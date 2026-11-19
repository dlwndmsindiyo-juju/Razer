import { HomeHero } from "../components/home/HomeHero";
import { HomeExplore } from "../components/home/HomeExplore";
import { HomeCategory } from "../components/home/HomeCategory";
import { HomeNewArrivals } from "../components/home/HomeNewArrivals";
import { HomePromoBanner } from "../components/home/HomePromoBanner";
import { HomeBest } from "../components/home/HomeBest";
import { HomeCustomizer } from "../components/home/HomeCustomizer";
import { HomeFeatures } from "../components/home/HomeFeatures";

export const Home = () => {
    return (
        <div className="home">
            <HomeHero />
            <HomeExplore />
            <HomeCategory />
            <HomeNewArrivals />
            <HomePromoBanner />
            <HomeBest />
            <HomeCustomizer />
            <HomeFeatures />
        </div>
    );
};
