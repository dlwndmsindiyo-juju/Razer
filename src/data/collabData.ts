import { getSeriesTitle, productData } from "./productData";
import { highlightSpecCodes } from "./detailData";
import type { Product } from "../types/product";

// 프로모션 알아보기 · 콜라보 상세 데이터
// 상품은 productData 에서 이름(match)으로 찾아옴 → 상품이 늘어나면 자동으로 함께 보여요

export interface CollabFaq {
    q: string;
    a: string;
}

// 상품 소개 블록 하나 (배너 이미지 기준 · productId 가 있으면 그 상품 상세로 연결)
export interface CollabSection {
    image: string; // 1920 x 700 배너
    model: string; // 상품 데이터가 없을 때 보일 모델 이름
    productId?: number; // productData 에 있는 같은 에디션 상품
    layout?: "center" | "left" | "right"; // 기본 순서(가운데 · 오른쪽 · 왼쪽 …) 대신 쓸 배치
}

export interface Collab {
    slug: string; // 주소 /promotion/collab/:slug
    name: string; // 카드 · 로고 띠에 보이는 이름 (영문)
    ko: string; // 문구에 쓰는 한글 이름
    match: RegExp; // 상품명에서 찾는 규칙
    logo?: string; // 로고 이미지 (없으면 이름 글자로 표시)
    cover?: string; // 콜라보 제품 카드 이미지 (342 x 447 · 없으면 첫 상품의 갤러리 이미지)
    hero?: string; // 큰 대표 이미지 (1920 가로 · 없으면 첫 상품 갤러리 → 카드 이미지)
    video?: string; // 큰 대표 영상 (있으면 이미지 대신 재생 · 이미지는 로딩 전 포스터)
    collection?: string; // 컬렉션 소개 · 대표 상품 블록 이미지 (전체 구성 컷)
    thumb?: string; // 대표 상품 블록의 작은 정사각 이미지 (500 x 500)
    sections?: CollabSection[]; // 상품 소개 블록 (있으면 이 순서대로 · 3장 이상이면 마지막 장은 "플레이 뒤에도 남는" 이미지)
    stay?: CollabSection; // "플레이 뒤에도 남는 …" 큰 이미지 · 소개 상품 (없으면 배너 3장 이상일 때 마지막 배너)
    stayAfter?: number; // "플레이 뒤에도 남는 …" 블록을 몇 번째 상품 블록 뒤에 둘지 (기본 4)
    ended?: boolean; // 종료된 이벤트 → 카드는 흐리게 · 상세 페이지는 들어갈 수 없음
    headline: string; // 컬렉션 소개 큰 문구 (\n 줄바꿈)
    intro: string; // 컬렉션 소개 설명 (\n 줄바꿈)
    stayTitle: string; // "플레이 뒤에도 남는 …" 블록 제목 (\n 줄바꿈)
    stayText: string;
    faq: CollabFaq[];
}

// 공통 FAQ (컬렉션 이름만 바뀜)
const collabFaq = (ko: string): CollabFaq[] => [
    {
        q: `${ko} 컬렉션은 일상에서도 사용할 수 있나요?`,
        a: `네. 게이밍뿐 아니라 업무, 스트리밍, 콘텐츠 감상 등 다양한 환경에서 사용할 수 있습니다. 편안함과 내구성에 ${ko}에서 영감을 받은 디자인을 결합했습니다.`,
    },
    {
        q: `${ko} 에디션은 일반 모델과 성능이 같나요?`,
        a: "네. 센서 · 스위치 · 드라이버 등 핵심 사양은 일반 모델과 같고, 디자인과 패키지만 컬렉션 전용으로 바뀌었습니다.",
    },
    {
        q: `${ko} 컬렉션은 한정 수량인가요?`,
        a: "콜라보 제품은 한정 수량으로 생산되며, 품절 후에는 재입고되지 않을 수 있습니다. 재입고 소식은 상품 페이지에서 확인해주세요.",
    },
    {
        q: "국내 정식 A/S 를 받을 수 있나요?",
        a: "네. Razer 공식 스토어에서 구매한 제품은 구매일로부터 2년간 국내 공식 A/S 를 받을 수 있습니다.",
    },
];

