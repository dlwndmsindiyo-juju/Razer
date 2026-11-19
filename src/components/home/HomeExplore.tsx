import { getProductById } from "../../data/productData";
import { toCardProduct } from "../../data/searchData";
import { exploreProductIds } from "../../data/homeData";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { HomeProductList } from "./HomeProductList";

// 제품 탐색
const products = exploreProductIds.flatMap((id) => {
    const product = getProductById(id);
    return product ? [toCardProduct(product)] : [];
});

export const HomeExplore = () => {
    return (
        <section className="home-section home-explore">
            <HomeSectionHeader title="제품 탐색" />
            <HomeProductList products={products} />
        </section>
    );
};

