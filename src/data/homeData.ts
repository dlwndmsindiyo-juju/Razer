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
// productId 의 상품명 · 가격 · 상세 링크를 productData 에서 가져옵니다.
// 이미지는 경로만 지정 (파일이 없으면 글자로 표시)
export interface ProPick {
    player: string;
    game: string;
    productId: number;
    productName: string; // 카드에 보이는 상품명 (짧게)
    variant: string; // 상품명 아래 회색 설명
    playerImage: string;
    productImage: string;
}

export const proPicksMoreLink = "/info/promotion/esports"; // Team Razer 보기

export const proPicks: ProPick[] = [
    {
        player: "대상혁",
        game: "League of Legends",
        productId: 2018,
        productName: "Razer Viper V4 Pro",
        variant: "Esports Green Edition",
        playerImage: "/images/home/pro-pick/faker.webp",
        productImage: "/images/home/pro-pick/pick-1-product.webp",
    },
    {
        player: "샤치",
        game: "Call of Duty",
        productId: 4025,
        productName: "Razer BlackShark V3 Pro",
        variant: "PlayStation · 블랙",
        playerImage: "/images/home/pro-pick/shotzzy.webp",
        productImage: "/images/home/pro-pick/pick-2-product.webp",
    },
    {
        player: "젤시스",
        game: "VALORANT",
        productId: 1029,
        productName: "Razer Huntsman V3 Pro TKL 8KHz",
        variant: "Esports Green Edition · US",
        playerImage: "/images/home/pro-pick/zellsis.webp",
        productImage: "/images/home/pro-pick/pick-3-product.webp",
    },
];

// ---------- 취향으로 완성하는 셋업 ----------
export const setupShowcase = {
    title: "취향으로 완성하는 셋업",
    collectionTitle: "Razer × BLACKPINK 컬렉션",
    subtitle: "블랙핑크와 스포트라이트의 중심으로",
    image: "/images/home/setup/setup-main.webp",
    // 이미지 위 + 표시 (x · y 는 이미지 기준 %) · 누르면 해당 상품 상세로
    hotspots: [
        { x: 23.4, y: 43.9, productId: 1019 },
        { x: 60.1, y: 43.9, productId: 1019 },
        { x: 82, y: 59, productId: 1019 },
    ],
    collectionButton: { label: "폼폼푸린 컬렉션 보기", to: "/products/collab" },
    product: {
        productId: 1019,
        name: "Razer Ornata V3 Tenkeyless",
        variant: "블랙핑크 에디션 · US",
        image: "/images/home/setup/setup-product.webp",
    },
};

