import { useEffect, useRef, useState } from "react";
import { sortOptions, type SortId } from "../../data/searchData";

interface SortDropdownProps {
    value: SortId;
    onChange: (id: SortId) => void;
}

// 정렬 드롭다운
export const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // 바깥 클릭하면 닫기
    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen]);

    const current = sortOptions.find((option) => option.id === value);

    return (
        <div className="sort-dropdown" ref={ref}>
            <button
                type="button"
                className="sort-dropdown__button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {value === "recommended" ? "정렬" : current?.label}
                <img src="/icons/down-arrow.svg" alt="" className={isOpen ? "is-open" : undefined} />
            </button>

            {isOpen && (
                <ul className="sort-dropdown__list" role="listbox">
                    {sortOptions.map((option) => (
                        <li key={option.id}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={option.id === value}
                                className={option.id === value ? "is-selected" : undefined}
                                onClick={() => {
                                    onChange(option.id);
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
