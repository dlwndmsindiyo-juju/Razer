import { Link } from "react-router-dom";

// GNB 메뉴 (확정 전 임시 항목)
const gnbItems = [
    { label: "GNB Items", to: "/" },
    { label: "GNB Items", to: "/" },
    { label: "GNB Items", to: "/" },
];

export const Header = () => {
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
                        <ul className="header__menu">
                            {gnbItems.map((item, i) => (
                                <li key={i}>
                                    <Link to={item.to}>{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="header__utils">
                        <Link to="/search" className="header__icon" aria-label="검색">
                            <img src="/icons/search.svg" alt="" />
                        </Link>
                        <Link to="/cart" className="header__icon" aria-label="장바구니">
                            <img src="/icons/cart.svg" alt="" />
                        </Link>
                        <Link to="/login" className="header__icon" aria-label="로그인">
                            <img src="/icons/user.svg" alt="" />
                        </Link>
                        <button type="button" className="header__lang">KR</button>
                    </div>
                </div>
            </div>
        </header>
    );
};
