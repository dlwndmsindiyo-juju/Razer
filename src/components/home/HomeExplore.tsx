import { exploreProducts } from "../../data/homeData";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { HomeProductList } from "./HomeProductList";

// 제품 탐색
export const HomeExplore = () => {
    return (
        <section className="home-section home-explore">
            <HomeSectionHeader title="제품 탐색" />
            <HomeProductList products={exploreProducts} />
        </section>
    );
};
