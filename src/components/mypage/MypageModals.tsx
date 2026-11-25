import { useEffect, useRef, useState, type InputHTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { Modal } from "../common/Modal";
import type { Address, PaymentCard } from "../../types/auth";
import type { Order, RegisteredProduct } from "../../types/product";
import { formatOrderDate } from "../../data/mypageData";

// =========================================================
// 팝업 공통 부품
// =========================================================

// 입력칸 (라벨 · 입력 · 아래 안내)
export const ModalField = ({ label, hint, ...input }: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) => (
    <label className="modal__field">
        <span className="modal__label">{label}</span>
        <input className="modal__input" {...input} />
        {hint && <span className="modal__hint">{hint}</span>}
    </label>
);

// 드롭다운 (브라우저 기본 select 대신 · 사이트 정렬 드롭다운과 같은 목록 모양)
// variant="modal": 팝업 입력칸 모양 / variant="card": 결제 수단 등록의 라벨 들어간 회색 칸
export const Dropdown = ({
    value,
    options,
    onChange,
    placeholder,
    label,
    variant = "modal",
    compact,
    disabled,
    openKey,
}: {
    value: string;
    options: string[];
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    variant?: "modal" | "card";
    compact?: boolean; // 라벨 없이 얇은 칸 (할부)
    disabled?: boolean;
    openKey?: number; // 값이 바뀌면 목록을 열고 포커스 (예: + 다른 카드 등록하기)
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!openKey) return;
        setOpen(true);
        ref.current?.querySelector("button")?.focus();
    }, [openKey]);

    // 바깥을 누르면 닫기
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open]);

    const pick = (option: string) => {
        onChange(option);
        setOpen(false);
    };

    // 위아래 화살표로 옮기기 · ESC 로 목록만 닫기 (팝업은 그대로)
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && open) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setOpen(false);
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const i = options.indexOf(value);
            const next = e.key === "ArrowDown" ? Math.min(options.length - 1, i + 1) : Math.max(0, i - 1);
            onChange(options[next]);
        }
    };

    return (
        <div className={`dropdown dropdown--${variant} ${compact ? "dropdown--compact" : ""} ${disabled ? "is-disabled" : ""}`} ref={ref} onKeyDown={onKeyDown}>
            <button
                type="button"
                className={`dropdown__button ${open ? "is-open" : ""}`}
                aria-haspopup="listbox"
                aria-expanded={open}
                disabled={disabled}
                onClick={() => setOpen(!open)}
            >
                <span className="dropdown__text">
                    {variant === "card" && label && !compact && <span className="card-form__label">{label}</span>}
                    <span className={`dropdown__value ${value ? "" : "is-empty"}`}>{value || placeholder}</span>
                </span>
                <img src="/icons/down-arrow.svg" alt="" className="dropdown__arrow" />
            </button>
            {open && (
                <ul className="dropdown__list" role="listbox" aria-label={label}>
                    {options.map((option) => (
                        <li key={option}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={option === value}
                                className={option === value ? "is-selected" : ""}
                                onClick={() => pick(option)}
                            >
                                {option}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// 선택칸 (사유 · 문의 유형 · 회수 주소) = 라벨 + 드롭다운
const ModalSelect = ({
    label,
    ...dropdown
}: { label: string } & Omit<Parameters<typeof Dropdown>[0], "label" | "variant">) => (
    <div className="modal__field">
        <span className="modal__label">{label}</span>
        <Dropdown label={label} {...dropdown} />
    </div>
);

// 체크박스 (기본 배송지 · 기본 결제수단)
const ModalCheck = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (next: boolean) => void }) => (
    <label className="modal__check">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="modal__check-box" aria-hidden="true" />
        {label}
    </label>
);

// 아래 버튼 2개 (취소 · 확인)
const Actions = ({
    onClose,
    label,
    onConfirm,
    busy,
    danger,
    single,
}: {
    onClose: () => void;
    label: string;
    onConfirm: () => void;
    busy?: boolean;
    danger?: boolean;
    single?: boolean; // 확인 버튼만 (안내 팝업)
}) => (
    <>
        {!single && (
            <button type="button" className="modal__btn" onClick={onClose}>
                취소
            </button>
        )}
        <button type="button" className={`modal__btn ${danger ? "modal__btn--danger" : "modal__btn--primary"}`} onClick={onConfirm} disabled={busy}>
            {label}
        </button>
    </>
);

const ErrorText = ({ text }: { text: string }) => (text ? <p className="modal__error">{text}</p> : null);

// Firebase 에러 → 안내 문구
export const authErrorText = (error: unknown) => {
    const code = (error as { code?: string })?.code ?? "";
    if (code.includes("invalid-credential") || code.includes("wrong-password")) return "현재 비밀번호가 맞지 않아요.";
    if (code.includes("requires-recent-login")) return "보안을 위해 로그아웃 후 다시 로그인한 뒤 시도해 주세요.";
    if (code.includes("email-already-in-use")) return "이미 사용 중인 이메일이에요.";
    if (code.includes("invalid-email")) return "이메일 형식이 올바르지 않아요.";
    if (code.includes("too-many-requests")) return "시도가 너무 많아요. 잠시 후 다시 시도해 주세요.";
    return "처리하지 못했어요. 잠시 후 다시 시도해 주세요.";
};

// 저장 중 표시 + 에러 처리 (팝업마다 같은 흐름)
const useSubmit = () => {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const run = async (task: () => Promise<void> | void) => {
        setBusy(true);
        setError("");
        try {
            await task();
        } catch (e) {
            setError(authErrorText(e));
        }
        setBusy(false); // 팝업이 닫혔으면 무시됨
    };
    return { busy, error, setError, run };
};

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const today = () => formatOrderDate(new Date().toISOString());

// =========================================================
// 확인 팝업 (로그아웃할까요? · 삭제할까요? · 회원 탈퇴)
// =========================================================
export const ConfirmModal = ({
    title,
    text,
    confirmLabel,
    danger,
    single,
    onConfirm,
    onClose,
}: {
    title: string;
    text?: string;
    confirmLabel: string;
    danger?: boolean;
    single?: boolean;
    onConfirm: () => Promise<void> | void;
    onClose: () => void;
}) => {
    const { busy, error, run } = useSubmit();
    return (
        <Modal
            size="sm"
            title={title}
            onClose={onClose}
            actions={<Actions onClose={onClose} label={confirmLabel} danger={danger} single={single} busy={busy} onConfirm={() => run(onConfirm)} />}
        >
            {(text || error) && (
                <>
                    {text && <p className="modal__text">{text}</p>}
                    <ErrorText text={error} />
                </>
            )}
        </Modal>
    );
};

// =========================================================
// 결제 수단 등록
// 흐름 (보편적인 카드 등록 UI):
// 1) 위 카드 슬라이드 (네이버페이 결제수단처럼): 등록된 카드들 → 맨 뒤 "+ 다른 카드 등록하기"
//    카드가 없으면 + 가 첫 번째(유일한) 슬라이드
// 2) + 를 누르면 아래 카드사 선택부터 입력 시작 (슬라이드는 + 그대로)
//    등록하면 아래 입력한 정보가 그대로 들어간 카드가 슬라이드에 생기고, 맨 뒤에 다시 + 가 생김 · 팝업은 그대로
// 3) 카드번호는 4자리씩 띄우고 다 쓰면 다음 칸으로 · 앞자리로 VISA/Mastercard 자동 인식
// 4) 등록하면 끝 4자리 · 카드사 · 유효기간 · 할부만 저장 (카드번호 전체 · 비밀번호는 저장 안 함)
// 5) 등록된 카드를 넘겨 보면 그 카드 정보가 아래에 표시되고, 기본 결제수단으로 바꿀 수 있음
// =========================================================
export const cardIssuers = ["신한카드", "삼성카드", "현대카드", "KB국민카드", "롯데카드", "하나카드", "우리카드", "NH농협카드", "BC카드", "씨티카드"];
const installments = ["일시불", "2개월", "3개월", "6개월", "12개월"];

const cardBrand = (digits: string) => {
    if (/^4/.test(digits)) return "VISA";
    if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
    if (/^3[47]/.test(digits)) return "AMEX";
    return "CARD";
};

// 카드 모양 (등록된 카드)
const CardFace = ({ issuer, brand, number, expiry, isDefault }: { issuer?: string; brand?: string; number: string; expiry?: string; isDefault?: boolean }) => (
    <div className="card-face">
        <div className="card-face__top">
            <span className="card-face__issuer">{issuer || "카드사"}</span>
            {isDefault && <span className="card-face__default">기본</span>}
        </div>
        <p className="card-face__number">{number}</p>
        <div className="card-face__bottom">
            <span>{expiry || "MM/YY"}</span>
            <strong>{brand && brand !== "CARD" ? brand : ""}</strong>
        </div>
    </div>
);

// 안에 라벨이 있는 입력칸 (결제 수단 등록 전용)
const CardField = ({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) => (
    <label className={`card-form__field ${className}`}>
        <span className="card-form__label">{label}</span>
        {children}
    </label>
);

export const CardModal = ({
    cards,
    onClose,
    onSave,
    onDefault,
}: {
    cards: PaymentCard[];
    onClose: () => void;
    onSave: (card: PaymentCard) => Promise<void>;
    onDefault: (card: PaymentCard) => Promise<void>;
}) => {
    const [index, setIndex] = useState(0); // 첫 번째 카드부터 (카드가 없으면 + 슬라이드)
    const [savedId, setSavedId] = useState(""); // 방금 등록한 카드 → 슬라이드를 그 카드로
    const [startKey, setStartKey] = useState(0); // + 를 누르면 카드사 목록 열기
    const [issuer, setIssuer] = useState("");
    const [number, setNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [pw, setPw] = useState("");
    const [installment, setInstallment] = useState(installments[0]);
    const expiryRef = useRef<HTMLInputElement>(null);
    const pwRef = useRef<HTMLInputElement>(null);
    const { busy, error, setError, run } = useSubmit();

    const current = cards[index]; // 등록된 카드를 보고 있으면 그 카드
    const [notice, setNotice] = useState("");

    // 등록이 저장되어 목록에 들어오면 그 카드로 이동 + 입력칸 비우기
    useEffect(() => {
        if (!savedId) return;
        const i = cards.findIndex((c) => c.id === savedId);
        if (i < 0) return;
        setIndex(i);
        setSavedId("");
        setIssuer("");
        setNumber("");
        setExpiry("");
        setPw("");
        setInstallment(installments[0]);
        setNotice("카드를 등록했어요. 뒤로 넘기면 다른 카드도 등록할 수 있어요.");
    }, [cards, savedId]);
    const digits = number.replace(/\D/g, "");
    const move = (step: number) => {
        setIndex((i) => Math.min(cards.length, Math.max(0, i + step)));
        setError("");
        setNotice("");
    };

    const submit = () => {
        if (current) return run(() => onDefault(current));
        const [mm, yy] = expiry.split("/").map(Number);
        const expired = !mm || mm > 12 || !yy || new Date(2000 + yy, mm) < new Date();
        if (!issuer) return setError("카드사를 선택해 주세요.");
        if (digits.length < 15) return setError("카드번호를 정확히 입력해 주세요.");
        if (expiry.length !== 5 || expired) return setError("유효기간을 MM/YY 형식으로 정확히 입력해 주세요.");
        if (pw.length !== 2) return setError("비밀번호 앞 두자리를 입력해 주세요.");
        const id = newId();
        run(async () => {
            await onSave({ id, brand: cardBrand(digits), last4: digits.slice(-4), issuer, expiry, installment, isDefault: cards.length === 0 });
            setSavedId(id);
        });
    };

    const buttonLabel = current ? (current.isDefault ? "기본 결제수단" : "기본 결제수단으로 설정") : "등록";

    return (
        <Modal
            size="card"
            title="결제 수단 등록"
            subtitle="결제 수단으로 등록하실 카드 정보를 입력해주세요"
            onClose={onClose}
            actions={
                <button
                    type="button"
                    className="modal__btn modal__btn--primary modal__btn--block"
                    onClick={submit}
                    disabled={busy || current?.isDefault}
                >
                    {buttonLabel}
                </button>
            }
        >
            {/* 카드 슬라이드 */}
            <div className="card-slider">
                <button type="button" className="card-slider__arrow is-prev" onClick={() => move(-1)} disabled={index === 0} aria-label="이전 카드">
                    <img src="/icons/mypage/chevron-right.svg" alt="" />
                </button>
                {/* 카드 한 장 너비 창 · 안의 줄을 옆으로 밀어서 넘김 */}
                <div className="card-slider__viewport">
                    <ul className="card-slider__track" style={{ transform: `translateX(calc(${index} * -1 * (100% + 1rem)))` }}>
                        {cards.map((card) => (
                            <li key={card.id} className="card-slider__slide">
                                <CardFace issuer={card.issuer} brand={card.brand} number={`•••• •••• •••• ${card.last4}`} expiry={card.expiry} isDefault={card.isDefault} />
                            </li>
                        ))}
                        {/* 맨 뒤: + 다른 카드 등록하기 → 누르면 입력 미리보기 */}
                        <li className="card-slider__slide">
                            <div className="card-slider__add">
                                <button
                                    type="button"
                                    className="card-slider__add-btn"
                                    onClick={() => setStartKey((k) => k + 1)}
                                    tabIndex={current ? -1 : 0}
                                >
                                    <span aria-hidden="true">+</span> 다른 카드 등록하기
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
                <button
                    type="button"
                    className="card-slider__arrow"
                    onClick={() => move(1)}
                    disabled={index === cards.length}
                    aria-label="다음 카드"
                >
                    <img src="/icons/mypage/chevron-right.svg" alt="" />
                </button>
            </div>
            {/* 위치 점 (카드 수 + 맨 뒤 추가) */}
            {cards.length > 0 && (
                <div className="card-slider__dots" aria-hidden="true">
                    {Array.from({ length: cards.length + 1 }, (_, i) => (
                        <span key={i} className={i === index ? "is-active" : ""} />
                    ))}
                </div>
            )}

            {/* 입력 (등록된 카드를 보고 있으면 그 정보 · 수정 불가) */}
            <div className="card-form">
                <Dropdown
                    variant="card"
                    label="카드사 선택"
                    placeholder="카드사를 선택하세요"
                    openKey={startKey}
                    options={cardIssuers}
                    value={current ? current.issuer ?? "" : issuer}
                    disabled={!!current}
                    onChange={(name) => {
                        setIssuer(name);
                        setError("");
                    }}
                />
                <CardField label="카드번호">
                    <input
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="0000 0000 0000 0000"
                        disabled={!!current}
                        value={current ? `•••• •••• •••• ${current.last4}` : number}
                        onChange={(e) => {
                            const d = e.target.value.replace(/\D/g, "").slice(0, 16);
                            setNumber(d.replace(/(\d{4})(?=\d)/g, "$1 "));
                            setError("");
                            if (d.length === 16) expiryRef.current?.focus(); // 다 쓰면 다음 칸
                        }}
                    />
                </CardField>
                <div className="card-form__row">
                    <CardField label="유효기간">
                        <input
                            ref={expiryRef}
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            placeholder="MM/YY"
                            disabled={!!current}
                            value={current ? current.expiry ?? "" : expiry}
                            onChange={(e) => {
                                const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                                setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                                setError("");
                                if (d.length === 4) pwRef.current?.focus();
                            }}
                        />
                    </CardField>
                    <CardField label="비밀번호 앞 두자리">
                        <input
                            ref={pwRef}
                            type="password"
                            inputMode="numeric"
                            placeholder={current ? "" : "●●"}
                            disabled={!!current}
                            value={current ? "" : pw}
                            onChange={(e) => {
                                setPw(e.target.value.replace(/\D/g, "").slice(0, 2));
                                setError("");
                            }}
                        />
                    </CardField>
                </div>
                <Dropdown
                    variant="card"
                    compact
                    label="할부"
                    options={installments}
                    value={current ? current.installment ?? installments[0] : installment}
                    disabled={!!current}
                    onChange={setInstallment}
                />
                <ErrorText text={error} />
                {notice && <p className="card-form__notice">{notice}</p>}
            </div>
        </Modal>
    );
};

// =========================================================
// 배송지 추가 · 수정 (주소 검색: 카카오 우편번호 서비스)
// =========================================================
type DaumPostcode = { zonecode: string; roadAddress: string; jibunAddress: string };
declare global {
    interface Window {
        daum?: { Postcode: new (options: { oncomplete: (data: DaumPostcode) => void }) => { open: () => void } };
    }
}

const POSTCODE_SRC = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
const loadPostcode = () =>
    new Promise<void>((resolve, reject) => {
        if (window.daum?.Postcode) return resolve();
        const script = document.createElement("script");
        script.src = POSTCODE_SRC;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("postcode"));
        document.head.appendChild(script);
    });

// 010-1234-5678 형식으로
const formatPhone = (value: string) => {
    const d = value.replace(/\D/g, "").slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
};

// 저장된 주소 "(우편번호) 도로명 주소, 상세 주소" → 나눠서 수정 팝업에
const splitAddress = (address = "") => {
    const [base, ...rest] = address.split(", ");
    return { base, detail: rest.join(", ") };
};

export const AddressModal = ({
    initial,
    onClose,
    onSave,
}: {
    initial?: Address;
    onClose: () => void;
    onSave: (address: Address) => Promise<void>;
}) => {
    const split = splitAddress(initial?.address);
    const [name, setName] = useState(initial?.name ?? "");
    const [phone, setPhone] = useState(initial?.phone ?? "");
    const [base, setBase] = useState(split.base ?? "");
    const [detail, setDetail] = useState(split.detail);
    const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);
    const [manual, setManual] = useState(false); // 주소 검색을 못 불러오면 직접 입력
    const { busy, error, setError, run } = useSubmit();

    const search = async () => {
        try {
            await loadPostcode();
            new window.daum!.Postcode({
                oncomplete: (data) => setBase(`(${data.zonecode}) ${data.roadAddress || data.jibunAddress}`),
            }).open();
        } catch {
            setManual(true);
            setError("주소 검색을 불러오지 못했어요. 주소를 직접 입력해 주세요.");
        }
    };

    const submit = () => {
        if (!name.trim()) return setError("받는 사람을 입력해 주세요.");
        if (phone.replace(/\D/g, "").length < 10) return setError("연락처를 정확히 입력해 주세요.");
        if (!base.trim()) return setError("주소를 검색해 주세요.");
        const address = [base.trim(), detail.trim()].filter(Boolean).join(", ");
        run(() => onSave({ id: initial?.id ?? newId(), name: name.trim(), phone, address, isDefault }));
    };

    return (
        <Modal
            title={initial ? "배송지 수정" : "배송지 추가"}
            onClose={onClose}
            actions={<Actions onClose={onClose} label="저장" busy={busy} onConfirm={submit} />}
        >
            <ModalField label="받는 사람" placeholder="홍길동" autoFocus value={name} onChange={(e) => setName(e.target.value)} />
            <ModalField
                label="연락처"
                inputMode="tel"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
            />
            <ModalField
                label="주소"
                placeholder="우편번호 · 주소 검색"
                value={base}
                readOnly={!manual}
                className={`modal__input ${manual ? "" : "modal__input--button"}`}
                onClick={manual ? undefined : search}
                onKeyDown={(e) => !manual && e.key === "Enter" && search()}
                onChange={(e) => setBase(e.target.value)}
            />
            <ModalField label="상세 주소" placeholder="입력해 주세요" value={detail} onChange={(e) => setDetail(e.target.value)} />
            <ModalCheck label="기본 배송지로 사용" checked={isDefault} onChange={setIsDefault} />
            <ErrorText text={error} />
        </Modal>
    );
};

// =========================================================
// 2단계 인증 설정 (인증 이메일 · 6자리 인증번호)
// =========================================================
export const TwoFactorModal = ({ email, onClose, onSave }: { email: string; onClose: () => void; onSave: () => Promise<void> }) => {
    const [code, setCode] = useState("");
    const { busy, error, setError, run } = useSubmit();

    const submit = () => {
        if (!email) return setError("이메일이 등록된 계정만 2단계 인증을 설정할 수 있어요.");
        if (code.length !== 6) return setError("6자리 인증번호를 입력해 주세요.");
        run(onSave);
    };

    return (
        <Modal title="2단계 인증 설정" onClose={onClose} actions={<Actions onClose={onClose} label="인증하고 활성화" busy={busy} onConfirm={submit} />}>
            <ModalField label="인증 이메일" value={email} placeholder="example@email.com" readOnly />
            <ModalField
                label="인증번호"
                inputMode="numeric"
                maxLength={6}
                placeholder="6자리 인증번호"
                autoFocus
                value={code}
                onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <ErrorText text={error} />
        </Modal>
    );
};

// =========================================================
// 정보 팝업 (로그인 기기 · 배송 조회) · 버튼 없음
// =========================================================
export const DeviceModal = ({ device, onClose }: { device: string; onClose: () => void }) => (
    <Modal title="로그인 기기" onClose={onClose}>
        <p className="modal__strong">{device}</p>
        <p className="modal__status">현재 사용 중</p>
        <p className="modal__line">다른 로그인 기기 없음</p>
    </Modal>
);

export const TrackingModal = ({ order, onClose }: { order: Order; onClose: () => void }) => {
    const item = order.items[0];
    const done = order.status === "배송 완료";
    const carrier = [order.carrier, order.trackingNumber].filter(Boolean).join(" ");
    return (
        <Modal title="배송 조회" onClose={onClose}>
            <p className="modal__strong">
                {item?.title.split(" - ")[0]}
                {order.items.length > 1 && ` 외 ${order.items.length - 1}개`}
            </p>
            <p className="modal__status modal__status--lg">
                {done ? `배송 완료 · ${order.deliveredAt ? formatOrderDate(order.deliveredAt) : "완료일 확인 중"}` : order.status}
            </p>
            {!done && <p className="modal__line">배송 예정일 · {order.expectedAt ? formatOrderDate(order.expectedAt) : "배송사 확인 중"}</p>}
            <p className="modal__line">택배사·송장번호 · {carrier || "업데이트 대기"}</p>
        </Modal>
    );
};

// =========================================================
// 반품 신청
// =========================================================
const returnReasons = ["단순 변심", "제품 불량·파손", "주문과 다른 제품 배송", "배송 지연", "기타"];

export const ReturnModal = ({
    order,
    addresses,
    onClose,
    onSubmit,
}: {
    order: Order;
    addresses: Address[];
    onClose: () => void;
    onSubmit: (reason: string, address: string) => Promise<void>;
}) => {
    const addressOptions = addresses.length
        ? addresses.map((a) => `${a.isDefault ? "기본 배송지 · " : ""}${a.name} · ${splitAddress(a.address).base}`)
        : ["기본 배송지"];
    const [reason, setReason] = useState("");
    const [address, setAddress] = useState(addressOptions[0]);
    const { busy, error, setError, run } = useSubmit();
    const item = order.items[0];

    const submit = () => {
        if (!reason) return setError("반품 사유를 선택해 주세요.");
        run(() => onSubmit(reason, address));
    };

    return (
        <Modal title="반품 신청" onClose={onClose} actions={<Actions onClose={onClose} label="신청" busy={busy} onConfirm={submit} />}>
            <p className="modal__strong">{item?.title.split(" - ")[0]}</p>
            <ModalSelect
                label="반품 사유"
                placeholder="사유를 선택하세요"
                options={returnReasons}
                value={reason}
                onChange={(next) => {
                    setReason(next);
                    setError("");
                }}
            />
            <ModalSelect label="회수 주소" options={addressOptions} value={address} onChange={setAddress} />
            <p className="modal__line">환불 수단 · 기존 결제수단</p>
            <ErrorText text={error} />
        </Modal>
    );
};

// =========================================================
// 이미지 업로드 (JPG·PNG · 최대 5MB · 확대해서 표시 영역 조정)
// =========================================================
const MAX_IMAGE = 5 * 1024 * 1024;

// 가운데 기준으로 zoom 만큼 확대해서 160px 정사각 webp 로
const cropImage = (src: string, zoom: number) =>
    new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
            const size = 160;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("canvas"));
            const side = Math.min(img.width, img.height) / zoom;
            ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
            resolve(canvas.toDataURL("image/webp", 0.85));
        };
        img.src = src;
    });

