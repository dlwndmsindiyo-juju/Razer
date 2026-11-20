import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { footerGroups, getGroupPath } from "../../data/footerData";
import { getCategoryPath, productMenu } from "../../data/navData";
import { SearchOverlay } from "./SearchOverlay";
import { UserMenu } from "./UserMenu";

export const Header = () => {
    const { pathname } = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 제품 서브 메뉴
    const [isSearchOpen, setIsSearchOpen] = useState(false); // 검색창

    // 페이지 이동하면 닫기
    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
    }, [pathname]);

    // ESC 로 닫기
    useEffect(() => {
        if (!isMenuOpen && !isSearchOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsMenuOpen(false);
                setIsSearchOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMenuOpen, isSearchOpen]);

    return (
        <header className="header">
            {/* 상단 프로모션 바 */}
            <div className="header__promo">
                <p className="header__promo-text">Promotion Bar</p>
            </div>

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
                                const isCurrent = pathname.startsWith(`/info/${group.slug}/`);

                                // 제품: 서브 메뉴 열기
                                if (group.slug === "product") {
                                    return (
                                        <li key={group.slug}>
                                            <button
                                                type="button"
                                                className={isCurrent || isMenuOpen ? "is-active" : undefined}
                                                aria-expanded={isMenuOpen}
                                                aria-controls="product-menu"
                                                onClick={() => {
                                                    setIsSearchOpen(false);
                                                    setIsMenuOpen((prev) => !prev);
                                                }}
                                            >
                                                {group.title}
                                            </button>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={group.slug}>
                                        <Link to={getGroupPath(group)} className={isCurrent ? "is-active" : undefined}>
                                            {group.title}
                                        </Link>
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
                            onClick={() => {
                                setIsMenuOpen(false);
                                setIsSearchOpen((prev) => !prev);
                            }}
                        >
                            <img src="/icons/search.svg" alt="" />
                        </button>
                        <Link to="/cart" className="header__icon" aria-label="장바구니">
                            <img src="/icons/cart.svg" alt="" />
                        </Link>
                        <UserMenu />
                        <button type="button" className="header__lang">KR</button>
                    </div>
                </div>
            </div>

            {/* 제품 서브 메뉴 (메가 메뉴) */}
            {isMenuOpen && (
                <>
                    <div id="product-menu" className="mega-menu">
                        <div className="mega-menu__inner">
                            <div className="mega-menu__main">
                                <strong className="mega-menu__title">{productMenu.title}</strong>
                                <ul className="mega-menu__grid">
                                    {productMenu.categories.map((category) => (
                                        <li key={category.slug}>
                                            <Link to={getCategoryPath(category.slug)} className="mega-menu__tile">
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

                            {/* 카드에 없는 판매 제품 */}
                            <ul className="mega-menu__links">
                                {productMenu.links.map((link) => (
                                    <li key={link.slug}>
                                        <Link to={getCategoryPath(link.slug)}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                className="mega-menu__close"
                                aria-label="메뉴 닫기"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <img src="/icons/close.svg" alt="" />
                            </button>
                        </div>
                    </div>

                    {/* 뒤 배경 (누르면 닫기) */}
                    <div className="mega-menu__dim" onClick={() => setIsMenuOpen(false)} />
                </>
            )}

            {/* 검색창 */}
            {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
        </header>
    );
};
