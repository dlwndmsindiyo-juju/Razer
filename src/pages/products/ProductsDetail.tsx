import { useEffect, useMemo, useRef, useState } from "react";
import { withoutPersonImages } from "../../data/personImages";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBadgeLabel, getProductById, getSeriesTitle, isInCollection, productData } from "../../data/productData";
import { detailGifts, keyboardActions } from "../../data/detailData";
import { useCartStore } from "../../store/useCartStore";
import type { Product } from "../../types/product";
import { ImageOrText } from "../../components/common/ImageOrText";
import { ProductGallery } from "../../components/product/detail/ProductGallery";
import { ProductOptions } from "../../components/product/detail/ProductOptions";
import { GiftList } from "../../components/product/detail/RecommendedProducts";
import { ProductRail } from "../info/PageLayout";
import { ProductDetailContent } from "../../components/product/detail/ProductDetailContent";

const isSoldOut = (product: Product) => product.stockStatus === "outOfStock" || !!product.soldOut;

// 같은 모델(series)은 하나만
const uniqueSeries = (products: Product[]) => {
    const seen = new Set<string>();
    return products.filter((item) => {
        const key = item.series ?? String(item.id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

// 추천 상품: 다른 카테고리의 구매 가능한 상품 (같이 쓰기 좋은 장비) · 카테고리를 번갈아 섞어서
const getRecommended = (product: Product) => {
    const pool = uniqueSeries(productData.filter((item) => item.category !== product.category && !isSoldOut(item) && item.price && item.summary));
    const byCategory = new Map<string, Product[]>();
    pool.forEach((item) => byCategory.set(item.category, [...(byCategory.get(item.category) ?? []), item]));
    const lists = [...byCategory.values()];
    const mixed: Product[] = [];
    for (let i = 0; mixed.length < 10 && lists.some((list) => list[i]); i += 1) {
        lists.forEach((list) => list[i] && mixed.push(list[i]));
    }
    return mixed.slice(0, 10);
};

// 제목 옆 배지 (Razer 독점 · 커스터마이징 · 사은품 증정 · 신규 · 품절) · 실제 데이터에 있는 것만
const getBadges = (product: Product) => {
    const labels: string[] = [];
    const badge = getBadgeLabel(product.badge);
    if (badge === "독점" || isInCollection(product, "exclusive")) labels.push("Razer 독점");
    if (product.category === "keyboards") labels.push("커스터마이징");
    if (badge && badge !== "독점") labels.push(badge);
    if (isSoldOut(product)) labels.push("품절");
    return [...new Set(labels)];
};

// 할인율 (할인 전 가격이 있을 때만)
const getDiscount = (product: Product) =>
    product.price != null && product.originalPrice && product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : null;

const ProductDetails = ({ product }: { product: Product }) => {
    const navigate = useNavigate();
    const addItem = useCartStore((state) => state.addItem);
    const [count, setCount] = useState(1);
    const [toast, setToast] = useState<{ text: string; cart?: boolean } | null>(null);
    const soundRef = useRef<HTMLAudioElement | null>(null);

    const title = getSeriesTitle(product);
    const badges = getBadges(product);
    const images = useMemo(() => {
        // 사람이 크게 나온 연출 사진은 빼고 제품 사진만
        const gallery = withoutPersonImages([...new Set(product.gallery ?? [])]);
        return gallery.length > 0 ? gallery : [product.image];
    }, [product]);
    const recommended = useMemo(() => getRecommended(product), [product]);
    const isKeyboard = product.category === "keyboards";
    const customizeTo = isKeyboard ? keyboardActions.customizeTo(product.id) : undefined;

    const soldOut = isSoldOut(product);
    const unverified = product.stockStatus === "unverified";
    const purchaseDisabled = soldOut || unverified;
    const discount = getDiscount(product);
    const total = unverified ? "판매 정보 미확인" : product.price == null ? "가격 미정" : `${(product.price * count).toLocaleString("ko-KR")}원`;

    // 옵션을 바꿔 다른 상품으로 이동하면 수량 초기화 · 타건음 정지
    useEffect(() => {
        setCount(1);
        return () => soundRef.current?.pause();
    }, [product.id]);

    // 알림 (2.5초 뒤 사라짐)
    useEffect(() => {
        if (!toast) return;
        const timer = window.setTimeout(() => setToast(null), 2500);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const addToCart = () => {
        addItem(product, count);
        setToast({ text: `${product.title} ${count}개를 장바구니에 담았어요.`, cart: true });
    };

    const buyNow = () => {
        addItem(product, count);
        navigate("/cart");
    };

    // 타건음 (파일이 없으면 안내)
    const playSound = () => {
        soundRef.current?.pause();
        const audio = new Audio(keyboardActions.soundSrc(product.series));
        soundRef.current = audio;
        audio.play().catch(() => setToast({ text: "타건음을 준비 중이에요." }));
    };

    return (
        <div className="product-detail">
            <div className="product-detail__top">
                {/* 왼쪽 위: 이미지 */}
                <div className="product-detail__gallery">
                    <ProductGallery key={product.id} images={images} alt={product.title}>
                        {isKeyboard && (
                            <div className="pd-gallery__actions">
                                <button type="button" className="pd-gallery__sound" onClick={playSound}>
                                    <ImageOrText src={keyboardActions.soundIcon} alt="" label="" />
                                    {keyboardActions.soundLabel}
                                </button>
                                {customizeTo && (
                                    <Link to={customizeTo} className="pd-gallery__customize">
                                        {keyboardActions.customizeLabel}
                                    </Link>
                                )}
                            </div>
                        )}
                    </ProductGallery>
                </div>

                {/* 오른쪽: 위(상품명 · 가격 · 옵션) / 아래(사은품 · 수량 · 구매) */}
                <div className="product-detail__right">
                    <div className="product-detail__head">
                        <h1 className="product-detail__title">{title}</h1>
                        {badges.map((badge) => (
                            <span key={badge} className="product-detail__badge">{badge}</span>
                        ))}
                    </div>

                    {/* 가격 (할인 중이면 할인율 · 할인가 · 원래 가격) */}
                    {!unverified && product.price != null && (
                        <p className="product-detail__price">
                            {discount && <span className="product-detail__discount">{discount}%</span>}
                            <strong>{product.price.toLocaleString("ko-KR")}원</strong>
                            {discount && <del>{product.originalPrice!.toLocaleString("ko-KR")}원</del>}
                        </p>
                    )}

                    <ProductOptions product={product} />

                    <div className="product-detail__bottom">
                        <GiftList gifts={detailGifts} />
                        <div className="product-detail__purchase-panel">
                            <div className="product-detail__buy">
                                <div className="pd-qty" aria-label="수량">
                                    <button type="button" aria-label="수량 줄이기" disabled={count <= 1} onClick={() => setCount((n) => Math.max(1, n - 1))}>
                                        -
                                    </button>
                                    <span aria-live="polite">{count}</span>
                                    <button type="button" aria-label="수량 늘리기" disabled={count >= 99} onClick={() => setCount((n) => Math.min(99, n + 1))}>
                                        +
                                    </button>
                                </div>
                                <p className="product-detail__total" aria-label="총 가격">
                                    <span className="product-detail__total-label">총 주문 금액</span>
                                    <strong>{total}</strong>
                                </p>
                            </div>

                            <div className="product-detail__actions">
                                <button type="button" className="product-detail__cart" disabled={purchaseDisabled} onClick={addToCart}>
                                    <span>장바구니에 추가</span>
                                    <img src="/icons/cart-mobile.svg" alt="" />
                                </button>
                                <button type="button" className="product-detail__purchase" disabled={purchaseDisabled} onClick={buyNow}>
                                    {unverified ? "판매 정보 미확인" : soldOut ? "품절" : product.stockStatus === "preOrderStock" ? "예약 구매하기" : "구매하기"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 추천 상품 (다른 카테고리 · 카드 슬라이드) */}
            {recommended.length > 0 && (
                <section className="product-detail__recommend">
                    <h2 className="product-detail__recommend-title">추천 상품</h2>
                    <ProductRail products={recommended} title="추천 상품" />
                </section>
            )}

            {/* 상품 상세 (사양 + 이미지) */}
            <section className="product-detail__content">
                <h2 className="product-detail__content-title">상품 상세</h2>
                <ProductDetailContent product={product} title={title} images={images} />
            </section>

            {toast && (
                <div className="pd-toast" role="status">
                    {toast.cart && <img className="pd-toast__icon" src="/icons/check.svg" alt="" />}
                    {toast.text}
                    {toast.cart && <Link to="/cart">장바구니 보기</Link>}
                </div>
            )}
        </div>
    );
};

export const ProductsDetail = () => {
    const { category, productId } = useParams();
    const product = /^\d+$/.test(productId ?? "") ? getProductById(Number(productId)) : undefined;
    if (!product || category !== product.category) {
        return (
            <section className="product-detail product-detail--empty">
                <h1>상품을 찾을 수 없어요.</h1>
                <Link to="/search">전체 상품 보기</Link>
            </section>
        );
    }
    return <ProductDetails product={product} />;
};
