import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBadgeLabel, getProductById, getSeriesTitle, productData } from "../../data/productData";
import { detailGifts, keyboardActions } from "../../data/detailData";
import { getProductPreview } from "../../data/keyboardPreview";
import { useCartStore } from "../../store/useCartStore";
import type { Product } from "../../types/product";
import { ImageOrText } from "../../components/common/ImageOrText";
import { ProductGallery } from "../../components/product/detail/ProductGallery";
import { ProductOptions } from "../../components/product/detail/ProductOptions";
import { GiftList, RecommendedProducts } from "../../components/product/detail/RecommendedProducts";
import { ProductDetailContent } from "../../components/product/detail/ProductDetailContent";
import { SpecModal } from "../../components/product/detail/SpecModal";

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

// 추천 상품: 다른 카테고리의 구매 가능한 상품 (같이 쓰기 좋은 장비)
const getRecommended = (product: Product) =>
    uniqueSeries(productData.filter((item) => item.category !== product.category && !isSoldOut(item) && item.price && item.summary)).slice(0, 6);

// 제목 옆 배지 (독점 · 신규 · 사은품 증정 · 품절)
const getBadges = (product: Product) => {
    const label = isSoldOut(product) ? "품절" : getBadgeLabel(product.badge);
    return label ? [label] : [];
};

const ProductDetails = ({ product }: { product: Product }) => {
    const navigate = useNavigate();
    const addItem = useCartStore((state) => state.addItem);
    const [count, setCount] = useState(1);
    const [isSpecOpen, setIsSpecOpen] = useState(false);
    const [toast, setToast] = useState<{ text: string; cart?: boolean } | null>(null);
    const soundRef = useRef<HTMLAudioElement | null>(null);

    const title = getSeriesTitle(product);
    const badges = getBadges(product);
    const images = useMemo(() => {
        const gallery = [...new Set(product.gallery ?? [])];
        return gallery.length > 0 ? gallery : [product.image];
    }, [product]);
    const recommended = useMemo(() => getRecommended(product), [product]);
    const isKeyboard = product.category === "keyboards";
    const customizeTo = isKeyboard || getProductPreview(product)
        ? `/products/${product.category}/${product.id}/customize`
        : undefined;

    const soldOut = isSoldOut(product);
    const unverified = product.stockStatus === "unverified";
    const purchaseDisabled = soldOut || unverified;
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

    const closeSpec = useCallback(() => setIsSpecOpen(false), []);

    return (
        <div className="product-detail">
            <div className="product-detail__top">
                {/* 왼쪽 위: 이미지 */}
                <div className="product-detail__gallery">
                    <ProductGallery key={product.id} images={images} alt={product.title}>
                        {(isKeyboard || customizeTo) && (
                            <div className="pd-gallery__actions">
                                {isKeyboard && <button type="button" className="pd-gallery__sound" onClick={playSound}>
                                    <ImageOrText src={keyboardActions.soundIcon} alt="" label="" />
                                    {keyboardActions.soundLabel}
                                </button>}
                                {customizeTo && (
                                    <Link to={customizeTo} className="pd-gallery__customize">
                                        {isKeyboard ? keyboardActions.customizeLabel : "3D로 보기"}
                                    </Link>
                                )}
                            </div>
                        )}
                    </ProductGallery>
                </div>

                {/* 왼쪽 아래: 요약 · 모든 사양 보기 */}
                <div className="product-detail__about">
                    {product.summary && <p className="product-detail__summary">{product.summary}</p>}
                    <button type="button" className="product-detail__spec-link" onClick={() => setIsSpecOpen(true)}>
                        모든 사양 보기 &gt;
                    </button>
                </div>

                {/* 오른쪽: 위(상품명 · 옵션) / 아래(사은품 · 추천 · 수량 · 구매)는 썸네일 아래 선에 맞춤 */}
                <div className="product-detail__right">
                    <div className="product-detail__head">
                        <h1 className="product-detail__title">{title}</h1>
                        {badges.map((badge) => (
                            <span key={badge} className="product-detail__badge">{badge}</span>
                        ))}
                    </div>

                    <ProductOptions product={product} />

                    <div className="product-detail__bottom">
                        <div className="product-detail__extras">
                            <GiftList gifts={detailGifts} />
                            <RecommendedProducts products={recommended} />
                        </div>

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
                            <p className="product-detail__total">
                                가격 <strong>{total}</strong>
                            </p>
                        </div>

                        <div className="product-detail__actions">
                            <button type="button" className="product-detail__cart" disabled={purchaseDisabled} onClick={addToCart}>
                                장바구니에 추가
                            </button>
                            <button type="button" className="product-detail__purchase" disabled={purchaseDisabled} onClick={buyNow}>
                                {unverified ? "판매 정보 미확인" : soldOut ? "품절" : product.stockStatus === "preOrderStock" ? "예약 구매하기" : "구매하기"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 상품 상세 (사양 + 이미지) */}
            <section className="product-detail__content">
                <h2 className="product-detail__content-title">상품 상세</h2>
                <ProductDetailContent product={product} title={title} images={images} />
            </section>

            {isSpecOpen && <SpecModal product={product} onClose={closeSpec} />}
            {toast && (
                <div className="pd-toast" role="status">
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