const make = (c: Omit<Collab, "faq">): Collab => ({ ...c, faq: collabFaq(c.ko) });

export const collabs: Collab[] = [
    make({
        slug: "kuromi",
        hero: "/images/promotion/kuromi/hero.webp",
        video: "/videos/collab/kuromi.mp4",
        collection: "/images/promotion/kuromi/collection.webp",
        thumb: "/images/promotion/kuromi/kuromi-500x500.webp",
        sections: [
            { image: "/images/promotion/kuromi/enki-x.webp", model: "Razer Enki X" },
            { image: "/images/promotion/kuromi/ornata-v3-tkl.webp", model: "Razer Ornata V3 Tenkeyless" },
            { image: "/images/promotion/kuromi/leviathan-v2-x.webp", model: "Razer Leviathan V2 X" },
            { image: "/images/promotion/kuromi/deathadder-essential-goliathus.webp", model: "Razer DeathAdder Essential + Goliathus" },
            { image: "/images/promotion/kuromi/kraken-kitty-v2-bt.webp", model: "Razer Kraken Kitty V2 BT" },
        ],
        cover: "/images/promotion/collab/kuromi.webp",
        name: "KUROMI",
        ko: "쿠로미",
        match: /Kuromi/i,
        headline: "Shadow Kawaii,\n당신의 셋업으로.",
        intro: "쿠로미의 시크한 매력을 담은 게이밍 컬렉션.\n퍼플과 블랙으로 셋업에 반전 매력을 더하세요.",
        stayTitle: "플레이 뒤에도 남는\n쿠로미의 존재감",
        stayText: "리본과 해골 포인트를 담은 디자인으로\n책상 위를 쿠로미의 무드로 채워보세요.",
    }),
    make({
        slug: "evangelion",
        video: "/videos/collab/evangelion.mp4",
        // 시안 순서: 대표 배너(풀폭) → 키보드 → (컬렉션 소개) → 마우스 → 사운드바(풀폭) → (마우스 + 스탠드) → 마우스 매트
        collection: "/images/promotion/evangelion/hero.webp",
        thumb: "/images/promotion/evangelion/mouse-stand.webp",
        sections: [
            { image: "/images/promotion/evangelion/hero.webp", model: "Razer Iskur V2 X", layout: "center" },
            { image: "/images/promotion/evangelion/blackwidow-v4-tkl-hyperspeed.webp", model: "Razer BlackWidow V4 Tenkeyless HyperSpeed", productId: 1002 },
            { image: "/images/promotion/evangelion/deathadder-v4-pro.webp", model: "Razer DeathAdder V4 Pro", productId: 2004 },
            { image: "/images/promotion/evangelion/leviathan-v2-x.webp", model: "Razer Leviathan V2 X", productId: 4044 },
            { image: "/images/promotion/evangelion/gigantus-v2-xxl.webp", model: "Razer DeathAdder V4 Pro + Gigantus V2 XXL", productId: 2005 },
        ],
        stay: { image: "/images/promotion/evangelion/deathadder-v4-pro.webp", model: "Razer DeathAdder V4 Pro", productId: 2004 },
        name: "EVANGELION (EVA-01)",
        ko: "에반게리온 (EVA-01)",
        match: /Evangelion/i,
        logo: "/images/promotion/evangelion-logo.webp",
        cover: "/images/promotion/collab/evangelion.webp",
        hero: "/images/promotion/evangelion/hero.webp",
        headline: "EVA-01의 힘을,\n당신의 셋업으로.",
        intro: "상징적인 퍼플과 그린으로 완성한 게이밍 컬렉션.\nEVA-01의 존재감을 당신의 플레이에 더하세요.",
        stayTitle: "플레이 뒤에도 남는\nEVA-01의 존재감",
        stayText: "EVA-01의 아이코닉한 디자인을 담았습니다.\n게임을 마친 뒤에도 셋업의 분위기를 이어가세요.",
    }),
    make({
        slug: "honkai-star-rail",
        hero: "/images/promotion/honkai-star-rail/hero.webp",
        video: "/videos/collab/honkai-star-rail.mp4",
        thumb: "/images/promotion/honkai-star-rail/gwp-blackwidow.webp",
        sections: [
            { image: "/images/promotion/honkai-star-rail/blackwidow.webp", model: "Razer BlackWidow V4 Tenkeyless HyperSpeed", productId: 1001 },
            { image: "/images/promotion/honkai-star-rail/viper.webp", model: "Razer Viper V3 Pro SE", productId: 2003 },
            { image: "/images/promotion/honkai-star-rail/blackshark.webp", model: "Razer BlackShark V3 X HyperSpeed", productId: 4001 },
            { image: "/images/promotion/honkai-star-rail/iskur.webp", model: "Razer Iskur V2" },
        ],
        name: "HONKAI: STAR RAIL",
        ko: "붕괴: 스타레일",
        match: /Honkai/i,
        headline: "은하를 여는 감각,\n당신의 셋업으로.",
        intro: "개척자의 여정을 담은 게이밍 컬렉션.\n붕괴: 스타레일의 세계를 책상 위에 펼쳐보세요.",
        stayTitle: "여정이 끝나도 남는\n스타레일의 여운",
        stayText: "은랑의 감각을 담은 디자인으로\n플레이 밖의 시간까지 채워보세요.",
    }),
    make({
        slug: "wuthering-waves",
        name: "WUTHERING WAVES",
        ko: "명조: 워더링 웨이브",
        match: /Wuthering/i,
        headline: "파동을 깨우는 손끝,\n당신의 셋업으로.",
        intro: "명조의 세계관을 담은 게이밍 컬렉션.\n공명하는 디자인으로 플레이에 리듬을 더하세요.",
        stayTitle: "플레이 뒤에도 남는\n명조의 울림",
        stayText: "작품 속 디테일을 그대로 옮겨\n데스크 위에서도 세계관을 느껴보세요.",
    }),
    make({
        slug: "zenless-zone-zero",
        name: "ZENLESS ZONE ZERO",
        ko: "젠레스 존 제로",
        match: /Zenless/i,
        headline: "뉴에리두의 스타일,\n당신의 셋업으로.",
        intro: "젠레스 존 제로의 감각을 담은 게이밍 컬렉션.\n개성 있는 컬러로 셋업을 완성하세요.",
        stayTitle: "플레이 뒤에도 남는\n뉴에리두의 무드",
        stayText: "강렬한 그래픽 디자인으로\n책상 위의 분위기를 바꿔보세요.",
    }),
    make({
        slug: "minecraft",
        hero: "/images/promotion/minecraft/hero.webp",
        video: "/videos/collab/minecraft.mp4",
        thumb: "/images/promotion/minecraft/kraken-v4-x-500x500.webp",
        sections: [
            { image: "/images/promotion/minecraft/blackwidow-v4-x.webp", model: "Razer BlackWidow V4 X", productId: 1048 },
            { image: "/images/promotion/minecraft/kraken-v4-x.webp", model: "Razer Kraken V4 X", productId: 4049 },
            { image: "/images/promotion/minecraft/cobra.webp", model: "Razer Cobra", productId: 2049 },
            { image: "/images/promotion/minecraft/gigantus-v2-m.webp", model: "Razer Gigantus V2 - Medium" },
        ],
        cover: "/images/promotion/collab/minecraft.webp",
        name: "MINECRAFT",
        ko: "마인크래프트",
        match: /Minecraft/i,
        headline: "블록으로 쌓은 세계,\n당신의 셋업으로.",
        intro: "마인크래프트의 픽셀 감성을 담은 게이밍 컬렉션.\n당신만의 월드를 책상 위에 지어보세요.",
        stayTitle: "플레이 뒤에도 남는\n픽셀 월드",
        stayText: "익숙한 블록 디자인으로\n게임 밖에서도 크래프트를 이어가세요.",
    }),
    make({
        slug: "pokemon",
        ended: true, // 종료된 이벤트
        cover: "/images/promotion/collab/pokemon.webp",
        name: "Pokemon",
        ko: "포켓몬",
        match: /Pok[eé]mon/i,
        headline: "Electric Adventure,\n당신의 셋업으로.",
        intro: "피카츄의 짜릿한 에너지를 담은 게이밍 컬렉션.\n번개처럼 빠른 플레이를 시작하세요.",
        stayTitle: "플레이 뒤에도 남는\n피카츄의 에너지",
        stayText: "옐로와 블랙으로 완성한 디자인으로\n셋업에 모험의 설렘을 더하세요.",
    }),
    make({
        slug: "joola",
        ended: true, // 종료된 이벤트
        cover: "/images/promotion/collab/joola.webp",
        name: "줄라",
        ko: "줄라 (JOOLA)",
        match: /JOOLA/i,
        headline: "Performance Pulse,\n당신의 셋업으로.",
        intro: "탁구 브랜드 줄라와 함께한 퍼포먼스 컬렉션.\n게임 안팎에서 최고의 컨디션을 유지하세요.",
        stayTitle: "경기가 끝나도 남는\n줄라의 퍼포먼스",
        stayText: "스포츠의 에너지를 담은 디자인으로\n플레이의 리듬을 이어가세요.",
    }),
    make({
        slug: "keith-haring",
        ended: true, // 종료된 이벤트
        cover: "/images/promotion/collab/keith-haring.webp",
        name: "KEITH HARING",
        ko: "키스 해링",
        match: /Keith Haring/i,
        headline: "Pop Motion,\n당신의 셋업으로.",
        intro: "키스 해링의 팝아트를 담은 컬렉션.\n움직이는 선과 하트로 셋업에 리듬을 더하세요.",
        stayTitle: "플레이 뒤에도 남는\n키스 해링의 리듬",
        stayText: "아이코닉한 드로잉을 담은 디자인으로\n책상 위를 하나의 작품으로 만들어보세요.",
    }),
    make({
        slug: "blackpink",
        name: "BLACKPINK",
        ko: "블랙핑크",
        match: /BLACKPINK/i,
        headline: "핑크빛 무대,\n당신의 셋업으로.",
        intro: "블랙과 핑크로 완성한 게이밍 컬렉션.\n무대의 에너지를 데스크 위로 옮겨보세요.",
        stayTitle: "플레이 뒤에도 남는\n블랙핑크의 무드",
        stayText: "시그니처 컬러를 담은 디자인으로\n셋업에 포인트를 더하세요.",
    }),
    make({
        slug: "pompompurin",
        hero: "/images/promotion/pompompurin/hero.webp",
        video: "/videos/collab/pompompurin.mp4",
        collection: "/images/promotion/pompompurin/collection.webp",
        sections: [
            { image: "/images/promotion/pompompurin/keyboard.webp", model: "Razer Ornata V3 Tenkeyless", productId: 1005 },
            { image: "/images/promotion/pompompurin/headset.webp", model: "Razer 게이밍 헤드셋" },
            { image: "/images/promotion/pompompurin/mice.webp", model: "Razer 게이밍 마우스" },
            { image: "/images/promotion/pompompurin/mouse-mat.webp", model: "Razer 마우스 매트" },
        ],
        cover: "/images/promotion/collab/pompompurin.webp",
        name: "POMPOMPURIN",
        ko: "폼폼푸린",
        match: /Pompompurin/i,
        headline: "말랑한 하루,\n당신의 셋업으로.",
        intro: "폼폼푸린의 포근함을 담은 게이밍 컬렉션.\n귀여운 디자인으로 책상 위를 채워보세요.",
        stayTitle: "플레이 뒤에도 남는\n폼폼푸린의 미소",
        stayText: "따뜻한 컬러와 캐릭터 디테일로\n하루 종일 기분 좋은 셋업을 완성하세요.",
    }),
    make({
        slug: "counter-strike-2",
        name: "COUNTER-STRIKE 2",
        ko: "카운터 스트라이크 2",
        match: /Counter-Strike 2/i,
        headline: "한 발의 정확도,\n당신의 셋업으로.",
        intro: "카운터 스트라이크 2 를 위해 만든 e스포츠 컬렉션.\n프로의 정밀함을 그대로 손에 쥐어보세요.",
        stayTitle: "라운드가 끝나도 남는\nCS2 의 긴장감",
        stayText: "전장을 담은 디자인으로\n플레이 밖에서도 집중을 이어가세요.",
    }),
    make({
        slug: "2xko",
        hero: "/images/promotion/2xko/hero.webp",
        video: "/videos/collab/2xko.mp4",
        thumb: "/images/promotion/2xko/kitsune-500x500.webp",
        sections: [
            { image: "/images/promotion/2xko/kitsune.webp", model: "Razer Kitsune", productId: 5011 },
            { image: "/images/promotion/2xko/blackshark-v3-pro-xbox.webp", model: "Razer BlackShark V3 Pro for Xbox" },
            { image: "/images/promotion/2xko/iskur-v2-x.webp", model: "Razer Iskur V2 X" },
        ],
        cover: "/images/promotion/collab/2xko.webp",
        name: "2XKO",
        ko: "2XKO",
        match: /2XKO/i,
        headline: "태그 팀의 리듬,\n당신의 셋업으로.",
        intro: "2XKO 를 위해 만든 아케이드 컬렉션.\n모든 입력을 빠르고 정확하게 이어가세요.",
        stayTitle: "플레이 뒤에도 남는\n2XKO 의 에너지",
        stayText: "격투 게임의 감성을 담은 디자인으로\n셋업에 존재감을 더하세요.",
    }),
    make({
        slug: "niko",
        name: "NIKO",
        ko: "NiKo",
        match: /NiKo Edition/i,
        headline: "프로의 선택,\n당신의 셋업으로.",
        intro: "NiKo 가 직접 참여한 시그니처 컬렉션.\n프로의 손끝 감각을 그대로 경험해보세요.",
        stayTitle: "경기가 끝나도 남는\nNiKo 의 시그니처",
        stayText: "선수의 아이덴티티를 담은 디자인으로\n셋업을 완성하세요.",
    }),
    make({
        slug: "faker",
        name: "FAKER",
        ko: "Faker",
        match: /Faker Edition/i,
        headline: "전설의 손끝,\n당신의 셋업으로.",
        intro: "Faker 의 시그니처를 담은 컬렉션.\n최고의 무대에서 검증된 감각을 경험해보세요.",
        stayTitle: "경기가 끝나도 남는\nFaker 의 시그니처",
        stayText: "레전드의 상징을 담은 디자인으로\n당신의 셋업에 무게를 더하세요.",
    }),
];

