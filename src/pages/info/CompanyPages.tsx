import { Link } from "react-router-dom";
import { aboutCopy } from "../../data/editorialData";
import {
    careerFacts, careerOpenings, careerSections, contactChannels, razerCareBenefits, razerCareNotes, razerCarePeriods,
    razerCarePlans, sustainabilityNote, sustainabilityPillars, zventuresFocus, type InfoCard,
} from "../../data/companyData";
import { aboutImages, supportImages, warrantyImages } from "../../data/pageImages";

// 예전 외부 링크(razer.com · careers · zVentures · RazerCare)를 대신하는 사이트 안 페이지

// 위쪽 배너 + 제목 + 소개 문단
function CompanyIntro({ banner, title, lead, text, display = false }: {
    banner?: string; title: string; lead?: string; text?: string; display?: boolean;
}) {
    return <>
        {banner && <div className="design-company__banner"><img src={banner} alt="" /></div>}
        <section className="design-container design-company__intro">
            <h1 className={"design-company__title" + (display ? " design-display" : "")}>{title}</h1>
            {lead && <p className="design-company__lead">{lead}</p>}
            {text && <p className="design-display-text">{text}</p>}
        </section>
    </>;
}

// 카드 목록 (링크가 있으면 카드 전체가 링크)
function CardGrid({ title, cards }: { title?: string; cards: InfoCard[] }) {
    return <section className="design-container design-company__section">
        {title && <h2 className="design-company__heading">{title}</h2>}
        <ul className="design-company__cards">
            {cards.map((card) => {
                const body = <>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                    {card.to && <img className="design-company__arrow" src={supportImages.arrow} alt="" />}
                </>;
                return <li key={card.title}>
                    {card.to ? <Link className="design-company__card is-link" to={card.to}>{body}</Link> : <div className="design-company__card">{body}</div>}
                </li>;
            })}
        </ul>
    </section>;
}

// ---------- 지속가능성 ----------
export function SustainabilityPage() {
    return <div className="design-page design-company">
        <CompanyIntro banner={aboutImages.sustainabilityBanner} title="#GOGREENWITHRAZER" display lead="지속 가능한 미래를 향한 Razer의 약속" text={aboutCopy[7]} />
        <CardGrid title="4가지 실천" cards={sustainabilityPillars} />
        <section className="design-container design-company__section">
            <p className="design-company__note">{sustainabilityNote}</p>
        </section>
    </div>;
}

// ---------- 채용 ----------
export function CareersPage() {
    return <div className="design-page design-company">
        <CompanyIntro banner={aboutImages.careersBanner} title="채용" lead={aboutCopy[11]} text={aboutCopy[12]} />
        <section className="design-container design-company__section">
            <ul className="design-company__facts">
                {careerFacts.map((fact) => <li key={fact.label}><strong className="design-display">{fact.value}</strong><span>{fact.label}</span></li>)}
            </ul>
        </section>
        <CardGrid title="Razer에서 일한다는 것" cards={careerSections} />
        <section className="design-container design-company__section">
            <h2 className="design-company__heading">채용 공고</h2>
            {careerOpenings.length
                ? <ul className="design-company__openings">
                    {careerOpenings.map((job) => <li key={job.title}><strong>{job.title}</strong><span>{job.team} · {job.location}</span></li>)}
                </ul>
                : <p className="design-company__empty">현재 등록된 채용 공고가 없습니다.<br />채용 관련 문의는 <Link to="/info/service/faq?topic=contact">1 : 1 문의</Link>로 남겨 주세요.</p>}
        </section>
    </div>;
}

// ---------- zVentures ----------
export function ZVenturesPage() {
    return <div className="design-page design-company">
        <CompanyIntro banner={aboutImages.city} title="zVENTURES" display
            lead="Razer의 기업 벤처 투자 조직"
            text="zVentures는 Razer의 기업 벤처 투자 조직으로, Razer 생태계와 함께 성장할 스타트업과 새로운 기술에 투자합니다." />
        <CardGrid title="투자 분야" cards={zventuresFocus} />
    </div>;
}

// ---------- 연락처 ----------
export function ContactPage() {
    return <div className="design-page design-company">
        <CompanyIntro title="연락처" lead="무엇을 도와드릴까요?" text={aboutCopy[14]} />
        <CardGrid cards={contactChannels} />
    </div>;
}

// ---------- RazerCare ----------
export function RazerCarePage() {
    return <div className="design-page design-company">
        <CompanyIntro banner={warrantyImages.hero} title="RazerCare" display
            lead="Razer 제한 보증이 끝난 뒤에도 이어지는 보호 플랜"
            text="RazerCare Essential과 RazerCare Elite, 두 가지 플랜으로 제한 보증 기간이 끝난 뒤에도 Razer 장비를 보호할 수 있습니다." />
        <section className="design-container design-company__section">
            <h2 className="design-company__heading">플랜</h2>
            <ul className="design-company__cards design-company__cards--two">
                {razerCarePlans.map((plan) => <li key={plan.name}>
                    <div className="design-company__card">
                        <h3>{plan.name}</h3>
                        <ul className="design-company__points">{plan.points.map((point) => <li key={point}>{point}</li>)}</ul>
                        <p className="design-company__window">{plan.window}</p>
                    </div>
                </li>)}
            </ul>
        </section>
        <section className="design-container design-company__section">
            <h2 className="design-company__heading">두 플랜 공통 혜택</h2>
            <ul className="design-company__chips">{razerCareBenefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
        </section>
        <section className="design-container design-company__section">
            <h2 className="design-company__heading">보장 기간</h2>
            <ul className="design-company__table">
                {razerCarePeriods.map((row) => <li key={row.product}><strong>{row.product}</strong><span>{row.period}</span></li>)}
            </ul>
        </section>
        <section className="design-container design-company__section">
            <h2 className="design-company__heading">알아 두세요</h2>
            <ul className="design-company__notes">{razerCareNotes.map((note) => <li key={note}>{note}</li>)}</ul>
            <Link className="design-about__button design-company__cta" to="/info/service/registration-warranty">등록 및 보증 안내 보기</Link>
        </section>
    </div>;
}
