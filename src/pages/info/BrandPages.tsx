import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { aboutCopy, aboutMilestones, esportsCopy } from "../../data/editorialData";
import { aboutImages, esportsImages } from "../../data/pageImages";
import { productData } from "../../data/productData";
import { CatalogCard, PageHeading, PageHero } from "./PageLayout";

const years = Array.from({ length: 19 }, (_, index) => 2023 - index);
// [이름, 직책, 사진, 소개] · 첫 번째는 넓은 카드
const leaders = [
    ["MIN-LIANG TAN", "공동 설립자 겸 CEO", aboutImages.leaders.minLiangTan, aboutCopy[57]],
    ["CHONG NENG TAN", "CFO", aboutImages.leaders.chongNengTan],
    ["KHENG JOO KHAW", "COO", aboutImages.leaders.khengJooKhaw],
    ["CHOO WEI-PIN", "CCO", aboutImages.leaders.chooWeiPin],
    ["LI MENG LEE", "CSO", aboutImages.leaders.liMengLee],
] as const;
const pcAward = "Razer는 Blade 게이밍 노트북을 비롯해 키보드, 마우스, 헤드셋 등 고성능 PC 게이밍 기기를 제공합니다. Huntsman V2 Analog, DeathAdder V2, BlackShark V2 Pro 등 다양한 수상 제품을 통해 뛰어난 성능과 정밀한 제어, 몰입감 있는 게이밍 경험을 제공합니다.";
const awards = [
    ["PC", [aboutImages.awards.pc], pcAward],
    ["콘솔", [aboutImages.awards.console], aboutCopy[47]],
    ["모바일", [aboutImages.awards.mobile], aboutCopy[49]],
    ["라이프스타일", [aboutImages.awards.lifestyle], aboutCopy[52]],
    ["서비스", [aboutImages.awards.pc, aboutImages.awards.service], aboutCopy[54]],
] as const;
// [id, 제목, 배너 이미지, 본문, 버튼, 링크, 제목을 디스플레이 서체로]
const brandSections = [
    ["sustainability", "지속가능성", aboutImages.sustainabilityBanner, aboutCopy[7], "자세히 보기", "/info/company/sustainability", false],
    ["careers", "채용", aboutImages.careersBanner, aboutCopy.slice(11, 13).join(" "), "채용 공고 보기", "/info/company/careers", false],
    ["ventures", "zVENTURES", aboutImages.city, "zVentures는 Razer의 기업 벤처 투자 조직으로, Razer 생태계와 함께 성장할 스타트업과 새로운 기술에 투자합니다.", "자세히 보기", "/info/company/zventures", true],
] as const;

