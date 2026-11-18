import { Link } from "react-router-dom";

// 대표 이미지와 상품 상세 링크
export const HomeHero = () => {
    return (
        <section className="home-hero">
            {/* 대표 이미지 (이미지 확정 전 텍스트) */}
            <div className="home-hero__visual">
                <p className="home-hero__placeholder">Hero Image</p>
            </div>

            <div className="home-hero__cta">
                <Link to="/" className="btn btn--primary btn--lg">Primary CTA</Link>
                <Link to="/" className="btn btn--secondary btn--lg">Secondary CTA</Link>
            </div>
        </section>
    );
};
