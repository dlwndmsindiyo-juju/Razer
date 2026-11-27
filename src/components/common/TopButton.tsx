// 맨 위로 (모든 페이지에 항상 보임 · 위: 초록 TOP / 아래: 로고)
// 화면 오른쪽 아래에 고정 · 푸터 위까지 그대로 따라 내려옴
export const TopButton = () => (
    <button
        type="button"
        className="top-button is-visible"
        aria-label="맨 위로"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
        <span className="top-button__text">TOP</span>
        <img src="/icons/logo.svg" alt="" className="top-button__logo" />
    </button>
);
