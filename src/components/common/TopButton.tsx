import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// 맨 위로 (모든 페이지에 항상 보임 · 위: 초록 TOP / 아래: 로고)
// 푸터가 화면에 들어오면 푸터 위에 걸려서 더 내려가지 않음
export const TopButton = () => {
    const [lift, setLift] = useState(0); // 푸터가 보이는 만큼 위로 올림 (px)
    const { pathname } = useLocation();

    useEffect(() => {
        const update = () => {
            const footer = document.querySelector(".footer");
            const footerTop = footer?.getBoundingClientRect().top ?? Infinity;
            setLift(Math.max(0, window.innerHeight - footerTop));
        };
        update();
        // 페이지 이동 · 이미지 로딩으로 길이가 바뀌어도 다시 계산
        const observer = new ResizeObserver(update);
        observer.observe(document.body);
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [pathname]);

    return (
        <button
            type="button"
            className="top-button is-visible"
            style={{ bottom: `calc(2.5rem + ${lift}px)` }}
            aria-label="맨 위로"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            <span className="top-button__text">TOP</span>
            <img src="/icons/logo.svg" alt="" className="top-button__logo" />
        </button>
    );
};
