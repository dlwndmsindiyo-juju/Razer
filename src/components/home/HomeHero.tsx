import { Link } from "react-router-dom";
import { homeImages } from "../../data/homeData";

// 히어로 (풀폭 1920 x 760) · 커스터마이징 유도
// 영상 → 이미지 → 텍스트 순으로 표시
export const HomeHero = () => {
    const { heroVideo, hero } = homeImages;

    return (
        <section
            className="home-hero"
            style={!heroVideo && hero ? { backgroundImage: `url(${hero})` } : undefined}
        >
            {heroVideo ? (
                <video
                    className="home-hero__video"
                    src={heroVideo}
                    poster={hero}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
            ) : (
                !hero && <span className="home-hero__no-image">Hero Image</span>
            )}

            <h2 className="home-hero__title">나만의 키보드, 나만의 규칙</h2>
            <Link to="/" className="home-hero__btn">커스터마이징 시작</Link>
        </section>
    );
};
