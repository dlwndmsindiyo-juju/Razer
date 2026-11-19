import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../data/productData";
import { formatPrice } from "../../data/searchData";
import type { Product } from "../../types/product";

const ProductDetails = ({ product }: { product: Product }) => {
    const [imageIndex, setImageIndex] = useState(0);
    const images = [...new Set([product.image, ...(product.gallery ?? [])])];

    return (
        <article className="home-section catalog-detail">
            <Link to="/search">전체 상품 보기</Link>
            <div className="catalog-detail__hero">
                <div>
                    <img className="catalog-detail__image" src={images[imageIndex]} alt={product.title} />
                    {images.length > 1 && (
                        <ul className="catalog-detail__thumbnails" aria-label="상품 이미지">
                            {images.map((image, index) => (
                                <li key={image}>
                                    <button type="button" aria-pressed={index === imageIndex}
                                        aria-label={`${index + 1}번 상품 이미지 보기`} onClick={() => setImageIndex(index)}>
                                        <img src={image} alt="" loading="lazy" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="catalog-detail__info">
                    {product.badge && <p>{product.badge}</p>}
                    <h1>{product.title}</h1>
                    {product.summary && <p>{product.summary}</p>}
                    <p className="product-card__price">
                        {product.originalPrice && <del>{product.originalPrice.toLocaleString("ko-KR")}원</del>}
                        {formatPrice(product)}
                        {product.soldOut && product.price !== null && " · 품절"}
                    </p>
                    <p>상품 코드 {product.sku}</p>
                    {product.selectedOptions?.map(({ label, value }) => <p key={label + value}>{label} · {value}</p>)}
                    {product.productUrl && <a href={product.productUrl}>Razer 공식몰에서 보기</a>}
                </div>
            </div>
            {product.technicalSpecifications?.map((group) => (
                <section key={group.code} className="catalog-detail__specs">
                    <h2>기술 사양</h2>
                    <dl>
                        {group.features.map((feature) => (
                            <div key={feature.code}>
                                <dt>{feature.label}</dt>
                                <dd>{feature.values.join(" · ")}{feature.unit ? ` ${feature.unit}` : ""}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            ))}
        </article>
    );
};

export const ProductsDetail = () => {
    const { category, productId } = useParams();
    const product = /^\d+$/.test(productId ?? "") ? getProductById(Number(productId)) : undefined;
    if (!product || category !== product.category) {
        return <section className="home-section catalog-detail"><h1>상품을 찾을 수 없어요.</h1><Link to="/search">전체 상품 보기</Link></section>;
    }
    return <ProductDetails key={product.id} product={product} />;
};
