import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { ConfirmModal } from "../mypage/MypageModals";

// 내 계정 메뉴 (모바일 "내 계정"과 같은 워딩 · 아이콘: public/icons/ui)
const menuItems = [
    { label: "마이페이지", to: "/mypage", icon: "/icons/ui/account.svg" },
    { label: "주문 내역", to: "/mypage?tab=orders", icon: "/icons/ui/order.svg" },
    { label: "등록 제품·보증", to: "/mypage?tab=warranty", icon: "/icons/ui/warranty.svg" },
    { label: "위시리스트", to: "/mypage?view=wishlist", icon: "/icons/ui/wishlist.svg" },
    { label: "계정 관리", to: "/mypage?tab=account", icon: "/icons/ui/settings.svg" },
];

// 헤더 유저 아이콘
// - 로그아웃 상태: 누르면 로그인 페이지
// - 로그인 상태: 누르면 프로필 + 내 계정 메뉴 + 로그아웃
export const UserMenu = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, onLogout } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false); // 로그아웃할까요? 팝업
    const ref = useRef<HTMLDivElement>(null);

    // 페이지 이동하면 닫기
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // 바깥 클릭 · Esc로 닫기
    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setIsOpen(false);
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        await onLogout();
        setConfirmLogout(false);
        navigate("/");
    };

    return (
        <div className="user-menu" ref={ref}>
            <button
                type="button"
                className="header__icon"
                aria-label="내 계정 메뉴"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <img src="/icons/user.svg" alt="" />
            </button>

            {isOpen && (
                <div className="user-menu__panel" role="menu">
                    <div className="user-menu__head">
                        <strong>내 계정</strong>
                        <button type="button" className="user-menu__close" aria-label="내 계정 닫기" onClick={() => setIsOpen(false)}>
                            <img src="/icons/ui/close.svg" alt="" />
                        </button>
                    </div>
                    {user ? <AccountLinks user={user} onLogout={() => { setIsOpen(false); setConfirmLogout(true); }} />
                        : <GuestPanel from={pathname} />}
                </div>
            )}

            {confirmLogout && (
                <ConfirmModal title="로그아웃할까요?" confirmLabel="로그아웃" onClose={() => setConfirmLogout(false)} onConfirm={handleLogout} />
            )}
        </div>
    );
};

// 비회원: 환영 문구 · 로그인 · 회원가입 · 도움말 (모바일 내 계정과 같은 구성)
export const GuestPanel = ({ from, onNavigate }: { from: string; onNavigate?: () => void }) => (
    <>
        <p className="user-menu__welcome"><em>RAZER</em>에 오신 것을<br />환영합니다.</p>
        <p className="user-menu__desc">로그인하고 주문과 등록 제품을<br />한곳에서 관리하세요.</p>
        <Link to="/login" state={{ from }} className="user-menu__btn user-menu__btn--primary" role="menuitem" onClick={onNavigate}>로그인</Link>
        <Link to="/signup" className="user-menu__btn" role="menuitem" onClick={onNavigate}>회원가입</Link>
        <Link to="/info/service/support" className="user-menu__item user-menu__item--logout" role="menuitem" onClick={onNavigate}>
            <img src="/icons/ui/help.svg" alt="" className="user-menu__icon" />
            <span>도움이 필요하세요?</span>
            <img src="/icons/ui/chevron-right.svg" alt="" className="user-menu__arrow" />
        </Link>
    </>
);

// 회원: 프로필 · 메뉴 · 로그아웃
export const AccountLinks = ({ user, onLogout, onNavigate }: {
    user: { profile?: string | null; nickname?: string | null; name?: string | null };
    onLogout: () => void;
    onNavigate?: () => void;
}) => (
    <>
        {/* 프로필: 이미지 · 별명님 · 프로필 설정 (모바일 내 계정과 같은 구성) */}
        <div className="user-menu__profile">
            <span className={`user-avatar user-avatar--md ${user.profile ? "" : "is-default"}`}>
                {user.profile ? <img src={user.profile} alt="" /> : <img src="/icons/user.svg" alt="" className="user-avatar__icon" />}
            </span>
            <div className="user-menu__who">
                <strong>{user.nickname || user.name || "Razer 회원"}님</strong>
                <Link to="/mypage?tab=account&section=profile" className="user-menu__profile-link" role="menuitem" onClick={onNavigate}>프로필 설정</Link>
            </div>
        </div>

        {menuItems.map((item) => (
            <Link key={item.label} to={item.to} className="user-menu__item" role="menuitem" onClick={onNavigate}>
                <img src={item.icon} alt="" className="user-menu__icon" />
                <span>{item.label}</span>
                <img src="/icons/ui/chevron-right.svg" alt="" className="user-menu__arrow" />
            </Link>
        ))}

        <button type="button" className="user-menu__item user-menu__item--logout" role="menuitem" onClick={onLogout}>
            <img src="/icons/ui/logout.svg" alt="" className="user-menu__icon" />
            <span>로그아웃</span>
            <img src="/icons/ui/chevron-right.svg" alt="" className="user-menu__arrow" />
        </button>
    </>
);
