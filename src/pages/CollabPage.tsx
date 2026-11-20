import { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { categoryLabels } from "../data/productData";
import {
    findCollab,
    getCollabCopy,
    getCollabCover,
    getCollabHero,
    getCollabHeading,
    getCollabNote,
    getCollabProducts,
    supportPath,
    type Collab,
} from "../data/collabData";
import type { Product } from "../types/product";
import { ImageOrText } from "../components/common/ImageOrText";
import { TopButton } from "../components/common/TopButton";
import { CollabStrip } from "../components/promotion/CollabStrip";
import { FaqList } from "../components/promotion/FaqList";

type Layout = "center" | "left" | "right";

// 상품 소개 블록 (이미지 + 제목 2줄 + 설명 + 대표 사양)
const ProductBlock = ({ product, collab, image, layout }: { product: Product; collab: Collab; image?: string; layout: Layout }) => {
    const { model, edition } = getCollabHeading(product, collab);
    const to = `/products/${product.category}/${product.id}`;
    return (
        <section className={`collab-block collab-block--${layout}`}>
            <Link to={to} className="collab-block__img" aria-label={`${product.title} 상세 보기`}>
                <ImageOrText src={image ?? product.image} alt={product.title} label="Product Image" />
            </Link>
            <div className="collab-block__text">
                <h3 className="collab-block__title">
                    <Link to={to}>
                        {model}
                        <br />
                        {edition}
                    </Link>
                </h3>
                <p className="collab-block__desc">{getCollabCopy(product, collab)}</p>
                <p className="collab-block__note">{getCollabNote(product)}</p>
            </div>
        </section>
    );
};

// 콜라보 상세 (/promotion/collab/:slug)
// 대표 이미지 → 로고 띠 → 상품 블록(가운데 · 좌 · 우 반복) 사이에 컬렉션 소개 · 대표 상품 블록 → FAQ
export const CollabPage = () => {
    const { collabSlug } = useParams();
    const collab = findCollab(collabSlug);

    if (!collab) {
        return (
            <section className="collab-page collab-page--empty">
                <h1>컬렉션을 찾을 수 없어요.</h1>
                <Link to="/info/promotion/promotions">프로모션 알아보기</Link>
            </section>
        );
    }

    // 같은 모델(번들 등)은 하나만 → 상품 수만큼 블록을 만들고 (최대 5개) 반복하지 않음
    const products = getCollabProducts(collab).filter(
        (p, i, list) => list.findIndex((q) => (q.series ?? q.id) === (p.series ?? p.id)) === i,
    );
    const [main] = products;
    const blocks = products.slice(0, 5);
    const layouts: Layout[] = ["center", "right", "left", "center", "left"];
    const imageOf = (product: Product | undefined, i: number) => {
        const gallery = product?.gallery ?? [];
        return gallery[i % Math.max(gallery.length, 1)] ?? product?.image;
    };
    // 컬렉션 소개는 2번째 블록 뒤, 대표 상품 블록은 4번째 블록 뒤 (상품이 적으면 끝에)
    const introAfter = Math.min(2, blocks.length);
    const stayAfter = Math.min(4, blocks.length);

    // 컬렉션 소개는 상품이 없어도 보여줌 (이미지는 콜라보 카드 이미지)
    const intro = (
        <section key="intro" className="collab-intro promo-container">
            <div className="collab-intro__text">
                <h2 className="collab-intro__title">{collab.headline}</h2>
                <p className="collab-intro__desc">{collab.intro}</p>
                <Link to={`/search?q=${encodeURIComponent(collab.name.split(" (")[0])}`} className="collab-btn">
                    컬렉션 살펴보기
                </Link>
            </div>
            <div className="collab-intro__img">
                <ImageOrText src={main ? imageOf(main, 2) : getCollabCover(collab)} alt={collab.name} label="Collection Image" />
            </div>
        </section>
    );

    const stay = main && (
        <section key="stay" className="collab-stay promo-container">
            <div className="collab-stay__img">
                <ImageOrText src={imageOf(main, 3)} alt={main.title} label="Product Image" />
            </div>
            <div className="collab-stay__text">
                <h2 className="collab-stay__title">{collab.stayTitle}</h2>
                <p className="collab-stay__desc">{collab.stayText}</p>
                <div className="collab-stay__feature">
                    <span className="collab-stay__thumb">
                        <ImageOrText src={main.image} alt="" label="" />
                    </span>
                    <div>
                        <strong>{getCollabHeading(main, collab).edition}</strong>
                        <p>{getCollabNote(main)}</p>
                    </div>
                </div>
                <Link to={`/products/${main.category}/${main.id}`} className="collab-btn">
                    {categoryLabels[main.category]} 자세히 보기
                </Link>
            </div>
        </section>
    );

    return (
        <div className="collab-page">
            <div className="collab-page__hero">
                <ImageOrText src={getCollabHero(collab)} alt={collab.name} label="Collab Image" />
            </div>
            <CollabStrip collab={collab} />

            {main ? (
                blocks.map((product, i) => (
                    <Fragment key={product.id}>
                        <ProductBlock product={product} collab={collab} image={imageOf(product, i === 0 ? 1 : 0)} layout={layouts[i]} />
                        {i + 1 === introAfter && intro}
                        {i + 1 === stayAfter && stay}
                    </Fragment>
                ))
            ) : (
                <>
                    {intro}
                    <p className="collab-page__empty">컬렉션 제품을 준비 중이에요.</p>
                </>
            )}

            {/* FAQ */}
            <section className="collab-page__faq promo-container">
                <h2 className="promotion__title">자주 묻는 질문 (FAQ)</h2>
                <FaqList items={collab.faq} numbered defaultOpen={0} />
                <div className="collab-page__support">
                    <span>원하는 답변을 찾지 못하셨나요?</span>
                    <Link to={supportPath}>고객지원 문의 ↗</Link>
                </div>
            </section>

            <TopButton />
        </div>
    );
};
