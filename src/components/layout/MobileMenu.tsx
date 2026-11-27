import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ConfirmModal } from "../mypage/MypageModals";
import { gnbMenus } from "../../data/navData";
import { useAuthStore } from "../../store/useAuthStore";
import { AccountLinks, GuestPanel } from "./UserMenu";

// 모바일 메뉴 (햄버거 → 전체 화면)
// 왼쪽 세로 메뉴(제품 · 프로모션 · 서비스 · 아래 계정) + 오른쪽 목록 · 계정은 아래에서 올라오는 시트
export const MobileMenu = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, onLogout } = useAuthStore();
    const [confirmLogout, setConfirmLogout] = useState(false);
    const [tab, setTab] = useState<string>(gnbMenus[0].slug);
    const [account, setAccount] = useState(false);
    const menu = gnbMenus.find(({ slug }) => slug === tab) ?? gnbMenus[0];

    // 열려 있는 동안 뒤 페이지 스크롤 막기 · ESC 로 닫기 (계정 시트가 열려 있으면 시트만)
    useEffect(() => {
        if (!open) {
            setAccount(false);
            return;
        }
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            if (account) setAccount(false);
            else onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose, account]);

    return <>{createPortal(
        <div className={"mobile-menu" + (open ? " is-open" : "")} inert={!open} aria-hidden={!open}>
            <div className="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="전체 메뉴">
                {/* 왼쪽 세로 메뉴 */}
                <div className="mobile-menu__rail">
                    <Link to="/" className="mobile-menu__logo" onClick={onClose}><img src="/icons/logo.svg" alt="Razer" /></Link>
                    <ul className="mobile-menu__tabs">
                        {gnbMenus.map((item) => (
                            <li key={item.slug}>
                                <button type="button" className={"mobile-menu__tab" + (item.slug === tab && !account ? " is-active" : "")}
                                    aria-pressed={item.slug === tab} onClick={() => { setTab(item.slug); setAccount(false); }}>
                                    <img src={item.railIcon} alt="" />
                                    {item.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button type="button" className={"mobile-menu__tab mobile-menu__tab--account" + (account ? " is-active" : "")}
                        aria-expanded={account} onClick={() => setAccount((v) => !v)}>
                        <span className={`user-avatar user-avatar--sm ${user?.profile ? "" : "is-default"}`}>
                            {user?.profile ? <img src={user.profile} alt="" /> : <img src="/icons/user.svg" alt="" className="user-avatar__icon" />}
                        </span>
                        계정
                    </button>
                </div>

                {/* 오른쪽 목록 */}
                <div className="mobile-menu__content">
                    <div className="mobile-menu__head">
                        <strong>{menu.title}</strong>
                        <button type="button" className="mobile-menu__close" aria-label="메뉴 닫기" onClick={onClose}>
                            <img src="/icons/ui/close.svg" alt="" />
                        </button>
                    </div>
                    {menu.columns.map((column, i) => (
                        <div key={column.title || i} className="mobile-menu__section">
                            {i > 0 && column.title && <p className="mobile-menu__section-title">{column.title}</p>}
                            <ul className="mobile-menu__links">
                                {column.links.map((link) => (
                                    <li key={link.to}>
                                        <Link to={link.to} onClick={onClose} className={pathname === link.to.split("?")[0] ? "is-current" : undefined}>
                                            <img src={link.icon} alt="" />
                                            <span>{link.label}</span>
                                            <img src="/icons/ui/chevron-right.svg" alt="" className="mobile-menu__arrow" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {menu.box && (
                        <div className="mobile-menu__box">
                            <strong>{menu.box.mobile.title}</strong>
                            <p>{menu.box.mobile.text}</p>
                        </div>
                    )}
                </div>

                {/* 계정: 아래에서 올라오는 시트 */}
                <div className={"mobile-menu__sheet-dim" + (account ? " is-open" : "")} onClick={() => setAccount(false)} />
                <div className={"mobile-menu__sheet user-menu" + (account ? " is-open" : "")} role="dialog" aria-label="내 계정" inert={!account}>
                    <span className="mobile-menu__handle" aria-hidden="true" />
                    <div className="user-menu__head">
                        <strong>내 계정</strong>
                        <button type="button" className="user-menu__close" aria-label="내 계정 닫기" onClick={() => setAccount(false)}>
                            <img src="/icons/ui/close.svg" alt="" />
                        </button>
                    </div>
                    {user ? <AccountLinks user={user} onNavigate={onClose} onLogout={() => { onClose(); setConfirmLogout(true); }} />
                        : <GuestPanel from={pathname} onNavigate={onClose} />}
                </div>
            </div>
        </div>,
        document.body,
    )}
        {confirmLogout && (
            <ConfirmModal title="로그아웃할까요?" confirmLabel="로그아웃" onClose={() => setConfirmLogout(false)}
                onConfirm={async () => { await onLogout(); setConfirmLogout(false); navigate("/"); }} />
        )}
    </>;
};