// 시안 순서 (처음 8개) · 나머지는 "더 보기"
const collabOrder = ["kuromi", "evangelion", "pompompurin", "2xko", "minecraft", "pokemon", "joola", "keith-haring"];
collabs.sort((a, b) => {
    const rank = (c: Collab) => (collabOrder.includes(c.slug) ? collabOrder.indexOf(c.slug) : collabOrder.length);
    return rank(a) - rank(b);
});

export const COLLAB_GRID_COUNT = 8; // 처음 보이는 콜라보 카드 수 (나머지는 "더 보기")

// 프로모션 알아보기 위쪽 대표 컬렉션 (카드 3개)
export const featuredCollab = {
    slug: "evangelion",
    hero: "/images/promotion/evangelion-hero.webp", // 프로모션 알아보기 위쪽 큰 이미지 (콜라보 상세는 영상)
    productIds: [4044, 2005, 1002],
};

// 프로모션 알아보기 FAQ
export const promotionFaq: CollabFaq[] = [
    {
        q: "내 기기가 지원되나요?",
        a: "제품 상세의 '모든 사양 보기'에서 지원 기기 · 연결 방식을 확인할 수 있습니다. PC 와 콘솔 지원 여부는 제품마다 다릅니다.",
    },
    {
        q: "콜라보 한정판은 재입고되나요?",
        a: "콜라보 제품은 한정 수량으로 생산되어 품절 후 재입고되지 않을 수 있습니다.",
    },
    {
        q: "프로모션 가격은 언제까지 적용되나요?",
        a: "프로모션 기간은 각 행사 안내에 표시되며, 재고 소진 시 조기 종료될 수 있습니다.",
    },
    {
        q: "프로모션 상품도 무료 배송인가요?",
        a: "₩139,900 이상 주문 시 대한민국 내 무료 표준 배송이 적용됩니다.",
    },
    {
        q: "콜라보 제품도 교환 · 반품이 되나요?",
        a: "미개봉 상태라면 수령 후 14일 이내에 교환 · 반품을 신청할 수 있습니다. 자세한 내용은 고객지원에서 확인해주세요.",
    },
];

