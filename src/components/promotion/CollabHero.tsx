import { useState } from "react";
import { ImageOrText } from "../common/ImageOrText";
import { getCollabHero, type Collab } from "../../data/collabData";

// 콜라보 큰 대표 영역: 영상이 있으면 영상(소리 없이 반복) · 영상이 없거나 못 불러오면 대표 이미지
export const CollabHero = ({ collab }: { collab: Collab }) => {
    const [videoFailed, setVideoFailed] = useState(false);
    const image = getCollabHero(collab);

    if (collab.video && !videoFailed) {
        return (
            <video
                className="collab-hero__video"
                src={collab.video}
                poster={image}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`${collab.name} 영상`}
                onError={() => setVideoFailed(true)}
            />
        );
    }

    return <ImageOrText src={image} alt={collab.name} label="Collab Image" />;
};
