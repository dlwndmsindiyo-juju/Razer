import { Link } from "react-router-dom";
import { getProductById } from "../../data/productData";
import { formatPrice } from "../../data/searchData";
import { proPicks, proPicksMoreLink, type ProPick } from "../../data/homeData";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { ImageOrText } from "../common/ImageOrText";
import { PlayerPhoto } from "./PlayerPhoto";

// 프로게이머 PICK (왼쪽 큰 카드 1 + 오른쪽 카드 2)
export const HomeProPick = () => {
    const [featured, ...others] = proPicks;

    return (
        <section className="home-section home-pick">
            <HomeSectionHeader title="프로게이머 PICK" to={proPicksMoreLink} moreLabel="Team Razer 보기" />

            <div className="home-pick__grid">
                {featured && <PickCard pick={featured} isLarge />}
                {others.map((pick) => (
                    <PickCard key={pick.player} pick={pick} />
                ))}
            </div>
        </section>
    );
};

const PickCard = ({ pick, isLarge = false }: { pick: ProPick; isLarge?: boolean }) => {
    // 가격 · 상품 이미지 · 상세 주소는 productData 기준
    const product = getProductById(pick.productId);
    const price = product ? formatPrice(product) : "";
    const to = product ? `/products/${product.category}/${product.id}` : "/";

    // 상품 이미지 (누르면 상세로)
    const productImage = (
        <Link to={to} className="home-pick__product-img" aria-label={`${pick.productName} 상세 보기`}>
            <ImageOrText src={product?.image} alt={pick.productName} label="Product Image" />
        </Link>
    );

    return (
        <article className={`home-pick__card ${isLarge ? "is-large" : ""}`}>
            {/* 선수 사진 */}
            <div className="home-pick__player">
                <PlayerPhoto src={pick.playerImage} alt={pick.player} />
                {isLarge && (
                    <div className="home-pick__player-text">
                        <strong className="home-pick__name">{pick.player}</strong>
                        <span className="home-pick__game">{pick.game}</span>
                    </div>
                )}
            </div>

            {/* 선수 · 상품 정보 */}
            <div className="home-pick__info">
                {!isLarge && (
                    <>
                        <strong className="home-pick__name">{pick.player}</strong>
                        <span className="home-pick__game">{pick.game}</span>
                    </>
                )}
                {isLarge && productImage}
                <strong className="home-pick__product">{pick.productName}</strong>
                <span className="home-pick__variant">{pick.variant}</span>
                <span className="home-pick__price">{price}</span>
                <Link to={to} className="home-pick__btn">
                    제품 자세히 보기
                </Link>
            </div>

            {/* 상품 이미지 (오른쪽 작은 카드) */}
            {!isLarge && productImage}
        </article>
    );
};
