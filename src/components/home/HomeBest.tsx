import { getProductById } from "../../data/productData";
import { toCardProduct } from "../../data/searchData";
import { bestProductIds } from "../../data/homeData";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { HomeProductList } from "./HomeProductList";

// 가장 많이 사용하는 제품
const products = bestProductIds.flatMap((id) => {
    const product = getProductById(id);
    return product ? [toCardProduct(product)] : [];
});

export const HomeBest = () => {
    return (
        <section className="home-section home-best">
            <HomeSectionHeader title="가장 많이 사용하는 제품" />
            <HomeProductList products={products} slider />
        </section>
    );
};

