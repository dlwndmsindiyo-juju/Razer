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

// 칸 맞춤(scroll-snap)이 있는 목록: 놓은 위치에서 가장 가까운 칸으로 부드럽게 이동
const snapTarget = (el: HTMLElement) => {
    const style = getComputedStyle(el);
    if (!style.scrollSnapType || style.scrollSnapType === "none") return null;
    const box = el.getBoundingClientRect();
    const padLeft = parseFloat(style.scrollPaddingLeft) || 0;
    const padTop = parseFloat(style.scrollPaddingTop) || 0;
    let best: { left: number; top: number; distance: number } | null = null;
    Array.from(el.children).forEach((child) => {
        const align = getComputedStyle(child).scrollSnapAlign;
        if (!align || align === "none") return;
        const rect = child.getBoundingClientRect();
        let left = el.scrollLeft + rect.left - box.left - padLeft;
        let top = el.scrollTop + rect.top - box.top - padTop;
        if (align.includes("center")) {
            left = el.scrollLeft + rect.left - box.left - (el.clientWidth - rect.width) / 2;
            top = el.scrollTop + rect.top - box.top - (el.clientHeight - rect.height) / 2;
        }
        left = Math.max(0, Math.min(left, el.scrollWidth - el.clientWidth));
        top = Math.max(0, Math.min(top, el.scrollHeight - el.clientHeight));
        const distance = Math.abs(left - el.scrollLeft) + Math.abs(top - el.scrollTop);
        if (!best || distance < best.distance) best = { left, top, distance };
    });
    return best as { left: number; top: number; distance: number } | null;
};

export const useDragScroll = () => {
    useEffect(() => {
        let target: HTMLElement | null = null;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;
        let moved = false;
        // 놓은 뒤 관성으로 조금 더 미끄러짐 (손을 뗄 때의 속도)
        let lastX = 0;
        let lastY = 0;
        let lastTime = 0;
        let velocityX = 0;
        let velocityY = 0;
        let glideFrame = 0;
        let settleTimer = 0;
        let gliding: HTMLElement | null = null;

        const finish = (el: HTMLElement) => {
            const snap = snapTarget(el);
            if (snap && snap.distance > 1) {
                el.scrollTo({ left: snap.left, top: snap.top, behavior: "smooth" });
                settleTimer = window.setTimeout(() => el.classList.remove("is-dragging"), 450);
            } else {
                el.classList.remove("is-dragging");
            }
            gliding = null;
        };
        const stopGlide = () => {
            cancelAnimationFrame(glideFrame);
            clearTimeout(settleTimer);
            if (gliding) gliding.classList.remove("is-dragging");
            gliding = null;
        };
        const glide = (el: HTMLElement) => {
            gliding = el;
            let prev = performance.now();
            const step = (now: number) => {
                const dt = Math.min(32, now - prev);
                prev = now;
                el.scrollLeft -= velocityX * dt;
                el.scrollTop -= velocityY * dt;
                const friction = Math.pow(0.94, dt / 16);
                velocityX *= friction;
                velocityY *= friction;
                if (Math.abs(velocityX) < 0.02 && Math.abs(velocityY) < 0.02) return finish(el);
                glideFrame = requestAnimationFrame(step);
            };
            glideFrame = requestAnimationFrame(step);
        };

        const onDown = (e: PointerEvent) => {
            stopGlide();
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
            lastX = e.clientX;
            lastY = e.clientY;
            lastTime = e.timeStamp;
            velocityX = 0;
            velocityY = 0;
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
            const dt = e.timeStamp - lastTime;
            if (dt > 0) {
                // 최근 움직임 쪽에 무게를 두고 속도 계산
                velocityX = velocityX * 0.2 + ((e.clientX - lastX) / dt) * 0.8;
                velocityY = velocityY * 0.2 + ((e.clientY - lastY) / dt) * 0.8;
            }
            lastX = e.clientX;
            lastY = e.clientY;
            lastTime = e.timeStamp;
            e.preventDefault();
        };
        const onUp = (e: PointerEvent) => {
            if (!target) return;
            const el = target;
            target = null;
            if (!moved) return;
            // 멈췄다 놓으면 관성 없음
            if (e.timeStamp - lastTime > 80) {
                velocityX = 0;
                velocityY = 0;
            }
            if (!isScrollableX(el)) velocityX = 0;
            if (!isScrollableY(el)) velocityY = 0;
            glide(el);
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
        const onWheel = () => gliding && stopGlide(); // 휠을 굴리면 관성 멈춤
        document.addEventListener("wheel", onWheel, { passive: true });
        return () => {
            stopGlide();
            document.removeEventListener("wheel", onWheel);
            document.removeEventListener("pointerdown", onDown);
            document.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerup", onUp);
            document.removeEventListener("pointercancel", onUp);
            document.removeEventListener("click", onClick, true);
            document.removeEventListener("dragstart", onDragStart);
        };
    }, []);
};
