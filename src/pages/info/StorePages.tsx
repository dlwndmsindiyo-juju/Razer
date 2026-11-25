import { useState } from "react";
import { Link } from "react-router-dom";
import { collabs, getCollabPath } from "../../data/collabData";
import { membershipCopy as copy } from "../../data/editorialData";
import { figmaImage } from "../../data/figmaPageAssets";
import { getProductsByCategory, getProductsByCollection, productData } from "../../data/productData";
import type { ProductCategory } from "../../types/product";
import { CatalogCard, PageHeading, PageHero, ProductRail } from "./PageLayout";

const programFrame = "1404:28006";
const programs = [
    ["파트너 및 제휴사", "Razer 제휴 프로그램은 내 웹사이트에 배너 또는 링크를 배치하여 팔로워에게 Razer.com에서의 쇼핑을 추천하고 커미션을 받을 수 있는 기회입니다.\n방문자가 구매를 완료하면 Razer 제품 판매 금액의 최대 10%를 커미션으로 획득할 수 있습니다.", "https://www.razer.com/affiliate", "Rectangle208"],
    ["교육 프로그램", "Razer 교육 프로그램은 학생들에게 고성능 게이밍 주변기기 및 Razer Blade 게이밍 노트북에 대한 독점 혜택을 제공합니다.\n작업할 때도 게임 플레이를 즐길 때도 최대 15% 할인된 Razer 장비로 최대의 잠재력을 발휘하세요.", "https://www.razer.com/education", "Rectangle209"],
    ["협력사 지원 프로그램", "당사는 비전을 공유하고 당사가 하는 일을 믿어주시는, 같은 마음을 가진 파트너 분들을 소중하게 생각하기에 파트너 분들을 지원하는 데 주력하고 있습니다.\nRazer 협력사 스토어만을 위한 전용 혜택으로 가입하여 더 많은 것을 누려보세요.", "https://www.razer.com/business", "Rectangle210"],
];

export function BuyingGuidePage() {
    return <div className="design-page design-buying">
        <PageHeading title="RAZER 프로그램 및 혜택" description="Razer.com에서 현재 진행 중인 프로그램으로 어떤 혜택을 받을 수 있는지 확인하세요." />
        <div className="design-container design-container--narrow design-stack">
            {programs.map(([title, text, href, image], index) => <article key={title}>
                <div className="design-buying__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
                <div className="design-panel design-buying__program">
                    <img src={figmaImage(programFrame, image)} alt="" loading="lazy" />
                    <div><h2>{title}</h2><p>{text}</p><a href={href}>자세한 정보</a></div>
                </div>
            </article>)}
        </div>
    </div>;
}

const exclusiveFrame = "1404:27870";
const hardware: [ProductCategory, string][] = [["mice", "마우스"], ["mousepads", "마우스 패드"], ["keyboards", "키보드"], ["controllers", "컨트롤러"]];
const exclusiveProducts = getProductsByCollection("exclusive");
const carbonProducts = ["Viper V4 Pro", "DeathAdder V4 Pro"].flatMap((model) => {
    const product = productData.find(({ title }) => title.includes(model) && /carbon/i.test(title))
        ?? productData.find(({ title }) => title.includes(model));
    return product ? [product] : [];
});
const featuredCollabCards = [
    ["honkai", "Rectangle198", "RAZER | HONKAI : STAR RAIL | CTRL + ALT + WIN", "모든 전투가 하나의 게임에 불과한 은하계에서, 무적 모드로 플레이하는 게이머는 오직 단 한 명뿐입니다."],
    ["evangelion", "Rectangle201", "RAZER | EVANGELION (EVA-01) | EVA-01의 힘을 깨우다", "새로운 Razer | EVANGELION(EVA-01) 컬렉션으로 EVA-01을 손에 넣으세요."],
    ["pompompurin", "Rectangle199", "RAZER | POMPOMPURIN™ | 푸딩이 선사하는 즐거운 플레이", "명랑하고 장난기 넘치며 거부할 수 없이 귀여운 Razer | 폼폼푸린 컬렉션으로 골든 리트리버의 활기찬 에너지를 책상 위에서 만나보세요."],
    ["wuthering", "Rectangle202", "RAZER | WUTHERING WAVES | 손 안에서 울리는 공명", "애니메이션에서 영감을 받은 게이밍 주변기기 Razer | 명조: 워더링 웨이브 컬렉션으로 여러분의 길을 밝히세요."],
    ["blackpink", "Rectangle200", "RAZER X BLACKPINK | 플레이를 핑크로 물들이세요", "시선을 사로잡는 BLACKPINK x Razer 컬렉션과 함께 스포트라이트의 중심에 서보세요."],
];

