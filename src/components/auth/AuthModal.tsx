import { useEffect, useId, useRef, type ReactNode } from "react";

interface AuthModalProps {
    title: string;
    children: ReactNode; // 안내 문구
    actions: ReactNode; // 하단 버튼
    onClose: () => void;
}

// 로그인 · 회원가입 안내 팝업 (Esc · 바깥 클릭으로 닫기)
export const AuthModal = ({ title, children, actions, onClose }: AuthModalProps) => {
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 열리면 첫 번째 버튼에 포커스, 뒤 화면 스크롤 막기
        panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener("keydown", handleKey);
        };
    }, [onClose]);

    return (
        <div className="auth-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className="auth-modal__panel" ref={panelRef} role="alertdialog" aria-modal="true" aria-labelledby={titleId}>
                <h2 id={titleId} className="auth-modal__title">{title}</h2>
                <div className="auth-modal__text">{children}</div>
                <div className="auth-modal__actions">{actions}</div>
            </div>
        </div>
    );
};
