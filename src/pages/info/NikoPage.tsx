import { Link } from "react-router-dom";
import { esportsImages } from "../../data/pageImages";
import { getProductById } from "../../data/productData";
import { CatalogCard, PageHero } from "./PageLayout";

const milestones = [
    ["1회", "메이저 우승"],
    ["10회", "HLTV 올해의 선수 Top 20 선정"],
    ["52킬", "메이저 단일 맵 최다 킬"],
    ["1.70", "ESL One New York 2017 레이팅"],
    ["3년", "연속 HLTV MVP 다관왕"],
] as const;

const collection = [2028, 1022, 4009, 3014].map(getProductById);
const matchGear = [1026, 2043, 4021].map(getProductById);

export function NikoPage() {
    return <div className="design-page niko-profile">
        <PageHero src={esportsImages.nikoHero} mobileSrc={esportsImages.nikoHeroMobile} />
        <div className="design-container">
            <Link className="niko-profile__back" to="/info/promotion/esports">‹ e스포츠</Link>
            <section className="niko-profile__intro" aria-labelledby="niko-profile-title">
                <div>
                    <p className="niko-profile__eyebrow">TEAM RAZER · COUNTER-STRIKE 2</p>
                    <h1 id="niko-profile-title">NiKo</h1>
                    <p className="niko-profile__name">Nikola Kovač</p>
                </div>
                <div className="niko-profile__bio">
                    <h2>IEM Cologne 2026 메이저 챔피언</h2>
                    <p>NiKo는 Counter-Strike에서 정교한 라이플 조준과 데저트 이글 플레이로 이름을 알렸습니다. 오랜 기간 세계 정상급 선수로 활약하며 2026년 쾰른 메이저에서 우승했습니다.</p>
                </div>
            </section>
            <section className="niko-profile__record" aria-labelledby="niko-record-title">
                <h2 id="niko-record-title">커리어 주요 기록</h2>
                <dl>
                    {milestones.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                </dl>
            </section>
            <section className="niko-profile__collection" aria-labelledby="niko-collection-title">
                <header>
                    <p className="niko-profile__eyebrow">DEAGLE GOD</p>
                    <h2 id="niko-collection-title">Razer NiKo 컬렉션</h2>
                    <p>NiKo의 데저트 이글 플레이에서 영감을 얻은 불꽃 그래픽을 마우스, 키보드, 헤드셋과 마우스 패드에 담았습니다.</p>
                </header>
                <video className="niko-profile__video" controls playsInline preload="none"
                    aria-label="Razer NiKo 컬렉션 소개 영상" poster="/images/esports/niko/intro-poster.jpg">
                    <source src="/videos/esports/niko-intro.mp4" type="video/mp4" />
                </video>
                <div className="design-grid design-grid--four">
                    {collection.map((product) => product && <CatalogCard product={product} key={product.id} featured />)}
                </div>
            </section>
            <section className="niko-profile__collection" aria-labelledby="niko-gear-title">
                <header>
                    <p className="niko-profile__eyebrow">TEAM RAZER</p>
                    <h2 id="niko-gear-title">NiKo의 실전 장비</h2>
                    <p>래피드 트리거 키보드, 무선 마우스, 팀 음성 전달과 착용감을 고려한 헤드셋을 살펴보세요.</p>
                </header>
                <div className="design-grid design-grid--three">
                    {matchGear.map((product) => product && <CatalogCard product={product} key={product.id} featured />)}
                </div>
            </section>
        </div>
    </div>;
}
