import { Link, useNavigate } from "react-router-dom";
import { SafeImage } from "../../components/common/SafeImage";
import { getProductById } from "../../data/productData";
import type { AwardBadge, Feature } from "../../data/esportsCollectionData";
import { useCartStore } from "../../store/useCartStore";

// e스포츠 컬렉션 페이지 (Esports Green · NiKo) 공용 조각

export const productPath = (id: number) => {
    const product = getProductById(id);
    return product ? "/products/" + product.category + "/" + product.id : "/";
};

// ProSettings.net 순위 배지 + 출처
export function AwardSeal({ award }: { award: AwardBadge }) {
    return <div className="collection-award">
        <SafeImage className="collection-award__seal" src={award.image} alt={award.label} fallback={award.label} loading="lazy" />
        <p className="collection-award__source">{award.source}</p>
    </div>;
}

// 구입: 장바구니에 담고 장바구니로 이동
export function BuyButton({ productId, label = "구입", className = "collection-buy" }: { productId: number; label?: string; className?: string }) {
    const addItem = useCartStore((state) => state.addItem);
    const navigate = useNavigate();
    const product = getProductById(productId);
    if (!product) return null;
    return <button type="button" className={className} onClick={() => { addItem(product); navigate("/cart"); }}>{label}</button>;
}

// 상품 칸: 이미지 · 이름 · (설명) · 자세한 정보 > · 구입
export function CollectionProduct({ productId, name, description }: { productId: number; name?: string; description?: string }) {
    const product = getProductById(productId);
    if (!product) return null;
    const title = name ?? product.title.replace(/\s*-\s*$/, ""); // 끝에 남은 " -" 정리
    return <div className="collection-product">
        <Link to={productPath(productId)} className="collection-product__image" tabIndex={-1} aria-hidden="true">
            <SafeImage src={product.image} fallback={title} loading="lazy" />
        </Link>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        <div className="collection-product__actions">
            <Link to={productPath(productId)}>자세한 정보 <span aria-hidden="true">›</span></Link>
            <BuyButton productId={productId} />
        </div>
    </div>;
}

// 기능 3칸 (원형 아이콘 · 제목 · 설명)
export function FeatureList({ features, note }: { features: Feature[]; note?: string }) {
    return <>
        <ul className="collection-features">
            {features.map((feature) => <li key={feature.title}>
                {/* 아이콘 모양만 가져와 프라이머리 색으로 칠함 */}
                <span className="collection-features__icon" aria-hidden="true"
                    style={{ maskImage: `url("${feature.icon}")`, WebkitMaskImage: `url("${feature.icon}")` }} />
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
            </li>)}
        </ul>
        {note && <p className="collection-note">{note}</p>}
    </>;
}
