import { useEffect, useId, useRef, useState } from "react";
import { useShake } from "./useShake";

interface AuthSelectProps {
    label: string; // 선택 전 표시 문구
    options: string[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
    shakeKey?: number;
}

// 회원가입 선택 박스 (검색 정렬 드롭다운과 같은 방식)
export const AuthSelect = ({ label, options, value, onChange, error, shakeKey }: AuthSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const listId = useId();
    const errorId = useId();
    const shake = useShake(error, shakeKey);

    // 바깥 클릭 · Esc로 닫기
    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setIsOpen(false);
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [isOpen]);

    return (
        <div className={`auth-field auth-field--select${error ? " has-error" : ""}`} ref={ref}>
            <div className={`auth-select${shake.isShaking ? " is-shaking" : ""}`} onAnimationEnd={shake.stop}>
                <button
                    type="button"
                    className={`auth-select__button${value ? "" : " is-empty"}${isOpen ? " is-open" : ""}`}
                    aria-label={label}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={listId}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    {value || label}
                    <img src="/icons/down-arrow.svg" alt="" />
                </button>

                {isOpen && (
                    <ul id={listId} className="auth-select__list" role="listbox" aria-label={label}>
                        {options.map((option) => (
                            <li key={option}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={option === value}
                                    className={option === value ? "is-selected" : undefined}
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                    }}
                                >
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {error && <p id={errorId} className="auth-field__error">{error}</p>}
        </div>
    );
};
