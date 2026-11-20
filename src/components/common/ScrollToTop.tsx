import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// 경로가 바뀌면 항상 페이지 맨 위에서 시작
// (검색어 q처럼 쿼리만 바뀔 때, 상세 옵션을 바꿀 때는 위치 유지)
export const ScrollToTop = () => {
    const { pathname, state } = useLocation();
    // 상세페이지에서 옵션(색상 · 모델)만 바꿀 때는 위치 유지
    const keepScroll = (state as { keepScroll?: boolean } | null)?.keepScroll;

    useLayoutEffect(() => {
        if (keepScroll) return;
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return null;
};
