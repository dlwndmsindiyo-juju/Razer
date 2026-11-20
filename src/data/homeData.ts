// 메인홈 시안(PDF) 데이터 — API 연결 전 임시 데이터
// image가 없는 항목은 화면에 텍스트로 대체됩니다.
// 이미지가 준비되면 public 경로를 image 에 넣어주세요.

// 제품 탐색 · 신상품 · 가장 많이 사용하는 제품 공통 상품
export interface HomeProduct {
    id: string;
    name: string;
    price: string;
    to?: string;
    originalPrice?: string;
    badge?: string;
    image?: string;
    colors?: string[]; // 이미지 왼쪽 아래 컬러칩
    liked?: boolean; // 위시리스트 처음 상태
}

export interface HomeCategory {
    name: string;
    image?: string;
    to: string;
}

// 카테고리 (첫 번째 항목이 왼쪽 큰 타일) · 누끼 이미지는 헤더 서브 메뉴 카드와 같은 파일 사용
export const categories: HomeCategory[] = [
    { name: "키보드", image: "/images/sub-menu-card/keyboard.webp", to: "/products/keyboards" },
    { name: "마우스", image: "/images/sub-menu-card/mouse.webp", to: "/products/mice" },
    { name: "마우스패드", image: "/images/sub-menu-card/mousepad.webp", to: "/products/mousepads" },
    { name: "오디오", image: "/images/sub-menu-card/audio.webp", to: "/products/controllers" },
    { name: "Razer 굿즈", image: "/images/sub-menu-card/goods.webp", to: "/products/goods" },
];

// 홈의 진열 순서는 상품 ID로 관리합니다.
export const bestProductIds = [1024, 1049, 1059, 1052, 1050, 1005];
// 히어로 · 배너 이미지 (없으면 텍스트 표시)
// promoVideo 가 있으면 홍보배너는 영상으로 재생됩니다.
// heroVideo · promoVideo 가 있으면 영상으로 재생됩니다.
export const homeImages: {
    hero?: string;
    heroVideo?: string;
    promoBanner?: string;
    promoVideo?: string;
} = {
    heroVideo: "/videos/hero-video.mp4",
    promoVideo: "/videos/EVA-banner.mp4",
};

// ---------- 프로게이머 PICK ----------
// productId 의 가격 · 상품 이미지 · 상세 링크는 productData 에서 가져옵니다.
export interface ProPick {
    player: string;
    game: string;
    productId: number;
    productName: string; // 카드에 보이는 상품명 (짧게)
    variant: string; // 상품명 아래 회색 설명
    playerImage: string;
}

export const proPicksMoreLink = "/info/promotion/esports"; // Team Razer 보기

export const proPicks: ProPick[] = [
    {
        player: "대상혁",
        game: "League of Legends",
        productId: 2018, // Razer Viper V4 Pro - Esports Green Edition
        productName: "Razer Viper V4 Pro",
        variant: "Esports Green Edition",
        playerImage: "/images/home/pro-pick/faker.webp",
    },
    {
        player: "샤치",
        game: "Call of Duty",
        productId: 4025, // Razer BlackShark V3 Pro for PlayStation and PC - 블랙
        productName: "Razer BlackShark V3 Pro",
        variant: "PlayStation · 블랙",
        playerImage: "/images/home/pro-pick/shotzzy.webp",
    },
    {
        player: "젤시스",
        game: "VALORANT",
        productId: 1029, // Razer Huntsman V3 Pro Tenkeyless 8KHz - US - Esports Green Edition
        productName: "Razer Huntsman V3 Pro TKL 8KHz",
        variant: "Esports Green Edition · US",
        playerImage: "/images/home/pro-pick/zellsis.webp",
    },
];

// ---------- 취향으로 완성하는 셋업 ----------
// + 를 누르면 오른쪽에 그 상품 정보(productData)가 나타나고, x 를 누르면 사라집니다.
export interface SetupHotspot {
    x: number; // 이미지 기준 가로 위치 (%)
    y: number; // 이미지 기준 세로 위치 (%)
    productId: number;
    variant: string; // 상품명 아래 회색 설명
}

export const setupShowcase = {
    title: "취향으로 완성하는 셋업",
    moreLink: { label: "모든 컬렉션 보기", to: "/products/collab" },
    collectionTitle: "은랑의 감각으로\n완성하는 셋업.", // \n = 줄바꿈
    subtitle: "Razer | 붕괴: 스타레일 컬렉션",
    image: "/images/home/setup/honkai-star-rail.webp", // 배경 + 마우스 · 헤드셋 합성 (1112 x 480)
    hotspots: [
        { x: 49.06, y: 27.6, productId: 2003, variant: "붕괴 에디션" }, // Viper V3 Pro SE - Honkai: Star Rail Edition
        { x: 83.68, y: 36.77, productId: 4001, variant: "붕괴 에디션" }, // BlackShark V3 X HyperSpeed - Honkai: Star Rail Edition
    ] as SetupHotspot[],
    collectionButton: { label: "스타레일 컬렉션 보기", to: "/search?q=Honkai" },
};
