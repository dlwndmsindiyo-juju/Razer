import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { ConfirmModal } from "../mypage/MypageModals";

// 헤더 유저 아이콘
// - 로그아웃 상태: 누르면 로그인 페이지
// - 로그인 상태: 누르면 마이페이지 · 장바구니 · 로그아웃 메뉴
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

    if (!user) {
        return (
            // 로그인 후 지금 보던 페이지로 돌아오도록 경로 전달
            <Link to="/login" state={{ from: pathname }} className="header__icon" aria-label="로그인">
                <img src="/icons/user.svg" alt="" />
            </Link>
        );
    }

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
                    <div className="user-menu__profile">
                        <strong>{user.nickname || user.name || "Razer 회원"}</strong>
                        {user.email && <span>{user.email}</span>}
                    </div>
                    <Link to="/mypage?tab=orders" className="user-menu__item" role="menuitem">나의 주문</Link>
                    <Link to="/mypage?tab=account&section=address" className="user-menu__item" role="menuitem">배송지 및 결제 관리</Link>
                    <Link to="/mypage?view=wishlist" className="user-menu__item" role="menuitem">위시리스트</Link>
                    <Link to="/mypage?tab=account&section=profile" className="user-menu__item" role="menuitem">프로필 관리</Link>
                    <button type="button" className="user-menu__item user-menu__item--logout" role="menuitem" onClick={() => {
                            setIsOpen(false);
                            setConfirmLogout(true);
                        }}>
                        로그아웃
                    </button>
                </div>
            )}

            {confirmLogout && (
                <ConfirmModal title="로그아웃할까요?" confirmLabel="로그아웃" onClose={() => setConfirmLogout(false)} onConfirm={handleLogout} />
            )}
        </div>
    );
};
