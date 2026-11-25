
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Modal } from "../components/common/Modal";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { CheckoutItem, CheckoutSummary } from "./CheckoutLayout";
import { subtotal } from "../data/checkoutData";
import { PageHeading } from "./info/PageLayout";

const methods = ["Apple Pay", "Google Pay", "신용카드", "PayPal"];

export function Payment() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const items = useCartStore((store) => store.items);
    const user = useAuthStore((store) => store.user);
    const [method, setMethod] = useState(methods[2]);
    const [cardOpen, setCardOpen] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const ids: unknown = state?.ids;
    const selected = items.filter(({ id, price }) => price !== null && (!Array.isArray(ids) || ids.includes(id)));

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (!agreed || !selected.length) return;
        navigate("/checkout/complete", { replace: true, state: { previewNumber: "TEST-" + Date.now() } });
    };

    if (!selected.length) return <section className="design-page design-empty">
        <PageHeading title="결제하기" description="선택한 주문 상품이 없습니다." />
        <Link className="btn btn--primary" to="/cart">장바구니로 돌아가기</Link>
    </section>;

    return <div className="design-page design-container">
        <PageHeading title="결제하기" />
        <form className="design-checkout design-checkout--payment" onSubmit={submit}>
            <div className="design-stack">
                <section className="design-panel design-stack">
                    <h2>주문 상품 정보</h2>
                    {selected.map((item) => <CheckoutItem key={item.id} item={item} />)}
                </section>
                <section className="design-panel design-stack">
                    <h2>주문자 정보</h2>
                    <label>이름<input required autoComplete="name" /></label>
                    <label>연락처<input required type="tel" autoComplete="tel" /></label>
                    <label>이메일<input required type="email" autoComplete="email" defaultValue={user?.email ?? ""} /></label>
                </section>
                <section className="design-panel design-stack">
                    <h2>배송 정보</h2>
                    <label>배송지<input required autoComplete="street-address" /></label>
                    <label>배송 메모<select defaultValue="">
                        <option value="">배송 메모를 선택해 주세요</option><option>문 앞에 놓아주세요</option><option>배송 전 연락해 주세요</option>
                    </select></label>
                </section>
            </div>
            <div className="design-stack">
                <CheckoutSummary amount={subtotal(selected)} title="최종 결제금액" />
                <fieldset className="design-panel design-stack">
                    <legend>결제 방법</legend>
                    <div className="design-grid design-grid--two">
                        {methods.map((name) => <label key={name}><input type="radio" name="payment" checked={method === name} onChange={() => setMethod(name)} /> {name}</label>)}
                    </div>
                    {method === methods[2] && <button type="button" className="btn" onClick={() => setCardOpen(true)}>결제 수단 등록</button>}
                    <p>테스트 화면입니다. 실제 결제나 카드 등록은 진행되지 않습니다.</p>
                </fieldset>
                <label><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} required /> 구매 조건 및 결제 진행 동의</label>
                <button type="submit" className="btn btn--primary" disabled={!agreed}>테스트 주문하기</button>
            </div>
        </form>
        {cardOpen && <Modal title="결제 수단 등록" size="card" onClose={() => setCardOpen(false)}
            subtitle="결제 수단으로 등록하실 카드 정보를 입력해주세요"
            actions={<button type="button" className="btn btn--primary" onClick={() => setCardOpen(false)}>등록</button>}>
            <div className="design-payment-preview">
                <div className="design-payment-preview__carousel" aria-hidden="true">
                    <span>‹</span><div><strong>＋ 다른 카드 등록하기</strong></div><span>›</span>
                </div>
                <div className="design-payment-preview__fields">
                    <p><small>카드번호</small>0000 0000 0000 0000</p>
                    <div><p><small>유효기간</small>MM/YY</p><p><small>비밀번호 앞 두자리</small>●●</p></div>
                    <p className="design-payment-preview__installment">일시불 <span aria-hidden="true">⌄</span></p>
                </div>
            </div>
        </Modal>}
    </div>;
}
