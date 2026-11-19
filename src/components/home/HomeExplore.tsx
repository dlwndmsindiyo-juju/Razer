import { exploreItems } from "../../data/homeData";

// 제품 탐색 (가로 스크롤)
export const HomeExplore = () => {
    return (
        <section className="home-explore">
            <h2 className="home-section__title">Section Title (섹션 제목) - 제품 탐색</h2>

            <ul className="home-explore__list">
                {exploreItems.map((item, i) => (
                    <li key={i} className={`home-explore__card ${i === 0 ? "is-active" : ""}`}>
                        <div className="home-explore__thumb">
                            {item.image ? (
                                <img src={item.image} alt={item.name} />
                            ) : (
                                <span className="home-explore__no-image">Image</span>
                            )}
                        </div>

                        <div className="home-explore__info">
                            {item.colors && (
                                <ul className="home-explore__colors">
                                    {item.colors.map((color, j) => (
                                        <li
                                            key={j}
                                            className={`home-explore__color ${j === 0 ? "is-selected" : ""}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </ul>
                            )}
                            <strong className="home-explore__name">{item.name}</strong>
                            <p className="home-explore__price">{item.price}</p>
                            <span className="home-explore__more">EXPLORE ↗</span>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};
