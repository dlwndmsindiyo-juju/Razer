import type { HomeProduct } from "../../data/homeData";
import { ProductCard } from "../product/ProductCard";

// 상품 6개 한 줄 목록 (260 x 6 · 간격 24)
export const HomeProductList = ({ products }: { products: HomeProduct[] }) => {
    if (products.length === 0) {
        return <p className="home-section__empty">준비 중인 상품이에요.</p>;
    }

    return (
        <ul className="home-section__products">
            {products.map((product) => (
                <li key={product.id}>
                    <ProductCard product={product} />
                </li>
            ))}
        </ul>
    );
};