export const supportPath = "/info/service/support";
export const getCollabPath = (slug: string) => `/promotion/collab/${slug}`;
export const findCollab = (slug?: string) => collabs.find((c) => c.slug === slug);

// ---------- 콜라보 상품 · 문구 만들기 ----------

// 콜라보에 속한 상품 (상품명으로 찾음)
export const getCollabProducts = (collab: Collab) => productData.filter((p) => collab.match.test(p.title));

// 콜라보 제품 카드 이미지
export const getCollabCover = (collab: Collab) => {
    if (collab.cover) return collab.cover;
    const first = getCollabProducts(collab)[0];
    return first?.gallery?.[0] ?? first?.image;
};

// 컬렉션 전체 구성 이미지 (컬렉션 소개 · 대표 상품 블록)
export const getCollabCollection = (collab: Collab) =>
    collab.collection ??
    collab.sections?.[0]?.image ??
    getCollabProducts(collab)[0]?.gallery?.[2] ??
    getCollabCover(collab);

// "플레이 뒤에도 남는 …" 블록 큰 이미지 (컬렉션 소개와 겹치지 않게)
// 배너가 3장 이상이면 마지막 배너 (블록에서는 빠짐)
export const getStayImage = (collab: Collab, product?: Product) => {
    if (collab.stay) return collab.stay.image;
    const sections = collab.sections ?? [];
    if (sections.length >= 3) return sections[sections.length - 1].image;
    return product?.gallery?.[3] ?? product?.image;
};

