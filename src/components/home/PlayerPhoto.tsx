import { useEffect, useRef, useState } from "react";

interface PlayerPhotoProps {
    src: string;
    alt: string;
}

// 선수 사진: 평소엔 흑백 → 마우스가 있는 곳만 물결치듯 컬러로 번짐
// 컬러 사진 한 장을 쓰고, 아래 층은 CSS 로 흑백 처리 · 위 층은 마우스 주변만 보이게(mask)
const SPOT_SIZE = 0.32; // 컬러 원 크기 (사진 짧은 변 대비)
const FOLLOW = 0.14; // 마우스를 따라가는 부드러움 (작을수록 느리게 따라옴)

export const PlayerPhoto = ({ src, alt }: PlayerPhotoProps) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const colorRef = useRef<HTMLImageElement>(null);
    const [failed, setFailed] = useState(false);

    // 애니메이션 상태 (렌더링 없이 값만 바꿈)
    const motion = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, radius: 0, targetRadius: 0, frame: 0 });

    useEffect(() => () => cancelAnimationFrame(motion.current.frame), []);

    const tick = (time: number) => {
        const m = motion.current;
        const box = boxRef.current;
        const color = colorRef.current;
        if (!box || !color) return;

        m.x += (m.targetX - m.x) * FOLLOW;
        m.y += (m.targetY - m.y) * FOLLOW;
        m.radius += (m.targetRadius - m.radius) * 0.12;

        // 원 3개가 서로 다른 박자로 흔들리며 합쳐져 물결 모양 테두리를 만듦
        const t = time / 1000;
        const r = m.radius;
        const blobs = [
            { dx: Math.cos(t * 1.6) * r * 0.18, dy: Math.sin(t * 1.9) * r * 0.14, s: 1 + Math.sin(t * 2.3) * 0.06 },
            { dx: Math.cos(t * 2.1 + 2) * r * 0.22, dy: Math.sin(t * 1.4 + 1) * r * 0.2, s: 0.78 + Math.sin(t * 1.7 + 1) * 0.08 },
            { dx: Math.cos(t * 1.2 + 4) * r * 0.2, dy: Math.sin(t * 2.4 + 3) * r * 0.22, s: 0.7 + Math.sin(t * 2.9 + 2) * 0.08 },
        ];
        color.style.maskImage = blobs
            .map(
                (b) =>
                    `radial-gradient(circle ${Math.max(0, r * b.s).toFixed(1)}px at ${(m.x + b.dx).toFixed(1)}px ${(m.y + b.dy).toFixed(1)}px, #000 55%, transparent 100%)`,
            )
            .join(", ");

        // 마우스가 나가서 다 사라지면 멈춤
        if (m.targetRadius === 0 && m.radius < 0.5) {
            color.style.maskImage = "radial-gradient(circle 0px at 0 0, #000, transparent)";
            m.frame = 0;
            return;
        }
        m.frame = requestAnimationFrame(tick);
    };

    const start = () => {
        if (!motion.current.frame) motion.current.frame = requestAnimationFrame(tick);
    };

    // 마우스 이벤트는 카드 전체에서 받음
    // (카드 전체가 상세페이지 링크로 덮여 있어 사진이 직접 마우스를 못 받기 때문 · 위치는 사진 기준으로 계산)
    useEffect(() => {
        const box = boxRef.current;
        if (!box) return;
        const area = (box.closest(".home-pick__card") as HTMLElement | null) ?? box;

        const point = (e: PointerEvent) => {
            const rect = box.getBoundingClientRect();
            return { x: e.clientX - rect.left, y: e.clientY - rect.top, size: Math.min(rect.width, rect.height) };
        };
        const onEnter = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            const { x, y, size } = point(e);
            // 들어온 자리에서 바로 번지기 시작
            Object.assign(motion.current, { x, y, targetX: x, targetY: y, targetRadius: size * SPOT_SIZE });
            start();
        };
        const onMove = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            const { x, y, size } = point(e);
            Object.assign(motion.current, { targetX: x, targetY: y, targetRadius: size * SPOT_SIZE });
            start();
        };
        const onLeave = () => {
            motion.current.targetRadius = 0;
            start();
        };

        area.addEventListener("pointerenter", onEnter);
        area.addEventListener("pointermove", onMove);
        area.addEventListener("pointerleave", onLeave);
        return () => {
            area.removeEventListener("pointerenter", onEnter);
            area.removeEventListener("pointermove", onMove);
            area.removeEventListener("pointerleave", onLeave);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [failed]);

    if (failed) return <span className="image-or-text home-pick__player-img">Player Image</span>;

    return (
        <div className="player-photo" ref={boxRef}>
            <img className="player-photo__gray" src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
            <img className="player-photo__color" src={src} alt="" aria-hidden="true" loading="lazy" ref={colorRef} />
        </div>
    );
};
