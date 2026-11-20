import { detailCopy, hiddenOptionLabels, highlightSpecCodes, optionLabelNames, optionValueNames } from "../../../data/detailData";
import type { Product } from "../../../types/product";

type Feature = { code: string; label: string; value: string };

// 표에 넣을 값 (단위 포함)
const toFeatures = (product: Product): Feature[] =>
    product.technicalSpecifications?.flatMap((group) =>
        group.features.map((f) => ({
            code: f.code,
            label: f.label,
            // 데이터에 남은 "값, · 값" 정리
            value: `${f.values.join(" · ").replace(/,\s*·/g, ",")}${f.unit ? ` ${f.unit}` : ""}`,
        })),
    ) ?? [];

// 크게 보여줄 사양: "없음" 같은 값은 빼고, 지정한 순서 우선
const pickHighlights = (features: Feature[]) => {
    const meaningful = features.filter((f) => !/^(없음|예|아니오|지원)$/.test(f.value) && f.value.length <= 60);
    const rank = (f: Feature) => {
        const i = highlightSpecCodes.indexOf(f.code);
        return i === -1 ? highlightSpecCodes.length : i;
    };
    return [...meaningful].sort((a, b) => rank(a) - rank(b));
};

// 상품 상세: 우리 사양 데이터 + 갤러리 이미지로 커머스 상세처럼 구성
// 공지 → 대표 이미지 → 초록 띠 → 특징(이미지 + 사양) → 3칸 카드 → 보증 → TECH SPECS → 남은 이미지
export const ProductDetailContent = ({ product, title, images }: { product: Product; title: string; images: string[] }) => {
    const features = toFeatures(product);
    const highlights = pickHighlights(features);
    const blocks = highlights.slice(0, 3); // 이미지 + 큰 글씨
    const cards = highlights.slice(3, 6); // 3칸 카드

    // 이미지 순서대로 나눠 쓰기
    const [heroImage, ...rest] = images;
    const blockImages = rest.slice(0, blocks.length);
    const cardImages = rest.slice(blocks.length, blocks.length + cards.length);
    const extraImages = rest.slice(blocks.length + cards.length);
    const brand = title.replace(/^Razer\s+/, "");

    return (
        <div className="pd-content">
            <p className="pd-content__notice">{detailCopy.notice}</p>

            {/* 대표 이미지 + 이름 + 핵심 사양 */}
            <section className="pd-content__hero">
                {heroImage && <img src={heroImage} alt={title} loading="lazy" />}
                <div className="pd-content__hero-text">
                    <span className="pd-content__brand">RAZER</span>
                    <strong className="pd-content__name">{brand}</strong>
                    {product.summary && <span className="pd-content__summary">{product.summary}</span>}
                </div>
                {highlights.length > 0 && (
                    <ul className="pd-content__chips">
                        {highlights.slice(0, 4).map((f) => (
                            <li key={f.code}>
                                <span>{f.label}</span>
                                <strong>{f.value}</strong>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* 초록 띠 */}
            <section className="pd-content__band">
                <h3>{detailCopy.bandTitle}</h3>
                <p>
                    {title}
                    {product.summary ? ` — ${product.summary}.` : ""}
                    <br />
                    {highlights.slice(0, 2).map((f) => `${f.label} ${f.value}`).join(" · ")}
                </p>
            </section>

            {/* 특징: 사양 하나 + 이미지 하나씩 */}
            {blocks.map((f, i) => (
                <section key={f.code} className="pd-content__feature">
                    <span className="pd-content__feature-label">{f.label}</span>
                    <h3 className="pd-content__feature-value">{f.value}</h3>
                    {blockImages[i] && <img src={blockImages[i]} alt={`${title} ${f.label}`} loading="lazy" />}
                </section>
            ))}

            {/* 3칸 카드 */}
            {cards.length > 0 && (
                <section className="pd-content__cards">
                    {cards.map((f, i) => (
                        <div key={f.code} className="pd-content__card">
                            {cardImages[i] && (
                                <span className="pd-content__card-img">
                                    <img src={cardImages[i]} alt="" loading="lazy" />
                                </span>
                            )}
                            <span className="pd-content__feature-label">{f.label}</span>
                            <p>{f.value}</p>
                        </div>
                    ))}
                </section>
            )}

            {/* 보증 */}
            <section className="pd-content__warranty">
                <span className="pd-content__warranty-badge">{detailCopy.warrantyBadge}</span>
                <div>
                    <strong>{detailCopy.warrantyTitle}</strong>
                    <p>{detailCopy.warrantyText}</p>
                </div>
            </section>

            {/* TECH SPECS */}
            {features.length > 0 && (
                <section className="pd-content__specs">
                    <h3>TECH SPECS</h3>
                    <div className="pd-content__spec-row">
                        <h4>At a glance</h4>
                        <ul>
                            {product.selectedOptions
                                ?.filter((o) => !hiddenOptionLabels.includes(o.label))
                                .map((o) => (
                                    <li key={o.label}>
                                        {optionLabelNames[o.label] ?? o.label}: <em>{optionValueNames[o.value] ?? o.value}</em>
                                    </li>
                                ))}
                            {highlights.slice(0, 4).map((f) => (
                                <li key={f.code}>{f.value}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="pd-content__spec-row">
                        <h4>Tech Specs</h4>
                        <dl>
                            {features.map((f) => (
                                <div key={f.code}>
                                    <dt>{f.label}</dt>
                                    <dd>{f.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                    {product.sku && (
                        <div className="pd-content__spec-row">
                            <h4>상품 코드</h4>
                            <ul>
                                <li>{product.sku}</li>
                            </ul>
                        </div>
                    )}
                </section>
            )}

            {/* 남은 이미지 */}
            {extraImages.map((image) => (
                <img key={image} className="pd-content__extra" src={image} alt={title} loading="lazy" />
            ))}
        </div>
    );
};
