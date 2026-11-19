import type { Product, ProductCategory, ProductCollection } from "../types/product";

// 카테고리 · 컬렉션 이름 (메뉴 · 필터 표시용)
export const categoryLabels: Record<ProductCategory, string> = {
    keyboards: "키보드",
    mice: "마우스",
    mousepads: "마우스패드",
    headphones: "헤드폰",
    controllers: "컨트롤러",
};

export const collectionLabels: Record<ProductCollection, string> = {
    exclusive: "독점",
    collab: "콜라보",
};

// 전체 상품 데이터 (카테고리별로 이어서 추가)
// 이미지: public/images/products/{category}/{이름}.webp
// 상세페이지 이미지는 별도 데이터에서 id 로 연결
// 3D 모델이 있는 상품에는 model3d도 함께 입력
export const productData: Product[] = [
    // ---------- 키보드 (1000번대) ----------

    // ---------- 마우스 (2000번대) · razer.com/kr-kr/shop/mice/gaming-mice 기준 ----------
    { id: 2001, title: "Razer Viper V4 Pro - Carbon Fiber Edition", category: "mice", series: "viper-v4-pro", sku: "RZ01-05650100-R3M1", price: 373900, image: "/images/products/mice/viper-v4-pro-carbon-fiber.webp" },
    { id: 2002, title: "Razer DeathAdder V4 Pro - Carbon Fiber Edition", category: "mice", series: "deathadder-v4-pro", sku: "RZ01-05600100-R3M1", price: 373900, image: "/images/products/mice/deathadder-v4-pro-carbon-fiber.webp" },
    { id: 2003, title: "Razer Viper V3 Pro SE - Honkai: Star Rail Edition", category: "mice", series: "viper-v3-pro-se", sku: "RZ01-04550600-R3M1", price: 199000, image: "/images/products/mice/viper-v3-pro-se-honkai-star-rail.webp", collections: ["collab"] },
    { id: 2004, title: "Razer DeathAdder V4 Pro - Evangelion (EVA-01) Edition", category: "mice", series: "deathadder-v4-pro", sku: "RZ01-05330600-R3A1", price: 287900, image: "/images/products/mice/deathadder-v4-pro-evangelion.webp", collections: ["collab"] },
    { id: 2005, title: "Razer DeathAdder V4 Pro + Gigantus V2 - XXL - Evangelion (EVA-01) Edition Bundle", category: "mice", series: "deathadder-v4-pro", sku: "RZHB-261031-01", price: 352800, image: "/images/products/mice/deathadder-v4-pro-gigantus-v2-evangelion-bundle.webp", collections: ["collab"] },
    { id: 2006, title: "Razer Basilisk V4 Pro - 블랙", category: "mice", series: "basilisk-v4-pro", sku: "RZ01-05670100-R3A1", price: 268800, image: "/images/products/mice/basilisk-v4-pro-black.webp" },
    { id: 2007, title: "Razer Basilisk V4 Pro - 화이트", category: "mice", series: "basilisk-v4-pro", sku: "RZ01-05670200-R3A1", price: 268800, image: "/images/products/mice/basilisk-v4-pro-white.webp" },
    { id: 2008, title: "Razer Basilisk V4 Pro - 블랙 + Mouse Dock V2 Pro 번들", category: "mice", series: "basilisk-v4-pro", sku: "RZHB-261001-04", price: 332000, originalPrice: 379600, image: "/images/products/mice/basilisk-v4-pro-black-dock-bundle.webp" },
    { id: 2009, title: "Razer Basilisk V4 Pro - 화이트 + Mouse Dock V2 Pro 번들", category: "mice", series: "basilisk-v4-pro", sku: "RZHB-261005-04", price: 332000, originalPrice: 379600, image: "/images/products/mice/basilisk-v4-pro-white-dock-bundle.webp" },
    { id: 2010, title: "Razer Basilisk V4 HyperSpeed - 블랙", category: "mice", series: "basilisk-v4-hyperspeed", sku: "RZ01-05680100-R3M1", price: 178800, image: "/images/products/mice/basilisk-v4-hyperspeed-black.webp" },
    { id: 2011, title: "Razer Basilisk V4 HyperSpeed - 화이트", category: "mice", series: "basilisk-v4-hyperspeed", sku: "RZ01-05680200-R3M1", price: 178800, image: "/images/products/mice/basilisk-v4-hyperspeed-white.webp" },
    { id: 2012, title: "Razer Basilisk V4 HyperSpeed - 블랙 + Mouse Dock V2 Pro 번들", category: "mice", series: "basilisk-v4-hyperspeed", sku: "RZHB-261009-04", price: 241800, originalPrice: 289600, image: "/images/products/mice/basilisk-v4-hyperspeed-black-dock-bundle.webp" },
    { id: 2013, title: "Razer Basilisk V4 HyperSpeed - 화이트 + Mouse Dock V2 Pro 번들", category: "mice", series: "basilisk-v4-hyperspeed", sku: "RZHB-261013-04", price: 241800, originalPrice: 289600, image: "/images/products/mice/basilisk-v4-hyperspeed-white-dock-bundle.webp" },
    { id: 2014, title: "Razer Naga V3 Pro - 블랙 + Mouse Dock V2 Pro 번들", category: "mice", series: "naga-v3-pro", sku: "RZHB-261018-04", price: null, image: "/images/products/mice/naga-v3-pro-black-dock-bundle.webp", soldOut: true },
    { id: 2015, title: "Razer Cobra Pro - 블랙 + Mouse Dock V2 Pro 번들", category: "mice", series: "cobra-pro", sku: "RZHB-261020-04", price: null, image: "/images/products/mice/cobra-pro-black-dock-bundle.webp", soldOut: true },
    { id: 2016, title: "Razer Cobra Pro - 화이트 + Mouse Dock V2 Pro 번들", category: "mice", series: "cobra-pro", sku: "RZHB-261027-04", price: null, image: "/images/products/mice/cobra-pro-white-dock-bundle.webp", soldOut: true },
    { id: 2017, title: "Razer Cobra HyperSpeed - 블랙 + Mouse Dock V2 Pro 번들", category: "mice", series: "cobra-hyperspeed", sku: "RZHB-261024-04", price: null, image: "/images/products/mice/cobra-hyperspeed-black-dock-bundle.webp", soldOut: true },
    { id: 2018, title: "Razer Viper V4 Pro - Esports Green Edition", category: "mice", series: "viper-v4-pro", sku: "RZ01-05630300-R3M1", price: 249000, image: "/images/products/mice/viper-v4-pro-esports-green.webp" },
    { id: 2019, title: "Razer Naga V3 Pro", category: "mice", series: "naga-v3-pro", sku: "RZ01-05660100-R3A1", price: 285800, image: "/images/products/mice/naga-v3-pro.webp" },
    { id: 2020, title: "Razer Viper V3 Pro SE Bundle - Wuthering Waves Edition", category: "mice", series: "viper-v3-pro-se", sku: "RZHB-260701-04", price: 291700, originalPrice: 323600, image: "/images/products/mice/viper-v3-pro-se-wuthering-waves-bundle.webp", collections: ["collab"], soldOut: true },
    { id: 2021, title: "Razer Viper V3 Pro SE - Wuthering Waves Edition", category: "mice", series: "viper-v3-pro-se", sku: "RZ01-04550500-R3M1", price: 201600, image: "/images/products/mice/viper-v3-pro-se-wuthering-waves.webp", collections: ["collab"] },
    { id: 2022, title: "Razer Orochi V2 - 블랙", category: "mice", series: "orochi-v2", sku: "RZ01-05690100-R3M1", price: 62480, image: "/images/products/mice/orochi-v2-black.webp" },
    { id: 2023, title: "Razer Orochi V2 - 화이트", category: "mice", series: "orochi-v2", sku: "RZ01-05690200-R3M1", price: 62480, image: "/images/products/mice/orochi-v2-white.webp" },
    { id: 2024, title: "Razer Orochi V2 - Quartz", category: "mice", series: "orochi-v2", sku: "RZ01-05690300-R3M1", price: 62480, image: "/images/products/mice/orochi-v2-quartz.webp" },
    { id: 2025, title: "Razer DeathAdder Essential Bundle - BLACKPINK Edition", category: "mice", series: "deathadder-essential", sku: "RZ01-03851700-R3M1", price: 131980, image: "/images/products/mice/deathadder-essential-blackpink-bundle.webp", collections: ["collab"] },
    { id: 2026, title: "Razer Viper V4 Pro - 블랙", category: "mice", series: "viper-v4-pro", sku: "RZ01-05630100-R3A1", price: 239000, image: "/images/products/mice/viper-v4-pro-black.webp" },
    { id: 2027, title: "Razer Viper V4 Pro - 화이트", category: "mice", series: "viper-v4-pro", sku: "RZ01-05630200-R3A1", price: 239000, image: "/images/products/mice/viper-v4-pro-white.webp" },
    { id: 2028, title: "Razer DeathAdder V4 Pro - NiKo Edition", category: "mice", series: "deathadder-v4-pro", sku: "RZ01-05330300-R3M1", price: 288000, image: "/images/products/mice/deathadder-v4-pro-niko.webp", collections: ["collab"] },
    { id: 2029, title: "Razer Boomslang 20th Anniversary Edition", category: "mice", series: "boomslang", sku: "RZ83-02530100-B3M1", price: 2117900, image: "/images/products/mice/boomslang-20th-anniversary.webp", soldOut: true },
    { id: 2030, title: "Razer Viper V3 Pro SE - 블랙", category: "mice", series: "viper-v3-pro-se", sku: "RZ01-04550100-R3A1", price: 159000, image: "/images/products/mice/viper-v3-pro-se-black.webp" },
    { id: 2031, title: "Razer Viper V3 Pro + Gigantus V2 - 라지 - Counter-Strike 2 Edition Bundle", category: "mice", series: "viper-v3-pro", sku: "RZHB-251028-03", price: 351360, image: "/images/products/mice/viper-v3-pro-gigantus-v2-cs2-bundle.webp", collections: ["collab"] },
    { id: 2032, title: "Razer Viper V3 Pro - Counter-Strike 2 Edition", category: "mice", series: "viper-v3-pro", sku: "RZ01-05120800-R3M1", price: 285580, image: "/images/products/mice/viper-v3-pro-cs2.webp", collections: ["collab"] },
    { id: 2033, title: "Razer Viper V3 Pro - Esports Green Edition", category: "mice", series: "viper-v3-pro", sku: "RZ01-05120600-R3M1", price: 190410, originalPrice: 249000, image: "/images/products/mice/viper-v3-pro-esports-green.webp" },
    { id: 2034, title: "Razer DeathAdder V4 Pro - Esports Green Edition", category: "mice", series: "deathadder-v4-pro", sku: "RZ01-05330500-R3M1", price: 237040, originalPrice: 278880, image: "/images/products/mice/deathadder-v4-pro-esports-green.webp" },
    { id: 2035, title: "Razer Basilisk V3 Pro 35K - Phantom White Edition", category: "mice", series: "basilisk-v3-pro-35k", sku: "RZ01-05240400-R3A1", price: 268880, image: "/images/products/mice/basilisk-v3-pro-35k-phantom-white.webp" },
    { id: 2036, title: "Razer Basilisk V3 Pro 35K + Mouse Dock Pro Bundle", category: "mice", series: "basilisk-v3-pro-35k", sku: "RZHB-251014-04", price: 324800, originalPrice: 369880, image: "/images/products/mice/basilisk-v3-pro-35k-phantom-white-dock-bundle.webp" },

    // ---------- 마우스패드 (3000번대) ----------

    // ---------- 헤드폰 (4000번대) ----------

    // ---------- 컨트롤러 (5000번대) ----------
];

// 카테고리별 상품
export const getProductsByCategory = (category: ProductCategory) =>
    productData.filter((product) => product.category === category);

// 컬렉션별 상품 (독점 · 콜라보)
export const getProductsByCollection = (collection: ProductCollection) =>
    productData.filter((product) => product.collections?.includes(collection));

// 상세페이지에서 id 로 상품 찾기
export const getProductById = (id: number) => productData.find((product) => product.id === id);
