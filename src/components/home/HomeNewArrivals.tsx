import { useState } from "react";
import { categoryLabels, getProductsByCollection } from "../../data/productData";
import { toCardProduct } from "../../data/searchData";
import type { ProductCategory } from "../../types/product";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { HomeProductList } from "./HomeProductList";

const newProducts = getProductsByCollection("new");
const tabs = (Object.keys(categoryLabels) as ProductCategory[]).filter((category) =>
    newProducts.some((product) => product.category === category),
);

export const HomeNewArrivals = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const products = newProducts.filter((product) => product.category === activeTab).map(toCardProduct);

    return (
        <section className="home-section home-new">
            <HomeSectionHeader title="신상품" to="/products/new">
                <ul className="home-new__tabs" aria-label="신상품 카테고리">
                    {tabs.map((tab) => (
                        <li key={tab}>
                            <button type="button" aria-pressed={activeTab === tab}
                                className={`home-new__tab ${activeTab === tab ? "is-active" : ""}`}
                                onClick={() => setActiveTab(tab)}>
                                {categoryLabels[tab]}
                            </button>
                        </li>
                    ))}
                </ul>
            </HomeSectionHeader>
            {/* 탭을 바꾸면 슬라이드를 처음 위치로 (key) */}
            <HomeProductList key={activeTab} products={products} slider />
        </section>
    );
};
