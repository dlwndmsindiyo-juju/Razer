
// 신상품 · 가장 많이 사용하는 제품 섹션에서 공통으로 쓰는 상품 카드 (레이아웃용)
// TODO: productData 확정 후 Product 타입을 props로 받아 연결
export const ProductCard = () => {
    return (
        <article className="product-card">
            <div className="product-card__thumb">
                <img src="/images/home/product-keyboard.png" alt="" />
                <button type="button" className="product-card__heart" aria-label="찜하기">♡</button>
            </div>

            <div className="product-card__info">
                {/* 컬러 옵션 */}
                <ul className="product-card__colors">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <li key={i} className="product-card__color" />
                    ))}
                </ul>

                <strong className="product-card__title">Section Title</strong>
                <p className="product-card__desc">Description</p>

                <div className="product-card__price">
                    <strong className="product-card__price-now">₩ Product Price</strong>
                    <del className="product-card__price-original">Original Price</del>
                </div>
            </div>
        </article>
    );
};
