// 검색 페이지 데이터 (필터 · 정렬 · 추천상품)
import type { Product, ProductCategory, ProductCollection } from "../types/product";
import { catalogListings, categoryLabels, collectionLabels, getProductsByCategory, getBadgeLabel, getProductsByCollection, isInCollection } from "./productData";
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

const normalize = (value: string) => value.trim().toLocaleLowerCase("ko-KR");
const inCategory = (product: Product, category: ProductCategory) =>
    (product.categories ?? [product.category]).includes(category);

const menuCategories: Record<string, ProductCategory> = {
    keyboards: "keyboards", mice: "mice", mousepads: "mousepads", audio: "headphones",
    goods: "merch", controllers: "controllers", "content-creation": "contentCreation",
};

export const getCatalogScope = (slug: string) => {
    const category = Object.hasOwn(menuCategories, slug) ? menuCategories[slug] : undefined;
    if (category) return { title: categoryLabels[category], products: getProductsByCategory(category) };
    if (slug === "collab" || slug === "new") {
        return { title: collectionLabels[slug], products: getProductsByCollection(slug) };
    }
};

const categoryGroup: FilterGroup = {
    id: "category", title: "카테고리",
    options: Object.entries(categoryLabels).map(([id, label]) => ({
        id, label, match: (p) => inCategory(p, id as ProductCategory),
    })),
};

const collectionGroup: FilterGroup = {
    id: "collection", title: "컬렉션",
    options: (Object.keys(collectionLabels) as ProductCollection[]).map((id) => ({
        id, label: collectionLabels[id], match: (p) => isInCollection(p, id),
    })),
};

const variantValues = (product: Product, label: RegExp) =>
    product.selectedOptions?.filter((option) => label.test(option.label)).map((option) => option.value) ?? [];

const readFacet = (product: Product, code: string, label: string): string[] => {
    const values = product.filters?.flatMap((group) => group.features)
        .filter((feature) => code.toLowerCase().endsWith("-" + feature.code.toLowerCase()))
        .flatMap((feature) => feature.values) ?? [];
    if (/색상|디자인/.test(label)) return [...values, ...(product.specs?.color ?? [])];
    if (/사이즈|^크기$/.test(label)) return [...values, ...variantValues(product, /사이즈|크기/)];
    if (label === "연결 방식") return [
        ...values, ...(product.specs?.connection ?? []).map((item) => item === "wired" ? "유선" : "무선"),
    ];
    if (/스위치/.test(label)) return [...values, ...(product.specs?.switches ?? [])];
    if (code.endsWith("-chroma-rgb") && product.specs?.chroma !== undefined) {
        return [...values, String(product.specs.chroma)];
    }
    return values;
};

const stockAliases: Record<string, string> = { "재고 있음": "inStock", "품절": "outOfStock", "재고 부족": "lowStock" };

export const getFilterGroups = (products: Product[]): FilterGroup[] => {
    const activeListings = new Set(products.flatMap((product) => product.listingUrls ?? []));
    const facets = new Map<string, { label: string; options: Map<string, FilterOption> }>();

    for (const listing of catalogListings) {
        if (!activeListings.has(listing.url)) continue;
        for (const facet of listing.filters) {
            if (facet.code === "category") continue;
            const id = facet.code === "stockAvailability" ? facet.code : normalize(facet.label);
            let group = facets.get(id);
            if (!group) {
                group = { label: facet.label, options: new Map() };
                facets.set(id, group);
            }
            for (const value of facet.values) {
                const optionId = normalize(value.label);
                const previous = group.options.get(optionId);
                const encoded = value.query?.split(":").at(-1);
                const decoded = encoded ? new URLSearchParams("value=" + encoded).get("value") : null;
                const candidates = new Set([optionId, ...(decoded ? [normalize(decoded)] : [])]);
                group.options.set(optionId, {
                    id: optionId,
                    label: value.label,
                    match: (product) => {
                        if (previous?.match(product)) return true;
                        if (!product.listingUrls?.includes(listing.url)) return false;
                        if (facet.code === "stockAvailability") {
                            return product.stockStatus === (stockAliases[value.label] ?? decoded);
                        }
                        return readFacet(product, facet.code, facet.label).some((item) => candidates.has(normalize(item)));
                    },
                });
            }
        }
    }

    return [
        categoryGroup, collectionGroup,
        ...Array.from(facets, ([id, group]) => ({ id, title: group.label, options: [...group.options.values()] })),
    ].map((group) => ({
        ...group,
        options: group.options.filter((option) => products.some(option.match)),
    })).filter((group) => group.options.length > 0);
};

export type SelectedFilters = Record<string, string[]>;

export const applyFilters = (products: Product[], selected: SelectedFilters, groups: FilterGroup[]) => {
    const activeGroups = groups.flatMap((group) => {
        const selectedIds = selected[group.id] ?? [];
        const options = group.options.filter((option) => selectedIds.includes(option.id));
        return options.length ? [options] : [];
    });
    return products.filter((product) => activeGroups.every((options) => options.some((option) => option.match(product))));
};

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
    return `${product.price.toLocaleString("ko-KR")}원`;
};

export const toCardProduct = (product: Product): HomeProduct => ({
    id: String(product.id),
    name: product.title,
    price: formatPrice(product),
    image: product.image,
    to: `/products/${product.category}/${product.id}`,
    originalPrice: product.originalPrice?.toLocaleString("ko-KR"),
    badge: product.soldOut ? "품절" : getBadgeLabel(product.badge),
});

// ---------- 인기 검색 (헤더 검색창) ----------
export const popularKeywords = ["Viper V4 Pro", "DeathAdder V4 Pro", "Basilisk V4", "Naga V3 Pro", "Orochi V2"];

// 검색 결과 페이지 주소
export const getSearchPath = (keyword: string) => {
    const word = keyword.trim();
    return word ? `/search?q=${encodeURIComponent(word)}` : "/search";
};

