// 푸터 메뉴 · 내부 링크 페이지 데이터
// 메뉴를 추가하면 푸터 링크와 페이지(/info/:group/:page)가 함께 생깁니다.

export interface FooterPage {
    slug: string; // 주소에 쓰이는 이름
    label: string; // 화면에 보이는 이름
}

export interface FooterGroup {
    slug: string;
    title: string;
    pages: FooterPage[];
}

// 상단 메뉴 그룹
export const footerGroups: FooterGroup[] = [
    {
        slug: "product",
        title: "제품",
        pages: [
            { slug: "how-to-buy", label: "구매 방법" },
            { slug: "razer-exclusives", label: "Razer 독점" },
            { slug: "membership", label: "Razer 멤버십" },
        ],
    },
    {
        slug: "promotion",
        title: "프로모션",
        pages: [
            { slug: "promotions", label: "프로모션 알아보기" },
            { slug: "technology", label: "제품 기술" },
            { slug: "esports", label: "e스포츠" },
        ],
    },
    {
        slug: "service",
        title: "서비스",
        pages: [
            { slug: "faq", label: "FAQ" },
            { slug: "registration-warranty", label: "등록 및 보증" },
            { slug: "support", label: "지원" },
        ],
    },
];

// 하단 오른쪽 링크 (회사 관련)
export const footerCompany: FooterGroup = {
    slug: "company",
    title: "회사 관련",
    pages: [
        { slug: "about", label: "Razer 소개" },
        { slug: "careers", label: "채용" },
        { slug: "contact", label: "연락처" },
    ],
};

// 페이지 주소 만들기
export const getFooterPath = (groupSlug: string, pageSlug: string) => `/info/${groupSlug}/${pageSlug}`;

// 그룹 대표 주소 (첫 번째 페이지) — GNB 메뉴에서 사용
export const getGroupPath = (group: FooterGroup) => getFooterPath(group.slug, group.pages[0].slug);

// 주소로 그룹 · 페이지 찾기 (없으면 undefined)
export const findFooterPage = (groupSlug?: string, pageSlug?: string) => {
    const group = [...footerGroups, footerCompany].find((g) => g.slug === groupSlug);
    const page = group?.pages.find((p) => p.slug === pageSlug);
    return { group, page };
};
