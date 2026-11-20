// GNB "제품" 서브 메뉴 (메가 메뉴) 데이터
// image가 없는 카테고리는 텍스트로 표시됩니다.

export interface NavCategory {
    slug: string; // 목록 페이지 주소 /products/:slug
    label: string;
    image?: string;
}

export interface NavLink {
    slug: string; // 목록 페이지 주소 /products/:slug
    label: string;
}

export const productMenu = {
    title: "카테고리별",
    // 누끼 이미지 (public/images/sub-menu-card) · 카드 배경색은 CSS
    categories: [
        { slug: "keyboards", label: "키보드", image: "/images/sub-menu-card/keyboard.webp" },
        { slug: "mice", label: "마우스", image: "/images/sub-menu-card/mouse.webp" },
        { slug: "mousepads", label: "마우스 패드", image: "/images/sub-menu-card/mousepad.webp" },
        { slug: "audio", label: "오디오", image: "/images/sub-menu-card/audio.webp" },
        { slug: "collab", label: "콜라보", image: "/images/sub-menu-card/collab.webp" },
        { slug: "goods", label: "Razer 굿즈", image: "/images/sub-menu-card/goods.webp" },
    ] as NavCategory[],

    // 오른쪽 링크: 판매 중인 제품 중 카드에 없는 것 (Razer 스토어 메뉴 기준)
    links: [
        { slug: "new", label: "신제품" },
        { slug: "controllers", label: "컨트롤러" },
        { slug: "content-creation", label: "콘텐츠 제작" },
    ] as NavLink[],
};

export const getCategoryPath = (slug: string) => `/products/${slug}`;

// 헤더 아래 프로모션 바 문구
export const promoBarText = "동안 ₩139,900 이상의 모든 주문은 대한민국으로의 무료 표준 배송 혜택을 누릴 수 있습니다.";
