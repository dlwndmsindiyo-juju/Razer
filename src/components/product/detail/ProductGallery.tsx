import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

const SWIPE = 60; // 이만큼(px) 이상 끌면 이전 · 다음 이미지

// 상세 이미지: 왼쪽 세로 썸네일(드래그 · 휠로 스크롤) + 오른쪽 큰 이미지(끌어서 넘김)
// 태블릿 · 모바일은 썸네일이 큰 이미지 아래 가로 줄로 (드래그 슬라이드)
// children: 큰 이미지 위에 올릴 버튼 (타건음 · 커스터마이징)
export const ProductGallery = ({ images, alt, children }: { images: string[]; alt: string; children?: ReactNode }) => {
    const [index, setIndex] = useState(0);
    const listRef = useRef<HTMLUListElement>(null);
    const dragRef = useRef<{ x: number; id: number } | null>(null);
    const [dragX, setDragX] = useState(0); // 끄는 중인 거리 (손을 따라 움직임)

    // 선택한 썸네일이 목록 안에서 보이도록 (페이지는 움직이지 않음)
    useEffect(() => {
        const list = listRef.current;
        const item = list?.children[index] as HTMLElement | undefined;
        if (!list || !item) return;
        const vertical = list.scrollHeight > list.clientHeight;
        if (vertical) {
            const top = item.offsetTop - list.offsetTop;
            if (top < list.scrollTop) list.scrollTo({ top, behavior: "smooth" });
            else if (top + item.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTo({ top: top + item.offsetHeight - list.clientHeight, behavior: "smooth" });
        } else {
            const left = item.offsetLeft - list.offsetLeft;
            if (left < list.scrollLeft) list.scrollTo({ left, behavior: "smooth" });
            else if (left + item.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollTo({ left: left + item.offsetWidth - list.clientWidth, behavior: "smooth" });
        }
    }, [index]);

    // 큰 이미지 끌어서 넘기기 (마우스 · 터치 공통 · 위 버튼은 제외)
    const onDown = (e: PointerEvent<HTMLDivElement>) => {
        if (images.length < 2 || (e.target as HTMLElement).closest("button, a")) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        dragRef.current = { x: e.clientX, id: e.pointerId };
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent<HTMLDivElement>) => {
        if (dragRef.current?.id !== e.pointerId) return;
        let dx = e.clientX - dragRef.current.x;
        // 처음 · 마지막 이미지에서는 살짝만 밀림
        if ((index === 0 && dx > 0) || (index === images.length - 1 && dx < 0)) dx /= 4;
        setDragX(dx);
    };
    const onUp = (e: PointerEvent<HTMLDivElement>) => {
        if (dragRef.current?.id !== e.pointerId) return;
        const dx = e.clientX - dragRef.current.x;
        dragRef.current = null;
        setDragX(0);
        if (dx <= -SWIPE) setIndex((i) => Math.min(images.length - 1, i + 1));
        else if (dx >= SWIPE) setIndex((i) => Math.max(0, i - 1));
    };

    return (
        <div className={`pd-gallery ${images.length > 1 ? "" : "is-single"}`}>
            {images.length > 1 && (
                <ul className="pd-gallery__list" ref={listRef} aria-label="상품 이미지 목록">
                    {images.map((image, i) => (
                        <li key={image}>
                            <button
                                type="button"
                                className={`pd-gallery__thumb ${i === index ? "is-active" : ""}`}
                                aria-label={`${i + 1}번 이미지 보기`}
                                aria-pressed={i === index}
                                onClick={() => setIndex(i)}
                            >
                                <img src={image} alt="" loading="lazy" draggable={false} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div
                className={`pd-gallery__main ${dragX ? "is-dragging" : ""}`}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                data-no-drag
            >
                <ul
                    className="pd-gallery__track"
                    style={{ transform: `translateX(calc(${-index * 100}% + ${dragX}px))` }}
                    aria-live="polite"
                >
                    {images.map((image, i) => (
                        <li key={image} aria-hidden={i !== index}>
                            <img
                                src={image}
                                alt={`${alt} 이미지 ${i + 1}`}
                                loading={Math.abs(i - index) <= 1 ? "eager" : "lazy"}
                                draggable={false}
                            />
                        </li>
                    ))}
                </ul>
                {children}
            </div>
        </div>
    );
};
