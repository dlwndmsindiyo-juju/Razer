import { useNavigate } from "react-router-dom";
import { findVariant, getOptionGroups } from "../../../data/productData";
import { hiddenOptionLabels, largeOptionLabels, optionLabelNames, optionValueNames, swatchColors } from "../../../data/detailData";
import type { Product } from "../../../types/product";

const won = (price?: number | null) => (price == null ? "가격 미정" : `${price.toLocaleString("ko-KR")}원`);

// 색상 / 디자인(동그라미) · 모델 등(버튼) 옵션 선택 → 같은 모델의 다른 상품 페이지로 이동
export const ProductOptions = ({ product }: { product: Product }) => {
    const navigate = useNavigate();
    // 고를 값이 2개 이상인 옵션만 (1개뿐이면 버튼을 만들지 않음)
    const groups = getOptionGroups(product).filter(
        (group) => !hiddenOptionLabels.includes(group.label) && group.values.length > 1,
    );
    const selected = Object.fromEntries((product.selectedOptions ?? []).map((o) => [o.label, o.value]));

    return (
        <>
            {groups.map(({ label, values }) => {
                const isSwatch = label.includes("색상");
                const isLarge = largeOptionLabels.includes(label);
                const listClass = isSwatch ? "pd-option__swatches" : isLarge ? "pd-option__buttons" : "pd-option__chips";
                return (
                    <section key={label} className="pd-option">
                        <h2 className="pd-option__title">{optionLabelNames[label] ?? label}</h2>
                        <ul className={listClass}>
                            {values.map((value) => {
                                const variant = findVariant(product, label, value);
                                const isActive = selected[label] === value;
                                const color = swatchColors[value];
                                const select = () => {
                                    if (variant && variant.id !== product.id) {
                                        // 옵션만 바꾸는 이동은 스크롤 위치 유지
                                        navigate(`/products/${variant.category}/${variant.id}`, { replace: true, state: { keepScroll: true } });
                                    }
                                };

                                return (
                                    <li key={value}>
                                        <button
                                            type="button"
                                            className={`${isSwatch ? "pd-swatch" : isLarge ? "pd-choice" : "pd-chip"} ${isActive ? "is-active" : ""}`}
                                            aria-pressed={isActive}
                                            aria-label={isSwatch ? `${value} · ${won(variant?.price)}` : undefined}
                                            title={isSwatch ? `${value} · ${won(variant?.price)}` : undefined}
                                            disabled={!variant} // 우리 데이터에 없는 조합은 선택 불가
                                            onClick={select}
                                        >
                                            {isSwatch ? (
                                                <span className="pd-swatch__dot" style={color ? { backgroundColor: color } : undefined}>
                                                    {!color && variant && <img src={variant.image} alt="" loading="lazy" />}
                                                </span>
                                            ) : (
                                                optionValueNames[value] ?? value
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                );
            })}
        </>
    );
};
