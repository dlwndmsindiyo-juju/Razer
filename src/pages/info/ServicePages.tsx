import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { ConfirmModal, RegisterModal, serialOnlyText, toSerial } from "../../components/mypage/MypageModals";
import { registerProductNames, useRegisterProduct, type RegisterValues } from "../../types/useRegisterProduct";
import { accountHelp, orderHelp, privacyHelp, restorifyHelp, returnsHelp, shippingHelp, silverHelp, termsHelp, warrantyHelp } from "../../data/customerFaq";
import { supportCards } from "../../data/editorialData";
import { warrantyBenefits, warrantyFaq } from "../../data/warrantyData";
import { faqImages, supportImages, warrantyImages } from "../../data/pageImages";
import { PageHeading, PageHero } from "./PageLayout";
import { Collapse } from "../../components/common/Collapse";

const servicePath = "/info/service/";
// FAQ 탭 (시안 순서) · 배송 · 복원 안내는 "자주 묻는 질문"에 함께
const tabs = [
    ["questions", "자주 묻는 질문 FAQ"], ["terms", "이용약관"], ["contact", "1 : 1 문의"],
    ["privacy", "개인 정보 처리 방침"], ["returns", "교환 및 환불"],
] as const;
const faqTopics = {
    questions: [...orderHelp, ...shippingHelp, ...warrantyHelp, ...silverHelp, ...restorifyHelp],
    terms: [...termsHelp, ...warrantyHelp.filter(({ id }) => id === "warranty-7")],
    contact: [],
    privacy: [...privacyHelp, ...accountHelp],
    returns: returnsHelp,
};
const FAQ_PAGE_SIZE = 10;
const faqEntries = [...new Map(Object.values(faqTopics).flat().map((entry) => [entry.id, entry])).values()];

export function FaqPage() {
    const [params, setParams] = useSearchParams();
    const [query, setQuery] = useState("");
    const [active, setActive] = useState<string>();
    const tab = tabs.find(([key]) => key === params.get("topic"))?.[0] ?? "questions";
    const normalizedQuery = query.trim().toLowerCase();
    const entries = normalizedQuery ? faqEntries : faqTopics[tab];
    const results = entries.filter(({ question, answer }) =>
        (question + " " + answer).toLowerCase().includes(normalizedQuery),
    );
    // 10개씩 페이지 (탭 · 검색어가 바뀌면 1페이지로)
    const [page, setPage] = useState(1);
    const pageCount = Math.max(1, Math.ceil(results.length / FAQ_PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const pageResults = results.slice((currentPage - 1) * FAQ_PAGE_SIZE, currentPage * FAQ_PAGE_SIZE);
    const goPage = (next: number) => { setPage(next); setActive(undefined); };

    // 다른 페이지에서 ?topic=탭&open=질문id 로 들어오면: 그 질문이 있는 페이지 · 펼친 채로 · FAQ 칸까지 스크롤
    const panel = useRef<HTMLElement>(null);
    const openId = params.get("open");
    useEffect(() => {
        if (!params.get("topic") && !openId) return;
        const list = faqTopics[tab];
        const index = openId ? list.findIndex(({ id }) => id === openId) : -1;
        if (index >= 0) {
            setPage(Math.floor(index / FAQ_PAGE_SIZE) + 1);
            setActive(openId!);
        }
        const timer = window.setTimeout(() => {
            const target = (index >= 0 && document.getElementById("faq-item-" + openId)) || panel.current;
            target?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
        return () => window.clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab, openId]);

    return <div className="design-page design-faq-page">
        <PageHeading title="FAQ" description="고객 가이드" />
        <input className="design-search" type="search" aria-label="도움말 검색"
            placeholder="궁금하신 점이 있다면 검색 또는 도움말 카테고리를 선택하세요."
            value={query} onChange={(event) => { setQuery(event.target.value); setActive(undefined); setPage(1); }} />
        <section className="design-panel design-faq" ref={panel}>
            <nav className="design-tabs" aria-label="고객 가이드">
                {tabs.map(([key, label]) => <button type="button" key={key} aria-pressed={tab === key}
                    onClick={() => { setParams({ topic: key }); setQuery(""); setActive(undefined); setPage(1); }}>{label}</button>)}
            </nav>
            {results.length ? <ol className="design-questions">
                {pageResults.map(({ id, question, answer }, index) => <li key={id} id={"faq-item-" + id} className={active === id ? "is-open" : ""}>
                    <button type="button" aria-expanded={active === id} aria-controls={"faq-answer-" + id}
                        onClick={() => setActive(active === id ? undefined : id)}>
                        <span>{String((currentPage - 1) * FAQ_PAGE_SIZE + index + 1).padStart(2, "0")}</span><strong>{question}</strong>
                        <span className="design-toggle-icon" aria-hidden="true"><img className="plus-toggle" src={faqImages.plus} alt="" /></span>
                    </button>
                    <Collapse open={active === id} id={"faq-answer-" + id}>
                        <div className="design-faq__answer"><p>{answer}</p></div>
                    </Collapse>
                </li>)}
            </ol> : null}
            {results.length > 0 && pageCount > 1 && <nav className="design-faq__pages" aria-label="FAQ 페이지">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) =>
                    <button type="button" key={number} aria-label={number + "페이지"}
                        aria-current={number === currentPage ? "page" : undefined} onClick={() => goPage(number)}>{number}</button>)}
            </nav>}
            {!results.length && <p className="design-policy" role="status">
                {normalizedQuery ? "검색 결과가 없습니다." : "등록된 안내가 없습니다."}
            </p>}
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
                    <img src={supportImages.arrow} alt="" />
                </span>}</>;
                return path ?
                    <Link className="design-panel design-support" to={path} key={title}>{content}</Link> :
                    <div className="design-panel design-support" key={title}>{content}</div>;
            })}
        </div>
    </div>;
}