// 상품 id 에 맞는 배너 이미지 (프로모션 대표 카드 등)
export const getSectionImage = (collab: Collab, productId: number) =>
    collab.sections?.find((s) => s.productId === productId)?.image;

// 큰 대표 이미지 (가로형)
export const getCollabHero = (collab: Collab) =>
    collab.hero ?? getCollabProducts(collab)[0]?.gallery?.[0] ?? getCollabCover(collab);

// 들어갈 수 있는 콜라보인지 (종료된 이벤트는 X)
export const isCollabOpen = (collab?: Collab): collab is Collab => !!collab && !collab.ended;

// 모델 이름 (에디션 · 옵션 부분 제외: "Razer Kraken V4 X - Minecraft Edition" → "Razer Kraken V4 X")
const getModelName = (product: Product) => getSeriesTitle(product).split(" - ")[0];

// 상품 제목 2줄: "RAZER DEATHADDER V4 PRO" / "에반게리온 (EVA-01) 에디션"
export const getCollabHeading = (product: Product, collab: Collab) => ({
    model: getModelName(product).toUpperCase(),
    edition: `${collab.ko} 에디션`,
});

// 상품 데이터가 없는 블록의 설명 문구
export const getSectionCopy = (model: string, collab: Collab) =>
    `${collab.ko}에서 영감을 받은 ${model}로 당신만의 셋업을 완성하세요.`;

// 상품 설명 문구
export const getCollabCopy = (product: Product, collab: Collab) => {
    const model = getModelName(product);
    const summary = product.summary ?? "게이밍 기어";
    return `${collab.ko}에서 영감을 받은 ${summary}, ${model}로 당신만의 셋업을 완성하세요.`;
};

// 작은 글씨로 보여줄 대표 사양 (예: 센서 · 스위치)
export const getCollabNote = (product: Product) => {
    const features = product.technicalSpecifications?.flatMap((g) => g.features) ?? [];
    const meaningful = features.filter((f) => !/^(없음|예|아니오|지원)$/.test(f.values.join("")));
    const picked =
        highlightSpecCodes.map((code) => meaningful.find((f) => f.code === code)).find(Boolean) ?? meaningful[0];
    return picked ? `${picked.label} · ${picked.values.join(" · ").replace(/,\s*·/g, ",")}` : "";
};
