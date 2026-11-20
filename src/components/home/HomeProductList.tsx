import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import type { HomeProduct } from "../../data/homeData";
import { ProductCard } from "../product/ProductCard";

interface HomeProductListProps {
    products: HomeProduct[];
    slider?: boolean; // true: 한 줄 6개 + 좌우 슬라이드 (메인) · false: 여러 줄 (검색 결과)
}

// 상품 목록 (260 x 6 · 간격 24)
export const HomeProductList = ({ products, slider = false }: HomeProductListProps) => {
    if (products.length === 0) {
        return <p className="home-section__empty">준비 중인 상품이에요.</p>;
    }

    const cards = products.map((product) => (
        <li key={product.id}>
            <ProductCard product={product} />
        </li>
    ));

    if (!slider) return <ul className="home-section__products">{cards}</ul>;
    return <ProductSlider>{cards}</ProductSlider>;
};

// 좌우 슬라이드 (버튼 · 마우스 드래그 · 트랙패드 · 터치)
// 더 넘길 상품이 없을 때 끌면 살짝 당겨졌다가 돌아옴 (끝이라는 표시)
const MAX_PULL = 96; // 최대로 당겨지는 거리(px)
const pull = (overflow: number) => Math.sign(overflow) * Math.min(Math.abs(overflow) * 0.35, MAX_PULL);

const ProductSlider = ({ children }: { children: ReactNode }) => {
    const trackRef = useRef<HTMLUListElement>(null);
    const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const [hasMore, setHasMore] = useState(false); // 한 화면보다 상품이 많은지

    // 처음 · 끝에 닿았는지 확인해서 버튼 상태 변경
    const update = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        const max = track.scrollWidth - track.clientWidth;
        setHasMore(max > 1);
        setCanPrev(track.scrollLeft > 1);
        setCanNext(track.scrollLeft < max - 1);
    }, []);

    useEffect(() => {
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [update, children]);

    // 당긴 위치에서 제자리로 (스프링처럼)
    const release = (track: HTMLUListElement) => {
        track.style.transition = "transform 0.45s cubic-bezier(0.22, 1.4, 0.36, 1)";
        track.style.transform = "";
    };

    // 끝에서 버튼을 누르면 그 방향으로 살짝 당겼다 놓기
    const bounce = (direction: -1 | 1) => {
        const track = trackRef.current;
        if (!track) return;
        track.style.transition = "transform 0.15s ease-out";
        track.style.transform = `translateX(${-direction * 40}px)`;
        window.setTimeout(() => release(track), 150);
    };

    // 한 번에 한 화면(6개)씩 이동 · 더 없으면 당기기만
    const slide = (direction: -1 | 1) => {
        const track = trackRef.current;
        if (!track) return;
        if ((direction === 1 && !canNext) || (direction === -1 && !canPrev)) return bounce(direction);
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        track.scrollBy({ left: direction * (track.clientWidth + gap), behavior: "smooth" });
    };

    // ---------- 마우스 드래그 (터치는 브라우저 기본 스크롤 사용) ----------
    const onPointerDown = (e: PointerEvent<HTMLUListElement>) => {
        if (e.pointerType === "touch" || e.button !== 0) return;
        const track = e.currentTarget;
        drag.current = { active: true, startX: e.clientX, startScroll: track.scrollLeft, moved: false };
        track.style.transition = "";
    };

    const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
        const state = drag.current;
        if (!state.active) return;
        const track = e.currentTarget;
        const dx = e.clientX - state.startX;
        if (!state.moved && Math.abs(dx) < 5) return; // 살짝 흔들린 클릭은 무시

        if (!state.moved) {
            state.moved = true;
            track.setPointerCapture(e.pointerId);
            track.classList.add("is-dragging");
        }

        const max = track.scrollWidth - track.clientWidth;
        const target = state.startScroll - dx;
        track.scrollLeft = Math.max(0, Math.min(max, target));

        // 처음보다 앞 · 끝보다 뒤로 끌면 당겨지는 효과
        const overflow = target < 0 ? -target : target > max ? max - target : 0;
        track.style.transform = overflow ? `translateX(${pull(overflow)}px)` : "";
    };

    const onPointerUp = (e: PointerEvent<HTMLUListElement>) => {
        const state = drag.current;
        if (!state.active) return;
        state.active = false;
        const track = e.currentTarget;
        if (!state.moved) return;

        track.classList.remove("is-dragging");
        release(track);

        // 가장 가까운 카드 시작 위치에 맞추기
        const first = track.firstElementChild as HTMLElement | null;
        if (first) {
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            const step = first.offsetWidth + gap;
            track.scrollTo({ left: Math.round(track.scrollLeft / step) * step, behavior: "smooth" });
        }
    };

    // 드래그 후 손을 뗄 때 상품 링크로 이동하지 않게
    const onClickCapture = (e: MouseEvent) => {
        if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
        }
    };

    return (
        <div className="home-slider">
            <ul
                className="home-slider__track"
                ref={trackRef}
                onScroll={update}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClickCapture={onClickCapture}
                onDragStart={(e) => e.preventDefault()} // 이미지 끌기 막기
            >
                {children}
            </ul>

            {/* 한 화면보다 많을 때만 버튼 표시 · 끝이면 흐리게 (눌러도 당기기만) */}
            {hasMore && (
                <>
                    <button
                        type="button"
                        className={`home-slider__btn home-slider__btn--prev ${canPrev ? "" : "is-end"}`}
                        aria-label="이전 상품"
                        onClick={() => slide(-1)}
                    >
                        <img src="/icons/down-arrow.svg" alt="" />
                    </button>
                    <button
                        type="button"
                        className={`home-slider__btn home-slider__btn--next ${canNext ? "" : "is-end"}`}
                        aria-label="다음 상품"
                        onClick={() => slide(1)}
                    >
                        <img src="/icons/down-arrow.svg" alt="" />
                    </button>
                </>
            )}
        </div>
    );
};
