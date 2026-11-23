import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { supportPath } from "../../data/collabData";
import { Modal } from "../common/Modal";
import { maskPhone } from "../../data/mypageData";
import type { Address, AppUser, PaymentCard } from "../../types/auth";

// 계정 관리 메뉴 (/mypage?tab=account&section=…)
export const accountSections = [
    { key: "basic", label: "기본 정보 설정", icon: "user" },
    { key: "profile", label: "프로필 설정", icon: "user" },
    { key: "security", label: "계정 및 보안", icon: "shield-check" },
    { key: "address", label: "배송지·결제 관리", icon: "credit-card" },
    { key: "notify", label: "알림 설정", icon: "bell" },
] as const;
export type AccountSection = (typeof accountSections)[number]["key"];

// 기본 프로필 이미지 (public/images/profile/avatar-01 ~ 07.webp)
const avatars = Array.from({ length: 7 }, (_, i) => `/images/profile/avatar-0${i + 1}.webp`);

const Icon = ({ name }: { name: string }) => <img src={`/icons/account/${name}.svg`} alt="" aria-hidden="true" />;

// 아이콘 파일이 아직 없는 것 (? · 더보기)은 같은 선 굵기로 그림
const HelpIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9.25" />
        <path d="M9.5 9.25a2.5 2.5 0 1 1 3.5 2.3c-.6.27-1 .86-1 1.52v.43M12 17h.01" />
    </svg>
);
const MoreIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="5" cy="12" r="1.75" />
        <circle cx="12" cy="12" r="1.75" />
        <circle cx="19" cy="12" r="1.75" />
    </svg>
);

// 회색 한 줄 (아이콘 · 제목 · 내용 · 오른쪽 버튼)
const SettingRow = ({ icon, title, value, action }: { icon: ReactNode; title: string; value: ReactNode; action?: ReactNode }) => (
    <div className="account__row">
        <span className="account__row-icon">{icon}</span>
        <div className="account__row-text">
            <strong>{title}</strong>
            <span>{value}</span>
        </div>
        {action}
    </div>
);

// 업로드한 사진을 정사각 160px webp 로 줄여서 저장 (Firestore 문서 크기 줄이기)
const resizeImage = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                const size = 160;
                const canvas = document.createElement("canvas");
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext("2d");
                if (!ctx) return reject(new Error("canvas"));
                const side = Math.min(img.width, img.height);
                ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
                resolve(canvas.toDataURL("image/webp", 0.85));
            };
            img.src = String(reader.result);
        };
        reader.readAsDataURL(file);
    });

// 지금 쓰는 기기 (이 기기 · Windows · Chrome)
const currentDevice = () => {
    const ua = navigator.userAgent;
    const os = /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : "기타 OS";
    const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "브라우저";
    return `이 기기 · ${os} · ${browser}`;
};

