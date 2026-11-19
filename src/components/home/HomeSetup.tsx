import { Link } from "react-router-dom";
import { getProductById } from "../../data/productData";
import { formatPrice } from "../../data/searchData";
import { setupShowcase } from "../../data/homeData";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { ImageOrText } from "../common/ImageOrText";

const productPath = (id: number) => {
    const product = getProductById(id);
    return product ? `/products/${product.category}/${product.id}` : "/";
};

// 취향으로 완성하는 셋업 (왼쪽 셋업 이미지 + 오른쪽 컬렉션 · 대표 상품)
export const HomeSetup = () => {
    const { title, collectionTitle, subtitle, image, hotspots, collectionButton, product } = setupShowcase;
    const productData = getProductById(product.productId);

    return (
        <section className="home-section home-setup">
            <HomeSectionHeader title={title} />

            <div className="home-setup__body">
                {/* 셋업 이미지 + 상품 표시(+) */}
                <div className="home-setup__visual">
                    <div className="home-setup__image">
                        <ImageOrText src={image} alt={collectionTitle} label="Setup Image" />
                    </div>

                    {hotspots.map((spot, i) => (
                        <Link
                            key={i}
                            to={productPath(spot.productId)}
                            className="home-setup__hotspot"
                            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                            aria-label={`${getProductById(spot.productId)?.title ?? "상품"} 보기`}
                        >
                            <img src="/icons/plus.svg" alt="" />
                        </Link>
                    ))}

                    <Link to={collectionButton.to} className="home-setup__collection-btn">
                        {collectionButton.label}
                    </Link>
                </div>

                {/* 컬렉션 소개 + 대표 상품 */}
                <div className="home-setup__side">
                    <div>
                        <h3 className="home-setup__collection">{collectionTitle}</h3>
                        <p className="home-setup__subtitle">{subtitle}</p>
                    </div>

                    <div className="home-setup__product">
                        <div className="home-setup__product-img">
                            <ImageOrText src={product.image} alt={product.name} label="Product Image" />
                        </div>
                        <div className="home-setup__product-info">
                            <strong className="home-setup__product-name">{product.name}</strong>
                            <span className="home-setup__product-variant">{product.variant}</span>
                            <span className="home-setup__product-price">{productData ? formatPrice(productData) : ""}</span>
                            <Link to={productPath(product.productId)} className="home-pick__btn">
                                제품 자세히 보기
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