export function ExclusivesPage() {
    const [category, setCategory] = useState<ProductCategory>("mice");
    const hardwareProducts = exclusiveProducts.filter((item) => item.category === category);
    return <div className="design-page design-exclusive">
        <PageHero src={figmaImage(exclusiveFrame, "Rectangle197")} mobileSrc="/images/figma-pages/exclusive-hero-mobile.png" />
        <div className="design-container">
            <PageHeading title="Razer 독점" description="공식 온라인 스토어에서만 구매할 수 있는 고유한 제품을 알아보세요" />
            <div className="design-grid design-grid--two design-exclusive__featured">
                {[["ONLY AT RAZER", "RAZER 카본 파이버 컬렉션", carbonProducts],
                    ["RAZER 독점", "Razer 독점 템", exclusiveProducts.filter((item) => !carbonProducts.includes(item)).slice(0, 2)]].map(([badge, title, products]) =>
                    <section key={String(title)} className="design-stack">
                        <div className="design-exclusive__label"><span className="design-pill">{String(badge)}</span><p>프로를 위한</p><h2>{String(title)}</h2></div>
                        <div className="design-grid design-grid--two design-product-pair">{typeof products !== "string" && products.map((product, index) =>
                            <CatalogCard key={product.id} product={product} featured title={products === carbonProducts ? ["Viper V4 Pro", "DeathAdder V4 Pro"][index] : "Category Title (카테고리 제목)"} />)}</div>
                    </section>)}
            </div>
            <PageHeading title="PC 관련 기기" description="공식 온라인 스토어에서만 구매할 수 있는 PC 관련 기기들을 알아보세요" as="h2" />
            <div className="design-tabs" aria-label="PC 관련 기기">
                {hardware.map(([key, label]) => <button type="button" key={key} onClick={() => setCategory(key)} aria-pressed={category === key}>{label}</button>)}
            </div>
            <ProductRail key={category} title="PC 관련 기기" products={(hardwareProducts.length ? hardwareProducts : getProductsByCategory(category)).slice(0, 8)} />
            <PageHeading title="Razer 콜라보 제품" description="Razer와 콜라보한 제품들을 만나보세요" as="h2" />
            <div className="design-grid design-grid--two">
                {featuredCollabCards.map(([slug, layer, title, description]) => {
                    const collab = collabs.find((item) => item.slug.includes(slug));
                    return <article key={slug} className="design-media-card">
                        <img src={figmaImage(exclusiveFrame, layer)} alt="" loading="lazy" />
                        <h3>{title}</h3>
                        <p>{description}</p>
                        <Link className="design-explore" to={collab ? getCollabPath(collab.slug) : "/products/collab"}>
                            EXPLORE <img src="/images/figma-pages/explore-primary.svg" alt="" />
                        </Link>
                    </article>;
                })}
            </div>
        </div>
    </div>;
}

