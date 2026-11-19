import { useState } from "react";

interface ImageOrTextProps {
    src?: string;
    alt: string;
    label?: string; // 이미지가 없을 때 보일 글자
    className?: string;
}

// 이미지 파일이 있으면 이미지, 없거나 아직 안 넣었으면 글자로 표시
// → 경로만 데이터에 적어두고 public 에 파일을 넣으면 코드 수정 없이 바로 이미지로 바뀜
export const ImageOrText = ({ src, alt, label = "Image", className }: ImageOrTextProps) => {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    if (!src || failedSrc === src) {
        return <span className={`image-or-text ${className ?? ""}`.trim()}>{label}</span>;
    }

    return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailedSrc(src)} />;
};
