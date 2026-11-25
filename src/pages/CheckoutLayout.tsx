import { Link } from "react-router-dom";
import type { CartItem } from "../types/product";
import { formatPrice } from "../data/searchData";
import { money } from "../data/checkoutData";

export function CheckoutItem({ item }: { item: CartItem }) {
    return <div className="design-checkout__product">
        <img src={item.image} alt="" />
        <div><Link to={"/products/" + item.category + "/" + item.id}>{item.title}</Link>
            <p>{formatPrice(item)}</p>
            {item.size && <details><summary>상세 정보 표시</summary><p>{item.size}</p></details>}
        </div>
    </div>;
}

export function CheckoutSummary({ amount, title }: { amount: number; title: string }) {
    return <section className="design-panel design-checkout__summary">
        <h2>{title}</h2>
        <dl>
            <div><dt>선택 상품 금액</dt><dd>{money(amount)}</dd></div>
            <div><dt>배송비</dt><dd>{amount >= 139900 ? "무료" : "주문 시 확인"}</dd></div>
            <div><dt>상품 합계</dt><dd>{money(amount)}</dd></div>
        </dl>
    </section>;
}