const membershipFrame = "1404:27912";
const benefits = [[10, 11, "Group"], [12, 13, "Frame"], [21, 22, "Group2"]] as const;
const earning = [
    [copy.slice(33, 35).join(" "), copy.slice(39, 41).join(" "), "Rectangle211", "https://www.razer.com/cortex"],
    [copy.slice(35, 37).join(" "), copy.slice(41, 43).join(" "), "Rectangle214", "https://insider.razer.com/"],
    [copy.slice(37, 39).join(" "), copy.slice(43, 45).join(" "), "Rectangle216", "https://gold.razer.com/silver"],
];

export function MembershipPage() {
    const [reward, setReward] = useState(0);
    return <div className="design-page design-membership">
        <PageHero src={figmaImage(membershipFrame, "Rectangle199")} />
        <div className="design-container">
            <PageHeading title={copy[0]} />
            <div className="design-grid design-grid--three design-member-benefits">
                {benefits.map(([title, body, icon]) => <article className="design-panel design-support" key={icon}>
                    <img src={figmaImage(membershipFrame, icon)} alt="" /><h2>{copy[title]}</h2><p>{copy[body]}</p>
                </article>)}
            </div>
            <section className="design-membership__signup">
                <div className="design-panel design-membership__coupon">
                    <span><img src={figmaImage(membershipFrame, "Group3")} alt="" /></span>
                    <div><p>{copy[23]}</p><h2>{copy[24]}</h2><p>{copy[25]}</p></div>
                </div>
                <ul>{copy.slice(14, 17).map((line, index) => <li key={line}>
                    <img src={"/images/figma-pages/" + ["membership-promo-email.svg", "membership-cart.svg", "membership-info.svg"][index]} alt="" />
                    {line}
                </li>)}</ul>
                <Link className="btn btn--primary" to="/signup">멤버십 가입하기</Link>
                <p>{copy[26]}</p>
            </section>
            <div className="design-grid design-grid--three design-membership__rewards">
                <article className="design-panel design-membership__reward">
                    <img src={figmaImage(membershipFrame, "Rectangle201")} alt="" loading="lazy" />
                    <h2>{copy[2]}</h2><p>{copy.slice(4, 6).join(" ")}</p>
                    <div><Link className="btn btn--primary" to="/signup">멤버십 가입하기</Link></div>
                </article>
                <article className="design-panel design-membership__reward">
                    <img src={figmaImage(membershipFrame, "Rectangle204")} alt="" loading="lazy" />
                    <h2>{copy[3]}</h2><p>{copy.slice(6, 8).join(" ")}</p>
                    <small>{copy.slice(8, 10).join(" ")}</small>
                    <div><Link className="btn btn--primary" to="/search">Razer.com</Link><a className="btn" href="https://gold.razer.com/">RAZER GOLD</a></div>
                </article>
                <article className="design-panel design-membership__reward">
                    <img src={figmaImage(membershipFrame, "Rectangle206")} alt="" loading="lazy" />
                    <h2>{copy[27 + reward]}</h2><p aria-live="polite">{copy[29 + reward]}</p>
                    <div className="design-membership__reward-pages" aria-label="리워드 유형">
                        <img src={"/images/figma-pages/membership-reward-" + (reward === 0 ? "first" : "second") + ".svg"} alt="" />
                        {[0, 1].map((index) => <button type="button" key={index} aria-label={copy[31 + index]}
                            aria-pressed={reward === index} onClick={() => setReward(index)} />)}
                    </div>
                    <div><a className="btn btn--primary" href={reward === 0 ? "https://gold.razer.com/silver" : "https://gold.razer.com/"}>{copy[31 + reward]}</a></div>
                </article>
            </div>
            <PageHeading title={copy[1]} as="h2" />
            <div className="design-grid design-grid--three design-membership__earning">
                {earning.map(([title, description, layer, href]) => <a href={href} key={layer}>
                    <img src={figmaImage(membershipFrame, layer)} alt="" loading="lazy" />
                    <h3>{title}</h3><p>{description}</p>
                </a>)}
            </div>
        </div>
    </div>;
}
