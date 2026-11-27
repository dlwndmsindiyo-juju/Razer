import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Modal } from "../common/Modal";
import {
    AddressModal,
    CardEditModal,
    CardModal,
    ConfirmModal,
    DeviceModal,
    ImageUploadModal,
    TwoFactorModal,
    ModalField,
    authErrorText,
} from "./MypageModals";
import { maskPhone } from "../../types/mypageData";
import { InlineToast } from "../common/InlineToast";
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
const HelpIcon = () => <img src="/icons/ui/help.svg" alt="" aria-hidden="true" />;
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 이메일 변경 팝업
// Firebase 는 새 이메일로 "인증 링크"를 보내고, 링크를 누르면 이메일이 바뀜
const EmailModal = ({ current, onClose, onSent }: { current: string; onClose: () => void; onSent: (email: string) => void }) => {
    const { onChangeEmail } = useAuthStore();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const submit = async () => {
        const next = email.trim();
        if (!emailPattern.test(next)) return setError("이메일 형식이 올바르지 않아요.");
        if (next.toLowerCase() === current.toLowerCase()) return setError("지금 쓰는 이메일과 같아요.");
        setSaving(true);
        try {
            await onChangeEmail(next);
            onSent(next);
        } catch (e) {
            setError(authErrorText(e));
            setSaving(false);
        }
    };

    return (
        <Modal
            title="이메일 변경"
            onClose={onClose}
            actions={
                <>
                    <button type="button" className="modal__btn" onClick={onClose}>
                        취소
                    </button>
                    <button type="button" className="modal__btn modal__btn--primary" onClick={submit} disabled={saving}>
                        인증하고 변경
                    </button>
                </>
            }
        >
            <ModalField
                label="새 이메일"
                type="email"
                placeholder="example@email.com"
                value={email}
                autoFocus
                onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <ModalField
                label="인증번호"
                inputMode="numeric"
                maxLength={6}
                placeholder="6자리 인증번호"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            {error && <p className="modal__error">{error}</p>}
        </Modal>
    );
};

// 비밀번호 변경 팝업 (현재 비밀번호 확인 → 새 비밀번호 · 문자+숫자 6자 이상)
const PasswordModal = ({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) => {
    const { onChangePassword } = useAuthStore();
    const [form, setForm] = useState({ current: "", next: "", confirm: "" });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [key]: e.target.value });
        setError("");
    };

    const submit = async () => {
        if (!form.current) return setError("현재 비밀번호를 입력해 주세요.");
        if (form.next.length < 6 || !/[A-Za-z]/.test(form.next) || !/\d/.test(form.next) || /[ㄱ-ㅎ가-힣]/.test(form.next))
            return setError("새 비밀번호는 문자·숫자를 조합해 6자 이상 입력해 주세요.");
        if (form.next === form.current) return setError("현재 비밀번호와 다른 비밀번호를 입력해 주세요.");
        if (form.next !== form.confirm) return setError("새 비밀번호가 서로 맞지 않아요.");
        setSaving(true);
        try {
            await onChangePassword(form.current, form.next);
            onSaved();
        } catch (e) {
            setError(authErrorText(e));
            setSaving(false);
        }
    };

    return (
        <Modal
            title="비밀번호 변경"
            onClose={onClose}
            actions={
                <>
                    <button type="button" className="modal__btn" onClick={onClose}>
                        취소
                    </button>
                    <button type="button" className="modal__btn modal__btn--primary" onClick={submit} disabled={saving}>
                        저장
                    </button>
                </>
            }
        >
            <ModalField label="현재 비밀번호" type="password" autoComplete="current-password" autoFocus value={form.current} onChange={set("current")} />
            <ModalField
                label="새 비밀번호"
                type="password"
                autoComplete="new-password"
                hint="문자·숫자를 조합해 입력"
                value={form.next}
                onChange={set("next")}
            />
            <ModalField
                label="새 비밀번호 확인"
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={set("confirm")}
                onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            {error && <p className="modal__error">{error}</p>}
        </Modal>
    );
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
            <ModalField
                label="닉네임"
                value={nickname}
                maxLength={20}
                autoFocus
                onChange={(e) => {
                    setNickname(e.target.value);
                    setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && save()}
            />
            {error && <p className="modal__error">{error}</p>}
        </Modal>
    );
};