export const ImageUploadModal = ({ onClose, onApply }: { onClose: () => void; onApply: (dataUrl: string) => void }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<{ name: string; url: string } | null>(null);
    const [zoom, setZoom] = useState(1);
    const { busy, error, setError, run } = useSubmit();

    // 미리보기 주소 정리
    useEffect(() => () => {
        if (file) URL.revokeObjectURL(file.url);
    }, [file]);

    const pick = (picked?: File) => {
        if (!picked) return;
        if (!/^image\/(jpeg|png)$/.test(picked.type)) return setError("JPG·PNG 파일만 올릴 수 있어요.");
        if (picked.size > MAX_IMAGE) return setError("5MB 이하 이미지만 올릴 수 있어요.");
        setError("");
        setZoom(1);
        setFile({ name: picked.name, url: URL.createObjectURL(picked) });
    };

    const apply = () => {
        if (!file) return setError("이미지를 선택해 주세요.");
        run(async () => onApply(await cropImage(file.url, zoom)));
    };

    return (
        <Modal title="이미지 업로드" onClose={onClose} actions={<Actions onClose={onClose} label="이미지 적용" busy={busy} onConfirm={apply} />}>
            <div className="modal__field">
                <span className="modal__label">이미지 파일</span>
                <button type="button" className={`modal__input modal__file ${file ? "" : "is-empty"}`} onClick={() => inputRef.current?.click()}>
                    {file?.name ?? "JPG·PNG · 최대 5MB"}
                </button>
                <input ref={inputRef} type="file" accept="image/jpeg,image/png" hidden onChange={(e) => pick(e.target.files?.[0])} />
            </div>
            {file ? (
                <div className="modal__crop">
                    <span className="modal__crop-preview">
                        <img src={file.url} alt="미리보기" style={{ transform: `scale(${zoom})` }} />
                    </span>
                    <label className="modal__crop-zoom">
                        <span className="modal__label">확대</span>
                        <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
                    </label>
                </div>
            ) : (
                <p className="modal__line">이미지 선택 후 표시 영역 조정</p>
            )}
            <ErrorText text={error} />
        </Modal>
    );
};

