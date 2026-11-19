import { Link } from "react-router-dom";
import { homeImages } from "../../data/homeData";

// 히어로 (풀폭 1920 x 760) · 커스터마이징 유도
export const HomeHero = () => {
    return (
        <section
            className="home-hero"
            style={homeImages.hero ? { backgroundImage: `url(${homeImages.hero})` } : undefined}
        >
            {!homeImages.hero && <span className="home-hero__no-image">Hero Image</span>}
            <h2 className="home-hero__title">나만의 키보드, 나만의 규칙</h2>
            <Link to="/" className="home-hero__btn">커스터마이징 시작</Link>
        </section>
    );
};
