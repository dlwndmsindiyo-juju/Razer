import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { footerGroups, getFooterPath, type FooterGroup } from "../../data/footerData";
import { getCategoryPath, productMenu } from "../../data/navData";
import { SearchOverlay } from "./SearchOverlay";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { promoBarShortText, promoBarText } from "../../data/navData";

export const Header = () => {
    const { pathname, key } = useLocation();
    const [overlay, setOverlay] = useState<{ location: string; id: string }>();
    const openId = overlay?.location === key ? overlay.id : undefined;
    const openGroup = footerGroups.find(({ slug }) => slug === openId);
    const isSearchOpen = openId === "search";
    // 닫히는 동안에도 내용이 보이도록 마지막으로 연 메뉴를 기억
    const [menuGroup, setMenuGroup] = useState<FooterGroup>();
    const closeOverlay = () => setOverlay(undefined);
    const [mobileOpen, setMobileOpen] = useState(false); // 태블릿 · 모바일 햄버거 메뉴
    const closeMobile = useCallback(() => setMobileOpen(false), []);
    const toggleOverlay = (id: string) => {
        const group = footerGroups.find(({ slug }) => slug === id);
        if (group) setMenuGroup(group);
        setOverlay(openId === id ? undefined : { location: key, id });
    };

    useEffect(() => {
        if (!openId) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOverlay(undefined);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [openId]);

    return (
        <header className="header">
            {/* GNB */}
            <div className="header__gnb">
                <div className="header__inner">
                    {/* 태블릿 · 모바일: 햄버거 (왼쪽) */}
                    <button type="button" className="header__burger" aria-label="전체 메뉴 열기"
                        aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
                        <img src="/icons/ui/menu.svg" alt="" />
                    </button>
                    <h1 className="header__logo">
                        <Link to="/">
                            <img src="/icons/logo.svg" alt="Razer" />
                        </Link>
                    </h1>

                    <nav className="header__nav">
                        {/* GNB 메뉴 = 푸터 그룹 타이틀 (footerData 공용) */}
                        <ul className="header__menu">
                            {footerGroups.map((group) => {
                                const expanded = openGroup === group;
                                const isCurrent = pathname === `/info/${group.slug}`
                                    || pathname.startsWith(`/info/${group.slug}/`)
                                    || (group.slug === "product" && pathname.startsWith("/products/"));

                                return (
                                    <li key={group.slug}>
                                        <button type="button" className={isCurrent || expanded ? "is-active" : undefined}
                                            aria-expanded={expanded} aria-controls={expanded ? "gnb-submenu" : undefined}
                                            onClick={() => toggleOverlay(group.slug)}>
                                            {group.title}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="header__utils">
                        <button
                            type="button"
                            className="header__icon"
                            aria-label="검색"
                            aria-expanded={isSearchOpen}
                            aria-controls="search-overlay"
                            onClick={() => toggleOverlay("search")}
                        >
                            <img src="/icons/search.svg" alt="" />
                        </button>
                        <Link to="/cart" className="header__icon" aria-label="장바구니">
                            <img src="/icons/cart.svg" alt="" />
                        </Link>
                        <UserMenu />
                    </div>
                </div>
            </div>

            {/* 프로모션 바 (GNB 아래) · 좁은 화면에서는 글자가 옆으로 흘러감 */}
            <div className="header__promo">
                <div className="header__promo-track">
                    <p className="header__promo-text">{promoBarText}</p>
                    <p className="header__promo-text header__promo-copy" aria-hidden="true">{promoBarText}</p>
                </div>
                <p className="header__promo-short">{promoBarShortText}</p>
            </div>
            <MobileMenu open={mobileOpen} onClose={closeMobile} />

            {/* GNB 서브 메뉴 (열고 닫을 때 아래로 스르륵) */}
            {menuGroup && (
                <>
                    <div id="gnb-submenu" className={"mega-menu" + (openGroup ? " is-open" : "")}
                        inert={!openGroup} aria-hidden={!openGroup}>
                        <div className="mega-menu__clip">
                            <div className={menuGroup.slug === "product" ? "mega-menu__inner" : "mega-menu__inner mega-menu__inner--links"}>
                                {menuGroup.slug === "product" ? (
                                    <div className="mega-menu__main">
                                        <strong className="mega-menu__title">{productMenu.title}</strong>
                                        <ul className="mega-menu__grid">
                                            {productMenu.categories.map((category) => (
                                                <li key={category.slug}>
                                                    <Link to={getCategoryPath(category.slug)} className="mega-menu__tile" onClick={closeOverlay}>
                                                        <span className="mega-menu__thumb">
                                                            {category.image ? (
                                                                <img src={category.image} alt="" />
                                                            ) : (
                                                                <span className="mega-menu__no-image">Image</span>
                                                            )}
                                                        </span>
                                                        <span className="mega-menu__label">{category.label}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    // 프로모션 · 서비스: 메뉴 이름을 타이틀로 표시 (헤더 버튼은 페이지 이동 없이 열기만)
                                    <strong className="mega-menu__title">{menuGroup.title}</strong>
                                )}

                                <ul className="mega-menu__links" aria-label={menuGroup.title + " 서브메뉴"}>
                                    {menuGroup.pages.map((page) => (
                                        <li key={page.slug}>
                                            <Link to={getFooterPath(menuGroup.slug, page.slug)} onClick={closeOverlay}>{page.label}</Link>
                                        </li>
                                    ))}
                                    {menuGroup.slug === "product" && productMenu.links.map((link) => (
                                        <li key={link.slug}>
                                            <Link to={getCategoryPath(link.slug)} onClick={closeOverlay}>{link.label}</Link>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    type="button"
                                    className="mega-menu__close"
                                    aria-label="메뉴 닫기"
                                    onClick={closeOverlay}
                                >
                                    <img src="/icons/close.svg" alt="" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 뒤 배경 (누르면 닫기) */}
                    <div className={"mega-menu__dim" + (openGroup ? " is-open" : "")} onClick={closeOverlay} />
                </>
            )}

            {/* 검색창 */}
            {isSearchOpen && <SearchOverlay onClose={closeOverlay} />}
        </header>
    );
};
