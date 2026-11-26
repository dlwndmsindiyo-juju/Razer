import type { DetailGift } from "../../../data/detailData";
import { ImageOrText } from "../../common/ImageOrText";

// 추천 상품은 상세 아래 카드 슬라이드(ProductRail)로 이동
// 사은품: 화살표 없이 2개씩 나란히
export const GiftList = ({ gifts }: { gifts: DetailGift[] }) => {
    if (gifts.length === 0) return null;
    return (
        <section className="pd-side">
            <h2 className="pd-option__title">사은품</h2>
            <ul className="pd-side__gifts">
                {gifts.map((gift) => (
                    <li key={gift.title} className="pd-side__item">
                        <span className="pd-side__img">
                            <ImageOrText src={gift.image} alt={gift.title} label="" />
                        </span>
                        <div className="pd-side__info">
                            <strong className="pd-side__name">{gift.title}</strong>
                            <span className="pd-side__price">가격 | {gift.price}</span>
                            <p className="pd-side__desc">{gift.desc}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};
