import { Link } from "react-router-dom";

// 서비스 안내 카드 4개 (아이콘: public/icons) · 누르면 FAQ의 해당 탭 · 질문으로 이동 (topic=탭 · open=펼칠 질문)
const faq = "/info/service/faq";
const features = [
    { icon: "/icons/delivery.svg", title: "주문 배송", description: "주문 및 배송 현황을 확인하세요", to: `${faq}?topic=questions&open=order-status` },
    { icon: "/icons/exchange.svg", title: "교환 · 반품", description: "교환과 반품을 간편하게 신청하세요.", to: `${faq}?topic=returns&open=returns-request` },
    { icon: "/icons/service.svg", title: "A/S 신청", description: "제품 점검과 수리를 신청하세요.", to: `${faq}?topic=questions&open=warranty-6` },
    { icon: "/icons/inquiry.svg", title: "1:1 문의", description: "궁금한 점을 편하게 문의하세요.", to: `${faq}?topic=contact` },
];

export const HomeFeatures = () => {
    return (
        <section className="home-features">
            <ul className="home-features__list">
                {features.map((feature) => (
                    <li key={feature.title}>
                        <Link to={feature.to} className="home-features__card">
                            <span className="home-features__icon">
                                <img src={feature.icon} alt="" />
                            </span>
                            <strong className="home-features__title">{feature.title}</strong>
                            <p className="home-features__desc">{feature.description}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
};
