import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// 경로가 바뀌면 항상 페이지 맨 위에서 시작
// (검색어 q처럼 쿼리만 바뀔 때는 위치 유지)
export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    return null;
};
