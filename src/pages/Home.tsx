import { HomeHero } from "../components/home/HomeHero";
import { HomeNewArrivals } from "../components/home/HomeNewArrivals";
import { HomeProPick } from "../components/home/HomeProPick";
import { HomeBest } from "../components/home/HomeBest";
import { HomeCategory } from "../components/home/HomeCategory";
import { HomePromoBanner } from "../components/home/HomePromoBanner";
import { HomeSetup } from "../components/home/HomeSetup";
import { HomeFeatures } from "../components/home/HomeFeatures";

// 메인홈 (시안 순서)
export const Home = () => {
    return (
        <div className="home">
            <HomeHero />
            <HomeNewArrivals />
            <HomeProPick />
            <HomeBest />
            <HomeCategory />
            <HomePromoBanner />
            <HomeSetup />
            <HomeFeatures />
        </div>
    );
};
