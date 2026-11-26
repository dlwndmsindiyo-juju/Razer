import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { detailGifts } from "../data/detailData";
import { getProductById } from "../data/productData";
import { subtotal } from "../data/checkoutData";
import type { Address, PaymentCard } from "../types/auth";
import type { CartItem } from "../types/product";
import { AddressModal, Dropdown, OrderInfoModal, cardIssuers, type OrderBuyer } from "../components/mypage/MypageModals";

// 결제하기 (시안: 왼쪽 주문 상품 · 주문자 · 배송 · 사은품 / 오른쪽 최종 결제금액 · 결제 방법 · 동의 · 결제하기)
// 카드가 등록되어 있지 않으면 팝업 없이 이 페이지에서 바로 입력 → 결제할 때 계정에 등록
// 카드는 전체 번호 · CVC · 비밀번호를 저장하지 않음 (끝 4자리 · 카드사 · 유효기간 · 할부 · 브랜드만)

const FREE_SHIPPING = 139900;
const SHIPPING_FEE = 13200; // 기본 배송 (139,900원 미만)
const GIFTS_VISIBLE = 3;

const methods = [
    { id: "apple", label: "Apple Pay로 결제하기" },
    { id: "google", label: "Google Pay로 결제하기" },
    { id: "card", label: "신용카드로 결제하기" },
    { id: "paypal", label: "PayPal로 결제하기" },
] as const;
type Method = typeof methods[number]["id"];

const installments = ["일시불", "2개월", "3개월", "6개월", "12개월"];
const memoOptions = ["문 앞에 놓아주세요", "경비실에 맡겨주세요", "배송 전 연락해 주세요", "부재 시 연락해 주세요"];
const DIRECT = "직접 입력";
const NEW_CARD = "새 카드 입력";
const ADD_ADDRESS = "+ 배송지 추가";
const addressLabel = (item: { name: string; address: string }) => `${item.name} · ${item.address}`;
// 저장된 주소 "(03706) 도로명 주소, 상세 주소" → 시안처럼 도로명 / 상세 / (우편번호) 세 줄
const addressLines = (address: string) => {
    const [base, ...rest] = address.split(", ");
    const zip = base.match(/^\((\d{5})\)\s*/);
    return [zip ? base.slice(zip[0].length) : base, rest.join(", "), zip ? `(${zip[1]})` : ""].filter(Boolean);
};

const won = (value: number) => value.toLocaleString("ko-KR") + " 원";
const digits = (value: string) => value.replace(/\D/g, "");
const formatPhone = (value: string) => {
    const number = digits(value);
    return number.length === 11 ? `${number.slice(0, 3)} - ${number.slice(3, 7)} - ${number.slice(7)}` : value;
};
const formatCardNumber = (value: string) => digits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (value: string) => {
    const number = digits(value).slice(0, 4);
    return number.length > 2 ? `${number.slice(0, 2)}/${number.slice(2)}` : number;
};
const cardBrand = (number: string) => (number.startsWith("4") ? "VISA" : /^5[1-5]/.test(number) ? "Mastercard" : number.startsWith("3") ? "AMEX" : "카드");
const cardLabel = (card: PaymentCard) => `${card.issuer ?? card.brand} · ${card.last4}`;

// 사양: 선택한 옵션 (없으면 상품 요약)
const itemSpec = (item: CartItem) => item.size || "";

