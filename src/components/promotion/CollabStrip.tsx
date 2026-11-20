import { ImageOrText } from "../common/ImageOrText";
import type { Collab } from "../../data/collabData";

// 큰 이미지 아래 검정 띠 (콜라보 로고 · 없으면 이름 글자)
export const CollabStrip = ({ collab }: { collab: Collab }) => (
    <div className="collab-strip">
        <ImageOrText src={collab.logo} alt={collab.name} label={collab.name} className="collab-strip__logo" />
    </div>
);
