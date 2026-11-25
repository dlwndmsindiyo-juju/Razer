import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { Collapse } from "../components/common/Collapse";
import type { CartItem } from "../types/product";
import { formatPrice } from "../data/searchData";
import { money } from "../data/checkoutData";

export function CheckoutItem({ item }: { item: CartItem }) {
    return <div className="design-checkout__product">
        <img src={item.image} alt="" />
        <div><Link to={"/products/" + item.category + "/" + item.id}>{item.title}</Link>
            <p>{formatPrice(item)}</p>
            {item.size && <ItemDetail text={item.size} />}
        </div>
    </div>;
}

// 상세 정보 표시 (누르면 아래로 스르륵)
function ItemDetail({ text }: { text: string }) {
    const [open, setOpen] = useState(false);
    const id = useId();
    return <div className={"design-checkout__detail" + (open ? " is-open" : "")}>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
            {open ? "상세 정보 숨기기" : "상세 정보 표시"}
        </button>
        <Collapse open={open} id={id}><p>{text}</p></Collapse>
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
