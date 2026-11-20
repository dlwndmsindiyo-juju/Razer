import { useEffect, useState } from "react";

// 맨 위로 (스크롤을 조금 내리면 나타남 · 위: 초록 TOP / 아래: 로고)
export const TopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 600);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <button
            type="button"
            className={`top-button ${visible ? "is-visible" : ""}`}
            aria-label="맨 위로"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            <span className="top-button__text">TOP</span>
            <img src="/icons/logo.svg" alt="" className="top-button__logo" />
        </button>
    );
};
