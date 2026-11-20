import { Link } from "react-router-dom";
import { footerCompany, footerGroups, getFooterPath } from "../../data/footerData";

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__inner">
                {/* 배경 로고 (장식 · public/icons/footer-big-logo.svg) · 컨테이너 기준으로 고정 */}
                <span className="footer__bg-logo" aria-hidden="true" />

                <div className="footer__top">

                    <div className="footer__groups">
                        {footerGroups.map((group) => (
                            <div className="footer__group" key={group.slug}>
                                <strong className="footer__group-title">{group.title}</strong>
                                <ul className="footer__submenu">
                                    {group.pages.map((page) => (
                                        <li key={page.slug}>
                                            <Link to={getFooterPath(group.slug, page.slug)}>{page.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
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
