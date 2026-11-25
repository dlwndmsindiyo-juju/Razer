import { useState, type ImgHTMLAttributes } from "react";

// 이미지가 없거나 못 불러오면 글자로 대신 보여 줌
export const SafeImage = ({ fallback, className, alt = "", ...img }: ImgHTMLAttributes<HTMLImageElement> & { fallback?: string }) => {
    const [failed, setFailed] = useState(false);
    if (failed || !img.src) {
        return fallback === undefined ? null : (
            <div className={"safe-image__fallback" + (className ? " " + className : "")} role={alt ? "img" : undefined} aria-label={alt || undefined}>
                {fallback}
            </div>
        );
    }
    return <img {...img} alt={alt} className={className} onError={() => setFailed(true)} />;
};
