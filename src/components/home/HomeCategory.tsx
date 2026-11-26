import { Link } from "react-router-dom";
import { categories } from "../../data/homeData";
import { ImageOrText } from "../common/ImageOrText";

// 카테고리 타일 (왼쪽 큰 타일 1 + 오른쪽 2x2) · 누끼 이미지 + 아래 이름
export const HomeCategory = () => {
    return (
        <section className="home-category">
            <ul className="home-category__grid">
                {categories.map((category, i) => (
                    <li key={category.name} className={`home-category__item ${i === 0 ? "is-large" : ""}`}>
                        <Link to={category.to} className="home-category__link">
                            <span className="home-category__thumb">
                                <ImageOrText src={category.image} alt="" label="Image" />
                            </span>
                            <strong className="home-category__name">{category.name}</strong>
                            {/* 화살표 (public/icons/arrow-right.svg) */}
                            <span className="home-category__arrow"><img src="/icons/arrow-right.svg" alt="" /></span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
};
