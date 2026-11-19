import { ProductCard } from "../product/ProductCard";
import { homeProducts } from "../../data/homeData";

// 가장 많이 사용하는 제품
export const HomeBest = () => {
    return (
        <section className="home-section home-best">
            <h2 className="home-section__title">Section Title (섹션 제목) - 가장 많이 사용하는 제품</h2>

            <ul className="home-section__products">
                {homeProducts.map((product, i) => (
                    <li key={i}>
                        <ProductCard product={product} />
                    </li>
                ))}
            </ul>
        </section>
    );
};
