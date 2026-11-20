import { useState } from "react";
import { Link } from "react-router-dom";
import { getProductById } from "../../data/productData";
import { formatPrice } from "../../data/searchData";
import { setupShowcase } from "../../data/homeData";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { ImageOrText } from "../common/ImageOrText";

// 재고 상태 표시
const stockLabel = (status?: string) => {
    if (status === "outOfStock") return "현재 품절";
    if (status === "preOrderStock") return "예약 주문";
    return "구매 가능";
};

// 취향으로 완성하는 셋업
// 처음엔 오른쪽에 타이틀 · 서브타이틀만 → + 를 누르면 x 로 돌면서 그 상품 정보가 나타남 → x 를 누르면 사라짐
export const HomeSetup = () => {
    const { title, collectionTitle, subtitle, image, hotspots, collectionButton } = setupShowcase;
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const activeSpot = activeIndex !== null ? hotspots[activeIndex] : null;
    const product = activeSpot ? getProductById(activeSpot.productId) : undefined;
    const productPath = product ? `/products/${product.category}/${product.id}` : "/";

    const toggle = (index: number) => setActiveIndex((prev) => (prev === index ? null : index));

    return (
        <section className="home-section home-setup">
            <HomeSectionHeader title={title} />

            <div className="home-setup__body">
                {/* 셋업 이미지 + 상품 표시(+) */}
                <div className="home-setup__visual">
                    <div className="home-setup__image">
                        <ImageOrText src={image} alt={collectionTitle} label="Setup Image" />
                    </div>

                    {hotspots.map((spot, i) => {
                        const isOpen = activeIndex === i;
                        const name = getProductById(spot.productId)?.title ?? "상품";
                        return (
                            <button
                                key={spot.productId}
                                type="button"
                                className={`home-setup__hotspot ${isOpen ? "is-open" : ""}`}
                                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                                aria-expanded={isOpen}
                                aria-controls="setup-product"
                                aria-label={isOpen ? `${name} 정보 닫기` : `${name} 정보 보기`}
                                onClick={() => toggle(i)}
                            >
                                <img src="/icons/plus.svg" alt="" />
                            </button>
                        );
                    })}

                    <Link to={collectionButton.to} className="home-setup__collection-btn">
                        {collectionButton.label}
                    </Link>
                </div>

                {/* 오른쪽: 타이틀 · 서브타이틀 + (열렸을 때만) 상품 정보 */}
                <div className="home-setup__side">
                    <div>
                        <h3 className="home-setup__collection">{collectionTitle}</h3>
                        <p className="home-setup__subtitle">{subtitle}</p>
                    </div>

                    <div id="setup-product" className="home-setup__product-area" aria-live="polite">
                        {product && activeSpot && (
                            <div key={product.id} className="home-setup__product">
                                <Link to={productPath} className="home-setup__product-img" aria-label={`${product.title} 상세 보기`}>
                                    <ImageOrText src={product.image} alt={product.title} label="Product Image" />
                                </Link>
                                <div className="home-setup__product-info">
                                    <strong className="home-setup__product-name">{product.title}</strong>
                                    <span className="home-setup__product-variant">{activeSpot.variant}</span>
                                    <span className="home-setup__product-price">{formatPrice(product)}</span>
                                    <span className="home-setup__product-stock">{stockLabel(product.stockStatus)}</span>
                                    <Link to={productPath} className="home-setup__product-btn">
                                        제품 자세히 보기
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
