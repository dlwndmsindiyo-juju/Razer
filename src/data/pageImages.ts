// 페이지별 이미지 경로 (파일은 public/images/<페이지 폴더>/ 에 있음)
const img = (path: string) => "/images/" + path;
const pad = (number: number) => String(number).padStart(2, "0");

// ---------- 공용 (여러 페이지에서 같이 씀) ----------
export const commonImages = {
    railLeft: img("common/rail-left.svg"), // 상품 목록 좌우 화살표 (구매 방법 · 결제 · 주문 완료)
    railRight: img("common/rail-right.svg"),
    explore: img("common/explore.svg"), // 카드 EXPLORE 화살표
};

// ---------- 제품 > 구매 방법 ----------
export const buyingGuideImages = {
    affiliate: img("buying-guide/affiliate.webp"),
    education: img("buying-guide/education.webp"),
    partner: img("buying-guide/partner.webp"),
};

// ---------- 제품 > Razer 독점 ----------
export const exclusiveImages = {
    hero: img("exclusive/hero-desktop.webp"),
    heroMobile: img("exclusive/hero-mobile.webp"),
    explore: img("exclusive/explore-primary.svg"),
    collabs: {
        honkai: img("exclusive/collab-honkai.webp"),
        evangelion: img("exclusive/collab-evangelion.webp"),
        pompompurin: img("exclusive/collab-pompompurin.webp"),
        wuthering: img("exclusive/collab-wuthering-waves.webp"),
        blackpink: img("exclusive/collab-blackpink.webp"),
    },
};

// ---------- 제품 > Razer 멤버십 ----------
export const membershipImages = {
    hero: img("membership/hero.webp"),
    benefitEarn: img("membership/benefit-earn.svg"),
    benefitRedeem: img("membership/benefit-redeem.svg"),
    benefitEvents: img("membership/benefit-events.svg"),
    promoCoupon: img("membership/promo-coupon.svg"),
    promoEmail: img("membership/promo-email.svg"),
    cart: img("membership/cart.svg"),
    info: img("membership/info.svg"),
    cyberWeekend: img("membership/cyber-weekend.webp"),
    rewardsEcosystem: img("membership/rewards-ecosystem.webp"),
    rewardsRedemption: img("membership/rewards-redemption.webp"),
    rewardFirst: img("membership/reward-first.svg"),
    rewardSecond: img("membership/reward-second.svg"),
    earnCortex: img("membership/earn-cortex.webp"),
    earnInsider: img("membership/earn-insider.webp"),
    earnPartners: img("membership/earn-partners.webp"),
};

// ---------- 프로모션 > 제품 기술 (패널 이미지는 technologyData 에) ----------
export const technologyImages = {
    icons: {
        mouse: img("technology/icon-mouse.svg"),
        keyboard: img("technology/icon-keyboard.svg"),
        headset: img("technology/icon-headset.svg"),
        speaker: img("technology/icon-speaker.svg"),
    },
};
export const technologyImage = (file: string) => img("technology/" + file);

// ---------- 프로모션 > e스포츠 ----------
export const esportsImages = {
    hero: img("esports/team-hero.webp"),
    player: img("esports/team-player.webp"),
    iconTrophy: img("esports/icon-trophy.svg"),
    iconAim: img("esports/icon-aim.svg"),
    galleryLeft: img("esports/gallery-left.svg"),
    galleryRight: img("esports/gallery-right.svg"),
    eventPhoto: (event: string, number: number) => img("esports/events/" + event + "/" + pad(number) + ".webp"),
    nikoHero: img("esports/niko/hero.webp"),
    nikoHeroMobile: img("esports/niko/hero-mobile.webp"),
    teamLogo: (number: number) => img("esports/team-logo-" + pad(number) + ".webp"), // 1 ~ 22
};

// ---------- 서비스 > FAQ ----------
export const faqImages = {
    plus: img("faq/plus.svg"),
    search: img("faq/search.svg"),
};

// ---------- 서비스 > 등록 및 보증 ----------
export const warrantyImages = {
    hero: img("warranty/hero.webp"),
    plus: img("warranty/plus.svg"),
    benefits: [
        img("warranty/benefit-resources.svg"),
        img("warranty/benefit-support.svg"),
        img("warranty/benefit-updates.svg"),
        img("warranty/benefit-feedback.svg"),
    ],
};

// ---------- 서비스 > 지원 ----------
export const supportImages = {
    arrow: img("support/arrow.svg"),
    arrowPrimary: img("support/arrow-primary.svg"),
};

// ---------- 회사 > Razer 소개 ----------
export const aboutImages = {
    city: img("about/razer-city.webp"),
    chromaBanner: img("about/chroma-banner.webp"),
    milestones2023: img("about/milestones-2023.webp"),
    sustainabilityBanner: img("about/sustainability-banner.webp"),
    careersBanner: img("about/careers-banner.webp"),
    awards: {
        pc: img("about/awards-service-background.webp"),
        console: img("about/awards-console.webp"),
        mobile: img("about/awards-mobile.webp"),
        lifestyle: img("about/awards-lifestyle.webp"),
        service: img("about/awards-service.webp"),
    },
    leaders: {
        minLiangTan: img("about/leadership-min-liang-tan.webp"),
        chongNengTan: img("about/leadership-chong-neng-tan.webp"),
        khengJooKhaw: img("about/leadership-kheng-joo-khaw.webp"),
        chooWeiPin: img("about/leadership-choo-wei-pin.webp"),
        liMengLee: img("about/leadership-li-meng-lee.webp"),
    },
};

// ---------- 결제 ----------
export const paymentImages = {
    addCard: img("payment/add-card.svg"),
    installmentChevron: img("payment/installment-chevron.svg"),
};

// ---------- 주문 완료 ----------
export const orderCompleteImages = {
    bag: img("order-complete/bag.svg"),
};

// ---------- 비밀번호 찾기 ----------
export const passwordResetImages = {
    check: img("password-reset/check.svg"),
    info: img("password-reset/info.svg"),
};
