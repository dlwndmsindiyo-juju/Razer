import { useEffect, useRef, useState } from "react";
import { Modal } from "../../components/common/Modal";
import { aboutCopy, esportsCopy } from "../../data/editorialData";
import { figmaImage } from "../../data/figmaPageAssets";
import { productData } from "../../data/productData";
import { CatalogCard, PageHeading, PageHero } from "./PageLayout";

const aboutImage = (number: number) => figmaImage("1401:24703", "Rectangle" + number);
const years = Array.from({ length: 19 }, (_, index) => 2023 - index);
// [이름, 직책, 사진 레이어, 소개] · 첫 번째는 넓은 카드
const leaders = [
    ["MIN-LIANG TAN", "공동 설립자 겸 CEO", 185, aboutCopy[57]],
    ["CHONG NENG TAN", "CFO", 186],
    ["KHENG JOO KHAW", "COO", 188],
    ["CHOO WEI-PIN", "CCO", 187],
    ["LI MENG LEE", "CSO", 189],
] as const;
const pcAward = "Razer는 Blade 게이밍 노트북을 비롯해 키보드, 마우스, 헤드셋 등 고성능 PC 게이밍 기기를 제공합니다. Huntsman V2 Analog, DeathAdder V2, BlackShark V2 Pro 등 다양한 수상 제품을 통해 뛰어난 성능과 정밀한 제어, 몰입감 있는 게이밍 경험을 제공합니다.";
const awards = [
    ["PC", [172], pcAward],
    ["콘솔", [173], aboutCopy[47]],
    ["모바일", [174], aboutCopy[49]],
    ["라이프스타일", [175], aboutCopy[52]],
    ["서비스", [172, 176], aboutCopy[54]],
] as const;
// [id, 제목, 배너 레이어, 본문, 버튼, 링크, 제목을 디스플레이 서체로]
const brandSections = [
    ["sustainability", "지속가능성", 180, aboutCopy[7], "자세히 보기", "https://www.razer.com/go-green", false],
    ["careers", "채용", 183, aboutCopy.slice(11, 13).join(" "), "지원하기", "https://careers.razer.com/", false],
    ["ventures", "zVENTURES", 167, "zVentures는 Razer의 기업 벤처 투자 조직으로, Razer 생태계와 함께 성장할 스타트업과 새로운 기술에 투자합니다.", "자세히 보기", "https://www.zvntrs.com/", true],
] as const;

// #GoGreenWithRazer 를 초록 밑줄 링크로
const withGreenTag = (text: string) => text.split(/(#GoGreenWithRazer)/).map((part, index) =>
    part === "#GoGreenWithRazer"
        ? <a key={index} className="design-about__tag" href="#sustainability">{part}</a>
        : part);

export function AboutPage() {
    return <div className="design-page design-about">
        <header className="design-about__hero"><h1>About Me</h1></header>
        <section className="design-about__intro" id="overview">
            <img src={aboutImage(167)} alt="" loading="lazy" />
            <h2 className="design-about__title"><span className="design-display">RAZER</span> 소개</h2>
            <p className="design-about__lead">{aboutCopy[4]}</p>
            <p>{aboutCopy[13]}</p>
        </section>
        <img className="design-about__banner" src={aboutImage(168)} alt="" loading="lazy" />
        <section className="design-about__intro design-about__intro--after">
            <p className="design-about__lead">{aboutCopy[5]}</p>
            <p>{withGreenTag(aboutCopy[14])}</p>
        </section>
        <YearTimeline />
        <BrandSection section={brandSections[0]} overlay={aboutCopy[26]} />
        <section className="design-about__block" id="awards">
            <h2 className="design-about__heading">수상</h2>
            <div className="design-about__awards" tabIndex={0} aria-label="수상 분야">
                {awards.map(([title, layers, body]) => <article className="design-about__award" key={title}>
                    <div className="design-award-image">
                        {layers.map((layer) => <img key={layer} src={aboutImage(layer)} alt="" loading="lazy" />)}
                    </div>
                    <h3 className="design-display">{title}</h3>
                    <p className="design-display-text">{body}</p>
                </article>)}
            </div>
        </section>
        <section className="design-about__block" id="leadership">
            <h2 className="design-about__heading design-display">LEADERSHIP</h2>
            <div className="design-about__leaders">
                {leaders.map(([name, role, layer, description]) => <article className={"design-leader" + (description ? " design-leader--wide" : "")} key={name}>
                    <img src={aboutImage(layer)} alt="" loading="lazy" />
                    <div><h3>{name}</h3><p>{role}</p></div>
                    {description && <p className="design-leader__desc">{description}</p>}
                </article>)}
            </div>
        </section>
        <BrandSection section={brandSections[1]} />
        <BrandSection section={brandSections[2]} />
    </div>;
}

// 연도 탭: 선택한 연도가 가운데로 오고, 좌우로 스크롤
function YearTimeline() {
    const [year, setYear] = useState(years[0]);
    const track = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const list = track.current;
        const active = list?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
        if (!list || !active) return;
        list.scrollTo({
            left: active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2,
            behavior: year === years[0] ? "auto" : "smooth",
        });
    }, [year]);

    return <section className="design-about__timeline" aria-label="Razer 주요 성과">
        <div className="design-about__years" ref={track} aria-label="연도 선택">
            {years.map((value) => <button key={value} type="button" aria-pressed={year === value} onClick={() => setYear(value)}>{value}</button>)}
        </div>
        <div className="design-about__block design-about__milestone" aria-live="polite">
            <div>
                <h2 className="design-about__heading design-about__heading--light">
                    <span className="design-display">{year}</span>년
                    {year === 2023 && <><br /><span className="design-display">Razer</span> 주요 성과</>}
                </h2>
                {year === 2023
                    ? <div className="design-display-text"><p>{aboutCopy[6]}</p><p>{aboutCopy[15]}</p></div>
                    : <p className="design-about__empty">등록된 주요 성과가 없습니다.</p>}
            </div>
            {year === 2023 && <img src={aboutImage(170)} alt="" loading="lazy" />}
        </div>
    </section>;
}

