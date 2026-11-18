import { Link } from "react-router-dom";

// 커스터마이징 유도 배너
export const HomeCustomBanner = () => {
    return (
        <section className="home-custom-banner">
            <h2 className="home-custom-banner__title">나만의 키보드, 나만의 규칙</h2>
            <Link to="/" className="home-custom-banner__btn">커스터마이징 시작</Link>
        </section>
    );
};
