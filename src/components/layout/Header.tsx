import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { footerGroups, getFooterPath } from "../../data/footerData";
import { getCategoryPath, productMenu } from "../../data/navData";
import { SearchOverlay } from "./SearchOverlay";
import { UserMenu } from "./UserMenu";
import { promoBarText } from "../../data/navData";

export const Header = () => {
    const { pathname, key } = useLocation();
    const [overlay, setOverlay] = useState<{ location: string; id: string }>();
    const openId = overlay?.location === key ? overlay.id : undefined;
    const openGroup = footerGroups.find(({ slug }) => slug === openId);
    const isSearchOpen = openId === "search";
    const closeOverlay = () => setOverlay(undefined);
    const toggleOverlay = (id: string) => {
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

            {/* 프로모션 바 (GNB 아래) */}
            <div className="header__promo">
                <p className="header__promo-text">{promoBarText}</p>
            </div>

            {/* GNB 서브 메뉴 */}
            {openGroup && (
                <>
                    <div id="gnb-submenu" className="mega-menu">
                        <div className={openGroup.slug === "product" ? "mega-menu__inner" : "mega-menu__inner mega-menu__inner--links"}>
                            {openGroup.slug === "product" && <div className="mega-menu__main">
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
                            </div>}

                            <ul className="mega-menu__links" aria-label={openGroup.title + " 서브메뉴"}>
                                {openGroup.pages.map((page) => (
                                    <li key={page.slug}>
                                        <Link to={getFooterPath(openGroup.slug, page.slug)} onClick={closeOverlay}>{page.label}</Link>
                                    </li>
                                ))}
                                {openGroup.slug === "product" && productMenu.links.map((link) => (
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

                    {/* 뒤 배경 (누르면 닫기) */}
                    <div className="mega-menu__dim" onClick={closeOverlay} />
                </>
            )}

            {/* 검색창 */}
            {isSearchOpen && <SearchOverlay onClose={closeOverlay} />}
        </header>
    );
};
