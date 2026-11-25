import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { footerGroups, getFooterPath } from "../../data/footerData";
import { getCategoryPath, productMenu } from "../../data/navData";
import { faqImages } from "../../data/pageImages";
import { useAuthStore } from "../../store/useAuthStore";
import { Collapse } from "../common/Collapse";

// 태블릿 · 모바일 메뉴 (햄버거 → 왼쪽에서 스르륵) · 그룹은 + 를 누르면 펼침
export const MobileMenu = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const user = useAuthStore((state) => state.user);
    const [group, setGroup] = useState<string>();

    // 열려 있는 동안 뒤 페이지 스크롤 막기 · ESC 로 닫기
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    return createPortal(
        <div className={"mobile-menu" + (open ? " is-open" : "")} inert={!open} aria-hidden={!open}>
            <div className="mobile-menu__dim" onClick={onClose} />
            <nav className="mobile-menu__panel" aria-label="전체 메뉴">
                <div className="mobile-menu__head">
                    <Link to="/" onClick={onClose}><img src="/icons/logo.svg" alt="Razer" /></Link>
                    <button type="button" className="mobile-menu__close" aria-label="메뉴 닫기" onClick={onClose}>
                        <img src="/icons/close.svg" alt="" />
                    </button>
                </div>
                <ul className="mobile-menu__groups">
                    {footerGroups.map((g) => {
                        const expanded = group === g.slug;
                        const links = [
                            ...g.pages.map((page) => ({ to: getFooterPath(g.slug, page.slug), label: page.label })),
                            ...(g.slug === "product" ? productMenu.categories.map((c) => ({ to: getCategoryPath(c.slug), label: c.label })) : []),
                        ];
                        return <li key={g.slug}>
                            <button type="button" className="mobile-menu__group" aria-expanded={expanded}
                                aria-controls={"mobile-menu-" + g.slug} onClick={() => setGroup(expanded ? undefined : g.slug)}>
                                {g.title}
                                <img className="plus-toggle" src={faqImages.plus} alt="" />
                            </button>
                            <Collapse open={expanded} id={"mobile-menu-" + g.slug}>
                                <ul className="mobile-menu__links">
                                    {links.map((link) => <li key={link.to + link.label}><Link to={link.to} onClick={onClose}>{link.label}</Link></li>)}
                                </ul>
                            </Collapse>
                        </li>;
                    })}
                </ul>
                <Link className="mobile-menu__account" to={user ? "/mypage" : "/login"} onClick={onClose}>
                    <img src="/icons/user.svg" alt="" />{user ? "마이페이지" : "로그인"}
                </Link>
            </nav>
        </div>,
        document.body,
    );
};
