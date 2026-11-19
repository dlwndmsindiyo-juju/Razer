import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface HomeSectionHeaderProps {
    title: string;
    to?: string; // 전체 보기 링크 (목록 페이지가 생기면 연결)
    children?: ReactNode; // 제목 아래 탭 등
}

// 상품 섹션 공통 헤더 (제목 + 전체 보기)
export const HomeSectionHeader = ({ title, to = "/", children }: HomeSectionHeaderProps) => {
    return (
        <div className="home-section__header">
            <div className="home-section__head">
                <h2 className="home-section__title">{title}</h2>
                <Link to={to} className="home-section__more">
                    전체 보기 →
                </Link>
            </div>
            {children}
        </div>
    );
};
