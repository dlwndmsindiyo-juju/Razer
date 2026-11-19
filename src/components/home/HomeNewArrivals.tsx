import { useState } from "react";
import { newArrivals, newArrivalTabs } from "../../data/homeData";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { HomeProductList } from "./HomeProductList";

// 신상품 (카테고리 탭 + 상품 목록)
export const HomeNewArrivals = () => {
    const [activeTab, setActiveTab] = useState<(typeof newArrivalTabs)[number]>(newArrivalTabs[0]);

    return (
        <section className="home-section home-new">
            <HomeSectionHeader title="신상품">
                <ul className="home-new__tabs" role="tablist">
                    {newArrivalTabs.map((tab) => (
                        <li key={tab}>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab}
                                className={`home-new__tab ${activeTab === tab ? "is-active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        </li>
                    ))}
                </ul>
            </HomeSectionHeader>

            <HomeProductList products={newArrivals[activeTab]} />
        </section>
    );
};
