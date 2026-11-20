import { useEffect, useState, type ReactNode } from "react";

const VISIBLE = 5; // 한 번에 보이는 썸네일 수

// 상세 이미지: 큰 이미지 + 썸네일 5개 (좌우 화살표로 이전 · 다음 이미지)
// children: 큰 이미지 위에 올릴 버튼 (타건음 · 커스터마이징)
export const ProductGallery = ({ images, alt, children }: { images: string[]; alt: string; children?: ReactNode }) => {
    const [index, setIndex] = useState(0);
    const [start, setStart] = useState(0); // 썸네일 목록 첫 칸

    // 선택한 썸네일이 항상 보이도록 목록 위치 조정
    useEffect(() => {
        setStart((prev) => {
            if (index < prev) return index;
            if (index >= prev + VISIBLE) return index - VISIBLE + 1;
            return prev;
        });
    }, [index]);

    const go = (direction: -1 | 1) => setIndex((prev) => (prev + direction + images.length) % images.length);

    return (
        <div className="pd-gallery">
            <div className="pd-gallery__main">
                <img src={images[index]} alt={`${alt} 이미지 ${index + 1}`} />
                {children}
            </div>

            {images.length > 1 && (
                <div className="pd-gallery__thumbs">
                    <button type="button" className="pd-arrow" aria-label="이전 이미지" onClick={() => go(-1)}>
                        <img src="/icons/down-arrow.svg" alt="" className="is-prev" />
                    </button>

                    <div className="pd-gallery__viewport">
                        <ul
                            className="pd-gallery__list"
                            style={{ transform: `translateX(calc(${-start} * (var(--thumb-size) + var(--thumb-gap))))` }}
                        >
                            {images.map((image, i) => (
                                <li key={image}>
                                    <button
                                        type="button"
                                        className={`pd-gallery__thumb ${i === index ? "is-active" : ""}`}
                                        aria-label={`${i + 1}번 이미지 보기`}
                                        aria-pressed={i === index}
                                        onClick={() => setIndex(i)}
                                    >
                                        <img src={image} alt="" loading="lazy" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button type="button" className="pd-arrow" aria-label="다음 이미지" onClick={() => go(1)}>
                        <img src="/icons/down-arrow.svg" alt="" className="is-next" />
                    </button>
                </div>
            )}
        </div>
    );
};
