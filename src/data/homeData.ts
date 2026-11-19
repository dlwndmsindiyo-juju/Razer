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

// 카테고리 (첫 번째 항목이 왼쪽 큰 타일)
export const categories: HomeCategory[] = [
    { name: "키보드", image: "/images/category/cate_banner_keyboard.webp", to: "/products/keyboards" },
    { name: "마우스", image: "/images/category/cate_banner_mouse.webp", to: "/products/mice" },
    { name: "마우스패드", image: "/images/category/cate_banner_pad.webp", to: "/products/mousepads" },
    { name: "컨트롤러", image: "/images/category/cate_banner_con.webp", to: "/products/controllers" },
    { name: "콜라보 제품", image: "/images/category/cate_banner_col.webp", to: "/products/collab" },
];

// 홈의 진열 순서는 상품 ID로 관리합니다.
export const exploreProductIds = [2018, 2043, 2006, 2041, 2046, 2061];
export const bestProductIds = [1024, 1049, 1059, 1052, 1050, 1005];
// 히어로 · 배너 이미지 (없으면 텍스트 표시)
// promoVideo 가 있으면 홍보배너는 영상으로 재생됩니다.
export const homeImages: {
    hero?: string;
    promoBanner?: string;
    promoVideo?: string;
} = {
    promoVideo: "/videos/EVA-banner.mp4",
};


