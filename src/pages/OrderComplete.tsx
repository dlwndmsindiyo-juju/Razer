import { Link, useLocation } from "react-router-dom";
import { figmaImage } from "../data/figmaPageAssets";
import { getProductsByCollection } from "../data/productData";
import { PageHeading, ProductRail } from "./info/PageLayout";

const recommendations = getProductsByCollection("new").slice(0, 8);

export function OrderComplete() {
    const { state } = useLocation();
    const orderNumber = typeof state?.previewNumber === "string" ? state.previewNumber : undefined;
    return <div className="design-page design-container">
        <section className="design-order-complete">
            <img src={figmaImage("1404:27645", "MaskGroup")} alt="" />
            <PageHeading title={orderNumber ? "테스트 주문이 완료되었습니다" : "주문 완료"} />
            {orderNumber ? <p>테스트 주문 번호는 <strong>{orderNumber}</strong>입니다.</p> :
                <p>확인할 수 있는 주문 정보가 없습니다. <Link to="/mypage?tab=orders">주문 내역 보기</Link></p>}
        </section>
        <section className="design-stack">
            <h2>추천 상품</h2><ProductRail products={recommendations} title="추천 상품" />
        </section>
    </div>;
}
