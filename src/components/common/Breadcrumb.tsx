import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { useBreadcrumb } from "../../types/useBreadcrumb";

// 히어로가 있는 페이지: 페이지 안에서 히어로 바로 아래에 직접 넣음 (<Breadcrumb inline />)
// 그 외 페이지: App 에서 페이지 맨 위에 넣음
const heroPages = [
    /^\/search/,
    /^\/products\/[^/]+$/, // 상품 목록 (검색창 아래)
    /^\/info\/promotion\/promotions$/,
    /^\/promotion\/collab\//,
    /^\/info\/product\/(razer-exclusives|membership)$/,
    /^\/info\/promotion\/esports(\/(niko|green))?$/,
    /^\/info\/service\/registration-warranty$/,
    /^\/info\/company\/about$/,
];

// 경로 표시 (예: 제품 > 키보드 > 제품명) · 마지막은 현재 페이지
export const Breadcrumb = ({ inline = false }: { inline?: boolean }) => {
    const { pathname } = useLocation();
    const crumbs = useBreadcrumb();
    if (!inline && heroPages.some((re) => re.test(pathname))) return null;
    if (!crumbs.length) return null;

    return (
        <div className="breadcrumb" aria-label="현재 위치">
            {crumbs.map((crumb, i) => (
                <Fragment key={`${crumb.label}-${i}`}>
                    {i > 0 && <img src="/icons/ui/chevron-right.svg" alt="" className="breadcrumb__sep" aria-hidden="true" />}
                    {crumb.to && i < crumbs.length - 1 ? (
                        <Link to={crumb.to} className="breadcrumb__link">{crumb.label}</Link>
                    ) : (
                        <span className="breadcrumb__current" aria-current="page">{crumb.label}</span>
                    )}
                </Fragment>
            ))}
        </div>
    );
};
