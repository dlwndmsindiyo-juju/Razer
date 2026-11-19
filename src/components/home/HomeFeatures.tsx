// 서비스 안내 카드 4개 (아이콘: public/icons)
const features = [
    { icon: "/icons/delivery.svg", title: "주문 배송", description: "주문 및 배송 현황을 확인하세요" },
    { icon: "/icons/exchange.svg", title: "교환 · 반품", description: "교환과 반품을 간편하게 신청하세요." },
    { icon: "/icons/service.svg", title: "A/S 신청", description: "제품 점검과 수리를 신청하세요." },
    { icon: "/icons/inquiry.svg", title: "1:1 문의", description: "궁금한 점을 편하게 문의하세요." },
];

export const HomeFeatures = () => {
    return (
        <section className="home-features">
            <ul className="home-features__list">
                {features.map((feature) => (
                    <li key={feature.title} className="home-features__card">
                        <span className="home-features__icon">
                            <img src={feature.icon} alt="" />
                        </span>
                        <strong className="home-features__title">{feature.title}</strong>
                        <p className="home-features__desc">{feature.description}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
};
