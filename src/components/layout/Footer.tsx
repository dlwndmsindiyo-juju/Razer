import { Link } from "react-router-dom";

// 푸터 메뉴 그룹 (확정 전 임시 항목)
const footerGroups = Array.from({ length: 3 }, () => ({
    title: "Group Title",
    items: ["Submenu Items", "Submenu Items", "Submenu Items"],
}));

const footerLinks = ["Footer Links", "Footer Links", "Footer Links"];

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__inner">
                <div className="footer__top">
                    <Link to="/" className="footer__logo">
                        <img src="/icons/logo.svg" alt="Razer" />
                    </Link>

                    <div className="footer__groups">
                        {footerGroups.map((group, i) => (
                            <div className="footer__group" key={i}>
                                <strong className="footer__group-title">{group.title}</strong>
                                <ul className="footer__submenu">
                                    {group.items.map((item, j) => (
                                        <li key={j}>
                                            <a href="#">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copyright">@Copyright</p>

                    <ul className="footer__links">
                        {footerLinks.map((link, i) => (
                            <li key={i}>
                                <a href="#">{link}</a>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </footer>
    );
};
