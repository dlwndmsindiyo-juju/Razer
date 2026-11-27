import { useState } from "react";
import { Link } from "react-router-dom";
import { collabs, getCollabPath } from "../../data/collabData";
import { membershipCopy as copy } from "../../data/editorialData";
import { buyingGuideImages, exclusiveImages, membershipImages } from "../../data/pageImages";
import { getProductsByCollection } from "../../data/productData";
import type { ProductCategory } from "../../types/product";
import { CatalogCard, PageHeading, PageHero, ProductRail } from "./PageLayout";

const programs = [
    ["파트너 및 제휴사", "Razer 제휴 프로그램은 내 웹사이트에 배너 또는 링크를 배치하여 팔로워에게 Razer.com에서의 쇼핑을 추천하고 커미션을 받을 수 있는 기회입니다.\n방문자가 구매를 완료하면 Razer 제품 판매 금액의 최대 10%를 커미션으로 획득할 수 있습니다.", buyingGuideImages.affiliate],
    ["교육 프로그램", "Razer 교육 프로그램은 학생들에게 고성능 게이밍 주변기기 및 Razer Blade 게이밍 노트북에 대한 독점 혜택을 제공합니다.\n작업할 때도 게임 플레이를 즐길 때도 최대 15% 할인된 Razer 장비로 최대의 잠재력을 발휘하세요.", buyingGuideImages.education],
    ["협력사 지원 프로그램", "당사는 비전을 공유하고 당사가 하는 일을 믿어주시는, 같은 마음을 가진 파트너 분들을 소중하게 생각하기에 파트너 분들을 지원하는 데 주력하고 있습니다.\nRazer 협력사 스토어만을 위한 전용 혜택으로 가입하여 더 많은 것을 누려보세요.", buyingGuideImages.partner],
];

export function BuyingGuidePage() {
    return <div className="design-page design-buying">
        <PageHeading title="RAZER 프로그램 및 혜택" description="Razer.com에서 현재 진행 중인 프로그램으로 어떤 혜택을 받을 수 있는지 확인하세요." />
        <div className="design-container design-container--narrow design-stack">
            {programs.map(([title, text, image], index) => <div key={title}>
                <div className="design-buying__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
                <div className="design-panel design-buying__program">
                    <img src={image} alt="" loading="lazy" />
                    <div><h2>{title}</h2>{text.split("\n").map((line) => <p key={line}>{line}</p>)}</div>
                </div>
            </div>)}
        </div>
    </div>;
}

const hardware: [ProductCategory, string][] = [["mice", "마우스"], ["mousepads", "마우스 패드"], ["keyboards", "키보드"], ["controllers", "컨트롤러"]];
const exclusiveProducts = getProductsByCollection("exclusive");
const carbonProducts = exclusiveProducts.filter(({ title }) => /^Razer (Viper V4 Pro|DeathAdder V4 Pro) - Carbon Fiber Edition$/i.test(title));
const otherExclusiveProducts = exclusiveProducts.filter(({ title }) => /^Razer (Viper V4 Pro - Esports Green Edition|Raiju V3 Pro Signature Edition)$/i.test(title));
const featuredGroups = [
    { title: "RAZER 카본 파이버 컬렉션", products: carbonProducts },
    { title: "Razer 독점 템", products: otherExclusiveProducts },
];
const featuredCollabCards = [
    ["honkai", exclusiveImages.collabs.honkai, "RAZER | HONKAI : STAR RAIL | CTRL + ALT + WIN", "모든 전투가 하나의 게임에 불과한 은하계에서, 무적 모드로 플레이하는 게이머는 오직 단 한 명뿐입니다."],
    ["evangelion", exclusiveImages.collabs.evangelion, "RAZER | EVANGELION (EVA-01) | EVA-01의 힘을 깨우다", "새로운 Razer | EVANGELION(EVA-01) 컬렉션으로 EVA-01을 손에 넣으세요."],
    ["pompompurin", exclusiveImages.collabs.pompompurin, "RAZER | POMPOMPURIN™ | 푸딩이 선사하는 즐거운 플레이", "명랑하고 장난기 넘치며 거부할 수 없이 귀여운 Razer | 폼폼푸린 컬렉션으로 골든 리트리버의 활기찬 에너지를 책상 위에서 만나보세요."],
    ["wuthering", exclusiveImages.collabs.wuthering, "RAZER | WUTHERING WAVES | 손 안에서 울리는 공명", "애니메이션에서 영감을 받은 게이밍 주변기기 Razer | 명조: 워더링 웨이브 컬렉션으로 여러분의 길을 밝히세요."],
    ["blackpink", exclusiveImages.collabs.blackpink, "RAZER X BLACKPINK | 플레이를 핑크로 물들이세요", "시선을 사로잡는 BLACKPINK x Razer 컬렉션과 함께 스포트라이트의 중심에 서보세요."],
];

