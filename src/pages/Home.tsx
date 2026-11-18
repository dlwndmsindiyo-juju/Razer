import { HomeHero } from "../components/home/HomeHero";
import { HomeExplore } from "../components/home/HomeExplore";
import { HomeNewArrivals } from "../components/home/HomeNewArrivals";
import { HomePromoBanner } from "../components/home/HomePromoBanner";
import { HomeCustomBanner } from "../components/home/HomeCustomBanner";
import { HomeBest } from "../components/home/HomeBest";
import { HomeCustomizer } from "../components/home/HomeCustomizer";
import { HomeFeatures } from "../components/home/HomeFeatures";

export const Home = () => {
    return (
        <div className="home">
            <HomeHero />
            <HomeExplore />
            <HomeNewArrivals />
            <HomePromoBanner />
            <HomeCustomBanner />
            <HomeBest />
            <HomeCustomizer />
            <HomeFeatures />
        </div>
    );
};