// #GoGreenWithRazer 를 초록 밑줄 링크로
const withGreenTag = (text: string) => text.split(/(#GoGreenWithRazer)/).map((part, index) =>
    part === "#GoGreenWithRazer"
        ? <a key={index} className="design-about__tag" href="#sustainability">{part}</a>
        : part);

export function AboutPage() {
    return <div className="design-page design-about">
        <div className="design-about__hero">
            <video
                className="design-about__hero-video"
                src={aboutImages.heroVideo}
                poster={aboutImages.heroPoster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
            />
            <h1>About Me</h1>
        </div>
        <section className="design-about__intro" id="overview">
            <img src={aboutImages.city} alt="" loading="lazy" />
            <h2 className="design-about__title"><span className="design-display">RAZER</span> 소개</h2>
            <p className="design-about__lead">{aboutCopy[4]}</p>
            <p>{aboutCopy[13]}</p>
        </section>
        <img className="design-about__banner" src={aboutImages.chromaBanner} alt="" loading="lazy" />
        <section className="design-about__intro design-about__intro--after">
            <p className="design-about__lead">{aboutCopy[5]}</p>
            <p>{withGreenTag(aboutCopy[14])}</p>
        </section>
        <YearTimeline />
        <BrandSection section={brandSections[0]} overlay={aboutCopy[26]} />
        <section className="design-about__block" id="awards">
            <h2 className="design-about__heading">수상</h2>
            <div className="design-about__awards" tabIndex={0} aria-label="수상 분야">
                {awards.map(([title, images, body]) => <div className="design-about__award" key={title}>
                    <div className="design-award-image">
                        {images.map((src) => <img key={src} src={src} alt="" loading="lazy" />)}
                    </div>
                    <h3 className="design-display">{title}</h3>
                    <p className="design-display-text">{body}</p>
                </div>)}
            </div>
        </section>
        <section className="design-about__block" id="leadership">
            <h2 className="design-about__heading design-display">LEADERSHIP</h2>
            <div className="design-about__leaders">
                {leaders.map(([name, role, photo, description]) => <div className={"design-leader" + (description ? " design-leader--wide" : "")} key={name}>
                    <img src={photo} alt="" loading="lazy" />
                    <div><h3>{name}</h3><p>{role}</p></div>
                    {description && <p className="design-leader__desc">{description}</p>}
                </div>)}
            </div>
        </section>
        <BrandSection section={brandSections[1]} />
        <BrandSection section={brandSections[2]} />
    </div>;
}

// 연도별 내용 (2023: 기존 문단 · 사진 / 나머지: aboutMilestones + 그 해 제품 계열의 실제 상품 이미지)
const getMilestone = (year: number) => {
    if (year === 2023) return { paragraphs: [aboutCopy[6], aboutCopy[15]], image: aboutImages.milestones2023, isProduct: false };
    const milestone = aboutMilestones.find((item) => item.year === year);
    const family = milestone?.product;
    const matches = family ? productData.filter((item) => item.title.startsWith(family) && item.image) : [];
    const product = matches.length ? matches[year % matches.length] : undefined; // 같은 계열이 두 해에 나와도 다른 사진
    return { paragraphs: milestone?.paragraphs ?? [], image: product?.image, isProduct: true, alt: product?.title ?? "" };
};

// 연도 탭: 선택한 연도가 가운데로 오고, 좌우로 스크롤
function YearTimeline() {
    const [year, setYear] = useState(years[0]);
    const track = useRef<HTMLDivElement>(null);

    // 선택한 연도를 목록 가운데로 (처음 · 글꼴 로드 후 · 창 크기 변경 시에도 다시 맞춤)
    const centerYear = useCallback((smooth: boolean) => {
        const list = track.current;
        const active = list?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
        if (!list || !active) return;
        const listBox = list.getBoundingClientRect();
        const activeBox = active.getBoundingClientRect();
        list.scrollTo({
            left: list.scrollLeft + activeBox.left - listBox.left - (list.clientWidth - activeBox.width) / 2,
            behavior: smooth ? "smooth" : "auto",
        });
    }, []);
    const first = useRef(true);

    useLayoutEffect(() => {
        centerYear(!first.current);
        first.current = false;
    }, [year, centerYear]);

    useEffect(() => {
        let alive = true;
        document.fonts?.ready.then(() => alive && centerYear(false));
        const list = track.current;
        const observer = new ResizeObserver(() => centerYear(false));
        if (list) observer.observe(list);
        return () => {
            alive = false;
            observer.disconnect();
        };
    }, [centerYear]);

    const milestone = getMilestone(year);

    return <section className="design-about__timeline" aria-label="Razer 주요 성과">
        <div className="design-about__years" ref={track} aria-label="연도 선택">
            {years.map((value) => <button key={value} type="button" aria-pressed={year === value} onClick={() => setYear(value)}>{value}</button>)}
        </div>
        <div className="design-about__block design-about__milestone" aria-live="polite">
            <div>
                <h2 className="design-about__heading design-about__heading--light">
                    <span className="design-display">{year}</span>년
                    <br /><span className="design-display">Razer</span> 주요 성과
                </h2>
                {milestone.paragraphs.length
                    ? <div className="design-display-text">{milestone.paragraphs.map((text) => <p key={text}>{text}</p>)}</div>
                    : <p className="design-about__empty">등록된 주요 성과가 없습니다.</p>}
            </div>
            {/* 사진: 2023 은 행사 사진 · 나머지는 그 해 제품 · 없으면 연도 글자 */}
            {milestone.image
                ? <img key={milestone.image} src={milestone.image} alt={milestone.isProduct ? milestone.alt : ""} loading="lazy" className={milestone.isProduct ? "is-product" : undefined} />
                : <div className="design-about__milestone-fallback" aria-hidden="true"><span className="design-display">{year}</span></div>}
        </div>
    </section>;
}

function BrandSection({ section: [id, title, banner, description, action, href, display], overlay }: {
    section: typeof brandSections[number];
    overlay?: string;
}) {
    return <section className="design-brand-section" id={id}>
        <div className="design-brand-section__banner">
            <img src={banner} alt="" loading="lazy" />
            {overlay && <strong className="design-brand-section__overlay">{overlay}</strong>}
        </div>
        <div className="design-about__block design-brand-section__copy">
            <div>
                <h2 className={"design-about__heading" + (display ? " design-display" : "")}>{title}</h2>
                <p className="design-display-text">{description}</p>
            </div>
            <Link className="design-about__button" to={href}>{action}</Link>
        </div>
    </section>;
}

const teamLogos = Array.from({ length: 22 }, (_, index) => esportsImages.teamLogo(index + 1));
const albums = [
    { title: "RED BULL LOIO", slug: "red-bull-loio", photoCount: 20 },
    { title: "ALGS SAPPORO 2026", slug: "algs-sapporo-2026", photoCount: 36 },
    { title: "VCT EMEA 2026", slug: "vct-emea-2026", photoCount: 12 },
    { title: "EVO JAPAN 2026", slug: "evo-japan-2026", photoCount: 38 },
];
const proModels = [
    "Razer Viper V4 Pro - Esports Green Edition",
    "Razer DeathAdder V4 Pro - Esports Green Edition",
    "Razer Huntsman V3 Pro - KR - 黑色",
    "Razer BlackShark V3 Pro - NiKo Edition",
];

export function EsportsPage() {
    const [event, setEvent] = useState(0);
    const album = albums[event];
    return <div className="design-page design-esports">
        <PageHero src={esportsImages.hero} />
        <div className="design-container">
            <PageHeading title={esportsCopy[0]} description={esportsCopy.slice(11, 13).join(" ")} />
            <PageHeading title={esportsCopy[3]} description={esportsCopy.slice(7, 9).join(" ")} as="h2" />
            <div className="design-grid design-grid--two">
                {([[5, 15, esportsImages.iconTrophy], [6, 17, esportsImages.iconAim]] as const).map(([title, body, icon]) =>
                    <div className="design-panel design-support" key={icon}>
                        <img src={icon} alt="" /><h3>{esportsCopy[title]}</h3>
                        <p>{esportsCopy.slice(body, body + 2).join(" ")}</p>
                    </div>)}
            </div>
            <PageHeading title={esportsCopy[4]} description={esportsCopy.slice(9, 11).join(" ")} as="h2" />
            <Link className="design-esports__gear-link" to="/info/promotion/esports/green">
                모든 e스포츠 기어 보기 <span aria-hidden="true">›</span>
            </Link>
            <div className="design-grid design-grid--four design-esports__equipment">
                {proModels.map((model, index) => {
                    const product = productData.find((item) => item.title === model);
                    return product && <CatalogCard key={model} product={product} featured badge={esportsCopy[19 + index * 4]} />;
                })}
            </div>
            <PageHeading title={esportsCopy[1]} description={esportsCopy[13]} as="h2" />
            <div className="design-esports__athlete">
                <img className="design-esports__player" src={esportsImages.player} alt="Team Razer의 NiKo 선수" loading="lazy" />
                <h3>NIKO</h3>
                <p>IEM COLOGNE 2026 메이저 챔피언</p>
                <Link to="/info/promotion/esports/niko">프로필 보기 <span aria-hidden="true">›</span></Link>
            </div>
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
        {/* 2026년을 돌아보며: 행사 버튼 → 사진 바뀜 (1번이 가운데) */}
        <section className="design-esports__year" aria-labelledby="esports-year-heading">
            <div className="design-container design-heading">
                <h2 id="esports-year-heading">{esportsCopy[2]}</h2>
                <p>{esportsCopy[14]}</p>
            </div>
            <div className="design-tabs design-container" role="group" aria-label="e스포츠 행사">
                {albums.map(({ title }, index) => <button type="button" key={title} aria-pressed={event === index} onClick={() => setEvent(index)}>{title}</button>)}
            </div>
            <EsportsGallery key={album.slug} album={album} />
        </section>
    </div>;
}

// 큰 사진: 가운데 + 양옆이 걸쳐 보이고 화살표 · 스와이프로 넘김 (끝에서 처음으로 이어짐)
// 아래 썸네일: 드래그해서 옆으로 밀고, 누르면 그 사진이 가운데로
function EsportsGallery({ album }: { album: typeof albums[number] }) {
    const count = album.photoCount;
    const [position, setPosition] = useState(0); // 계속 늘거나 줄어드는 위치 (애니메이션이 끊기지 않게)
    const index = ((position % count) + count) % count;
    const imageAt = (photo: number) => esportsImages.eventPhoto(album.slug, photo + 1);
    const thumbs = useRef<HTMLDivElement>(null);
    const drag = useRef({ x: 0, scroll: 0, moved: false, active: false });
    const swipe = useRef<number | null>(null);

    // 선택한 썸네일이 보이도록 가운데로
    useEffect(() => {
        const track = thumbs.current;
        const thumb = track?.children[index] as HTMLElement | undefined;
        if (!track || !thumb) return;
        track.scrollTo({ left: thumb.offsetLeft - (track.clientWidth - thumb.offsetWidth) / 2, behavior: "smooth" });
    }, [index]);

    const go = (direction: number) => setPosition((p) => p + direction);
    const select = (photo: number) => setPosition((p) => p + (photo - index));

    // 썸네일 드래그
    const onThumbDown = (e: PointerEvent<HTMLDivElement>) => {
        drag.current = { x: e.clientX, scroll: e.currentTarget.scrollLeft, moved: false, active: true };
    };
    const onThumbMove = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        if (!d.active) return;
        const dx = e.clientX - d.x;
        if (Math.abs(dx) > 5 && !d.moved) {
            d.moved = true;
            e.currentTarget.setPointerCapture(e.pointerId);
        }
        if (d.moved) e.currentTarget.scrollLeft = d.scroll - dx;
    };
    const onThumbUp = () => { drag.current.active = false; };

    // 큰 사진 스와이프
    const onStageDown = (e: PointerEvent<HTMLDivElement>) => { swipe.current = e.clientX; };
    const onStageUp = (e: PointerEvent<HTMLDivElement>) => {
        if (swipe.current === null) return;
        const dx = e.clientX - swipe.current;
        swipe.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    };

    return <div className="design-esports-gallery" role="region" aria-roledescription="carousel" aria-label={album.title + " 행사 사진"}
        onKeyDown={(e) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            go(e.key === "ArrowLeft" ? -1 : 1);
        }}>
        <div className="design-esports-gallery__stage" onPointerDown={onStageDown} onPointerUp={onStageUp}
            onPointerCancel={() => { swipe.current = null; }}>
            {[-2, -1, 0, 1, 2].map((offset) => {
                const slot = position + offset;
                const photo = ((slot % count) + count) % count;
                return <div key={slot} className={"design-esports-gallery__slide" + (offset === 0 ? " is-active" : "")}
                    style={{ "--offset": offset } as CSSProperties} aria-hidden={offset !== 0}
                    onClick={() => offset !== 0 && go(offset)}>
                    <img src={imageAt(photo)} alt={offset === 0 ? album.title + " 사진 " + (photo + 1) : ""} draggable={false} />
                </div>;
            })}
            <button type="button" className="design-esports-gallery__arrow" onClick={() => go(-1)} aria-label="이전 사진">
                <img src={esportsImages.galleryLeft} alt="" />
            </button>
            <button type="button" className="design-esports-gallery__arrow design-esports-gallery__arrow--next" onClick={() => go(1)} aria-label="다음 사진">
                <img src={esportsImages.galleryRight} alt="" />
            </button>
        </div>
        <div className="design-esports-gallery__thumbs" data-no-drag ref={thumbs} aria-label="행사 사진 목록 (드래그해서 넘기기)"
            onPointerDown={onThumbDown} onPointerMove={onThumbMove} onPointerUp={onThumbUp} onPointerCancel={onThumbUp}
            onClickCapture={(e) => {
                // 드래그한 뒤 손을 뗄 때는 사진 선택으로 치지 않음
                if (drag.current.moved) { e.stopPropagation(); e.preventDefault(); drag.current.moved = false; }
            }}>
            {Array.from({ length: count }, (_, photo) => (
                <button type="button" key={photo} aria-label={"사진 " + (photo + 1) + " 보기"}
                    aria-pressed={photo === index} onClick={() => select(photo)}>
                    <img src={imageAt(photo)} alt="" loading="lazy" draggable={false} />
                </button>
            ))}
        </div>
        <span className="design-visually-hidden" aria-live="polite">{index + 1} / {count}</span>
    </div>;
}
