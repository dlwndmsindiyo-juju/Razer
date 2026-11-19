import { useState } from "react";

const descTabs = ["Description", "Description", "Description", "Description"];

// 커스터마이징 미리보기 (좌: 소개 / 우: 옵션 패널)
export const HomeCustomizer = () => {
    const [selected, setSelected] = useState<number | null>(null);

    return (
        <section className="home-customizer">
            <div className="home-customizer__intro">
                <h2 className="home-customizer__heading">Section Title (섹션 제목)</h2>
                <p className="home-customizer__text">
                    Section Description (섹션 설명)Section Description (섹션 설명)
                    <br />
                    Section Description (섹션 설명)Section Description (섹션 설명)
                    <br />
                    Section Description (섹션 설명)Section Description (섹션 설명)
                    <br />
                    Section Description (섹션 설명)Section Description (섹션 설명)
                </p>

                <ul className="home-customizer__desc-tabs">
                    {descTabs.map((tab, i) => (
                        <li key={i}>{tab}</li>
                    ))}
                </ul>
            </div>

            <div className="home-customizer__panel">
                <span className="home-customizer__label">Label</span>
                <div className="home-customizer__progress">
                    <span className="home-customizer__progress-bar" style={{ width: "35%" }} />
                </div>

                <h3 className="home-customizer__title">Section Title (섹션 제목)</h3>
                <p className="home-customizer__desc">Section Description (섹션 설명)</p>

                <ul className="home-customizer__options">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <li key={i}>
                            <button
                                type="button"
                                className={`home-customizer__option ${selected === i ? "is-selected" : ""}`}
                                onClick={() => setSelected(i)}
                            >
                                {/* 옵션 이미지 없음 → 텍스트 */}
                                <span className="home-customizer__option-thumb">Image</span>
                                <span className="home-customizer__option-text">
                                    <strong>Option Title (옵션 제목)</strong>
                                    <span>Option Description (옵션 설명)</span>
                                </span>
                                <span className="home-customizer__radio" />
                            </button>
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
