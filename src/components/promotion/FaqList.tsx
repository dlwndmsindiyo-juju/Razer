import { useId, useState } from "react";
import type { CollabFaq } from "../../data/collabData";

interface FaqListProps {
    items: CollabFaq[];
    numbered?: boolean; // true: 01 02 … 번호 + 선 구분 (콜라보 상세) · false: 회색 박스 (프로모션)
    defaultOpen?: number | null;
}

// 자주 묻는 질문 (누르면 답변 열림 · 다시 누르면 닫힘)
export const FaqList = ({ items, numbered = false, defaultOpen = null }: FaqListProps) => {
    const [open, setOpen] = useState<number | null>(defaultOpen);
    const baseId = useId();

    return (
        <ul className={`faq ${numbered ? "faq--numbered" : "faq--boxed"}`}>
            {items.map((item, i) => {
                const isOpen = open === i;
                const panelId = `${baseId}-${i}`;
                return (
                    <li key={item.q} className={`faq__item ${isOpen ? "is-open" : ""}`}>
                        <button
                            type="button"
                            className="faq__question"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setOpen(isOpen ? null : i)}
                        >
                            {numbered && <span className="faq__num">{String(i + 1).padStart(2, "0")}</span>}
                            <span className="faq__text">{item.q}</span>
                            <span className="faq__icon" aria-hidden="true" />
                        </button>
                        {isOpen && (
                            <p id={panelId} className="faq__answer">
                                {item.a}
                            </p>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};
