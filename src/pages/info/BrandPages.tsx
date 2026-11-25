import { useState } from "react";
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
    ["sustainability", "지속가능성", 180, aboutCopy[7], "https://www.razer.com/go-green"],
    ["careers", "채용", 183, aboutCopy.slice(11, 13).join(" "), "https://www.razer.com/careers"],
    ["ventures", "zVENTURES", 167, "Razer의 벤처 투자 프로그램", "https://www.razer.com/zventures"],
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

function BrandSection({ section: [id, title, layer, description, href] }: { section: typeof brandSections[number] }) {
    return <section className="design-brand-section" id={id}>
        <PageHero src={aboutImage(layer)} />
        <div className="design-container design-brand-section__copy">
            <h2>{title}</h2><p>{description}</p><a className="btn" href={href}>자세히 보기 ↗</a>
        </div>
    </section>;
}

const esportImage = (layer: string) => figmaImage("1403:26959", layer);
const teamLogos = Array.from({ length: 22 }, (_, index) => 220 + index);
const albums = [
    { title: "RED BULL LOIO", photos: [242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261] },
    { title: "ALGS SAPPORO 2026", photos: [244, 248, 252, 256, 260] },
    { title: "VCT EMEA 2026", photos: [245, 249, 253, 257, 261] },
    { title: "EVO JAPAN 2026", photos: [246, 250, 254, 258] },
];
const proModels = ["Viper V4 Pro", "DeathAdder V4 Pro", "Huntsman V3 Pro", "BlackShark V3 Pro"];

export function EsportsPage() {
    const [event, setEvent] = useState(0);
    const [photo, setPhoto] = useState<number>();
    const album = albums[event];
    const adjacentPhoto = (direction: -1 | 1) => ((photo ?? 0) + direction + album.photos.length) % album.photos.length;
    return <div className="design-page design-esports">
        <PageHero src={esportImage("Rectangle199")} />
        <div className="design-container">
            <PageHeading title={esportsCopy[0]} description={esportsCopy.slice(11, 13).join(" ")} />
            <PageHeading title={esportsCopy[3]} description={esportsCopy.slice(7, 9).join(" ")} as="h2" />
            <div className="design-grid design-grid--two">
                {[[5, 15, "Layer2", "https://www.youtube.com/razer"], [6, 17, "Layer3", "https://www.razer.com/esports"]].map(([title, body, icon, href]) =>
                    <a className="design-panel design-support" href={String(href)} key={icon}>
                        <img src={esportImage(String(icon))} alt="" /><h3>{esportsCopy[Number(title)]}</h3>
                        <p>{esportsCopy.slice(Number(body), Number(body) + 2).join(" ")}</p>
                    </a>)}
            </div>
            <PageHeading title={esportsCopy[4]} description={esportsCopy.slice(9, 11).join(" ")} as="h2" />
            <div className="design-grid design-grid--four design-esports__equipment">
                {proModels.map((model, index) => {
                    const product = productData.find((item) => item.title.includes(model));
                    return product && <div key={model}>
                        <span className="design-pill">{esportsCopy[19 + index * 4]}</span>
                        <CatalogCard product={product} title={esportsCopy[20 + index * 4]} featured />
                    </div>;
                })}
            </div>
            <PageHeading title={esportsCopy[1]} description={esportsCopy[13]} as="h2" />
            <img className="design-esports__player" src={esportImage("Property1Default")} alt="Team Razer 프로 선수" loading="lazy" />
            <div className="design-team-logos">
                {teamLogos.map((number, index) => <img src={esportImage("Rectangle" + number)} alt={"Team Razer 파트너 " + (index + 1)} key={number} loading="lazy" />)}
            </div>
            <PageHeading title={esportsCopy[2]} description={esportsCopy[14]} as="h2" />
            <div className="design-tabs" aria-label="e스포츠 행사">
                {albums.map(({ title }, index) => <button type="button" key={title} aria-pressed={event === index} onClick={() => setEvent(index)}>{title}</button>)}
            </div>
            <div className={event === 0 ? "design-album design-album--mosaic" : "design-album"}>
                {album.photos.map((number, index) => <button type="button" key={number} onClick={() => setPhoto(index)} aria-label={album.title + " 사진 " + (index + 1)}>
                    <img src={esportImage("Rectangle" + number)} alt="" loading="lazy" />
                </button>)}
            </div>
        </div>
        {photo !== undefined && <Modal title={album.title} onClose={() => setPhoto(undefined)}>
            <div className="design-lightbox">
                <div className="design-lightbox__stage">
                    <img className="design-lightbox__neighbor" src={esportImage("Rectangle" + album.photos[adjacentPhoto(-1)])} alt="" />
                    <img className="design-lightbox__active" src={esportImage("Rectangle" + album.photos[photo])} alt={album.title + " 사진 " + (photo + 1)} />
                    <img className="design-lightbox__neighbor" src={esportImage("Rectangle" + album.photos[adjacentPhoto(1)])} alt="" />
                    <button type="button" onClick={() => setPhoto(adjacentPhoto(-1))} aria-label="이전"><img src="/images/figma-pages/gallery-left.svg" alt="" /></button>
                    <button type="button" onClick={() => setPhoto(adjacentPhoto(1))} aria-label="다음"><img src="/images/figma-pages/gallery-right.svg" alt="" /></button>
                </div>
                <div className="design-lightbox__thumbs" aria-label="갤러리 사진">
                    {Array.from({ length: Math.min(5, album.photos.length) }, (_, offset) => {
                        const index = (photo + offset + album.photos.length - Math.min(2, album.photos.length - 1)) % album.photos.length;
                        return <button type="button" key={index} aria-label={"사진 " + (index + 1)} aria-pressed={photo === index} onClick={() => setPhoto(index)}>
                            <img src={esportImage("Rectangle" + album.photos[index])} alt="" />
                        </button>;
                    })}
                </div>
            </div>
        </Modal>}
    </div>;
}