function BrandSection({ section: [id, title, layer, description, action, href, display], overlay }: {
    section: typeof brandSections[number];
    overlay?: string;
}) {
    return <section className="design-brand-section" id={id}>
        <div className="design-brand-section__banner">
            <img src={aboutImage(layer)} alt="" loading="lazy" />
            {overlay && <strong className="design-brand-section__overlay">{overlay}</strong>}
        </div>
        <div className="design-about__block design-brand-section__copy">
            <div>
                <h2 className={"design-about__heading" + (display ? " design-display" : "")}>{title}</h2>
                <p className="design-display-text">{description}</p>
            </div>
            <a className="design-about__button" href={href} target="_blank" rel="noreferrer">{action}</a>
        </div>
    </section>;
}

const esportImage = (layer: string) => figmaImage("1403:26959", layer);
const teamLogos = Array.from({ length: 22 }, (_, index) =>
    "/images/esports/team-logo-" + String(index + 1).padStart(2, "0") + ".webp",
);
const albums = [
    { title: "RED BULL LOIO", photos: [242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261] },
    { title: "ALGS SAPPORO 2026", photos: [244, 248, 252, 256, 260] },
    { title: "VCT EMEA 2026", photos: [245, 249, 253, 257, 261] },
    { title: "EVO JAPAN 2026", photos: [246, 250, 254, 258] },
];
const proModels = [
    "Razer Viper V4 Pro - Esports Green Edition",
    "Razer DeathAdder V4 Pro - NiKo Edition",
    "Razer Huntsman V3 Pro - KR - 黑色",
    "Razer BlackShark V3 Pro - NiKo Edition",
];

