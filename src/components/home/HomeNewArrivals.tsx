import { useState } from "react";
import { ProductCard } from "../product/ProductCard";

const tabs = ["Category Title (카테고리 제목)", "Category Title (카테고리 제목)", "Category Title (카테고리 제목)"];

// 신상품 (카테고리 탭 + 상품 카드)
export const HomeNewArrivals = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="home-section home-new">
            <h2 className="home-section__title">Section Title (섹션 제목) - 신상품</h2>

            <ul className="home-new__tabs">
                {tabs.map((tab, i) => (
                    <li key={i}>
                        <button
                            type="button"
                            className={`home-new__tab ${activeTab === i ? "is-active" : ""}`}
                            onClick={() => setActiveTab(i)}
                        >
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>

            <ul className="home-section__products">
                {Array.from({ length: 5 }).map((_, i) => (
                    <li key={i}>
                        <ProductCard />
                    </li>
                ))}
            </ul>
        </section>
    );
};
