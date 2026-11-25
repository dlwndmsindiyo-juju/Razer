import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { promotionFaq } from "../../data/collabData";
import { supportCards, warrantyQuestions } from "../../data/editorialData";
import { figmaImage } from "../../data/figmaPageAssets";
import { PageHeading, PageHero } from "./PageLayout";

const servicePath = "/info/service/";
const tabs = [
    ["notices", "공지사항"], ["questions", "자주 묻는 질문 FAQ"], ["terms", "이용약관"],
    ["contact", "1 : 1 문의"], ["privacy", "개인 정보 처리 방침"], ["returns", "교환 및 환불"],
] as const;
const initialQuestion = {
    question: "에반게리온 컬렉션은 일상에서도 사용할 수 있나요?",
    answer: "제품별 기능과 호환성은 콜라보 상세 화면에서 확인할 수 있습니다.",
};

export function FaqPage() {
    const [params, setParams] = useSearchParams();
    const [query, setQuery] = useState("");
    const [active, setActive] = useState<number>();
    const [page, setPage] = useState(1);
    const tab = tabs.find(([key]) => key === params.get("topic"))?.[0] ?? "notices";
    const entries = tab === "notices" && !query.trim()
        ? Array.from({ length: 10 }, () => initialQuestion)
        : [initialQuestion, ...promotionFaq.map(({ q, a }) => ({ question: q, answer: a }))];
    const results = entries.filter(({ question, answer }) =>
        (question + " " + answer).toLowerCase().includes(query.trim().toLowerCase()),
    );

    return <div className="design-page design-faq-page">
        <PageHeading title="FAQ" description="고객 가이드" />
        <input className="design-search" type="search" aria-label="도움말 검색"
            placeholder="검색 또는 도움말 카테고리를 선택하세요."
            value={query} onChange={(event) => { setQuery(event.target.value); setActive(undefined); setPage(1); }} />
        <section className="design-panel design-faq">
            <nav className="design-tabs" aria-label="고객 가이드">
                {tabs.map(([key, label]) => <button type="button" key={key} aria-pressed={tab === key}
                    onClick={() => { setParams({ topic: key }); setActive(undefined); setPage(1); }}>{label}</button>)}
            </nav>
            {tab !== "notices" && tab !== "questions" ? <p className="design-policy">등록된 안내가 없습니다.</p> :
                results.length ? <ol className="design-questions">
                {results.map((entry, index) => <li key={index}>
                    <button type="button" aria-expanded={active === index} aria-controls={"faq-answer-" + index}
                        onClick={() => setActive(active === index ? undefined : index)}>
                        <span>{entry === initialQuestion ? "01" : String(index + 1).padStart(2, "0")}</span><strong>{entry.question}</strong>
                        <span className="design-toggle-icon" aria-hidden="true">{active === index ? "−" : <img src="/images/figma-pages/faq-plus.svg" alt="" />}</span>
                    </button>
                    <div className="design-faq__answer" id={"faq-answer-" + index} hidden={active !== index}><p>{entry.answer}</p></div>
                </li>)}
            </ol> : <p className="design-policy" role="status">검색 결과가 없습니다.</p>}
            {tab === "notices" && !query && <nav className="design-faq__pages" aria-label="공지사항 페이지">
                {[1, 2, 3].map((number) => <button type="button" key={number} aria-current={page === number ? "page" : undefined}
                    onClick={() => { setPage(number); setActive(undefined); }}>{number}</button>)}
            </nav>}
        </section>
    </div>;
}

const supportPaths = [
    "/mypage", servicePath + "faq?topic=returns", undefined, "/info/product/how-to-buy",
    undefined, "/mypage?tab=orders",
    servicePath + "faq?topic=terms", servicePath + "faq?topic=questions",
];

export function SupportPage() {
    return <div className="design-page design-container design-support-page">
        <PageHeading title="RAZER STORE 지원" />
        <div className="design-grid design-grid--two">
            {supportCards.map(([title, description], index) => {
                const path = supportPaths[index];
                const content = <><h2>{title}</h2><p>{description}</p>{path && <span className="design-support__arrow">
                    <img src={index === 0 ? "/images/figma-pages/support-arrow-primary.svg" : "/images/figma-pages/support-arrow.svg"} alt="" />
                </span>}</>;
                return path ?
                    <Link className="design-panel design-support" to={path} key={title}>{content}</Link> :
                    <article className="design-panel design-support" key={title}>{content}</article>;
            })}
        </div>
    </div>;
}

const warrantyBenefits = [
    ["제품 지원 자료에 쉽게 접근", "지원 문서에서 필요한 정보를 쉽고 간편하게 찾아보세요."],
    ["더 빠른 지원 및 해결", "제품을 등록하시면 제품 정보에 빠르게 접근할 수 있습니다."],
    ["최신 정보 업데이트", "최신 프로모션 및 소프트웨어 업데이트 소식을 받아보세요."],
    ["피드백 제공 및 보상", "등록된 제품에 대한 의견을 공유해 주세요."],
];

export function WarrantyPage() {
    return <div className="design-page design-warranty">
        <PageHero src={figmaImage("1404:27724", "Rectangle182")}>
            <div className="design-warranty__register">
                <h1>등록 및 보증</h1>
                <Link className="btn btn--primary" to="/mypage?tab=warranty">제품 등록</Link>
            </div>
        </PageHero>
        <div className="design-container">
            <PageHeading title="왜 제품을 등록해야할까요?" as="h2" />
            <div className="design-grid design-grid--four">
                {warrantyBenefits.map(([title, description], index) => <article className="design-support" key={title}>
                    <img src={figmaImage("1404:27724", ["Frame", "Frame1", "Frame2", "Frame3"][index])} alt="" />
                    <h3>{title}</h3>
                    <p>{description}</p>
                </article>)}
            </div>
            <PageHeading title="Razer 품질 보증 정책" description="도움이 필요하신가요? 걱정하지 마세요! 저희가 도와드리겠습니다." as="h2" />
            <div className="design-panel design-accordion">
                {warrantyQuestions.map((question) => <details key={question}>
                    <summary>{question}<img src="/images/figma-pages/warranty-plus.svg" alt="" /></summary>
                    <p>등록된 보증 안내가 없습니다.</p>
                </details>)}
            </div>
        </div>
    </div>;
}
