// 제품 탐색 (카테고리 카드 · 가로 스크롤)
export const HomeExplore = () => {
    return (
        <section className="home-section home-explore">
            <h2 className="home-section__title">Section Title (섹션 제목) - 제품 탐색</h2>

            <ul className="home-explore__list">
                {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i} className={`home-explore__card ${i === 0 ? "is-active" : ""}`}>
                        <div className="home-explore__thumb">
                            <img src="/images/home/explore-mouse.png" alt="" />
                        </div>
                        <div className="home-explore__info">
                            <strong className="home-explore__category">Category Title (카테고리 제목)</strong>
                            <p className="home-explore__desc">Section Title</p>
                            <span className="home-explore__more">EXPLORE ↗</span>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};