// 히어로 오른쪽: 제품 PIN 입력 → 이 페이지에서 바로 제품 등록 팝업 (PIN이 시리얼 칸에 채워짐)
type PinModal = "register" | "login" | "done" | "proof" | null;

function PinRegister() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const user = useAuthStore((state) => state.user);
    const registerProduct = useRegisterProduct();
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [modal, setModal] = useState<PinModal>(null);

    // 영문 · 숫자만 (한글 · 특수문자는 입력 즉시 빼고 안내)
    const changePin = (value: string) => {
        const next = toSerial(value);
        setPin(next);
        // 한글 · 특수문자 안내는 다시 등록을 누를 때까지 보여 줌
        if (next !== value.toUpperCase()) setError(serialOnlyText);
        else if (error !== serialOnlyText) setError("");
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (pin.length < 4) return setError("제품의 PIN 번호를 정확히 입력해 주세요.");
        setModal(user ? "register" : "login");
    };

    const save = async (values: RegisterValues) => {
        await registerProduct(undefined, values);
        setPin("");
        setModal(values.proof ? "proof" : "done");
    };

    return <>
        <form className="design-warranty__register" onSubmit={submit} noValidate>
            <h1>등록 및 보증</h1>
            <div className="design-warranty__field">
                <input type="text" value={pin} aria-label="제품 PIN 번호" placeholder="제품의 PIN 번호를 입력하세요"
                    autoComplete="off" autoCapitalize="characters" spellCheck={false}
                    aria-invalid={!!error} aria-describedby={error ? "warranty-pin-error" : undefined}
                    onChange={(event) => changePin(event.target.value)}
                    onCompositionEnd={(event) => changePin(event.currentTarget.value)} />
                <button type="submit" className="btn btn--primary">등록</button>
            </div>
            {error && <p id="warranty-pin-error" className="design-warranty__error" role="alert">{error}</p>}
        </form>

        {/* 팝업은 모두 이 페이지 위에서 열림 */}
        {modal === "register" && (
            <RegisterModal serial={pin} productNames={registerProductNames} onClose={() => setModal(null)} onSave={save} />
        )}
        {modal === "login" && (
            <ConfirmModal title="로그인이 필요해요" text="제품 등록은 로그인 후 이용할 수 있어요." confirmLabel="로그인"
                onClose={() => setModal(null)} onConfirm={() => navigate("/login", { state: { from: pathname } })} />
        )}
        {modal === "done" && (
            <ConfirmModal single title="제품을 등록했어요" text="등록한 제품은 마이페이지 > 등록 및 보증에서 확인할 수 있어요."
                confirmLabel="확인" onClose={() => setModal(null)} onConfirm={() => setModal(null)} />
        )}
        {modal === "proof" && (
            <ConfirmModal single title="구매 증빙을 첨부했어요" text="확인 후 보증 적용 여부를 이메일로 안내해 드려요."
                confirmLabel="확인" onClose={() => setModal(null)} onConfirm={() => setModal(null)} />
        )}
    </>;
}

// Razer 품질 보증 정책: 질문을 누르면 아래 답변 박스가 스르륵 (한 번에 하나)
function WarrantyAccordion() {
    const [open, setOpen] = useState<number>();
    return <div className="design-accordion">
        {warrantyFaq.map(({ q, a }, index) => {
            const isOpen = open === index;
            return <div className={"design-accordion__item" + (isOpen ? " is-open" : "")} key={q}>
                <button type="button" className="design-accordion__summary" aria-expanded={isOpen}
                    aria-controls={"warranty-answer-" + index} onClick={() => setOpen(isOpen ? undefined : index)}>
                    {q}<img className="plus-toggle" src={warrantyImages.plus} alt="" />
                </button>
                <Collapse open={isOpen} id={"warranty-answer-" + index}>
                    <div className="warranty-answer">{a}</div>
                </Collapse>
            </div>;
        })}
    </div>;
}

export function WarrantyPage() {
    return <div className="design-page design-warranty">
        <PageHero src={warrantyImages.hero}>
            <PinRegister />
        </PageHero>
        <div className="design-container">
            <section className="design-warranty__section">
                <h2>왜 제품을 등록해야할까요?</h2>
                <div className="design-warranty__benefits">
                    {warrantyBenefits.map(([title, lines], index) => <div key={title}>
                        <img src={warrantyImages.benefits[index]} alt="" />
                        <div>
                            <h3>{title}</h3>
                            {lines.map((line) => <p key={line}>{line}</p>)}
                        </div>
                    </div>)}
                </div>
            </section>
            <section className="design-warranty__section">
                <h2>Razer 품질 보증 정책</h2>
                <WarrantyAccordion />
            </section>
        </div>
    </div>;
}
