import type { HomeProduct } from "../../data/homeData";

interface ProductCardProps {
    product: HomeProduct;
}

// 신상품 · 가장 많이 사용하는 제품 공통 카드
export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <article className="product-card">
            <div className="product-card__thumb">
                {product.image ? (
                    <img src={product.image} alt={product.name} />
                ) : (
                    <span className="product-card__no-image">Image</span>
                )}

                {/* 찜 (아이콘 파일 없음 → 텍스트) */}
                <button
                    type="button"
                    className={`product-card__heart ${product.liked ? "is-active" : ""}`}
                    aria-label="찜하기"
                >
                    {product.liked ? "♥" : "♡"}
                </button>
            </div>

            <div className="product-card__info">
                <ul className="product-card__colors">
                    {product.colors.map((color, i) => (
                        <li
                            key={i}
                            className={`product-card__color ${i === 0 ? "is-selected" : ""}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </ul>

                <strong className="product-card__title">{product.name}</strong>
                <p className="product-card__desc">{product.description}</p>

                <div className="product-card__price">
                    <strong className="product-card__price-now">{product.price}</strong>
                    <del className="product-card__price-original">{product.originalPrice}</del>
                </div>
            </div>
        </article>
    );
};
