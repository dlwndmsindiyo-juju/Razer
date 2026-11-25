import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Collapse } from "../../components/common/Collapse";
import { SafeImage } from "../../components/common/SafeImage";
import { greenAxon, greenColorways, greenFaq, greenHero, greenLineup, greenSections } from "../../data/esportsCollectionData";
import { faqImages } from "../../data/pageImages";
import { AwardSeal, CollectionProduct, FeatureList, productPath } from "./CollectionParts";

type Platform = keyof typeof greenLineup.tabs;
const platforms = Object.keys(greenLineup.tabs) as Platform[];

// Razer Esports Green 컬렉션 (razer.com/kr-kr/esports-green 구성)
export function EsportsGreenPage() {
    const [platform, setPlatform] = useState<Platform>("PC");
    const [openFaq, setOpenFaq] = useState<number>();

    return <div className="design-page collection-page esports-green">
        <GreenHero />

        <section className="collection-intro">
            <span className="collection-intro__exclusive">{greenHero.exclusive}</span>
            <p className="collection-intro__eyebrow">{greenHero.eyebrow}</p>
            <h1 className="collection-intro__title">{greenHero.title}</h1>
            <p className="collection-intro__body">{greenHero.body}</p>
            <ul className="collection-intro__awards">
                {greenHero.awards.map((award) => <li key={award.label}><AwardSeal award={award} /></li>)}
            </ul>
        </section>

        {/* 최고급 장비. 승리의 색상. */}
        <section className="collection-lineup" aria-labelledby="green-lineup">
            <h2 id="green-lineup" className="collection-lineup__title">{greenLineup.title}</h2>
            <div className="collection-tabs" role="tablist" aria-label="플랫폼">
                {platforms.map((option) => <button key={option} type="button" role="tab" aria-selected={option === platform}
                    onClick={() => setPlatform(option)}>{option}</button>)}
            </div>
            <ul className="collection-lineup__grid" role="tabpanel" aria-label={platform + " 제품"}>
                {greenLineup.tabs[platform].map((id) => <li key={id}><CollectionProduct productId={id} name={greenLineup.names[id]} /></li>)}
            </ul>
        </section>

        {/* 제품별 소개 */}
        {greenSections.map((section) => <section className="collection-section" id={section.id} key={section.id}>
            <div className="collection-section__head">
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                <div className="collection-section__links">
                    {section.links.map((link) => <Link key={link.label} to={productPath(link.productId)}>
                        {link.label} <span aria-hidden="true">›</span>
                    </Link>)}
                </div>
                {section.award && <AwardSeal award={section.award} />}
            </div>
            <div className={"collection-section__media" + (section.images.length > 1 ? " is-split" : "")}>
                {section.images.map((image) => <SafeImage key={image.src} src={image.src} alt={image.alt} fallback={image.alt} loading="lazy" />)}
            </div>
            <FeatureList features={section.features} note={section.note} />
        </section>)}

        <AxonWallpapers />

        {/* 다른 색상 둘러보기 (외부 페이지라 버튼 없이 설명만) */}
        <section className="collection-colorways" aria-labelledby="green-colorways">
            <h2 id="green-colorways">{greenColorways.title}</h2>
            <ul>
                {greenColorways.items.map((item) => <li key={item.title}>
                    <SafeImage src={item.image} fallback={item.title} loading="lazy" />
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                </li>)}
            </ul>
        </section>

        {/* 자주 묻는 질문 */}
        <section className="collection-faq" aria-labelledby="green-faq">
            <h2 id="green-faq">자주 묻는 질문</h2>
            {greenFaq.map(({ q, a }, index) => {
                const open = openFaq === index;
                return <div className={"collection-faq__item" + (open ? " is-open" : "")} key={q}>
                    <button type="button" aria-expanded={open} aria-controls={"green-faq-" + index}
                        onClick={() => setOpenFaq(open ? undefined : index)}>
                        {q}<img className="collection-faq__icon plus-toggle" src={faqImages.plus} alt="" />
                    </button>
                    <Collapse open={open} id={"green-faq-" + index}><p>{a}</p></Collapse>
                </div>;
            })}
        </section>
    </div>;
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function PauseIcon({ playing }: { playing: boolean }) {
    return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        {playing ? <path d="M3 2h3.5v12H3zm6.5 0H13v12H9.5z" /> : <path d="M4 2v12l10-6z" />}
    </svg>;
}

// 히어로 영상 (반복 · 일시정지 · 영상을 못 불러오면 이미지)
function GreenHero() {
    const video = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!prefersReducedMotion()) video.current?.play().catch(() => undefined);
    }, []);

    const toggle = () => {
        const player = video.current;
        if (!player) return;
        if (player.paused) player.play().catch(() => setFailed(true));
        else player.pause();
    };

    return <div className="collection-hero">
        {failed ? <SafeImage src={greenHero.image} alt="Esports Green 컬렉션 장비" fallback="RAZER ESPORTS GREEN" />
            : <>
                <video ref={video} src={greenHero.video} poster={greenHero.image} muted loop playsInline
                    aria-label="Esports Green 컬렉션 장비 영상"
                    onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
                <button type="button" className="collection-playback collection-hero__toggle"
                    aria-label={playing ? "영상 일시정지" : "영상 재생"} onClick={toggle}>
                    <PauseIcon playing={playing} />
                </button>
            </>}
    </div>;
}

// 스타일을 완성하세요 · RAZER AXON (다운로드는 외부라 버튼 없이 지원 OS만)
function AxonWallpapers() {
    const [playing, setPlaying] = useState(() => !prefersReducedMotion());
    // 배경화면을 4줄로 나눠 줄마다 반대 방향으로 흐름
    const rows = [0, 1, 2, 3].map((row) => greenAxon.wallpapers.filter((_, index) => index % 4 === row));

    return <section className="collection-axon" aria-labelledby="green-axon">
        <div className="collection-axon__head">
            <h2 id="green-axon">{greenAxon.title}</h2>
            <h3>{greenAxon.name}</h3>
            <p>{greenAxon.body}</p>
            <p className="collection-axon__platforms">{greenAxon.platforms}</p>
        </div>
        <div className="collection-axon__wall" data-playing={playing}>
            <div className="collection-axon__tilt" aria-hidden="true">
                {rows.map((row, index) => <div className="collection-axon__row" key={index}>
                    {[...row, ...row].map((src, i) => <img key={i} src={src} alt="" loading="lazy" />)}
                </div>)}
            </div>
            <div className="collection-axon__logo">
                <SafeImage src={greenAxon.logo} alt="Razer Axon Wallpaper Engine" fallback="RAZER AXON" />
            </div>
            <button type="button" className="collection-playback collection-axon__toggle"
                aria-label={playing ? "배경화면 움직임 멈춤" : "배경화면 움직임 재생"} onClick={() => setPlaying(!playing)}>
                <PauseIcon playing={playing} />
            </button>
        </div>
    </section>;
}
