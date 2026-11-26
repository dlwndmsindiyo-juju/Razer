
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { CheckoutItem, CheckoutSummary } from "./CheckoutLayout";
import { money, subtotal } from "../data/checkoutData";
import { PageHeading } from "./info/PageLayout";

export function Cart() {
    const { items, removeItem, updateCount } = useCartStore();
    const [excluded, setExcluded] = useState<number[]>([]);
    const [showSummary, setShowSummary] = useState(true);
    const summaryId = useId();
    const selection = items.filter(({ id, price }) => price !== null && !excluded.includes(id));
    const available = items.filter(({ price }) => price !== null);
    const amount = subtotal(selection);

    if (!items.length) return <section className="design-page design-container design-empty">
        <PageHeading title="장바구니" description="장바구니에 담긴 상품이 없습니다." />
        <Link to="/search" className="btn btn--primary">제품 둘러보기</Link>
    </section>;

    return <div className="design-page design-container design-checkout">
        <section className="design-panel design-cart">
            <h1 className="design-visually-hidden">장바구니</h1>
            <label><input type="checkbox" checked={available.length > 0 && selection.length === available.length}
                disabled={!available.length} onChange={(event) => setExcluded(event.target.checked ? [] : items.map(({ id }) => id))} /> 전체선택</label>
            {items.map((item) => <div className="design-cart__row" key={item.id}>
                <input type="checkbox" aria-label={item.title + " 선택"} disabled={item.price === null}
                    checked={item.price !== null && !excluded.includes(item.id)}
                    onChange={(event) => setExcluded((previous) => event.target.checked ? previous.filter((id) => id !== item.id) : [...previous, item.id])} />
                <div><CheckoutItem item={item} /><div className="design-cart__quantity">
                    <button type="button" aria-label={item.title + " 수량 줄이기"} disabled={item.count <= 1} onClick={() => updateCount(item.id, item.count - 1)}>−</button>
                    <span>{item.count}</span>
                    <button type="button" aria-label={item.title + " 수량 늘리기"} disabled={item.count >= 99} onClick={() => updateCount(item.id, item.count + 1)}>+</button>
                </div></div>
                <div className="design-cart__end">
                    <button type="button" aria-label={item.title + " 삭제"} onClick={() => removeItem(item.id)}>×</button>
                    <strong>{item.price === null ? "가격 미정" : money(item.price * item.count)}</strong>
                </div>
            </div>)}
            <p className="design-cart__total"><strong>총 결제 금액</strong><strong>{money(amount)}</strong></p>
        </section>
        <aside className="design-stack design-cart__checkout">
            <button type="button" className="design-cart__summary-toggle" aria-expanded={showSummary}
                aria-controls={summaryId} onClick={() => setShowSummary((expanded) => !expanded)}>
                <img src="/icons/chevron-down.svg" alt="" />
                <span className="design-visually-hidden">주문 금액 상세</span>
            </button>
            <div id={summaryId} className="design-cart__summary-details" data-expanded={showSummary}>
                <CheckoutSummary amount={amount} title="주문 금액" />
            </div>
            <p className="design-cart__mobile-total"><strong>총 주문 금액</strong><strong>{money(amount)}</strong></p>
            {selection.length ? <Link className="btn btn--primary" to="/checkout" state={{ ids: selection.map(({ id }) => id) }}>주문하기</Link> :
                <button className="btn btn--primary" disabled>주문하기</button>}
        </aside>
    </div>;
}
