
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { money, subtotal } from "../data/checkoutData";
import { PageHeading } from "./info/PageLayout";

const FREE_SHIPPING = 139900;
const SHIPPING_FEE = 13200;

export function Cart() {
    const { items, removeItem, updateCount } = useCartStore();
    const [excluded, setExcluded] = useState<number[]>([]);
    const [showSummary, setShowSummary] = useState(true);
    const summaryId = useId();
    const selection = items.filter(({ id, price }) => price !== null && !excluded.includes(id));
    const available = items.filter(({ price }) => price !== null);
    const amount = subtotal(selection);
    // 결제하기와 같은 계산: 할인 전 금액 · 할인 · 배송비 (139,900원 이상 무료)
    const original = selection.reduce((sum, item) => sum + Math.max(item.originalPrice ?? 0, item.price ?? 0) * item.count, 0);
    const discount = original - amount;
    const shipping = !selection.length || amount >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
    const total = amount + shipping;
    const count = selection.reduce((sum, item) => sum + item.count, 0);

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
                {/* 이미지 · 상품명 · 금액(수량만큼) · 수량 (상세 정보 표시 자리) */}
                <div className="design-checkout__product">
                    <img src={item.image} alt="" />
                    <div>
                        <Link to={"/products/" + item.category + "/" + item.id}>{item.title}</Link>
                        <strong className="design-cart__price">{item.price === null ? "가격 미정" : money(item.price * item.count)}</strong>
                        <div className="design-cart__quantity">
                            <button type="button" aria-label={item.title + " 수량 줄이기"} disabled={item.count <= 1} onClick={() => updateCount(item.id, item.count - 1)}>−</button>
                            <span aria-live="polite">{item.count}</span>
                            <button type="button" aria-label={item.title + " 수량 늘리기"} disabled={item.count >= 99} onClick={() => updateCount(item.id, item.count + 1)}>+</button>
                        </div>
                    </div>
                </div>
                <div className="design-cart__end">
                    <button type="button" aria-label={item.title + " 삭제"} onClick={() => removeItem(item.id)}><img src="/icons/ui/close.svg" alt="" /></button>
                </div>
            </div>)}
        </section>
        <aside className="design-stack design-cart__checkout">
            <button type="button" className="design-cart__summary-toggle" aria-expanded={showSummary}
                aria-controls={summaryId} onClick={() => setShowSummary((expanded) => !expanded)}>
                <img src="/icons/chevron-down.svg" alt="" />
                <span className="design-visually-hidden">주문 금액 상세</span>
            </button>
            {/* 주문 금액: 결제하기 "최종 결제금액"과 같은 모양 */}
            <div id={summaryId} className="design-cart__summary-details" data-expanded={showSummary}>
                <section className="pay-panel design-cart__summary">
                    <h2 className="pay-panel__title">주문 금액</h2>
                    <ul className="pay-total">
                        <li><span>상품 금액</span><b>{money(original)}</b></li>
                        {discount > 0 && <li><span>할인 금액</span><b>-{money(discount)}</b></li>}
                        <li><span>배송비</span><b>{shipping ? "+" + money(shipping) : "무료배송"}</b></li>
                    </ul>
                    <p className="pay-total__sum"><span>총 주문 금액</span><strong>{money(total)}</strong></p>
                </section>
            </div>
            <p className="design-cart__mobile-total"><strong>총 주문 금액</strong><strong>{money(total)}</strong></p>
            {/* 주문하기: 결제하기 버튼과 같은 모양 · 할인 전 금액 줄 긋기 · 금액 · 개수 (체크한 상품만) */}
            {selection.length ? <Link className="pay-submit design-cart__submit" to="/checkout" state={{ ids: selection.map(({ id }) => id) }}>
                {discount > 0 && <s>{money(original + shipping)}</s>}
                {money(total)} 주문하기 ({count}개)
            </Link> : <button type="button" className="pay-submit design-cart__submit" disabled>주문할 상품을 선택해 주세요</button>}
        </aside>
    </div>;
}