// =========================================================
// 제품 등록 · 등록 정보 수정
// =========================================================
// 2026.11.14 형식으로
const formatDateInput = (value: string) => {
    const d = value.replace(/\D/g, "").slice(0, 8);
    return [d.slice(0, 4), d.slice(4, 6), d.slice(6)].filter(Boolean).join(".");
};

export const RegisterModal = ({
    initial,
    productNames,
    onClose,
    onSave,
}: {
    initial?: RegisteredProduct;
    productNames: string[]; // 모델명 자동완성
    onClose: () => void;
    onSave: (values: { title: string; serial: string; purchasedAt: string; proof?: string }) => Promise<void>;
}) => {
    const proofRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState(initial?.title.split(" - ")[0] ?? "");
    const [serial, setSerial] = useState(initial?.serial ?? "");
    const [purchasedAt, setPurchasedAt] = useState(initial?.purchasedAt ? formatOrderDate(initial.purchasedAt) : "");
    const [proof, setProof] = useState("");
    const { busy, error, setError, run } = useSubmit();

    const submit = () => {
        if (!title.trim()) return setError("모델명을 입력해 주세요.");
        if (serial.trim().length < 4) return setError("시리얼 번호를 정확히 입력해 주세요.");
        if (!/^\d{4}\.\d{2}\.\d{2}$/.test(purchasedAt)) return setError("구매일을 YYYY.MM.DD 형식으로 입력해 주세요.");
        run(() => onSave({ title: title.trim(), serial: serial.trim(), purchasedAt, proof: proof || undefined }));
    };

    return (
        <Modal
            title={initial ? "등록 정보 수정" : "제품 등록"}
            onClose={onClose}
            actions={<Actions onClose={onClose} label={initial ? "저장" : "등록"} busy={busy} onConfirm={submit} />}
        >
            <ModalField
                label="모델명"
                placeholder="Razer BlackWidow V4 75%"
                list="register-models"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <datalist id="register-models">
                {productNames.map((name) => (
                    <option key={name} value={name} />
                ))}
            </datalist>
            <ModalField label="시리얼 번호" placeholder="입력해 주세요" value={serial} onChange={(e) => setSerial(e.target.value.toUpperCase())} />
            <ModalField
                label="구매일"
                inputMode="numeric"
                placeholder="YYYY.MM.DD"
                value={purchasedAt}
                onChange={(e) => setPurchasedAt(formatDateInput(e.target.value))}
            />
            <button type="button" className="modal__attach" onClick={() => proofRef.current?.click()}>
                {proof ? `구매 증빙 · ${proof}` : "구매 증빙 첨부"}
            </button>
            <input ref={proofRef} type="file" accept="image/*,.pdf" hidden onChange={(e) => setProof(e.target.files?.[0]?.name ?? "")} />
            <ErrorText text={error} />
        </Modal>
    );
};

// =========================================================
// 제품 지원 요청
// =========================================================
const supportTypes = ["제품 사용·보증", "고장·수리", "드라이버·소프트웨어", "기타"];

export const SupportModal = ({
    product,
    onClose,
    onSubmit,
}: {
    product: string;
    onClose: () => void;
    onSubmit: (type: string, content: string) => Promise<void>;
}) => {
    const [type, setType] = useState(supportTypes[0]);
    const [content, setContent] = useState("");
    const { busy, error, setError, run } = useSubmit();

    const submit = () => {
        if (content.trim().length < 5) return setError("문의 내용을 5자 이상 입력해 주세요.");
        run(() => onSubmit(type, content.trim()));
    };

    return (
        <Modal title="제품 지원 요청" onClose={onClose} actions={<Actions onClose={onClose} label="요청 접수" busy={busy} onConfirm={submit} />}>
            <ModalField label="제품" value={product} readOnly />
            <ModalSelect label="문의 유형" options={supportTypes} value={type} onChange={setType} />
            <ModalField label="문의 내용" placeholder="입력해 주세요" autoFocus value={content} onChange={(e) => setContent(e.target.value)} />
            <ErrorText text={error} />
        </Modal>
    );
};