export function ExclusivesPage() {
    const [category, setCategory] = useState<ProductCategory>("mice");
    const hardwareProducts = exclusiveProducts.filter((item) => item.category === category || item.categories?.includes(category));
    return <div className="design-page design-exclusive">
        <PageHero src={exclusiveImages.hero} mobileSrc={exclusiveImages.heroMobile} />
        <div className="design-container">
            <PageHeading title="Razer 독점" description="공식 온라인 스토어에서만 구매할 수 있는 고유한 제품을 알아보세요" />
            <div className="design-grid design-grid--two design-exclusive__featured">
                {featuredGroups.map(({ title, products }) =>
                    <section key={title} className="design-stack">
                        <div className="design-exclusive__label"><p>프로를 위한</p><h2>{title}</h2></div>
                        <div className="design-grid design-grid--two design-product-pair">{products.map((product) =>
                            <CatalogCard key={product.id} product={product} featured />)}</div>
                    </section>)}
            </div>
            <PageHeading title="PC 관련 기기" description="공식 온라인 스토어에서만 구매할 수 있는 PC 관련 기기들을 알아보세요" as="h2" />
            <div className="design-tabs" aria-label="PC 관련 기기">
                {hardware.map(([key, label]) => <button type="button" key={key} onClick={() => setCategory(key)} aria-pressed={category === key}>{label}</button>)}
            </div>
            <ProductRail key={category} title="PC 관련 기기" products={hardwareProducts.slice(0, 8)} />
            <PageHeading title="Razer 콜라보 제품" description="Razer와 콜라보한 제품들을 만나보세요" as="h2" />
            <div className="design-grid design-grid--two">
                {featuredCollabCards.map(([slug, image, title, description]) => {
                    const collab = collabs.find((item) => item.slug.includes(slug));
                    return <div key={slug} className="design-media-card">
                        <img src={image} alt="" loading="lazy" />
                        <h3>{title}</h3>
                        <p>{description}</p>
                        <Link className="design-explore" to={collab ? getCollabPath(collab.slug) : "/products/collab"}>
                            EXPLORE <img src={exclusiveImages.explore} alt="" />
                        </Link>
                    </div>;
                })}
            </div>
        </div>
    </div>;
}

const benefits = [[10, 11, membershipImages.benefitEarn], [12, 13, membershipImages.benefitRedeem], [21, 22, membershipImages.benefitEvents]] as const;
const earning = [
    [copy.slice(33, 35).join(" "), copy.slice(39, 41).join(" "), membershipImages.earnCortex],
    [copy.slice(35, 37).join(" "), copy.slice(41, 43).join(" "), membershipImages.earnInsider],
    [copy.slice(37, 39).join(" "), copy.slice(43, 45).join(" "), membershipImages.earnPartners],
];

export function MembershipPage() {
    const [reward, setReward] = useState(0);
    return <div className="design-page design-membership">
        <PageHero src={membershipImages.hero} />
        <div className="design-container">
            <PageHeading title={copy[0]} />
            <div className="design-grid design-grid--three design-member-benefits">
                {benefits.map(([title, body, icon]) => <div className="design-panel design-support" key={icon}>
                    <img src={icon} alt="" /><h2>{copy[title]}</h2><p>{copy[body]}</p>
                </div>)}
            </div>
            <section className="design-membership__signup">
                <div className="design-panel design-membership__coupon">
                    <span><img src={membershipImages.promoCoupon} alt="" /></span>
                    <div><p>{copy[23]}</p><h2>{copy[24]}</h2><p>{copy[25]}</p></div>
                </div>
                <ul>{copy.slice(14, 17).map((line, index) => <li key={line}>
                    <img src={[membershipImages.promoEmail, membershipImages.cart, membershipImages.info][index]} alt="" />
                    {line}
                </li>)}</ul>
                <Link className="btn btn--primary" to="/signup">멤버십 가입하기</Link>
                <p>{copy[26]}</p>
            </section>
            <div className="design-grid design-grid--three design-membership__rewards">
                <div className="design-panel design-membership__reward">
                    <img src={membershipImages.cyberWeekend} alt="" loading="lazy" />
                    <h2>{copy[2]}</h2><p>{copy.slice(4, 6).join(" ")}</p>
                    <div><Link className="btn btn--primary" to="/signup">멤버십 가입하기</Link></div>
                </div>
                <div className="design-panel design-membership__reward">
                    <img src={membershipImages.rewardsEcosystem} alt="" loading="lazy" />
                    <h2>{copy[3]}</h2><p>{copy.slice(6, 8).join(" ")}</p>
                    <small>{copy.slice(8, 10).join(" ")}</small>
                    {/* Razer.com · RAZER GOLD (시안 · 결제 수단 안내는 구매 방법) */}
                    <div>
                        <Link className="btn btn--primary" to="/search">Razer.com</Link>
                        <Link className="btn" to="/info/product/how-to-buy">RAZER GOLD</Link>
                    </div>
                </div>
                <div className="design-panel design-membership__reward">
                    <img src={membershipImages.rewardsRedemption} alt="" loading="lazy" />
                    <h2>{copy[27 + reward]}</h2><p aria-live="polite">{copy[29 + reward]}</p>
                    <div className="design-membership__reward-pages" aria-label="리워드 유형">
                        <img src={reward === 0 ? membershipImages.rewardFirst : membershipImages.rewardSecond} alt="" />
                        {[0, 1].map((index) => <button type="button" key={index} aria-label={copy[31 + index]}
                            aria-pressed={reward === index} onClick={() => setReward(index)} />)}
                    </div>
                    <div><Link className="btn btn--primary" to="/info/product/razer-exclusives">리워드 살펴보기</Link></div>
                </div>
            </div>
            <PageHeading title={copy[1]} as="h2" />
            <div className="design-grid design-grid--three design-membership__earning">
                {earning.map(([title, description, image]) => <div key={image}>
                    <img src={image} alt="" loading="lazy" />
                    <h3>{title}</h3><p>{description}</p>
                </div>)}
            </div>
        </div>
    </div>;
}
