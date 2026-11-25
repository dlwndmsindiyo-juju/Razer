import { Link } from "react-router-dom";
import { useState, type MouseEvent } from "react";
import type { HomeProduct } from "../../data/homeData";

interface ProductCardProps {
    product: HomeProduct;
}

// 제품 탐색 · 신상품 · 가장 많이 사용하는 제품 공통 카드 (이미지 260 x 260 + 상품명 · 가격)
export const ProductCard = ({ product }: ProductCardProps) => {
    // 위시리스트 상태 (처음 값은 데이터의 liked)
    const [liked, setLiked] = useState(product.liked ?? false);

    const handleWishlist = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // 나중에 카드 전체가 링크가 되어도 이동하지 않도록
        e.stopPropagation();
        setLiked((prev) => !prev);
    };

    const thumbContent = product.image ? (
        <img src={product.image} alt={product.name} className="product-card__image" loading="lazy" decoding="async" />
    ) : (
        <span className="product-card__no-image">Image</span>
    );

    return (
        <div className="product-card">
            <div className="product-card__thumb">
                {/* 이미지 영역 전체를 상세 링크로 (상품명 링크와 같은 주소 · 키보드 이동은 상품명 링크 하나로) */}
                {product.to ? (
                    <Link to={product.to} className="product-card__thumb-link" tabIndex={-1} aria-hidden="true">
                        {thumbContent}
                    </Link>
                ) : (
                    thumbContent
                )}

                {/* 위시리스트 (public/icons/wishlist-normal · wishlist-active .svg) */}
                <button
                    type="button"
                    className="product-card__heart"
                    aria-label={liked ? "위시리스트에서 빼기" : "위시리스트에 담기"}
                    aria-pressed={liked}
                    onClick={handleWishlist}
                >
                    <img src={liked ? "/icons/wishlist-active.svg" : "/icons/wishlist-normal.svg"} alt="" />
                </button>

                {/* 컬러칩 (있는 상품만) */}
                {product.colors && (
                    <ul className="product-card__colors">
                        {product.colors.map((color) => (
                            <li key={color} className="product-card__color" style={{ backgroundColor: color }} />
                        ))}
                    </ul>
                )}
            </div>

            {product.badge && <span className="product-card__badge">{product.badge}</span>}
            {product.to ? (
                <Link to={product.to} className="product-card__name">{product.name}</Link>
            ) : (
                <strong className="product-card__name">{product.name}</strong>
            )}
            <p className="product-card__price">{product.originalPrice && <del>{product.originalPrice}원</del>}{product.price}</p>
        </div>
    );
};

