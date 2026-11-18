// 서비스 안내 카드 4개
export const HomeFeatures = () => {
    return (
        <section className="home-features">
            <ul className="home-features__list">
                {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className="home-features__card">
                        <div className="home-features__icon">ICON</div>
                        <strong className="home-features__title">Section Title (섹션 제목)</strong>
                        <p className="home-features__desc">Section Description (섹션 설명)</p>
                    </li>
                ))}
            </ul>
        </section>
    );
};
