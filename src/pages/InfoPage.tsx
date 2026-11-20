import { Link, NavLink, useParams } from "react-router-dom";
import { findFooterPage, getFooterPath } from "../data/footerData";

// 푸터 내부 링크 페이지 (/info/:group/:page)
export const InfoPage = () => {
    const { group: groupSlug, page: pageSlug } = useParams();
    const { group, page } = findFooterPage(groupSlug, pageSlug);

    if (!group || !page) {
        return (
            <section className="info-page info-page--empty">
                <h1 className="info-page__title">페이지를 찾을 수 없어요</h1>
                <Link to="/" className="btn btn--primary btn--sm">홈으로</Link>
            </section>
        );
    }

    return (
        <section className="info-page">
            <p className="info-page__breadcrumb">
                <Link to="/">홈</Link>
                <span>/</span>
                {group.title}
            </p>

            <div className="info-page__body">
                {/* 같은 그룹 메뉴 */}
                <nav className="info-page__nav" aria-label={group.title}>
                    <strong className="info-page__nav-title">{group.title}</strong>
                    <ul>
                        {group.pages.map((item) => (
                            <li key={item.slug}>
                                <NavLink to={getFooterPath(group.slug, item.slug)}>{item.label}</NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="info-page__content">
                    <h1 className="info-page__title">{page.label}</h1>
                    <p className="info-page__text">콘텐츠 준비 중입니다.</p>
                </div>
            </div>
        </section>
    );
};
