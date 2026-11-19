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

                {/* 위시리스트 (public/icons/wishlist-normal · wishlist-active .svg) */}
                <button
                    type="button"
                    className="product-card__heart"
                    aria-label={product.liked ? "위시리스트에서 빼기" : "위시리스트에 담기"}
                    aria-pressed={product.liked}
                >
                    <img
                        src={product.liked ? "/icons/wishlist-active.svg" : "/icons/wishlist-normal.svg"}
                        alt=""
                    />
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
