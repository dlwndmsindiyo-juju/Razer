import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { esportsImages } from "../../data/pageImages";
import { getProductById } from "../../data/productData";
import { CatalogCard, PageHero } from "./PageLayout";

const milestones = [
    ["1회", "메이저 우승"],
    ["10회", "HLTV 올해의 선수 Top 20 선정"],
    ["52킬", "메이저 단일 맵 최다 킬"],
    ["EVP", "커리어 주요 대회 우수 선수 선정"],
    ["1.70", "ESL One New York 2017 레이팅"],
    ["3년", "연속 HLTV MVP 다관왕"],
] as const;

const collection = [
    [2028, "정밀한 조준과 세밀한 트래킹을 위한 무선 마우스."],
    [1022, "래피드 트리거와 아날로그 입력을 지원하는 8KHz 텐키리스 키보드."],
    [4009, "방향감 있는 게임 사운드와 팀 음성 전달에 초점을 맞춘 헤드셋."],
    [3014, "마우스를 부드럽게 움직이고 원하는 지점에서 멈추기 좋은 직조 패드."],
] as const;
const matchGear = [
    [1026, "빠른 방향 전환을 위한 래피드 트리거."],
    [2043, "민첩한 조준을 지원하는 저지연 무선 연결."],
    [4021, "마이크, 게임 오디오, 장시간 착용감을 고려한 헤드셋."],
] as const;

function PlaybackIcon({ playing }: { playing: boolean }) {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        {playing ? <path d="M3 3h3v10H3zm7 0h3v10h-3z" /> : <path d="M4 2v12l10-6z" />}
    </svg>;
}

function NikoVideo() {
    const video = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [failed, setFailed] = useState(false);

    async function togglePlayback() {
        const player = video.current;
        if (!player) return;
        if (!player.paused) {
            player.pause();
            return;
        }
        setFailed(false);
        try {
            await player.play();
        } catch {
            setFailed(true);
        }
    }

    return <div className="niko-profile__media">
        <video ref={video} className="niko-profile__video" playsInline preload="none"
            src="/videos/esports/niko-intro.mp4" poster="/images/esports/niko/intro-poster.jpg"
            aria-label="Razer NiKo 컬렉션 소개 영상"
            onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)} onError={() => setFailed(true)} />
        <button className="niko-profile__playback" type="button"
            aria-label={playing ? "영상 일시정지" : "영상 재생"} onClick={() => void togglePlayback()}>
            <PlaybackIcon playing={playing} />
        </button>
        {failed && <p className="niko-profile__error" role="status">영상을 재생하지 못했습니다. 다시 시도해 주세요.</p>}
    </div>;
}

export function NikoPage() {
    const [gearMotion, setGearMotion] = useState(
        () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

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
                    <h2>우리는 승리하기 위해 플레이합니다</h2>
                    <p>정교한 라이플 조준과 데저트 이글 플레이로 알려진 NiKo의 커리어와 그가 선택한 장비를 살펴보세요.</p>
                </div>
            </section>
            <section className="niko-profile__record" aria-labelledby="niko-record-title">
                <h2 id="niko-record-title">IEM Cologne 2026 메이저 챔피언</h2>
                <dl>
                    {milestones.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                </dl>
            </section>
            <section className="niko-profile__collection" aria-labelledby="niko-collection-title">
                <header>
                    <h2 id="niko-collection-title">불꽃을 느껴보세요</h2>
                    <p>NiKo의 데저트 이글 플레이에서 영감을 얻은 불꽃 그래픽을 마우스, 키보드, 헤드셋과 마우스 패드에 담았습니다.</p>
                </header>
                <NikoVideo />
            </section>
            <section className="niko-profile__collection" aria-labelledby="niko-lineup-title">
                <header>
                    <p className="niko-profile__eyebrow">DEAGLE GOD</p>
                    <h2 id="niko-lineup-title">DEAGLE GOD처럼 플레이하세요</h2>
                </header>
                <div className="design-grid design-grid--two niko-profile__lineup">
                    {collection.map(([id, description]) => {
                        const product = getProductById(id);
                        return product && <CatalogCard product={product} key={id} description={description} featured />;
                    })}
                </div>
            </section>
            <section className="niko-profile__tribute" aria-labelledby="niko-tribute-title">
                <img src={esportsImages.player} alt="Team Razer의 NiKo" loading="lazy" />
                <div>
                    <p className="niko-profile__eyebrow">TEAM RAZER</p>
                    <h2 id="niko-tribute-title">고마워요, NiKo.</h2>
                    <p>오랜 시간 큰 무대에서 보여준 집중력과 투지를 기립니다.</p>
                </div>
            </section>
            <section className="niko-profile__collection" aria-labelledby="niko-gear-title">
                <header>
                    <p className="niko-profile__eyebrow">TEAM RAZER</p>
                    <h2 id="niko-gear-title">NiKo의 실전 장비</h2>
                    <p>래피드 트리거 키보드, 무선 마우스, 팀 음성 전달과 착용감을 고려한 헤드셋을 살펴보세요.</p>
                </header>
                <div className="niko-profile__gear">
                    <div className="niko-profile__gear-track" data-playing={gearMotion}>
                        {[false, true].map((duplicate) => <div key={String(duplicate)} inert={duplicate}>
                            {matchGear.map(([id, description]) => {
                                const product = getProductById(id);
                                return product && <CatalogCard product={product} key={id} description={description} featured />;
                            })}
                        </div>)}
                    </div>
                    <button className="niko-profile__playback" type="button"
                        aria-label={gearMotion ? "장비 애니메이션 일시정지" : "장비 애니메이션 재생"}
                        onClick={() => setGearMotion(!gearMotion)}>
                        <PlaybackIcon playing={gearMotion} />
                    </button>
                </div>
            </section>
            <nav className="niko-profile__related" aria-label="관련 e스포츠 페이지">
                <Link to="/info/promotion/esports">
                    <img src="/images/esports/niko/team-razer.webp" alt="" loading="lazy" />
                    <span>Team Razer 선수 더 보기 <span aria-hidden="true">›</span></span>
                </Link>
                <Link to="/info/promotion/technology">
                    <img src="/images/esports/niko/trusted-technology.webp" alt="" loading="lazy" />
                    <span>Razer 제품 기술 보기 <span aria-hidden="true">›</span></span>
                </Link>
            </nav>
        </div>
    </div>;
}
