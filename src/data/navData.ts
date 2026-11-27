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
// 모바일(360) 프로모션 바: 짧은 한 줄 (흐르지 않음)
export const promoBarShortText = "139,900원 이상 주문 시 국내 무료 표준 배송";
export const promoBarText = "동안 ₩139,900 이상의 모든 주문은 대한민국으로의 무료 표준 배송 혜택을 누릴 수 있습니다.";

// =========================================================
// GNB 서브 메뉴 (PC 메가 메뉴 · 모바일 메뉴 공용) · 아이콘: public/icons/ui (흰색)
// =========================================================
export interface MenuLink {
    label: string;
    to: string;
    icon: string; // 모바일 메뉴 왼쪽 아이콘
}

export interface MenuColumn {
    title: string; // PC 칼럼 제목 · 모바일 구역 제목 (첫 구역은 숨김)
    links: MenuLink[];
}

export interface GnbMenu {
    slug: "product" | "promotion" | "service";
    title: string;
    railIcon: string; // 모바일 왼쪽 세로 메뉴 아이콘
    columns: MenuColumn[];
    box?: { pc: { title: string; text: string }; mobile: { title: string; text: string } };
}

const ui = (name: string) => `/icons/ui/${name}.svg`;

// 제품: 카테고리 카드(productMenu.categories) + 오른쪽 "RAZER 더 알아보기"
export const productMore = {
    title: "RAZER 더 알아보기",
    note: "당신의 플레이에 맞는 기어를 찾아보세요.",
    links: [
        { label: "구매 방법", to: "/info/product/how-to-buy", icon: ui("store") },
        { label: "Razer 독점", to: "/info/product/razer-exclusives", icon: ui("tag") },
        { label: "Razer 멤버십", to: "/info/product/membership", icon: ui("account") },
        { label: "신제품", to: "/products/new", icon: ui("review") },
        { label: "컨트롤러", to: "/products/controllers", icon: ui("controller") }, // 시안 "레트로" 는 상품 데이터가 없어 컨트롤러로
        { label: "콘텐츠 제작", to: "/products/content-creation", icon: ui("microphone") },
    ] as MenuLink[],
};

// 모바일 제품 메뉴: 카테고리 (아이콘) → 구분선 → 구매 방법 · Razer 독점 · Razer 멤버십
const categoryIcons: Record<string, string> = {
    keyboards: ui("keyboard"), mice: ui("mouse"), mousepads: ui("3d-model"), audio: ui("headset"), collab: ui("tag"), goods: ui("controller"),
};

export const gnbMenus: GnbMenu[] = [
    {
        slug: "product",
        title: "제품",
        railIcon: ui("keyboard"),
        columns: [
            {
                title: "카테고리별",
                links: productMenu.categories.map((c) => ({ label: c.label, to: getCategoryPath(c.slug), icon: categoryIcons[c.slug] ?? ui("tag") })),
            },
            { title: "", links: productMore.links.slice(0, 3) },
        ],
    },
    {
        slug: "promotion",
        title: "프로모션",
        railIcon: ui("tag"),
        columns: [
            {
                title: "프로모션",
                links: [
                    { label: "프로모션 알아보기", to: "/info/promotion/promotions", icon: ui("tag") },
                    { label: "제품 기술", to: "/info/promotion/technology", icon: ui("3d-model") },
                    { label: "e스포츠", to: "/info/promotion/esports", icon: ui("controller") },
                ],
            },
            {
                title: "Razer 컬렉션",
                links: [
                    { label: "Razer 독점", to: "/info/product/razer-exclusives", icon: ui("tag") },
                    { label: "Razer 멤버십", to: "/info/product/membership", icon: ui("account") },
                    { label: "콜라보", to: "/products/collab", icon: ui("controller") },
                ],
            },
        ],
        box: {
            pc: { title: "FOR GAMERS. BY GAMERS.", text: "새로운 컬렉션과 Razer의 기술,\ne스포츠 이야기를 만나보세요." },
            mobile: { title: "새로운 플레이를 만나보세요.", text: "컬렉션부터 기술과 e스포츠까지." },
        },
    },
    {
        slug: "service",
        title: "서비스",
        railIcon: ui("help"),
        columns: [
            {
                title: "고객 지원",
                links: [
                    { label: "FAQ", to: "/info/service/faq", icon: ui("help") },
                    { label: "등록 및 보증", to: "/info/service/registration-warranty", icon: ui("warranty") },
                    { label: "지원", to: "/info/service/support", icon: ui("info") },
                ],
            },
            {
                title: "구매 안내",
                links: [
                    { label: "구매 방법", to: "/info/product/how-to-buy", icon: ui("store") },
                    { label: "배송·반품 안내", to: "/info/service/faq?topic=returns", icon: ui("delivery") },
                    { label: "문의하기", to: "/info/company/contact", icon: ui("review") },
                ],
            },
        ],
        box: {
            pc: { title: "언제나 플레이할 수 있도록", text: "제품 등록부터 보증 확인까지,\n필요한 서비스를 한곳에서 찾아보세요." },
            mobile: { title: "플레이를 위한 든든한 지원", text: "제품 등록과 보증을 한곳에서." },
        },
    },
];

// 검색 패널 (모바일): 인기 검색 TOP 5 · 카테고리로 찾기
export const searchCategories = [
    { label: "키보드", to: "/products/keyboards" },
    { label: "마우스", to: "/products/mice" },
    { label: "한정판", to: "/products/collab" },
];
