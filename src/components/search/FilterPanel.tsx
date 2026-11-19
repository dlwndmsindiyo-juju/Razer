import { useEffect, useRef } from "react";
import type { FilterGroup, SelectedFilters } from "../../data/searchData";

interface FilterPanelProps {
    isOpen: boolean;
    groups: FilterGroup[];
    onClear: () => void;
    selected: SelectedFilters;
    onToggle: (groupId: string, optionId: string) => void;
    onClose: () => void;
}

// 모든 필터 (왼쪽 슬라이드 창)
export const FilterPanel = ({ isOpen, groups, selected, onToggle, onClose, onClear }: FilterPanelProps) => {
    const closeButton = useRef<HTMLButtonElement>(null);
    // ESC 로 닫기 · 열려 있는 동안 뒤 화면 스크롤 막기
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButton.current?.focus();
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = overflow;
        };
    }, [isOpen, onClose]);

    return (
        <div className={`filter-panel ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen} inert={!isOpen}>
            <div className="filter-panel__dim" onClick={onClose} />

            <aside className="filter-panel__sheet" role="dialog" aria-modal="true" aria-label="필터">
                <div className="filter-panel__head">
                    <h2 className="filter-panel__title">필터</h2>
                    <button ref={closeButton} type="button" className="filter-panel__close" aria-label="필터 닫기" onClick={onClose}>
                        <img src="/icons/close.svg" alt="" />
                    </button>
                </div>

                <button type="button" className="filter-panel__reset" onClick={onClear}>선택 초기화</button>

                {groups.map((group) => (
                    <section key={group.id} className="filter-panel__group">
                        <h3 className="filter-panel__group-title">{group.title}</h3>
                        <ul className="filter-panel__chips">
                            {group.options.map((option) => {
                                const isSelected = selected[group.id]?.includes(option.id) ?? false;
                                return (
                                    <li key={option.id}>
                                        <button
                                            type="button"
                                            className={`filter-panel__chip ${isSelected ? "is-selected" : ""}`}
                                            aria-pressed={isSelected}
                                            onClick={() => onToggle(group.id, option.id)}
                                        >
                                            {option.label}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))}
            </aside>
        </div>
    );
};


