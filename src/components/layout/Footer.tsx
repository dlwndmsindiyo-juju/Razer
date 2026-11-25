import { useState } from "react";
import { Link } from "react-router-dom";
import { footerCompany, footerGroups, getFooterPath } from "../../data/footerData";
import { faqImages } from "../../data/pageImages";

export const Footer = () => {
    // 태블릿 · 모바일: 그룹 제목을 누르면 링크가 스르륵 (PC 에서는 항상 펼침)
    const [openGroup, setOpenGroup] = useState<string>();

    return (
        <footer className="footer">
            <div className="footer__inner">
                {/* 배경 로고 (장식 · public/icons/footer-big-logo.svg) · 컨테이너 기준으로 고정 */}
                <span className="footer__bg-logo" aria-hidden="true" />

                <div className="footer__top">

                    <div className="footer__groups">
                        {footerGroups.map((group) => {
                            const expanded = openGroup === group.slug;
                            return (
                                <div className={"footer__group" + (expanded ? " is-open" : "")} key={group.slug}>
                                    <strong className="footer__group-title">
                                        <button type="button" aria-expanded={expanded} aria-controls={"footer-" + group.slug}
                                            onClick={() => setOpenGroup(expanded ? undefined : group.slug)}>
                                            {group.title}
                                            <img className="plus-toggle footer__plus" src={faqImages.plusWhite} alt="" />
                                        </button>
                                    </strong>
                                    <div className="footer__panel" id={"footer-" + group.slug}>
                                        <ul className="footer__submenu">
                                            {group.pages.map((page) => (
                                                <li key={page.slug}>
                                                    <Link to={getFooterPath(group.slug, page.slug)}>{page.label}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copyright">Copyright © 2026 Razer Inc. All rights reserved.</p>

                    {/* 회사 관련 링크 */}
                    <ul className="footer__links">
                        {footerCompany.pages.map((page) => (
                            <li key={page.slug}>
                                <Link to={getFooterPath(footerCompany.slug, page.slug)}>{page.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
};
