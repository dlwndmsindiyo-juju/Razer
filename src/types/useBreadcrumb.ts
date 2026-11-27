import { useLocation } from "react-router-dom";
import { categoryLabels, getProductById } from "../data/productData";
import { getCatalogScope } from "../data/searchData";
import { findCollab } from "../data/collabData";
import { findFooterPage, footerCompany, footerGroups } from "../data/footerData";
import { technologyCategories } from "../data/technologyData";
import { mypageTabs } from "./mypageData";
import type { ProductCategory } from "./product";

export interface Crumb {
    label: string;
    to?: string; // 없으면 현재 페이지 (링크 없음)
}

// 상품 카테고리 → 목록 페이지 주소 (/products/:slug)
const catalogSlug: Partial<Record<ProductCategory, string>> = {
    keyboards: "keyboards", mice: "mice", mousepads: "mousepads", headphones: "audio",
    merch: "goods", controllers: "controllers", contentCreation: "content-creation",
};

// 푸터 데이터에 없는 페이지 이름
const extraPages: Record<string, string> = {
    "service/razercare": "Razer Care",
    "company/sustainability": "지속 가능성",
    "company/zventures": "zVentures",
};

const group = (slug: string) => [...footerGroups, footerCompany].find((g) => g.slug === slug);

// 주소 → 경로 (예: 제품 > 키보드 > Razer BlackWidow V4)
export const getBreadcrumb = (pathname: string, search: string): Crumb[] => {
    const parts = pathname.split("/").filter(Boolean);
    const params = new URLSearchParams(search);
    const [first, second, third, fourth] = parts;

    if (!first || ["login", "signup", "password-reset"].includes(first)) return [];

    if (first === "search") {
        const q = params.get("q");
        return q ? [{ label: "검색", to: "/search" }, { label: `"${q}"` }] : [{ label: "검색" }];
    }

    if (first === "cart") return [{ label: "장바구니" }];
    if (first === "checkout") {
        const base: Crumb[] = [{ label: "장바구니", to: "/cart" }];
        return second === "complete"
            ? [...base, { label: "결제하기", to: "/checkout" }, { label: "주문 완료" }]
            : [...base, { label: "결제하기" }];
    }

    if (first === "mypage") {
        const tab = mypageTabs.find(({ key }) => key === params.get("tab"));
        if (params.get("view") === "wishlist") return [{ label: "마이페이지", to: "/mypage" }, { label: "위시리스트" }];
        return tab && tab.key !== "home" ? [{ label: "마이페이지", to: "/mypage" }, { label: tab.label }] : [{ label: "마이페이지" }];
    }

    if (first === "products") {
        // 목록: /products/:slug
        if (!third) {
            const scope = second ? getCatalogScope(second) : undefined;
            return [{ label: "제품", to: "/search" }, { label: scope?.title ?? "상품 목록" }];
        }
        // 상세: /products/:category/:id (/customize)
        const product = getProductById(Number(third));
        const category = second as ProductCategory;
        const slug = catalogSlug[category];
        const crumbs: Crumb[] = [
            { label: "제품", to: "/search" },
            { label: categoryLabels[category] ?? "상품", to: slug ? `/products/${slug}` : "/search" },
        ];
        const title = product?.title ?? "상품";
        return fourth === "customize"
            ? [...crumbs, { label: title, to: `/products/${second}/${third}` }, { label: "커스터마이징" }]
            : [...crumbs, { label: title }];
    }

    if (first === "promotion" && second === "collab") {
        return [
            { label: "프로모션", to: "/info/promotion" },
            { label: "프로모션 알아보기", to: "/info/promotion/promotions" },
            { label: findCollab(third)?.name ?? "콜라보" },
        ];
    }

    if (first === "info" && second) {
        const g = group(second);
        const top: Crumb = { label: g?.title ?? "안내", to: `/info/${second}` };
        if (!third) return [{ label: top.label }];
        const label = findFooterPage(second, third).page?.label ?? extraPages[`${second}/${third}`] ?? third;
        const pagePath = `/info/${second}/${third}`;
        // 한 단계 더: 제품 기술 > 기술 · e스포츠 > NiKo / Esports Green
        if (fourth) {
            const sub =
                third === "technology"
                    ? technologyCategories.find(({ slug }) => slug === fourth)?.label
                    : third === "esports"
                      ? { niko: "NiKo", green: "Esports Green" }[fourth]
                      : undefined;
            return sub ? [top, { label, to: pagePath }, { label: sub }] : [top, { label }];
        }
        return [top, { label }];
    }

    return [];
};

// =========================================================
// 들어온 길 반영: 상세 페이지(상품 · 콜라보 · 선수 등)는 "어디에서 눌러서 왔는지" 뒤에 붙임
// 예) 프로모션 알아보기에서 상품 클릭 → 프로모션 > 프로모션 알아보기 > 상품명
//     검색에서 상품 클릭 → 검색 > "Viper" > 상품명
//     주소를 바로 열었거나 메인에서 왔으면 → 기본 경로 (제품 > 키보드 > 상품명)
// 메뉴 페이지(목록 · 안내 · 장바구니 등)는 항상 기본 경로
// =========================================================
type Leaf = "product" | "customize" | "collab" | "player";

const leafOf = (pathname: string): Leaf | undefined => {
    if (/^\/products\/[^/]+\/[^/]+\/customize$/.test(pathname)) return "customize";
    if (/^\/products\/[^/]+\/[^/]+$/.test(pathname)) return "product";
    if (/^\/promotion\/collab\/[^/]+$/.test(pathname)) return "collab";
    if (/^\/info\/promotion\/esports\/(niko|green)$/.test(pathname)) return "player";
    return undefined;
};

interface Visit {
    path: string; // 주소 + 검색어 (?q=)
    pathname: string;
    trail: Crumb[];
}

// 방문마다 (location.key) 계산한 경로를 기억 → 뒤로 가기 해도 같은 경로
const visits = new Map<string, Visit>();
let lastVisit: Visit | undefined;

const MAX_DEPTH = 5;

const resolveTrail = (key: string, pathname: string, search: string): Crumb[] => {
    const saved = visits.get(key);
    if (saved && saved.path === pathname + search) return saved.trail;

    const base = getBreadcrumb(pathname, search);
    const leaf = leafOf(pathname);
    const prev = lastVisit;
    let trail = base;

    if (leaf && base.length && prev && prev.trail.length && prev.pathname !== pathname) {
        const current = base[base.length - 1];
        const prevLeaf = leafOf(prev.pathname);
        // 커스터마이징: 그 상품 상세에서 왔을 때만 상세 경로 뒤에
        if (leaf === "customize") {
            trail = prevLeaf === "product" && pathname.startsWith(prev.pathname + "/")
                ? [...prev.trail.slice(0, -1), { ...prev.trail[prev.trail.length - 1], to: prev.path }, current]
                : base;
        } else {
            // 같은 종류 상세끼리 이동 (추천 상품 → 다른 상품): 마지막만 바꿈
            const from = prevLeaf === leaf
                ? prev.trail.slice(0, -1)
                : [...prev.trail.slice(0, -1), { ...prev.trail[prev.trail.length - 1], to: prev.path }];
            trail = [...from, current].slice(-MAX_DEPTH);
        }
    }

    const visit = { path: pathname + search, pathname, trail };
    visits.set(key, visit);
    lastVisit = visit;
    return trail;
};

export const useBreadcrumb = () => {
    const { pathname, search, key } = useLocation();
    return resolveTrail(key ?? pathname + search, pathname, search);
};
