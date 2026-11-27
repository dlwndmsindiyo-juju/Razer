// 저장 · 변경 결과 안내 (✓ 문구 · 닫기 X)
// PC: 초록 글씨 한 줄 / 모바일: 회색 상자 (style/mobile.scss account-phone)
// tone="info": 체크 없이 (안내 · 입력 오류)
export const InlineToast = ({ text, onClose, tone = "success" }: { text: string; onClose: () => void; tone?: "success" | "info" }) => {
    if (!text) return null;
    return (
        <div className={`inline-toast inline-toast--${tone}`} role="status">
            <span className="inline-toast__text">{text}</span>
            <button type="button" className="inline-toast__close" onClick={onClose} aria-label="안내 닫기">
                <img src="/icons/ui/close.svg" alt="" />
            </button>
        </div>
    );
};
