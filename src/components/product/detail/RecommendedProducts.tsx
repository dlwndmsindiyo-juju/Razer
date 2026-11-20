import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../../data/searchData";
import type { DetailGift } from "../../../data/detailData";
import type { Product } from "../../../types/product";
import { ImageOrText } from "../../common/ImageOrText";

// 사은품 · 추천 상품 공통: 한 개씩 보여주고 좌우 화살표로 넘김
const SideCarousel = <T,>({ title, items, render }: { title: string; items: T[]; render: (item: T) => ReactNode }) => {
    const [index, setIndex] = useState(0);
    if (items.length === 0) return null;
    const go = (direction: -1 | 1) => setIndex((prev) => (prev + direction + items.length) % items.length);

    return (
        <section className="pd-side">
            <div className="pd-side__head">
                <h2 className="pd-option__title">{title}</h2>
                <div className="pd-side__arrows">
                    <button type="button" className="pd-arrow" aria-label={`이전 ${title}`} disabled={items.length < 2} onClick={() => go(-1)}>
                        <img src="/icons/down-arrow.svg" alt="" className="is-prev" />
                    </button>
                    <button type="button" className="pd-arrow" aria-label={`다음 ${title}`} disabled={items.length < 2} onClick={() => go(1)}>
                        <img src="/icons/down-arrow.svg" alt="" className="is-next" />
                    </button>
                </div>
            </div>
            <div className="pd-side__item">{render(items[index])}</div>
        </section>
    );
};

export const GiftList = ({ gifts }: { gifts: DetailGift[] }) => (
    <SideCarousel
        title="사은품"
        items={gifts}
        render={(gift) => (
            <>
                <span className="pd-side__img">
                    <ImageOrText src={gift.image} alt={gift.title} label="" />
                </span>
                <div className="pd-side__info">
                    <strong className="pd-side__name">{gift.title}</strong>
                    <span className="pd-side__price">가격 | {gift.price}</span>
                    <p className="pd-side__desc">{gift.desc}</p>
                </div>
            </>
        )}
    />
);

export const RecommendedProducts = ({ products }: { products: Product[] }) => (
    <SideCarousel
        title="추천 상품"
        items={products}
        render={(item) => {
            const to = `/products/${item.category}/${item.id}`;
            return (
                <>
                    <Link to={to} className="pd-side__img" tabIndex={-1} aria-hidden="true">
                        <img src={item.image} alt="" loading="lazy" />
                    </Link>
                    <div className="pd-side__info">
                        <Link to={to} className="pd-side__name">{item.title}</Link>
                        <span className="pd-side__price">가격 | {formatPrice(item)}</span>
                        {item.summary && <p className="pd-side__desc">{item.summary}</p>}
                    </div>
                </>
            );
        }}
    />
);