const BasicInfo = ({ user }: { user: AppUser }) => {
    const { onDeleteAccount } = useAuthStore();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [leaving, setLeaving] = useState(false);
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
                        <button type="button" className="account__btn" onClick={() => setEditingEmail(true)}>
                            변경
                        </button>
                    }
                />
                <SettingRow icon={<HelpIcon />} title="Razer ID" value={user.nickname || user.name || "-"} />
            </div>
            <button type="button" className="mypage__line-btn account__leave" onClick={() => setLeaving(true)}>
                회원 탈퇴 안내
            </button>
            <InlineToast text={message} tone={/했습니다$/.test(message) ? "success" : "info"} onClose={() => setMessage("")} />

            {leaving && (
                <ConfirmModal
                    title="회원 탈퇴"
                    text="주문·지원 내역을 확인한 뒤 진행하세요."
                    confirmLabel="탈퇴"
                    danger
                    onClose={() => setLeaving(false)}
                    onConfirm={async () => {
                        await onDeleteAccount();
                        navigate("/");
                    }}
                />
            )}

            {editingEmail && (
                <EmailModal
                    current={user.email ?? ""}
                    onClose={() => setEditingEmail(false)}
                    onSent={(email) => {
                        setEditingEmail(false);
                        setMessage(`${email} 로 인증 메일을 보냈어요. 메일의 링크를 누르면 이메일이 바뀌어요.`);
                    }}
                />
            )}
            {editing && (
                <NicknameModal
                    current={user.nickname}
                    onClose={() => setEditing(false)}
                    onSaved={() => {
                        setEditing(false);
                        setMessage("저장했습니다");
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
    const [uploading, setUploading] = useState(false);
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
            setMessage("프로필을 저장했습니다");
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
                        <button type="button" className="account__avatar" onClick={() => setUploading(true)} aria-label="사진 올리기">
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
                <input ref={cameraRef} type="file" accept="image/*" capture="user" hidden onChange={handleFile} />
            </div>
            {uploading && (
                <ImageUploadModal
                    onClose={() => setUploading(false)}
                    onApply={(dataUrl) => {
                        setSelected(dataUrl);
                        setUploading(false);
                        setMessage("");
                    }}
                />
            )}
            <div className="mypage__actions account__actions">
                <button type="button" className="mypage__line-btn" onClick={() => setSelected(user.profile)} disabled={selected === user.profile}>
                    변경 취소
                </button>
                <button type="button" className="mypage__primary-btn" onClick={save} disabled={selected === user.profile}>
                    저장하기
                </button>
            </div>
            <InlineToast text={message} tone={/했습니다$/.test(message) ? "success" : "info"} onClose={() => setMessage("")} />
        </>
    );
};

// ---------- 계정 및 보안 ----------
const Security = ({ user }: { user: AppUser }) => {
    const { hasPassword, onUpdateProfile } = useAuthStore();
    const [editing, setEditing] = useState(false);
    const [devices, setDevices] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    const [message, setMessage] = useState("");

    const openPassword = () => {
        if (!hasPassword()) return setMessage("간편 로그인으로 가입한 계정은 비밀번호가 없어요. 가입한 서비스에서 관리해 주세요.");
        setMessage("");
        setEditing(true);
    };

    return (
        <>
            <div className="account__rows">
                <SettingRow
                    icon={<Icon name="lock" />}
                    title="비밀번호"
                    value={user.passwordChangedAt ? `최근 변경 ${user.passwordChangedAt}` : "최근 변경 내역 없음"}
                    action={
                        <button type="button" className="account__btn" onClick={openPassword}>
                            변경
                        </button>
                    }
                />
                <SettingRow
                    icon={<Icon name="shield-check" />}
                    title="2단계 인증"
                    value={user.twoFactor ? "사용 중 · 이메일 인증" : "설정 안 됨"}
                    action={
                        <button type="button" className="account__btn" onClick={() => setTwoFactor(true)}>
                            {user.twoFactor ? "관리" : "설정하기"}
                        </button>
                    }
                />
                <SettingRow
                    icon={<Icon name="monitor" />}
                    title="로그인 기기"
                    value={currentDevice()}
                    action={
                        <button type="button" className="account__btn" onClick={() => setDevices(true)}>
                            기기 관리
                        </button>
                    }
                />
            </div>
            <InlineToast text={message} tone={/했습니다$/.test(message) ? "success" : "info"} onClose={() => setMessage("")} />
            {devices && <DeviceModal device={currentDevice()} onClose={() => setDevices(false)} />}
            {twoFactor &&
                (user.twoFactor ? (
                    <ConfirmModal
                        title="2단계 인증을 해제할까요?"
                        confirmLabel="해제"
                        danger
                        onClose={() => setTwoFactor(false)}
                        onConfirm={async () => {
                            await onUpdateProfile({ twoFactor: false });
                            setTwoFactor(false);
                            setMessage("2단계 인증을 해제했습니다");
                        }}
                    />
                ) : (
                    <TwoFactorModal
                        email={user.email ?? ""}
                        onClose={() => setTwoFactor(false)}
                        onSave={async () => {
                            await onUpdateProfile({ twoFactor: true });
                            setTwoFactor(false);
                            setMessage("2단계 인증을 설정했습니다");
                        }}
                    />
                ))}
            {editing && (
                <PasswordModal
                    onClose={() => setEditing(false)}
                    onSaved={() => {
                        setEditing(false);
                        setMessage("변경했습니다");
                    }}
                />
            )}
        </>
    );
};

// ---------- 배송지·결제 관리 ----------
// 카드 오른쪽 위 … 메뉴 (기본 결제수단으로 설정 · 삭제)
const PaymentCardItem = ({
    card,
    onDefault,
    onEdit,
    onDelete,
}: {
    card: PaymentCard;
    onDefault: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) => {
    const [menu, setMenu] = useState(false);
    // 메뉴 버튼 (PC: 카드 위 작은 목록 · 모바일: 카드 아래 펼침)
    const items = (
        <>
            {!card.isDefault && (
                <button
                    type="button"
                    role="menuitem"
                    className="pay-card__menu-btn"
                    onClick={() => {
                        setMenu(false);
                        onDefault();
                    }}
                >
                    기본 결제수단으로 설정
                </button>
            )}
            <button
                type="button"
                role="menuitem"
                className="pay-card__menu-btn"
                onClick={() => {
                    setMenu(false);
                    onEdit();
                }}
            >
                카드 정보 변경
            </button>
            <button
                type="button"
                role="menuitem"
                className="pay-card__menu-btn pay-card__menu-btn--danger"
                onClick={() => {
                    setMenu(false);
                    onDelete();
                }}
            >
                삭제
            </button>
        </>
    );
    // "VISA" → "Visa" (메뉴 위 작은 글씨)
    const brandName = card.brand.charAt(0) + card.brand.slice(1).toLowerCase();

    return (
        <li className="pay-card-item">
            <div className={`pay-card pay-card--${card.brand.toLowerCase().replace(/[^a-z]/g, "")}`}>
                <div className="pay-card__head">
                    <span className="pay-card__logo" aria-hidden="true" />
                    <strong className="pay-card__brand">{card.brand}</strong>
                    {card.isDefault && <span className="pay-card__default">기본</span>}
                    <div className="pay-card__menu-wrap">
                        <button
                            type="button"
                            className="pay-card__more"
                            aria-label={`${card.brand} 카드 메뉴`}
                            aria-expanded={menu}
                            onClick={() => setMenu(!menu)}
                        >
                            <MoreIcon />
                        </button>
                        {menu && (
                            <div className="pay-card__menu" role="menu" onMouseLeave={() => setMenu(false)}>
                                {items}
                            </div>
                        )}
                    </div>
                </div>
                {/* 모바일: IC 칩 + (마스터카드) 로고 줄 */}
                <div className="pay-card__chip-row" aria-hidden="true">
                    <span className="pay-card__chip" />
                    <span className="pay-card__logo pay-card__logo--row" />
                </div>
                <p className="pay-card__number">
                    <span className="pay-card__dots">•••• •••• ••••</span> {card.last4}
                </p>
                <div className="pay-card__foot">
                    <span>{card.issuer ?? ""}</span>
                    <span>{card.expiry ?? ""}</span>
                </div>
            </div>
            {/* 모바일: 카드 아래로 스르륵 펼치는 메뉴 (PC 에서는 숨김) */}
            <div className="pay-card__sheet" data-expanded={menu} inert={!menu}>
                <div className="pay-card__sheet-inner" role="menu" aria-label={`${brandName} ${card.last4} 메뉴`}>
                    <p className="pay-card__sheet-label">
                        {brandName} · {card.last4}
                    </p>
                    {items}
                </div>
            </div>
        </li>
    );
};

// 기본 하나만 남기기 (새로 기본으로 고른 것 우선 · 하나도 없으면 첫 번째)
const keepOneDefault = <T extends { id: string; isDefault?: boolean }>(list: T[], preferId?: string): T[] => {
    const defaultId = preferId ?? list.find((x) => x.isDefault)?.id ?? list[0]?.id;
    return list.map((x) => ({ ...x, isDefault: x.id === defaultId }));
};

// "(06234) 서울특별시 강남구 테헤란로 123, 101동" → "서울특별시 강남구 테헤란로 123" (상세 주소는 숨김)
const publicAddress = (address: string) => address.split(", ")[0].replace(/^\(\d+\)\s*/, "");

type AddressModalState = { type: "address"; target?: Address } | { type: "card" } | { type: "deleteAddress" } | { type: "deleteCard"; target: PaymentCard } | { type: "editCard"; target: PaymentCard } | null;

const AddressPayment = ({ user }: { user: AppUser }) => {
    const { onUpdateProfile } = useAuthStore();
    const [modal, setModal] = useState<AddressModalState>(null);
    const addresses = user.addresses ?? [];
    const address: Address | undefined = addresses.find((a) => a.isDefault) ?? addresses[0];
    // 등록한 순서 그대로 (처음 등록한 카드가 맨 앞 · 새 카드는 뒤에 붙음)
    const cards = user.cards ?? [];
    const close = () => setModal(null);

    const saveAddress = async (next: Address) => {
        const exists = addresses.some((a) => a.id === next.id);
        const list = exists ? addresses.map((a) => (a.id === next.id ? next : a)) : [...addresses, next];
        await onUpdateProfile({ addresses: keepOneDefault(list, next.isDefault ? next.id : undefined) });
        close();
    };

    const saveCards = async (list: PaymentCard[], preferId?: string) => {
        await onUpdateProfile({ cards: keepOneDefault(list, preferId) });
        close();
    };

    const addCardButton = (primary?: boolean) => (
        <button type="button" className={primary ? "mypage__primary-btn" : "mypage__line-btn"} onClick={() => setModal({ type: "card" })}>
            카드 추가
        </button>
    );

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
                        <p className="mypage__sub">
                            {publicAddress(address.address)}
                            <span className="account__address-note">
                                <br />
                                상세 주소는 주문 시 다시 확인할 수 있습니다.
                            </span>
                        </p>
                    </>
                ) : (
                    <p className="mypage__sub mypage__sub--lg">등록된 배송지가 없습니다.</p>
                )}
                <div className="mypage__actions">
                    {address && (
                        <button type="button" className="mypage__line-btn" onClick={() => setModal({ type: "address", target: address })}>
                            배송지 수정
                        </button>
                    )}
                    <button
                        type="button"
                        className={address ? "mypage__line-btn" : "mypage__primary-btn"}
                        onClick={() => setModal({ type: "address" })}
                    >
                        배송지 추가
                    </button>
                    {address && (
                        <button type="button" className="mypage__line-btn account__danger-btn" onClick={() => setModal({ type: "deleteAddress" })}>
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
                    {cards.length > 0 && addCardButton()}
                </div>
                {cards.length > 0 ? (
                    <ul className="account__cards">
                        {cards.map((card) => (
                            <PaymentCardItem
                                key={card.id}
                                card={card}
                                onDefault={() => saveCards(cards, card.id)}
                                onEdit={() => setModal({ type: "editCard", target: card })}
                                onDelete={() => setModal({ type: "deleteCard", target: card })}
                            />
                        ))}
                    </ul>
                ) : (
                    <>
                        <p className="mypage__sub mypage__sub--lg">등록된 결제수단이 없습니다.</p>
                        <div className="mypage__actions">{addCardButton(true)}</div>
                    </>
                )}
            </section>

            {modal?.type === "address" && <AddressModal initial={modal.target} onClose={close} onSave={saveAddress} />}
            {modal?.type === "card" && (
                <CardModal
                    cards={cards}
                    onClose={close}
                    // 등록 · 기본 변경 후에도 팝업은 열어 둠 (슬라이드에서 바로 확인)
                    onSave={(card) => onUpdateProfile({ cards: keepOneDefault([...cards, card], card.isDefault ? card.id : undefined) })}
                    onDefault={(card) => onUpdateProfile({ cards: keepOneDefault(cards, card.id) })}
                />
            )}
            {modal?.type === "editCard" && (
                <CardEditModal
                    card={modal.target}
                    onClose={close}
                    onSave={(next) => saveCards(cards.map((c) => (c.id === next.id ? next : c)))}
                />
            )}
            {modal?.type === "deleteAddress" && address && (
                <ConfirmModal
                    title="배송지를 삭제할까요?"
                    confirmLabel="삭제"
                    danger
                    onClose={close}
                    onConfirm={async () => {
                        await onUpdateProfile({ addresses: keepOneDefault(addresses.filter((a) => a.id !== address.id)) });
                        close();
                    }}
                />
            )}
            {modal?.type === "deleteCard" && (
                <ConfirmModal
                    title="결제수단을 삭제할까요?"
                    confirmLabel="삭제"
                    danger
                    onClose={close}
                    onConfirm={() => saveCards(cards.filter((c) => c.id !== modal.target.id))}
                />
            )}
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
    const [loggingOut, setLoggingOut] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // 모바일: 계정 관리 메뉴 펼침
    if (!user) return null;
    const current = accountSections.find((s) => s.key === section) ?? accountSections[0];

    const logout = async () => {
        await onLogout();
        navigate("/");
    };

    return (
        <div className="account">
            <nav className="account__nav" aria-label="계정 관리 메뉴">
                {/* 모바일: 지금 메뉴를 보여주는 버튼 → 누르면 메뉴 목록이 스르륵 (PC 에서는 숨김) */}
                <button type="button" className="account__mobile-toggle" aria-expanded={menuOpen} aria-controls="account-menu"
                    onClick={() => setMenuOpen((v) => !v)}>
                    <span className="account__nav-icon"><Icon name={current.icon} /></span>
                    <span>
                        <small>계정 관리</small>
                        <strong>{current.label}</strong>
                    </span>
                    <img src="/icons/ui/chevron-down.svg" alt="" className="account__mobile-chevron" />
                </button>
                <div className="account__nav-list" id="account-menu" data-expanded={menuOpen}>
                <ul>
                    {accountSections.map((s) => (
                        <li key={s.key}>
                            <button
                                type="button"
                                className={`account__nav-item ${s.key === current.key ? "is-active" : ""}`}
                                aria-current={s.key === current.key ? "page" : undefined}
                                onClick={() => { onSection(s.key); setMenuOpen(false); }}
                            >
                                <span className="account__nav-icon">
                                    <Icon name={s.icon} />
                                </span>
                                {s.label}
                            </button>
                        </li>
                    ))}
                </ul>
                </div>
                <button type="button" className="mypage__line-btn account__logout" onClick={() => setLoggingOut(true)}>
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
                {/* 모바일: 로그아웃은 내용 아래 */}
                <button type="button" className="mypage__line-btn account__logout account__logout--mobile" onClick={() => setLoggingOut(true)}>
                    로그아웃
                </button>
            </section>

            {loggingOut && <ConfirmModal title="로그아웃할까요?" confirmLabel="로그아웃" onClose={() => setLoggingOut(false)} onConfirm={logout} />}
        </div>
    );
};
