// 검색 페이지 데이터 (필터 · 정렬 · 추천상품)
import type { Product } from "../types/product";
import type { HomeProduct } from "./homeData";

// ---------- 필터 ----------
export interface FilterOption {
    id: string;
    label: string;
    match: (product: Product) => boolean;
}

export interface FilterGroup {
    id: string;
    title: string;
    options: FilterOption[];
}

export const filterGroups: FilterGroup[] = [
    {
        id: "category",
        title: "카테고리",
        options: [
            { id: "mice", label: "마우스", match: (p) => p.category === "mice" },
            { id: "keyboards", label: "키보드", match: (p) => p.category === "keyboards" },
            { id: "audio", label: "오디오", match: (p) => p.category === "headphones" },
            { id: "speakers", label: "스피커", match: () => false }, // 스피커 카테고리 데이터 추가 후 연결
        ],
    },
    {
        id: "chroma",
        title: "Chroma RGB",
        options: [
            { id: "yes", label: "지원", match: (p) => p.specs?.chroma === true },
            { id: "no", label: "없음", match: (p) => p.specs?.chroma === false },
        ],
    },
    {
        id: "weight",
        title: "무게",
        options: [
            { id: "under-80", label: "< 80g", match: (p) => (p.specs?.weight ?? Infinity) < 80 },
            { id: "80-100", label: "80g - 100g", match: (p) => { const w = p.specs?.weight; return w !== undefined && w >= 80 && w <= 100; } },
        ],
    },
    {
        id: "sensor",
        title: "센서",
        options: [
            { id: "focus-pro-35k-2", label: "2세대 Focus Pro 35K 옵티컬 센서", match: (p) => p.specs?.sensor === "2세대 Focus Pro 35K 옵티컬 센서" },
        ],
    },
    {
        id: "connection",
        title: "연결 방식",
        options: [
            { id: "wireless", label: "무선", match: (p) => !!p.specs?.connection?.includes("wireless") },
            { id: "wired", label: "유선", match: (p) => !!p.specs?.connection?.includes("wired") },
        ],
    },
    {
        id: "onboard",
        title: "온보드 메모리",
        options: [{ id: "profiles-5", label: "프로파일 5개", match: (p) => p.specs?.onboardProfiles === 5 }],
    },
    {
        id: "buttons",
        title: "프로그래밍 가능 버튼",
        options: [{ id: "over-10", label: "> 10", match: (p) => (p.specs?.programmableButtons ?? 0) > 10 }],
    },
];

// 선택한 필터 적용: 같은 그룹 안에서는 하나라도 맞으면(OR), 그룹끼리는 모두 맞아야(AND)
export type SelectedFilters = Record<string, string[]>;

export const applyFilters = (products: Product[], selected: SelectedFilters) =>
    products.filter((product) =>
        filterGroups.every((group) => {
            const ids = selected[group.id] ?? [];
            if (ids.length === 0) return true;
            return group.options.some((option) => ids.includes(option.id) && option.match(product));
        }),
    );

// ---------- 정렬 ----------
export const sortOptions = [
    { id: "recommended", label: "추천순" },
    { id: "price-low", label: "낮은 가격순" },
    { id: "price-high", label: "높은 가격순" },
    { id: "name", label: "이름순" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];

export const sortProducts = (products: Product[], sortId: SortId) => {
    const list = [...products];
    // 가격 없는 상품(null)은 항상 뒤로
    const price = (p: Product, empty: number) => p.price ?? empty;
    if (sortId === "price-low") list.sort((a, b) => price(a, Infinity) - price(b, Infinity));
    if (sortId === "price-high") list.sort((a, b) => price(b, -Infinity) - price(a, -Infinity));
    if (sortId === "name") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
};

// ---------- 추천상품 (productData id) ----------
export const recommendedIds = [2018, 2006, 2026, 2010, 2022, 2019];

// ---------- 상품 → 카드 표시용 ----------
export const formatPrice = (product: Product) => {
    if (product.price === null) return product.soldOut ? "품절" : "가격 미정";
    return `₩${product.price.toLocaleString("ko-KR")}원`;
};

export const toCardProduct = (product: Product): HomeProduct => ({
    id: String(product.id),
    name: product.title,
    price: formatPrice(product),
    image: product.image,
});

// ---------- 인기 검색 (헤더 검색창) ----------
export const popularKeywords = ["Viper V4 Pro", "DeathAdder V4 Pro", "Basilisk V4", "Naga V3 Pro", "Orochi V2"];

// 검색 결과 페이지 주소
export const getSearchPath = (keyword: string) => {
    const word = keyword.trim();
    return word ? `/search?q=${encodeURIComponent(word)}` : "/search";
};
