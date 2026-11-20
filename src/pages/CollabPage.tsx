import { Fragment } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { categoryLabels, getProductById } from "../data/productData";
import {
    findCollab,
    getCollabCopy,
    getCollabCollection,
    getCollabHeading,
    getCollabNote,
    getCollabProducts,
    getStayImage,
    type CollabSection,
    getSectionCopy,
    isCollabOpen,
    supportPath,
} from "../data/collabData";
import type { Product } from "../types/product";
import { ImageOrText } from "../components/common/ImageOrText";
import { CollabHero } from "../components/promotion/CollabHero";
import { FaqList } from "../components/promotion/FaqList";

type Layout = "caption" | "center" | "left" | "right"; // caption: 히어로 영상 바로 아래 글만

// 블록 하나에 들어갈 내용 (상품이 있으면 상품 상세로 연결)
interface Block {
    key: string;
    image?: string;
    model: string;
    edition: string;
    desc: string;
    note: string;
    product?: Product;
    layout?: Layout; // 정해진 순서 대신 쓸 배치
}

// 상품 소개 블록 (이미지 + 제목 2줄 + 설명 + 대표 사양)
const ProductBlock = ({ block, layout }: { block: Block; layout: Layout }) => {
    const { product } = block;
    const to = product && `/products/${product.category}/${product.id}`;
    const title = product?.title ?? block.model;
    const image = <ImageOrText src={block.image} alt={title} label="Product Image" />;
    return (
        <section className={`collab-block collab-block--${layout}`}>
            {layout === "caption" ? null : to ? (
                <Link to={to} className="collab-block__img" aria-label={`${title} 상세 보기`}>
                    {image}
                </Link>
            ) : (
                <div className="collab-block__img">{image}</div>
            )}
            <div className="collab-block__text">
                <h3 className="collab-block__title">
                    {to ? (
                        <Link to={to}>
                            {block.model}
                            <br />
                            {block.edition}
                        </Link>
                    ) : (
                        <>
                            {block.model}
                            <br />
                            {block.edition}
                        </>
                    )}
                </h3>
                <p className="collab-block__desc">{block.desc}</p>
                {block.note && <p className="collab-block__note">{block.note}</p>}
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

    // 종료된 이벤트는 들어갈 수 없음 → 프로모션 알아보기로 돌려보냄
    if (!isCollabOpen(collab)) return <Navigate to="/info/promotion/promotions" replace />;

    const edition = `${collab.ko} 에디션`;
    const productBlock = (product: Product, image?: string): Block => {
        const heading = getCollabHeading(product, collab);
        return {
            key: `p${product.id}`,
            image: image ?? product.gallery?.[0] ?? product.image,
            model: heading.model,
            edition: heading.edition,
            desc: getCollabCopy(product, collab),
            note: getCollabNote(product),
            product,
        };
    };

    // 블록: 배너 이미지(sections)가 있으면 그 순서대로 · 없으면 상품 데이터로 (같은 모델은 하나만 · 최대 5개)
    // 배너가 3장 이상이면 마지막 배너는 "플레이 뒤에도 남는 …" 큰 이미지로 씀 (블록에서는 빠짐)
    const sections = collab.sections ?? [];
    const stayImage = getStayImage(collab, getCollabProducts(collab)[0]);
    const blockSections = sections.length >= 3 ? sections.slice(0, -1) : sections;
    const sectionBlock = (section: CollabSection, i: number): Block => {
        const product = section.productId ? getProductById(section.productId) : undefined;
        const block: Block = product
            ? productBlock(product, section.image)
            : {
                  key: `s${i}`,
                  image: section.image,
                  model: section.model.toUpperCase(),
                  edition,
                  desc: getSectionCopy(section.model, collab),
                  note: "",
              };
        return { ...block, layout: section.layout };
    };
    const blocks: Block[] = (
        collab.sections
            ? blockSections.map(sectionBlock)
            : getCollabProducts(collab)
                  .filter((p, i, list) => list.findIndex((q) => (q.series ?? q.id) === (p.series ?? p.id)) === i)
                  .map((product, i) => productBlock(product, product.gallery?.[i === 0 ? 1 : 0]))
    ).slice(0, 5);
    // "플레이 뒤에도 남는 …" 블록에 소개할 상품: 그 큰 이미지의 상품 (마지막 배너) → 없으면 첫 상품
    const main =
        sections.length >= 3 ? sectionBlock(sections[sections.length - 1], sections.length - 1) : blocks.find((b) => b.product) ?? blocks[0];
    // 시안 순서: 히어로 아래 글 → 이미지 왼쪽 · 글 오른쪽 → (컬렉션 소개) → 같은 배치 → 풀폭 이미지 + 아래 글 → (대표 상품) → 글 왼쪽 · 이미지 오른쪽
    const layouts: Layout[] = ["caption", "right", "right", "center", "left"];
    // 컬렉션 소개는 2번째 블록 뒤, 대표 상품 블록은 4번째 블록 뒤 (상품이 적으면 끝에)
    const introAfter = Math.min(2, blocks.length);
    const stayAfter = Math.min(collab.stayAfter ?? 4, blocks.length);

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
                <ImageOrText src={getCollabCollection(collab)} alt={collab.name} label="Collection Image" />
            </div>
        </section>
    );

    // 대표 상품 블록 (작은 이미지: 정사각 이미지 → 대표 상품 이미지)
    const mainProduct = main?.product;
    const stay = main && (
        <section key="stay" className="collab-stay promo-container">
            <div className="collab-stay__img">
                <ImageOrText src={stayImage} alt={collab.name} label="Product Image" />
            </div>
            <div className="collab-stay__text">
                <h2 className="collab-stay__title">{collab.stayTitle}</h2>
                <p className="collab-stay__desc">{collab.stayText}</p>
                {/* 큰 정사각 이미지 + 오른쪽에 에디션 · 모델 · 버튼 */}
                <div className="collab-stay__feature">
                    <span className="collab-stay__thumb">
                        <ImageOrText src={collab.thumb ?? mainProduct?.image ?? main.image} alt="" label="" />
                    </span>
                    <div className="collab-stay__info">
                        <strong>{main.edition}</strong>
                        <p>{main.note || main.model}</p>
                        {mainProduct ? (
                            <Link to={`/products/${mainProduct.category}/${mainProduct.id}`} className="collab-btn">
                                {categoryLabels[mainProduct.category]} 자세히 보기
                            </Link>
                        ) : (
                            <Link to={`/search?q=${encodeURIComponent(collab.name.split(" (")[0])}`} className="collab-btn">
                                컬렉션 살펴보기
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <div className="collab-page">
            <div className="collab-page__hero">
                <CollabHero collab={collab} />
            </div>

            {main ? (
                blocks.map((block, i) => (
                    <Fragment key={block.key}>
                        <ProductBlock block={block} layout={i === 0 ? "caption" : block.layout ?? layouts[i]} />
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
                <FaqList items={collab.faq} numbered />
                <div className="collab-page__support">
                    <span>원하는 답변을 찾지 못하셨나요?</span>
                    <Link to={supportPath}>고객지원 문의 ↗</Link>
                </div>
            </section>
        </div>
    );
};
