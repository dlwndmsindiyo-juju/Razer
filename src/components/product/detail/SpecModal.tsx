import { useEffect } from "react";
import type { Product } from "../../../types/product";

// 모든 사양 보기 (기술 사양 팝업)
export const SpecModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    const features = product.technicalSpecifications?.flatMap((group) => group.features) ?? [];

    return (
        <div className="pd-spec" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className="pd-spec__panel" role="dialog" aria-modal="true" aria-labelledby="pd-spec-title">
                <div className="pd-spec__head">
                    <h2 id="pd-spec-title">기술 사양</h2>
                    <button type="button" className="pd-spec__close" aria-label="닫기" onClick={onClose}>
                        <img src="/icons/close.svg" alt="" />
                    </button>
                </div>
                {features.length > 0 ? (
                    <dl className="pd-spec__list">
                        {features.map((feature) => (
                            <div key={feature.code}>
                                <dt>{feature.label}</dt>
                                <dd>
                                    {feature.values.join(" · ")}
                                    {feature.unit ? ` ${feature.unit}` : ""}
                                </dd>
                            </div>
                        ))}
                    </dl>
                ) : (
                    <p className="pd-spec__empty">등록된 사양 정보가 없어요.</p>
                )}
            </div>
        </div>
    );
};