export function Payment() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const items = useCartStore((store) => store.items);
    const user = useAuthStore((store) => store.user);
    const onUpdateProfile = useAuthStore((store) => store.onUpdateProfile);
    const ids: unknown = state?.ids;
    const selected = items.filter(({ id, price }) => price !== null && (!Array.isArray(ids) || ids.includes(id)));

    // 주문자 ("주문자 정보 입력" 팝업에서 입력 → 바로 적용 · 아이디(닉네임)는 쓰지 않음)
    const [buyer, setBuyer] = useState<OrderBuyer>({ name: "", phone: "" });
    const [orderOpen, setOrderOpen] = useState(false);

    // 배송지 (기본 배송지 · 없으면 "배송지 추가" → 받는 사람 · 연락처 · 주소 입력 팝업)
    const [guestAddresses, setGuestAddresses] = useState<Address[]>([]); // 비로그인 주문용 (저장 안 함)
    const addresses = [...(user?.addresses ?? []), ...guestAddresses];
    const [addressId, setAddressId] = useState("");
    const [editAddress, setEditAddress] = useState(false);
    const [addressOpen, setAddressOpen] = useState(false);
    const [memo, setMemo] = useState("");
    const [memoText, setMemoText] = useState("");

    // 결제
    const cards = user?.cards ?? [];
    const [method, setMethod] = useState<Method>("card");
    const [cardId, setCardId] = useState("");
    const [card, setCard] = useState({ issuer: cardIssuers[0], number: "", expiry: "", password: "", installment: installments[0] });
    const [receipt, setReceipt] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [showAllGifts, setShowAllGifts] = useState(false);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // 계정 정보가 늦게 들어와도 채움
    useEffect(() => {
        const base = user?.addresses?.find((item) => item.isDefault) ?? user?.addresses?.[0];
        // 이름은 기본 배송지의 받는 분 (계정 이름은 아이디라 쓰지 않음)
        // 계정 정보가 바뀌어도 이미 입력 · 선택한 값은 그대로 둠
        setBuyer((prev) => (prev.name || prev.phone ? prev : { name: base?.name ?? "", phone: digits(user?.phone || base?.phone || "") }));
        setAddressId((prev) => (user?.addresses?.some((item) => item.id === prev) ? prev : base?.id ?? prev));
        const baseCard = user?.cards?.find((item) => item.isDefault) ?? user?.cards?.[0];
        setCardId((prev) => (user?.cards?.some((item) => item.id === prev) ? prev : baseCard?.id ?? ""));
    }, [user]);

    const address = addresses.find((item) => item.id === addressId);
    const buyerValid = !!buyer.name.trim() && digits(buyer.phone).length >= 10;

    // 주문자 정보 입력 팝업 → 주문자 바로 적용 · 주소를 넣었으면 배송지도 추가 · 선택
    const applyOrderInfo = async (next: OrderBuyer, newAddress?: Address) => {
        setBuyer(next);
        if (newAddress) await saveAddress(newAddress);
        setOrderOpen(false);
    };

    // 배송지 추가 저장: 로그인이면 계정에 저장 (기본 배송지 처리) · 아니면 이번 주문에만
    const saveAddress = async (next: Address) => {
        if (user) {
            const base = user.addresses ?? [];
            const isDefault = !!next.isDefault || base.length === 0;
            await onUpdateProfile({ addresses: [...base.map((item) => (isDefault ? { ...item, isDefault: false } : item)), { ...next, isDefault }] });
        } else {
            setGuestAddresses((prev) => [...prev, next]);
        }
        setAddressId(next.id);
        setEditAddress(false);
        setAddressOpen(false);
    };
    const enteringCard = method === "card" && !cards.find((item) => item.id === cardId);

    const price = subtotal(selected);
    const shipping = price >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
    const total = price + shipping;
    const gifts = useMemo(() => (selected.length ? detailGifts : []), [selected.length]);

    if (!selected.length) return <section className="design-page design-empty pay-page">
        <h1 className="pay-page__title">결제하기</h1>
        <p className="pay-page__empty">선택한 주문 상품이 없습니다.</p>
        <Link className="btn btn--primary" to="/cart">장바구니로 돌아가기</Link>
    </section>;

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        if (!buyerValid) return setError("주문자 정보를 정확히 입력해 주세요.");
        if (!address) return setError("배송지를 추가해 주세요.");
        if (enteringCard) {
            const number = digits(card.number);
            const [mm] = card.expiry.split("/");
            if (number.length < 15) return setError("카드 번호를 정확히 입력해 주세요.");
            if (card.expiry.length !== 5 || Number(mm) < 1 || Number(mm) > 12) return setError("유효기간을 MM/YY 형식으로 입력해 주세요.");
            if (card.password.length !== 2) return setError("비밀번호 앞 두 자리를 입력해 주세요.");
        }
        if (!agreed) return setError("구매 조건 확인 및 결제 진행에 동의해 주세요.");

        // 로그인 상태면 이번에 입력한 카드 · 배송지 · 연락처를 계정에 반영
        let last4 = cards.find((item) => item.id === cardId)?.last4;
        if (user) {
            const changes: Parameters<typeof onUpdateProfile>[0] = {};
            if (enteringCard) {
                const number = digits(card.number);
                last4 = number.slice(-4);
                const saved: PaymentCard = {
                    id: "card-" + Date.now(),
                    brand: cardBrand(number),
                    last4,
                    issuer: card.issuer,
                    expiry: card.expiry,
                    installment: card.installment,
                    isDefault: cards.length === 0,
                };
                changes.cards = [...cards, saved];
            }
            if (!user.phone && buyer.phone) changes.phone = buyer.phone; // 계정에 연락처가 없으면 채움
            if (Object.keys(changes).length) {
                setSaving(true);
                try {
                    await onUpdateProfile(changes);
                } catch {
                    setSaving(false);
                    return setError("결제 정보를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
                }
            }
        }
        navigate("/checkout/complete", {
            replace: true,
            state: { previewNumber: "TEST-" + Date.now(), method, last4 },
        });
    };

    return <div className="design-page pay-page">
        <h1 className="pay-page__title">결제하기</h1>
        <form className="pay" onSubmit={submit} noValidate>
            {/* 왼쪽: 한 박스 안에 구역을 선으로 나눔 */}
            <div className="pay__main pay-panel">
                {/* 주문 상품 정보 */}
                <section className="pay-section">
                    <h2 className="pay-panel__title">주문 상품 정보</h2>
                    <ul className="pay-items">
                        {selected.map((item) => {
                            const product = getProductById(item.id);
                            const spec = itemSpec(item);
                            return <li className="pay-item" key={item.id}>
                                <Link className="pay-item__image" to={`/products/${item.category}/${item.id}`}>
                                    <img src={item.image} alt="" />
                                </Link>
                                <div className="pay-item__info">
                                    <h3>{item.title}</h3>
                                    {product?.summary && <p className="pay-item__summary">{product.summary}</p>}
                                    <strong className="pay-item__price">
                                        {won((item.price ?? 0) * item.count)}
                                        {item.count > 1 && <small> ({item.count}개)</small>}
                                    </strong>
                                    {spec && <>
                                        <p className="pay-item__label">사양</p>
                                        <p className="pay-item__spec">{spec}</p>
                                    </>}
                                </div>
                            </li>;
                        })}
                    </ul>
                </section>

                {/* 주문자 정보: 이름 · 연락처 · 이메일을 한 줄씩 (라벨 | 값) · 오른쪽 위 입력 버튼 → 팝업 */}
                <section className="pay-section">
                    <div className="pay-panel__head">
                        <h2 className="pay-panel__title">주문자 정보</h2>
                        {buyerValid && <button type="button" className="pay-edit" onClick={() => setOrderOpen(true)}>수정</button>}
                    </div>
                    {/* 실명 · 연락처가 다 있으면 보기 · 없으면 입력 버튼만 크게 */}
                    {buyerValid ? <ul className="pay-rows">
                        <li><span>이름</span><b>{buyer.name}</b></li>
                        <li><span>연락처</span><b>{formatPhone(buyer.phone)}</b></li>
                    </ul> : <button type="button" className="pay-empty-btn" onClick={() => setOrderOpen(true)}>
                        <img src="/icons/ui/plus.svg" alt="" aria-hidden="true" />
                        주문자 정보 입력
                        <small>실명 · 연락처 · 배송지를 입력해 주세요.</small>
                    </button>}
                </section>

                {/* 배송 정보 · 배송 메모 */}
                <section className="pay-section">
                    <div className="pay-panel__head">
                        <h2 className="pay-panel__title">배송 정보</h2>
                        {address && <button type="button" className="pay-edit" onClick={() => setEditAddress(!editAddress)}>{editAddress ? "취소" : "변경"}</button>}
                    </div>
                    {/* 변경: 다른 배송지 고르기 · 맨 아래 "+ 배송지 추가" */}
                    {address && editAddress && <div className="pay-dropdown pay-address-select">
                        <Dropdown label="배송지 선택" value={addressLabel(address)} options={[...addresses.map(addressLabel), ADD_ADDRESS]}
                            onChange={(label) => {
                                if (label === ADD_ADDRESS) return setAddressOpen(true);
                                setAddressId(addresses.find((item) => addressLabel(item) === label)?.id ?? addressId);
                                setEditAddress(false);
                            }} />
                    </div>}
                    {address ? <ul className="pay-rows">
                        <li><span>받는 분</span><b>{address.name}</b></li>
                        <li><span>연락처</span><b>{formatPhone(address.phone)}</b></li>
                        <li><span>주소</span><b>{addressLines(address.address).join(" ")}</b></li>
                    </ul> : <p className="pay-info__empty">등록된 배송지가 없습니다. 주문자 정보 입력에서 배송지를 함께 입력해 주세요.</p>}

                    <h3 className="pay-panel__subtitle">배송 메모</h3>
                    <div className="pay-dropdown pay-dropdown--filled">
                        <Dropdown label="배송 메모" value={memo} placeholder="배송메모를 선택해 주세요." options={[...memoOptions, DIRECT]} onChange={setMemo} />
                    </div>
                    {memo === DIRECT && <input className="pay-input pay-memo-text" placeholder="배송 메모를 입력해 주세요 (50자 이내)" maxLength={50}
                        value={memoText} onChange={(event) => setMemoText(event.target.value)} />}
                </section>

                {/* 사은품 */}
                {gifts.length > 0 && <section className="pay-section">
                    <h2 className="pay-panel__title">사은품</h2>
                    <p className="pay-panel__desc">이 제품 구매시 함께 제공되는 제품(들)</p>
                    <ul className="pay-gifts">
                        {(showAllGifts ? gifts : gifts.slice(0, GIFTS_VISIBLE)).map((gift) => <li key={gift.title}>
                            <span className="pay-gifts__image">{gift.image ? <img src={gift.image} alt="" /> : <span>사은품</span>}</span>
                            <div>
                                <strong>{gift.title}</strong>
                                <p>{gift.desc}</p>
                                <b>{gift.price}</b>
                            </div>
                        </li>)}
                    </ul>
                    {gifts.length > GIFTS_VISIBLE && <button type="button" className="pay-more" onClick={() => setShowAllGifts(!showAllGifts)}>
                        {showAllGifts ? "접기" : "더보기"}
                    </button>}
                </section>}
            </div>

            <div className="pay__side">
                {/* 최종 결제금액 */}
                <section className="pay-panel">
                    <h2 className="pay-panel__title">최종 결제금액</h2>
                    <ul className="pay-total">
                        <li><span>상품 가격</span><b>{won(price)}</b></li>
                        <li><span>쿠폰 할인</span><b>-0 원</b></li>
                        <li><span>포인트 사용</span><b>-0 원</b></li>
                        <li><span>배송비</span><b>+{won(shipping)}</b></li>
                    </ul>
                    <p className="pay-total__sum"><span>총 결제 금액</span><strong>{won(total)}</strong></p>
                </section>

                {/* 결제 방법 */}
                <section className="pay-panel">
                    <h2 className="pay-panel__title">결제 방법</h2>
                    <div className="pay-methods" role="radiogroup" aria-label="결제 방법">
                        {methods.map(({ id, label }) => <label className="pay-radio" key={id}>
                            <input type="radio" name="payment" checked={method === id} onChange={() => setMethod(id)} />
                            <span>{label}</span>
                        </label>)}
                    </div>

                    {method === "card" ? <div className="pay-cardform">
                        {cards.length > 0 && <div className="pay-dropdown">
                            <Dropdown label="결제 카드" options={[...cards.map(cardLabel), NEW_CARD]}
                                value={cards.find((item) => item.id === cardId) ? cardLabel(cards.find((item) => item.id === cardId)!) : NEW_CARD}
                                onChange={(label) => setCardId(cards.find((item) => cardLabel(item) === label)?.id ?? "")} />
                        </div>}
                        {enteringCard && <>
                            <div className="pay-cardform__row">
                                <div className="pay-dropdown">
                                    <Dropdown label="카드사" value={card.issuer} options={cardIssuers} onChange={(issuer) => setCard({ ...card, issuer })} />
                                </div>
                                <input className="pay-input" placeholder="카드 번호 입력" inputMode="numeric" autoComplete="cc-number" aria-label="카드 번호"
                                    value={card.number} onChange={(event) => setCard({ ...card, number: formatCardNumber(event.target.value) })} />
                            </div>
                            <div className="pay-cardform__row pay-cardform__row--half">
                                <input className="pay-input" placeholder="유효기간 (MM/YY)" inputMode="numeric" autoComplete="cc-exp" aria-label="유효기간"
                                    value={card.expiry} onChange={(event) => setCard({ ...card, expiry: formatExpiry(event.target.value) })} />
                                <input className="pay-input" placeholder="비밀번호 앞 2자리" type="password" inputMode="numeric" autoComplete="off" aria-label="비밀번호 앞 두 자리"
                                    value={card.password} onChange={(event) => setCard({ ...card, password: digits(event.target.value).slice(0, 2) })} />
                            </div>
                            <div className="pay-dropdown">
                                <Dropdown label="할부" value={card.installment} options={installments} onChange={(installment) => setCard({ ...card, installment })} />
                            </div>
                            <p className="pay-note">{user ? "결제하면 이 카드가 계정에 등록됩니다. 카드 번호는 끝 4자리만 저장돼요." : "카드 정보는 저장되지 않습니다."}</p>
                        </>}
                    </div> : <p className="pay-note pay-note--line">결제하기를 누르면 {methods.find(({ id }) => id === method)?.label.replace("로 결제하기", "")} 결제 창으로 이동합니다.</p>}

                    <label className="pay-check pay-check--receipt">
                        <input type="checkbox" checked={receipt} onChange={(event) => setReceipt(event.target.checked)} />
                        <span>현금영수증 신청</span>
                    </label>
                </section>

                {/* 동의 · 결제하기 */}
                <div className="pay-agree">
                    <label className="pay-check">
                        <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
                        <span>전체동의</span>
                    </label>
                    <label className="pay-check">
                        <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
                        <span>구매 조건 확인 및 결제 진행에 동의</span>
                    </label>
                </div>
                {error && <p className="pay-error" role="alert">{error}</p>}
                <button type="submit" className="pay-submit" disabled={saving}>{saving ? "처리 중…" : `${won(total).replace(" 원", "원")} 결제하기`}</button>
            </div>
        </form>
        {addressOpen && <AddressModal onClose={() => setAddressOpen(false)} onSave={saveAddress} />}
        {orderOpen && <OrderInfoModal initial={buyer} needAddress={!address} canSaveAddress={!!user}
            onClose={() => setOrderOpen(false)} onSave={applyOrderInfo} />}
    </div>;
}
