import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SafeImage } from "../../components/common/SafeImage";
import { nikoProfile as niko } from "../../data/esportsCollectionData";
import { CollectionProduct, productPath } from "./CollectionParts";
import { Breadcrumb } from "../../components/common/Breadcrumb";

function PlaybackIcon({ playing }: { playing: boolean }) {
    return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        {playing ? <path d="M3 2h3.5v12H3zm6.5 0H13v12H9.5z" /> : <path d="M4 2v12l10-6z" />}
    </svg>;
}

// 소개 영상 (반복 재생 · 재생/일시정지)
function NikoVideo() {
    const video = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [failed, setFailed] = useState(false);

    // 움직임 줄이기 설정이 아니면 자동 재생
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        video.current?.play().catch(() => undefined);
    }, []);

    const toggle = () => {
        const player = video.current;
        if (!player) return;
        if (player.paused) player.play().catch(() => setFailed(true));
        else player.pause();
    };

    if (failed) return <div className="safe-image__fallback niko__video">NiKo 컬렉션 소개 영상</div>;
    return <div className="niko__video">
        <video ref={video} src={niko.video.src} poster={niko.video.poster} muted loop playsInline preload="metadata"
            aria-label="Razer NiKo 컬렉션 소개 영상"
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
        <button type="button" className="collection-playback" aria-label={playing ? "영상 일시정지" : "영상 재생"} onClick={toggle}>
            <PlaybackIcon playing={playing} />
        </button>
    </div>;
}

// 자동으로 넘어가는 슬라이드 (NiKo 장면 · 제품 장면 · 지금 쇼핑하기 = 상품 상세)
function NikoCarousel() {
    const slides = niko.carousel;
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    useEffect(() => {
        if (!playing) return;
        const timer = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
        return () => window.clearInterval(timer);
    }, [playing, slides.length]);

    return <section className="niko__carousel" aria-roledescription="carousel" aria-label="NiKo가 쓰는 장비">
        <div className="niko__slides" style={{ transform: `translateX(${index * -100}%)` }}>
            {slides.map((slide, i) => <div className="niko__slide" key={slide.image}
                aria-roledescription="slide" aria-label={`${i + 1} / ${slides.length}`} aria-hidden={i !== index} inert={i !== index}>
                <SafeImage src={slide.image} alt={slide.alt} fallback={slide.alt} loading="lazy" />
                <Link className="niko__shop" to={productPath(slide.productId)}>지금 쇼핑하기</Link>
            </div>)}
        </div>
        <div className="niko__carousel-controls">
            {slides.map((slide, i) => <button key={slide.image} type="button" className={i === index ? "is-active" : ""}
                aria-label={`${i + 1}번째 슬라이드`} aria-current={i === index} onClick={() => setIndex(i)} />)}
            <button type="button" className="collection-playback" aria-label={playing ? "슬라이드 일시정지" : "슬라이드 재생"}
                onClick={() => setPlaying(!playing)}>
                <PlaybackIcon playing={playing} />
            </button>
        </div>
    </section>;
}

// NiKo 프로필 (razer.com/kr-kr/esports/niko 구성)
export function NikoPage() {
    return <div className="design-page collection-page niko">
        <div className="collection-hero">
            <picture>
                <source srcSet={niko.hero.mobile} media="(max-width: 699px)" />
                <SafeImage src={niko.hero.image} alt="Team Razer NiKo" fallback="NIKO" />
            </picture>
        </div>
        <Breadcrumb inline />

        <section className="collection-intro">
            <h1 className="niko__title">{niko.title}</h1>
            <h2 className="collection-intro__title">{niko.subtitle}</h2>
            <p className="collection-intro__body">{niko.intro}</p>
        </section>

        {/* 기록 */}
        <section className="niko__records" aria-labelledby="niko-records">
            <h2 id="niko-records">{niko.recordTitle}</h2>
            <ul>
                {niko.records.map(([value, label]) => <li key={label}>
                    <span className="niko__record-value">{value}</span>
                    <span className="niko__record-label">{label}</span>
                </li>)}
            </ul>
        </section>

        {/* 불꽃을 느껴보세요 + 영상 */}
        <section className="niko__story" aria-labelledby="niko-story">
            <h2 id="niko-story">{niko.storyTitle}</h2>
            <p>{niko.story}</p>
            <NikoVideo />
        </section>

        {/* DEAGLE GOD처럼 플레이하세요 */}
        <section className="collection-lineup" aria-labelledby="niko-gear">
            <h2 id="niko-gear" className="collection-lineup__title">{niko.gearTitle}</h2>
            <ul className="collection-lineup__grid">
                {niko.gear.map(([id, description]) => <li key={id}><CollectionProduct productId={id} description={description} /></li>)}
            </ul>
        </section>

        <section className="niko__thanks" aria-labelledby="niko-thanks">
            <h2 id="niko-thanks">{niko.thanksTitle}</h2>
            <p>{niko.thanks}</p>
        </section>

        <NikoCarousel />
        <p className="collection-source">{niko.source}</p>

        {/* 다른 페이지 */}
        <ul className="niko__related" aria-label="관련 페이지">
            {niko.related.map((item) => <li key={item.to}>
                <Link to={item.to}>
                    <SafeImage src={item.image} fallback={item.title} loading="lazy" />
                    <span className="niko__related-title">{item.title}</span>
                    <span className="niko__related-body">{item.body}</span>
                    <span className="niko__related-more">자세한 정보 <span aria-hidden="true">›</span></span>
                </Link>
            </li>)}
        </ul>
    </div>;
}
