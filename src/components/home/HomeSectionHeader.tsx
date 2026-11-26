import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface HomeSectionHeaderProps {
    title: string;
    to?: string; // 오른쪽 링크 (없으면 표시 안 함)
    moreLabel?: string; // 오른쪽 링크 글자
    children?: ReactNode; // 제목 아래 탭 등
}

// 상품 섹션 공통 헤더 (제목 + 오른쪽 링크)
export const HomeSectionHeader = ({ title, to, moreLabel = "전체 보기", children }: HomeSectionHeaderProps) => {
    return (
        <div className="home-section__header">
            <div className="home-section__head">
                <h2 className="home-section__title">{title}</h2>
                {to && (
                    <Link to={to} className="home-section__more">
                        {moreLabel}
                        <span className="home-section__more-icon" aria-hidden="true" />
                    </Link>
                )}
            </div>
            {children}
        </div>
    );
};
