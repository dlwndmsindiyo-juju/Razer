// 커스터마이징 미리보기 (좌: 3D 모델 영역 / 우: 옵션 패널)
export const HomeCustomizer = () => {
    return (
        <section className="home-customizer">
            {/* 3D 모델 영역 (ProductModelViewer 연결 예정) */}
            <div className="home-customizer__viewer" />

            <div className="home-customizer__panel">
                <div className="home-customizer__step">
                    <span className="home-customizer__label">Label</span>
                    <div className="home-customizer__progress">
                        <span className="home-customizer__progress-bar" style={{ width: "35%" }} />
                    </div>
                </div>

                <h3 className="home-customizer__title">Section Title (섹션 제목)</h3>
                <p className="home-customizer__desc">Section Description (섹션 설명)</p>

                <ul className="home-customizer__options">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <li key={i} className="home-customizer__option">
                            <div className="home-customizer__option-thumb">IMG</div>
                            <div className="home-customizer__option-text">
                                <strong>Option Title (옵션 제목)</strong>
                                <p>Option Description (옵션 설명)</p>
                            </div>
                            <span className="home-customizer__radio" />
                        </li>
                    ))}
                </ul>

                <div className="home-customizer__actions">
                    <button type="button" className="btn btn--text">Secondary CTA</button>
                    <button type="button" className="btn btn--primary btn--sm">Primary CTA</button>
                </div>
            </div>
        </section>
    );
};
