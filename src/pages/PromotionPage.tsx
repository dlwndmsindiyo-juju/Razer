import { useState } from "react";
import { Link } from "react-router-dom";
import {
    COLLAB_GRID_COUNT,
    collabs,
    featuredCollab,
    findCollab,
    getCollabCopy,
    getCollabCover,
    getCollabHeading,
    getCollabPath,
    getSectionImage,
    promotionFaq,
} from "../data/collabData";
import { getProductById } from "../data/productData";
import type { Product } from "../types/product";
import { ImageOrText } from "../components/common/ImageOrText";
import { TopButton } from "../components/common/TopButton";
import { CollabHero } from "../components/promotion/CollabHero";
import { CollabStrip } from "../components/promotion/CollabStrip";
import { FaqList } from "../components/promotion/FaqList";

// 프로모션 알아보기 (/info/promotion/promotions · 왼쪽 메뉴의 "프로모션 알아보기"를 누르면 이 화면)
// 대표 이미지 → 로고 띠 → 대표 컬렉션 상품 3개 → 콜라보 제품(8개 + 더 보기) → FAQ
export const PromotionPage = () => {
    const [showAll, setShowAll] = useState(false);
    const featured = findCollab(featuredCollab.slug) ?? collabs[0];
    const featuredProducts = featuredCollab.productIds
        .map((id) => getProductById(id))
        .filter((p): p is Product => !!p);
    const visibleCollabs = showAll ? collabs : collabs.slice(0, COLLAB_GRID_COUNT);

    return (
        <div className="promotion">
            {/* 대표 이미지 (누르면 대표 컬렉션 상세) */}
            <Link to={getCollabPath(featured.slug)} className="promotion__hero" aria-label={`${featured.name} 컬렉션 보기`}>
                <CollabHero collab={featured} />
            </Link>
            <CollabStrip collab={featured} />

            {/* 대표 컬렉션 상품 3개 */}
            <section className="promotion__featured promo-container">
                <Link to={getCollabPath(featured.slug)} className="promotion__badge" aria-label={featured.name}>
                    <ImageOrText src={featured.logo} alt={featured.name} label={featured.name} />
                </Link>
                <ul className="promotion__cards">
                    {featuredProducts.map((product) => {
                        const { model, edition } = getCollabHeading(product, featured);
                        const to = `/products/${product.category}/${product.id}`;
                        return (
                            <li key={product.id}>
                                <Link to={to} className="promotion__card">
                                    <span className="promotion__card-img">
                                        <ImageOrText src={getSectionImage(featured, product.id) ?? product.gallery?.[0] ?? product.image} alt={product.title} label="Product Image" />
                                    </span>
                                    <strong className="promotion__card-title">
                                        {model} {edition}
                                    </strong>
                                    <p className="promotion__card-desc">{getCollabCopy(product, featured)}</p>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* 콜라보 제품 */}
            <section className="promotion__collabs promo-container">
                <div className="promotion__head">
                    <h2 className="promotion__title">콜라보 제품</h2>
                    {collabs.length > COLLAB_GRID_COUNT && (
                        <button type="button" className="promotion__more" onClick={() => setShowAll((v) => !v)}>
                            {showAll ? "접기 ↑" : "더 보기 →"}
                        </button>
                    )}
                </div>
                <ul className="promotion__grid">
                    {visibleCollabs.map((collab) => {
                        const card = (
                            <>
                                <span className="promotion__collab-img">
                                    <ImageOrText src={getCollabCover(collab)} alt={collab.name} label={collab.name} />
                                    {collab.ended && <span className="promotion__collab-ended">종료된 이벤트 입니다.</span>}
                                </span>
                                <strong className="promotion__collab-name">{collab.name}</strong>
                            </>
                        );
                        return (
                            <li key={collab.slug}>
                                {/* 종료된 이벤트는 누를 수 없음 */}
                                {collab.ended ? (
                                    <div className="promotion__collab promotion__collab--ended" aria-disabled="true">
                                        {card}
                                    </div>
                                ) : (
                                    <Link to={getCollabPath(collab.slug)} className="promotion__collab">
                                        {card}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* FAQ */}
            <section className="promotion__faq promo-container">
                <h2 className="promotion__title">자주 묻는 질문 (FAQ)</h2>
                <FaqList items={promotionFaq} />
            </section>

            <TopButton />
        </div>
    );
};
