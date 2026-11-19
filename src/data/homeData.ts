// 메인홈 시안(PDF) 데이터 — API 연결 전 임시 데이터
// image가 없는 항목은 화면에 텍스트로 대체됩니다.
// 이미지가 준비되면 public 경로를 image 에 넣어주세요.

// 제품 탐색 · 신상품 · 가장 많이 사용하는 제품 공통 상품
export interface HomeProduct {
    id: string;
    name: string;
    price: string;
    image?: string;
    colors?: string[]; // 이미지 왼쪽 아래 컬러칩
    liked?: boolean; // 위시리스트 처음 상태
}

export interface HomeCategory {
    name: string;
    image?: string;
    to: string;
}

// 카테고리 (첫 번째 항목이 왼쪽 큰 타일)
export const categories: HomeCategory[] = [
    { name: "키보드", image: "/images/category/cate_banner_keyboard.webp", to: "/" },
    { name: "마우스", image: "/images/category/cate_banner_mouse.webp", to: "/" },
    { name: "마우스패드", image: "/images/category/cate_banner_pad.webp", to: "/" },
    { name: "컨트롤러", image: "/images/category/cate_banner_con.webp", to: "/" },
    { name: "콜라보 제품", image: "/images/category/cate_banner_col.webp", to: "/" },
];

// 제품 탐색
export const exploreProducts: HomeProduct[] = [
    { id: "viper-v4-pro-green", name: "Razer Viper V4 Pro - Esports Green Edition", price: "249,000원부터", liked: true },
    { id: "deathadder-v4-pro-black", name: "Razer DeathAdder V4 Pro - 블랙", price: "268,880원" },
    { id: "basilisk-v4-pro", name: "Razer Basilisk V4 Pro", price: "268,800원" },
    { id: "cobra-hyperspeed", name: "Razer Cobra HyperSpeed", price: "158,780원" },
    { id: "basilisk-mobile", name: "Razer Basilisk Mobile", price: "143,980원" },
    { id: "viper-v3-pro-black", name: "Razer Viper V3 Pro - 블랙", price: "194,190원부터" },
];

const blackWhite = ["#000000", "#FFFFFF"];

// 신상품 (탭별 상품 · 모든 탭 같은 카드 디자인)
export const newArrivalTabs = ["키보드", "마우스", "컨트롤러"] as const;

// 상품 확정 전 플레이스홀더 6개
const placeholderProducts = (prefix: string): HomeProduct[] =>
    Array.from({ length: 6 }, (_, i) => ({
        id: `${prefix}-${i + 1}`,
        name: "Product Name (상품명)",
        price: "Price (가격)",
    }));

export const newArrivals: Record<(typeof newArrivalTabs)[number], HomeProduct[]> = {
    키보드: [
        { id: "reclusa-x-mini-65", name: "Razer Reclusa X Mini 65% - US", price: "89,000원" },
        { id: "huntsman-v3-pro-mini-8k", name: "Razer Huntsman V3 Pro Mini 8KHz", price: "289,000원" },
        { id: "huntsman-v3-pro-lp-tkl-8k", name: "Razer Huntsman V3 Pro Low-Profile Tenkeyless 8KHz", price: "359,000원" },
        { id: "huntsman-v3-pro-tkl-8k", name: "Razer Huntsman V3 Pro Tenkeyless 8KHz", price: "338,000원부터", colors: blackWhite },
        { id: "huntsman-v3-he-tkl-8k", name: "Razer Huntsman V3 HE Magnetic Tenkeyless 8KHz", price: "230,800원" },
        { id: "huntsman-v3-he-mini-65-8k", name: "Razer Huntsman V3 HE Magnetic Mini 65% 8KHz", price: "199,800원" },
    ],
    마우스: placeholderProducts("new-mouse"),
    컨트롤러: placeholderProducts("new-controller"),
};

// 가장 많이 사용하는 제품
export const bestProducts: HomeProduct[] = [
    { id: "huntsman-v3-pro-8k", name: "Razer Huntsman V3 Pro 8KHz", price: "378,000원" },
    { id: "blackwidow-v4-pro-75", name: "Razer BlackWidow V4 Pro 75%", price: "399,900원" },
    { id: "blackwidow-v4-75", name: "Razer BlackWidow V4 75%", price: "289,000원부터", colors: blackWhite },
    { id: "blackwidow-v4-pro-orange", name: "Razer BlackWidow V4 Pro - 오렌지 스위치 - US - 블랙", price: "339,000원", colors: blackWhite },
    { id: "huntsman-v3-pro-tkl-white", name: "Razer Huntsman V3 Pro Tenkeyless - US - 화이트", price: "242,090원" },
    { id: "ornata-v3-tkl-pompompurin", name: "Razer Ornata V3 Tenkeyless - US - Pompompurin Edition", price: "182,000원" },
];

// 히어로 · 배너 이미지 (없으면 텍스트 표시)
// promoVideo 가 있으면 홍보배너는 영상으로 재생됩니다.
export const homeImages: {
    hero?: string;
    promoBanner?: string;
    promoVideo?: string;
} = {
    promoVideo: "/videos/EVA-banner.mp4",
};
