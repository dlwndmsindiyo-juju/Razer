import { useEffect, useRef, useState } from "react";
import { Modal } from "../../components/common/Modal";
import { aboutCopy, esportsCopy } from "../../data/editorialData";
import { figmaImage } from "../../data/figmaPageAssets";
import { productData } from "../../data/productData";
import { CatalogCard, PageHeading, PageHero } from "./PageLayout";

const aboutImage = (number: number) => figmaImage("1401:24703", "Rectangle" + number);
const years = Array.from({ length: 19 }, (_, index) => 2023 - index);
const leaders = [
    ["MIN-LIANG TAN", "공동 설립자 겸 CEO", 185],
    ["CHONG NENG TAN", "CFO", 186],
    ["CHOO WEI-PIN", "CCO", 187],
    ["KHENG JOO KHAW", "COO", 188],
    ["LI MENG LEE", "CSO", 189],
] as const;
const brandSections = [
    ["sustainability", "지속가능성", 180, aboutCopy[7]],
    ["careers", "채용", 183, aboutCopy.slice(11, 13).join(" ")],
    ["ventures", "zVENTURES", 167, "Razer의 벤처 투자 프로그램"],
] as const;

export function AboutPage() {
    const [year, setYear] = useState(2023);
    return <div className="design-page design-about">
        <header className="design-about__hero"><h1>About Me</h1></header>
        <nav className="design-tabs design-about__nav" aria-label="Razer 소개">
            {[["overview", "RAZER 소개"], ["sustainability", "지속가능성"], ["awards", "수상"], ["leadership", "LEADERSHIP"],
                ["careers", "채용"], ["ventures", "zVENTURES"]].map(([id, label]) => <a key={id} href={"#" + id}>{label}</a>)}
        </nav>
        <section className="design-container design-about__intro" id="overview">
            <img src={aboutImage(167)} alt="" loading="lazy" />
            <PageHeading title="RAZER 소개" description={aboutCopy[4]} as="h2" />
            <p>{aboutCopy[5]}</p>
        </section>
        <PageHero src={aboutImage(168)} />
        <section className="design-container design-about__intro">
            <p>{aboutCopy[13]}</p>
            <p>{aboutCopy[14]}</p>
        </section>
        <section className="design-container design-stack">
            <div className="design-tabs design-years" aria-label="Razer 주요 성과 연도">
                {years.map((value) => <button key={value} type="button" aria-pressed={year === value} onClick={() => setYear(value)}>{value}</button>)}
            </div>
            <div className="design-timeline" aria-live="polite">
                <h2>{year}년</h2>
                {year === 2023 && <div className="design-program">
                    <div><h3>Razer 주요 성과</h3><p>{aboutCopy[6]}</p><p>{aboutCopy[15]}</p></div>
                    <img src={aboutImage(170)} alt="" loading="lazy" />
                </div>}
            </div>
        </section>
        <BrandSection section={brandSections[0]} />
        <section className="design-container" id="awards">
            <PageHeading title="수상" as="h2" />
            <div className="design-grid design-grid--three">
                {[["콘솔", 173, aboutCopy[47]], ["모바일", 174, aboutCopy[49]], ["라이프스타일", 175, aboutCopy[52]], ["서비스", 176, aboutCopy[54]]].map(([title, number, body]) =>
                    <article className="design-media-card" key={title}>
                        <div className="design-award-image">
                            {number === 176 && <img src={aboutImage(172)} alt="" loading="lazy" />}
                            <img src={aboutImage(Number(number))} alt="" loading="lazy" />
                        </div>
                        <h3>{title}</h3><p>{body}</p>
                    </article>)}
            </div>
        </section>
        <section className="design-container" id="leadership">
            <PageHeading title="LEADERSHIP" as="h2" />
            <div className="design-grid design-grid--two">
                {leaders.map(([name, role, layer]) => <article className="design-panel design-leader" key={name}>
                    <img src={aboutImage(layer)} alt="" loading="lazy" /><div><h3>{name}</h3><p>{role}</p></div>
                </article>)}
            </div>
        </section>
        <BrandSection section={brandSections[1]} />
        <BrandSection section={brandSections[2]} />
    </div>;
}

function BrandSection({ section: [id, title, layer, description] }: { section: typeof brandSections[number] }) {
    return <section className="design-brand-section" id={id}>
        <PageHero src={aboutImage(layer)} />
        <div className="design-container design-brand-section__copy">
            <h2>{title}</h2><p>{description}</p>
        </div>
    </section>;
}

const esportImage = (layer: string) => figmaImage("1403:26959", layer);
const teamLogos = Array.from({ length: 22 }, (_, index) =>
    "/images/figma-pages/esports-team-logo-" + String(index + 1).padStart(2, "0") + ".svg",
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
    const [logosPaused, setLogosPaused] = useState(false);
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
                    return product && <div key={model}>
                        <span className="design-pill">{esportsCopy[19 + index * 4]}</span>
                        <CatalogCard product={product} featured />
                    </div>;
                })}
            </div>
            <PageHeading title={esportsCopy[1]} description={esportsCopy[13]} as="h2" />
            <img className="design-esports__player" src={esportImage("Property1Default")} alt="Team Razer 프로 선수" loading="lazy" />
            <section className="design-team-logos" aria-label="Team Razer 선수와 팀">
                <div className="design-team-logos__viewport" data-paused={logosPaused} tabIndex={0} aria-label="팀 아이콘 목록">
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
                <button className="design-team-logos__control" type="button" onClick={() => setLogosPaused(!logosPaused)}>
                    {logosPaused ? "아이콘 흐름 재생" : "아이콘 흐름 일시정지"}
                </button>
            </section>
        </div>
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
                    <img src="/images/figma-pages/gallery-left.svg" alt="" />
                </button>
                <button type="button" className="design-esports-gallery__arrow design-esports-gallery__arrow--next" onClick={() => changePhoto(1)} aria-label="다음 사진">
                    <img src="/images/figma-pages/gallery-right.svg" alt="" />
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