export function EsportsPage() {
    const [event, setEvent] = useState(0);
    const [mobilePhoto, setMobilePhoto] = useState<number>();
    const album = albums[event];
    return <div className="design-page design-esports">
        <PageHero src={esportImage("Rectangle199")} />
        <div className="design-container">
            <PageHeading title={esportsCopy[0]} description={esportsCopy.slice(11, 13).join(" ")} />
            <PageHeading title={esportsCopy[3]} description={esportsCopy.slice(7, 9).join(" ")} as="h2" />
            <div className="design-grid design-grid--two">
                {[[5, 15, "Layer2"], [6, 17, "Layer3"]].map(([title, body, icon]) =>
                    <article className="design-panel design-support" key={icon}>
                        <img src={esportImage(String(icon))} alt="" /><h3>{esportsCopy[Number(title)]}</h3>
                        <p>{esportsCopy.slice(Number(body), Number(body) + 2).join(" ")}</p>
                    </article>)}
            </div>
            <PageHeading title={esportsCopy[4]} description={esportsCopy.slice(9, 11).join(" ")} as="h2" />
            <div className="design-grid design-grid--four design-esports__equipment">
                {proModels.map((model, index) => {
                    const product = productData.find((item) => item.title === model);
                    return product && <CatalogCard key={model} product={product} featured badge={esportsCopy[19 + index * 4]} />;
                })}
            </div>
            <PageHeading title={esportsCopy[1]} description={esportsCopy[13]} as="h2" />
            <img className="design-esports__player" src={esportImage("Property1Default")} alt="Team Razer 프로 선수" loading="lazy" />
        </div>
        {/* 팀 아이콘: 화면 끝까지 풀로 흘러감 · 마우스를 올리면 멈춤 */}
        <section className="design-team-logos" aria-label="Team Razer 선수와 팀">
            <div className="design-team-logos__viewport" tabIndex={0} aria-label="팀 아이콘 목록 (마우스를 올리면 멈춤)">
                <div className="design-team-logos__track">
                    {[false, true].map((duplicate) => (
                        <ul className="design-team-logos__row" key={String(duplicate)} aria-hidden={duplicate || undefined}>
                            {teamLogos.map((src, index) => <li key={src}>
                                <img src={src} alt={duplicate ? "" : "Team Razer 선수 및 팀 " + (index + 1)} />
                            </li>)}
                        </ul>
                    ))}
                </div>
            </div>
        </section>
        <section className="design-esports__year" aria-labelledby="esports-year-heading">
            <div className="design-container design-heading">
                <h2 id="esports-year-heading">
                    <span className="design-esports__year-desktop">{esportsCopy[2]}</span>
                    <span className="design-esports__year-mobile">우리가 함께한 곳</span>
                </h2>
                <p>{esportsCopy[14]}</p>
            </div>
            <div className="design-tabs design-container" aria-label="e스포츠 행사">
                {albums.map(({ title }, index) => <button type="button" key={title} aria-pressed={event === index} onClick={() => setEvent(index)}>{title}</button>)}
            </div>
            <div className="design-esports__year-desktop">
                <EsportsGallery key={album.title} album={album} />
            </div>
            <div className="design-container design-esports__year-mobile">
                <div className="design-esports__photo-grid">
                    {album.photos.map((number, index) => (
                        <button type="button" key={number} onClick={() => setMobilePhoto(index)} aria-label={album.title + " 사진 " + (index + 1)}>
                            <img src={esportImage("Rectangle" + number)} alt="" loading="lazy" />
                        </button>
                    ))}
                </div>
            </div>
        </section>
        {mobilePhoto !== undefined && <Modal title={album.title} onClose={() => setMobilePhoto(undefined)}>
            <div className="design-esports-gallery-modal">
                <EsportsGallery album={album} initialIndex={mobilePhoto} />
            </div>
        </Modal>}
    </div>;
}

function EsportsGallery({ album, initialIndex = 0 }: { album: typeof albums[number]; initialIndex?: number }) {
    const [index, setIndex] = useState(initialIndex);
    const thumbnailTrack = useRef<HTMLDivElement>(null);
    const count = album.photos.length;
    const wrapIndex = (value: number) => (value + count) % count;
    const changePhoto = (direction: -1 | 1) => setIndex((previous) => wrapIndex(previous + direction));
    const imageAt = (position: number) => esportImage("Rectangle" + album.photos[position]);
    const thumbnailCount = Math.min(9, count);
    const thumbnails = Array.from({ length: thumbnailCount }, (_, offset) =>
        wrapIndex(index + offset - Math.floor(thumbnailCount / 2)),
    );

    useEffect(() => {
        const track = thumbnailTrack.current;
        const thumbnail = track?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
        if (track && thumbnail) {
            track.scrollLeft = thumbnail.offsetLeft - (track.clientWidth - thumbnail.offsetWidth) / 2;
        }
    }, [index]);

    return <div className="design-esports-gallery" role="region" aria-label={album.title + " 행사 사진"}
        onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            changePhoto(event.key === "ArrowLeft" ? -1 : 1);
        }}>
        <div className="design-esports-gallery__stage">
            <img className="design-esports-gallery__neighbor" src={imageAt(wrapIndex(index - 1))} alt="" loading="lazy" />
            <div className="design-esports-gallery__focus">
                <img src={imageAt(index)} alt={album.title + " 사진 " + (index + 1)} loading="lazy" />
                <button type="button" className="design-esports-gallery__arrow" onClick={() => changePhoto(-1)} aria-label="이전 사진">
                    <img src="/images/esports/gallery-left.svg" alt="" />
                </button>
                <button type="button" className="design-esports-gallery__arrow design-esports-gallery__arrow--next" onClick={() => changePhoto(1)} aria-label="다음 사진">
                    <img src="/images/esports/gallery-right.svg" alt="" />
                </button>
            </div>
            <img className="design-esports-gallery__neighbor" src={imageAt(wrapIndex(index + 1))} alt="" loading="lazy" />
        </div>
        <div className="design-esports-gallery__thumbs" ref={thumbnailTrack} aria-label="행사 사진 썸네일">
            {thumbnails.map((position) => (
                <button type="button" key={position} aria-label={"사진 " + (position + 1) + " 보기"}
                    aria-pressed={position === index} onClick={() => setIndex(position)}>
                    <img src={imageAt(position)} alt="" loading="lazy" />
                </button>
            ))}
        </div>
        <span className="design-visually-hidden" aria-live="polite">{index + 1} / {count}</span>
    </div>;
}
