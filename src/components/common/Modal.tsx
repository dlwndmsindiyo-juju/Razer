import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

// 공통 팝업 (어두운 배경 + 가운데 상자 · 제목 · 닫기 X · 아래 버튼)
// ESC 또는 배경을 누르면 닫힘
// size="sm": 확인 팝업 (로그아웃할까요? · 삭제할까요? 처럼 제목 + 버튼만)
export const Modal = ({
    title,
    onClose,
    children,
    actions,
    size,
    subtitle,
}: {
    title: string;
    onClose: () => void;
    children?: ReactNode;
    actions?: ReactNode;
    size?: "sm" | "card"; // card: 결제 수단 등록 (가운데 제목 · 큰 등록 버튼)
    subtitle?: string;
}) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        // 팝업이 떠 있는 동안 뒤 화면 스크롤 막기
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = overflow;
        };
    }, [onClose]);

    return createPortal(
        <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className={`modal__panel ${size ? `modal__panel--${size}` : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div className="modal__head">
                    <div>
                        <h2 id="modal-title" className="modal__title">
                            {title}
                        </h2>
                        {subtitle && <p className="modal__subtitle">{subtitle}</p>}
                    </div>
                    <button type="button" className="modal__close" onClick={onClose} aria-label="닫기">
                        <img src="/icons/close.svg" alt="" />
                    </button>
                </div>
                {children && <div className="modal__body">{children}</div>}
                {actions && <div className="modal__actions">{actions}</div>}
            </div>
        </div>,
        document.body,
    );
};