// ---------- 기본 정보 설정 ----------
// 닉네임 변경 팝업
const NicknameModal = ({ current, onClose, onSaved }: { current: string; onClose: () => void; onSaved: () => void }) => {
    const { onUpdateProfile } = useAuthStore();
    const [nickname, setNickname] = useState(current);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const save = async () => {
        const next = nickname.trim();
        if (next.length < 2) return setError("닉네임은 2자 이상 입력해 주세요.");
        if (next === current) return onClose();
        setSaving(true);
        try {
            await onUpdateProfile({ nickname: next, name: next });
            onSaved();
        } catch {
            setError("저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
            setSaving(false);
        }
    };

    return (
        <Modal
            title="닉네임 변경"
            onClose={onClose}
            actions={
                <>
                    <button type="button" className="modal__btn" onClick={onClose}>
                        취소
                    </button>
                    <button type="button" className="modal__btn modal__btn--primary" onClick={save} disabled={saving}>
                        저장
                    </button>
                </>
            }
        >
            <label className="modal__field">
                <span className="modal__label">닉네임</span>
                <input
                    className="modal__input"
                    value={nickname}
                    maxLength={20}
                    autoFocus
                    onChange={(e) => {
                        setNickname(e.target.value);
                        setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && save()}
                />
            </label>
            {error && <p className="modal__error">{error}</p>}
        </Modal>
    );
};

const BasicInfo = ({ user }: { user: AppUser }) => {
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState("");

    return (
        <>
            <div className="account__rows">
                <SettingRow
                    icon={<Icon name="user" />}
                    title="닉네임"
                    value={user.nickname || "-"}
                    action={
                        <button type="button" className="account__btn" onClick={() => setEditing(true)}>
                            변경
                        </button>
                    }
                />
                <SettingRow
                    icon={<Icon name="user" />}
                    title="이메일"
                    value={user.email || "-"}
                    action={
                        <Link to={supportPath} className="account__btn">
                            변경
                        </Link>
                    }
                />
                <SettingRow icon={<HelpIcon />} title="Razer ID" value={user.nickname || user.name || "-"} />
            </div>
            {message && <p className="account__message">{message}</p>}
            <Link to={supportPath} className="mypage__line-btn account__leave">
                회원 탈퇴 안내
            </Link>

            {editing && (
                <NicknameModal
                    current={user.nickname}
                    onClose={() => setEditing(false)}
                    onSaved={() => {
                        setEditing(false);
                        setMessage("닉네임을 변경했어요.");
                    }}
                />
            )}
        </>
    );
};

// ---------- 프로필 설정 ----------
const ProfileSetting = ({ user }: { user: AppUser }) => {
    const { onUpdateProfile } = useAuthStore();
    const [selected, setSelected] = useState(user.profile);
    const [message, setMessage] = useState("");
    const uploadRef = useRef<HTMLInputElement>(null);
    const cameraRef = useRef<HTMLInputElement>(null);

    const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) return setMessage("이미지 파일만 올릴 수 있어요.");
        try {
            setSelected(await resizeImage(file));
            setMessage("");
        } catch {
            setMessage("이미지를 불러오지 못했어요.");
        }
    };

    const save = async () => {
        try {
            await onUpdateProfile({ profile: selected });
            setMessage("프로필 이미지를 저장했어요.");
        } catch {
            setMessage("저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
        }
    };

    return (
        <>
            <div className="account__profile">
                <span className="account__preview">
                    {selected ? <img src={selected} alt="선택한 프로필 이미지" /> : <img src="/icons/account/user.svg" alt="" className="account__preview-default" />}
                </span>
                <ul className="account__avatars">
                    <li>
                        <button type="button" className="account__avatar" onClick={() => uploadRef.current?.click()} aria-label="사진 올리기">
                            <img src="/images/profile/upload.webp" alt="" />
                        </button>
                    </li>
                    <li>
                        <button type="button" className="account__avatar" onClick={() => cameraRef.current?.click()} aria-label="사진 찍기">
                            <img src="/images/profile/camera.webp" alt="" />
                        </button>
                    </li>
                    {avatars.map((src, i) => (
                        <li key={src}>
                            <button
                                type="button"
                                className={`account__avatar ${selected === src ? "is-selected" : ""}`}
                                aria-pressed={selected === src}
                                aria-label={`기본 이미지 ${i + 1}`}
                                onClick={() => setSelected(src)}
                            >
                                <img src={src} alt="" />
                            </button>
                        </li>
                    ))}
                </ul>
                <input ref={uploadRef} type="file" accept="image/*" hidden onChange={handleFile} />
                <input ref={cameraRef} type="file" accept="image/*" capture="user" hidden onChange={handleFile} />
            </div>
            {message && <p className="account__message">{message}</p>}
            <div className="mypage__actions account__actions">
                <button type="button" className="mypage__line-btn" onClick={() => setSelected(user.profile)} disabled={selected === user.profile}>
                    변경 취소
                </button>
                <button type="button" className="mypage__primary-btn" onClick={save} disabled={selected === user.profile}>
                    저장하기
                </button>
            </div>
        </>
    );
};

// ---------- 계정 및 보안 ----------
const Security = ({ user }: { user: AppUser }) => {
    const { onResetPassword } = useAuthStore();
    const [message, setMessage] = useState("");

    const resetPassword = async () => {
        if (!user.email) return setMessage("이메일이 없는 계정은 비밀번호를 바꿀 수 없어요.");
        try {
            await onResetPassword(user.email);
            setMessage(`${user.email} 로 비밀번호 재설정 메일을 보냈어요.`);
        } catch {
            setMessage("메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.");
        }
    };

    return (
        <>
            <div className="account__rows">
                <SettingRow
                    icon={<Icon name="lock" />}
                    title="비밀번호"
                    value={user.passwordChangedAt ? `최근 변경 ${user.passwordChangedAt}` : "최근 변경 내역 없음"}
                    action={
                        <button type="button" className="account__btn" onClick={resetPassword}>
                            변경
                        </button>
                    }
                />
                <SettingRow
                    icon={<Icon name="shield-check" />}
                    title="2단계 인증"
                    value={user.twoFactor ? "설정됨" : "설정 안 됨"}
                    action={
                        <Link to={supportPath} className="account__btn">
                            설정하기
                        </Link>
                    }
                />
                <SettingRow
                    icon={<Icon name="monitor" />}
                    title="로그인 기기"
                    value={currentDevice()}
                    action={
                        <Link to={supportPath} className="account__btn">
                            기기 관리
                        </Link>
                    }
                />
            </div>
            {message && <p className="account__message">{message}</p>}
        </>
    );
};

// ---------- 배송지·결제 관리 ----------
const PaymentCardItem = ({ card }: { card: PaymentCard }) => (
    <li className="pay-card">
        <div className="pay-card__head">
            <span className="pay-card__logo" aria-hidden="true" />
            <strong className="pay-card__brand">{card.brand}</strong>
            {card.isDefault && <span className="pay-card__default">기본</span>}
            <button type="button" className="pay-card__more" aria-label={`${card.brand} 카드 메뉴`}>
                <MoreIcon />
            </button>
        </div>
        <p className="pay-card__number">•••• •••• •••• {card.last4}</p>
        <div className="pay-card__foot">
            <span>{card.issuer ?? ""}</span>
            <span>{card.expiry ?? ""}</span>
        </div>
    </li>
);

const AddressPayment = ({ user }: { user: AppUser }) => {
    const { onUpdateProfile } = useAuthStore();
    const addresses = user.addresses ?? [];
    const address: Address | undefined = addresses.find((a) => a.isDefault) ?? addresses[0];
    const cards = [...(user.cards ?? [])].sort((a, b) => Number(!!b.isDefault) - Number(!!a.isDefault));

    const removeAddress = async () => {
        if (!address) return;
        await onUpdateProfile({ addresses: addresses.filter((a) => a.id !== address.id) });
    };

    return (
        <div className="mypage__panels account__panels">
            <section className="mypage__panel">
                <h3 className="mypage__panel-title">
                    <span className="mypage__panel-icon">
                        <img src="/icons/mypage/delivery.svg" alt="" />
                    </span>
                    나의 배송지
                </h3>
                {address ? (
                    <>
                        {address.isDefault && <p className="account__default">기본 배송지</p>}
                        <p className="account__address-name">
                            {address.name} · {maskPhone(address.phone)}
                        </p>
                        <p className="mypage__sub">{address.address}</p>
                    </>
                ) : (
                    <p className="mypage__sub mypage__sub--lg">등록된 배송지가 없습니다.</p>
                )}
                <div className="mypage__actions">
                    {address && (
                        <button type="button" className="mypage__line-btn">
                            배송지 수정
                        </button>
                    )}
                    <button type="button" className="mypage__line-btn">
                        배송지 추가
                    </button>
                    {address && (
                        <button type="button" className="mypage__line-btn" onClick={removeAddress}>
                            삭제
                        </button>
                    )}
                </div>
            </section>

            <section className="mypage__panel">
                <div className="account__panel-head">
                    <h3 className="mypage__panel-title">
                        <span className="mypage__panel-icon">
                            <Icon name="credit-card" />
                        </span>
                        나의 결제 수단
                    </h3>
                    <button type="button" className="mypage__line-btn">
                        카드 추가
                    </button>
                </div>
                {cards.length > 0 ? (
                    <ul className="account__cards">
                        {cards.map((card) => (
                            <PaymentCardItem key={card.id} card={card} />
                        ))}
                    </ul>
                ) : (
                    <p className="mypage__sub mypage__sub--lg">등록된 결제 수단이 없습니다.</p>
                )}
            </section>
        </div>
    );
};

// ---------- 알림 설정 ----------
const Toggle = ({ checked, label, onChange }: { checked: boolean; label: string; onChange: (next: boolean) => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`account__toggle ${checked ? "is-on" : ""}`}
        onClick={() => onChange(!checked)}
    />
);

const Notify = ({ user }: { user: AppUser }) => {
    const { onUpdateProfile } = useAuthStore();
    const notify = user.notify ?? { event: false, product: false };
    const change = (key: keyof typeof notify) => (next: boolean) => onUpdateProfile({ notify: { ...notify, [key]: next } });

    return (
        <div className="account__rows">
            <div className="account__row account__row--notice">
                <div className="account__row-text">
                    <strong>주문·보안 필수 안내</strong>
                    <span>주문 확인, 배송 진행 및 중요한 보안 안내는 서비스 이용에 필요한 정보입니다. 등록된 이메일로 안내합니다.</span>
                </div>
            </div>
            <SettingRow
                icon={<Icon name="bell" />}
                title="이벤트·프로모션"
                value="할인과 기획전 소식을 이메일로 받습니다."
                action={<Toggle checked={notify.event} label="이벤트·프로모션 알림" onChange={change("event")} />}
            />
            <SettingRow
                icon={<Icon name="bell" />}
                title="신제품·추천 장비"
                value="새로운 제품과 추천 소식을 이메일로 받습니다."
                action={<Toggle checked={notify.product} label="신제품·추천 장비 알림" onChange={change("product")} />}
            />
        </div>
    );
};

// 계정 관리 (왼쪽 메뉴 + 오른쪽 내용)
export const AccountSettings = ({ section, onSection }: { section: AccountSection; onSection: (key: AccountSection) => void }) => {
    const { user, onLogout } = useAuthStore();
    const navigate = useNavigate();
    if (!user) return null;
    const current = accountSections.find((s) => s.key === section) ?? accountSections[0];

    const logout = async () => {
        await onLogout();
        navigate("/");
    };

    return (
        <div className="account">
            <nav className="account__nav" aria-label="계정 관리 메뉴">
                <ul>
                    {accountSections.map((s) => (
                        <li key={s.key}>
                            <button
                                type="button"
                                className={`account__nav-item ${s.key === current.key ? "is-active" : ""}`}
                                aria-current={s.key === current.key ? "page" : undefined}
                                onClick={() => onSection(s.key)}
                            >
                                <span className="account__nav-icon">
                                    <Icon name={s.icon} />
                                </span>
                                {s.label}
                            </button>
                        </li>
                    ))}
                </ul>
                <button type="button" className="mypage__line-btn account__logout" onClick={logout}>
                    로그아웃
                </button>
            </nav>

            <section className="account__content">
                <h2 className="mypage__section-title">{current.label}</h2>
                {/* key: 다른 메뉴로 갔다 오면 입력 중이던 값 초기화 */}
                {current.key === "basic" && <BasicInfo key={user.uid} user={user} />}
                {current.key === "profile" && <ProfileSetting key={user.uid} user={user} />}
                {current.key === "security" && <Security user={user} />}
                {current.key === "address" && <AddressPayment user={user} />}
                {current.key === "notify" && <Notify user={user} />}
            </section>
        </div>
    );
};
