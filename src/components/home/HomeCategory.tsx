import { Link } from "react-router-dom";
import { categories } from "../../data/homeData";

// 카테고리 타일 (왼쪽 큰 타일 1 + 오른쪽 2x2)
export const HomeCategory = () => {
    return (
        <section className="home-category">
            <ul className="home-category__grid">
                {categories.map((category, i) => (
                    <li key={i} className={`home-category__item ${i === 0 ? "is-large" : ""}`}>
                        <Link
                            to={category.to}
                            className="home-category__link"
                            style={category.image ? { backgroundImage: `url(${category.image})` } : undefined}
                        >
                            <strong className="home-category__name">{category.name}</strong>
                            {/* 화살표 (아이콘 파일 없음 → 텍스트) */}
                            <span className="home-category__arrow">→</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
};
