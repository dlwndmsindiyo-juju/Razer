import { useEffect } from "react";

// 넘치는 목록(가로 · 세로)은 마우스로 잡아 끌어서 스크롤 (터치는 원래 손가락으로 밀림)
// 페이지 전체에 한 번만 걸어 둠 (App) · 끌고 난 뒤의 클릭은 무시
const isScrollableX = (el: HTMLElement) => {
    const style = getComputedStyle(el);
    return /(auto|scroll)/.test(style.overflowX) && el.scrollWidth > el.clientWidth + 1;
};
// 세로는 페이지 본문이 아닌 안쪽 목록만 (상세 세로 썸네일 등)
const isScrollableY = (el: HTMLElement) => {
    const style = getComputedStyle(el);
    return /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1;
};
const isScrollable = (el: HTMLElement) => isScrollableX(el) || isScrollableY(el);

export const useDragScroll = () => {
    useEffect(() => {
        let target: HTMLElement | null = null;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;
        let moved = false;

        const onDown = (e: PointerEvent) => {
            moved = false;
            if (e.pointerType !== "mouse" || e.button !== 0) return;
            let el = e.target as HTMLElement | null;
            // 입력칸 · 직접 드래그를 쓰는 곳(data-no-drag)은 건드리지 않음
            if (el?.closest("input, textarea, select, [data-no-drag]")) return;
            while (el && el !== document.body && el !== document.documentElement && !isScrollable(el)) el = el.parentElement;
            if (!el || el === document.body || el === document.documentElement) return;
            target = el;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = el.scrollLeft;
            startTop = el.scrollTop;
            moved = false;
        };
        const onMove = (e: PointerEvent) => {
            if (!target) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (!moved && Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
            if (!moved) {
                moved = true;
                target.classList.add("is-dragging");
            }
            target.scrollLeft = startLeft - dx;
            target.scrollTop = startTop - dy;
            e.preventDefault();
        };
        const onUp = () => {
            target?.classList.remove("is-dragging");
            target = null;
        };
        const onClick = (e: MouseEvent) => {
            if (!moved) return;
            moved = false;
            e.preventDefault();
            e.stopPropagation();
        };
        const onDragStart = (e: DragEvent) => {
            if (target) e.preventDefault(); // 이미지 · 링크 끌기 대신 목록이 움직이게
        };

        document.addEventListener("pointerdown", onDown);
        document.addEventListener("pointermove", onMove, { passive: false });
        document.addEventListener("pointerup", onUp);
        document.addEventListener("pointercancel", onUp);
        document.addEventListener("click", onClick, true);
        document.addEventListener("dragstart", onDragStart);
        return () => {
            document.removeEventListener("pointerdown", onDown);
            document.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerup", onUp);
            document.removeEventListener("pointercancel", onUp);
            document.removeEventListener("click", onClick, true);
            document.removeEventListener("dragstart", onDragStart);
        };
    }, []);
};
