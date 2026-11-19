import { bestProducts } from "../../data/homeData";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { HomeProductList } from "./HomeProductList";

// 가장 많이 사용하는 제품
export const HomeBest = () => {
    return (
        <section className="home-section home-best">
            <HomeSectionHeader title="가장 많이 사용하는 제품" />
            <HomeProductList products={bestProducts} />
        </section>
    );
};
