// 메인홈 시안(PDF) 데이터 — API 연결 전 임시 데이터
// image가 없는 항목은 화면에 텍스트로 대체됩니다.
// 이미지가 준비되면 public 경로를 image 에 넣어주세요.

export interface HomeExploreItem {
    name: string;
    price: string;
    image?: string;
    colors?: string[];
}

export interface HomeProduct {
    name: string;
    description: string;
    price: string;
    originalPrice: string;
    image?: string;
    colors: string[];
    liked?: boolean;
}

export interface HomeCategory {
    name: string;
    image?: string;
    to: string;
}

const productColors = ["#000000", "#44D62C", "#DD27E3"];

// 제품 탐색
export const exploreItems: HomeExploreItem[] = [
    {
        name: "Razer Viper V4 Pro - Esports Green Edition",
        price: "₩249,000원",
        colors: productColors,
    },
    { name: "Razer Basilisk Mobile", price: "₩143,980" },
    { name: "Razer Viper V3 Pro", price: "₩85,370.00" },
    { name: "Razer Viper V3 Pro", price: "₩143,980" },
    { name: "Razer Viper V3 Pro", price: "₩143,980" },
    { name: "Razer Viper V3 Pro", price: "₩143,980" },
];

// 카테고리 (첫 번째 항목이 왼쪽 큰 타일)
export const categories: HomeCategory[] = [
    { name: "키보드", image: "/images/category/cate_banner_keyboard.webp", to: "/" },
    { name: "마우스", image: "/images/category/cate_banner_mouse.webp", to: "/" },
    { name: "마우스패드", image: "/images/category/cate_banner_pad.webp", to: "/" },
    { name: "컨트롤러", image: "/images/category/cate_banner_con.webp", to: "/" },
    { name: "콜라보 제품", image: "/images/category/cate_banner_col.webp", to: "/" },
];

// 신상품 · 가장 많이 사용하는 제품
export const homeProducts: HomeProduct[] = Array.from({ length: 5 }, (_, i) => ({
    name: "Razer Huntsman V3 Pro Mini 8KHz",
    description: "로우 프로파일 아날로그 옵티컬 E스포츠 키보드",
    price: "₩ 289,000",
    originalPrice: "₩ 309,900",
    colors: productColors,
    liked: i === 0,
}));

// 히어로 · 배너 이미지 (없으면 텍스트 표시)
// promoVideo 가 있으면 홍보배너는 영상으로 재생됩니다.
export const homeImages: {
    hero?: string;
    promoBanner?: string;
    promoVideo?: string;
} = {
    promoVideo: "/videos/EVA-banner.mp4",
};
