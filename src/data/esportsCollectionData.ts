// e스포츠 컬렉션 페이지 내용 (Razer 공식 페이지 구성 그대로)
// · Esports Green 컬렉션 (/info/promotion/esports/green)
// · NiKo 프로필 (/info/promotion/esports/niko)
// 이미지: public/images/esports/green · niko (없으면 글자로 대신 보여 줌)

const green = (file: string) => "/images/esports/green/" + file;
const niko = (file: string) => "/images/esports/niko/" + file;

// ProSettings.net 순위 배지 이미지 + 출처
export type AwardBadge = { image: string; label: string; source: string };
const badge = (file: string) => green("badges/" + file);
const award2025 = "*출처: ProSettings.net, \"올해의 프로 게이밍 기어 - 2025\", 2025년 12월 4일";
const award2025b = "*출처: ProSettings.net, \"올해의 프로 게이밍 기어 - 2025\", 2025년 12월 5일";
const award2026 = "*출처: ProSettings.net, \"최고의 프로 게이밍 장비 - 2026년 여름 에디션\", 2026년 6월 24일";

// =========================================================
// Esports Green 컬렉션
// =========================================================
export const greenHero = {
    image: green("collection.webp"), // 영상 첫 화면 · 영상을 못 불러오면 이 이미지
    video: "/videos/esports/green-hero.mp4",
    exclusive: "RAZER 독점",
    eyebrow: "RAZER ESPORTS GREEN 컬렉션",
    title: "그린이 바로 새로운 트렌드다",
    body: "Razer는 시작부터 Team Razer 선수들과 긴밀히 협력하여 최고 수준의 경기용 장비에 대한 기준을 지속적으로 높여왔습니다. 이들은 Razer의 e스포츠 라인을 디자인하는 데 중요한 역할을 합니다. Esports Green 컬렉션은 단순한 색상이 아니라 20년 넘게 세계 최고의 선수들과 함께 일해 온 Razer의 대담한 선언입니다.",
    awards: [
        { image: badge("no1-mouse-brand.webp"), label: "1위 마우스 브랜드", source: award2025 },
        { image: badge("no1-keyboard.webp"), label: "1위 키보드", source: award2025 },
        { image: badge("no1-headset-brand.webp"), label: "1위 헤드셋 브랜드", source: award2025 },
    ] as AwardBadge[],
};

// 최고급 장비. 승리의 색상. (PC | 콘솔 탭) · 상품 id
export const greenLineup = {
    title: "최고급 장비.\n승리의 색상.",
    tabs: {
        PC: [2018, 2034, 4012, 5008, 1029],
        콘솔: [4013, 5005, 5006, 5007],
    },
    // 카드에 보이는 이름 (대문자 두세 줄)
    names: {
        2018: "RAZER VIPER V4 PRO ESPORTS GREEN EDITION",
        2034: "RAZER DEATHADDER V4 PRO ESPORTS GREEN EDITION",
        4012: "RAZER BLACKSHARK V3 PRO ESPORTS GREEN EDITION (PC)",
        5008: "RAZER WOLVERINE V3 PRO 8K PC ESPORTS GREEN EDITION",
        1029: "RAZER HUNTSMAN V3 PRO TENKEYLESS 8KHZ ESPORTS GREEN EDITION",
        4013: "RAZER BLACKSHARK V3 PRO ESPORTS GREEN EDITION (XBOX)",
        5005: "RAZER WOLVERINE V3 PRO ESPORTS GREEN EDITION",
        5006: "RAZER RAIJU V3 PRO ESPORTS GREEN EDITION",
        5007: "RAZER KITSUNE ESPORTS GREEN EDITION",
    } as Record<number, string>,
};

export type Feature = { icon: string; title: string; body: string };
export type GreenSection = {
    id: string;
    title: string; // 두 줄 (\n)
    body: string;
    links: { label: string; productId: number }[];
    award?: AwardBadge;
    images: { src: string; alt: string }[]; // 1920 x 700 배너
    features: Feature[];
    note?: string;
};

export const greenSections: GreenSection[] = [
    {
        id: "viper",
        title: "RAZER VIPER V4 PRO\nESPORTS GREEN EDITION",
        body: "챔피언들이 세계 무대를 지배하기 위해 신뢰하는 e스포츠 최고의 마우스입니다. Focus Pro 50K 옵티컬 센서 3세대와 HyperPolling 8000Hz를 탑재하고도 52g에 불과한 이 제품은 프로들이 사용하는 초고속 플릭과 정밀한 플레이를 위해 제작되었습니다.",
        links: [{ label: "자세히 알아보기", productId: 2018 }],
        award: { image: badge("no1-mouse-brand-en.webp"), label: "#1 MOUSE BRAND", source: award2026 },
        images: [{ src: green("viper.webp"), alt: "Viper V4 Pro Esports Green Edition을 손에 든 모습" }],
        features: [
            { icon: green("icons/lightweight.svg"), title: "52G의 초경량 디자인", body: "월드 클래스 e스포츠 프로게이머와 협력하여 만든 Viper V4 Pro는 게이머가 의도하는 대로 움직이는 완벽한 밸런스의 초경량 디자인으로 재빠르고 정확한 플리킹을 선사합니다." },
            { icon: green("icons/focus-pro.svg"), title: "3세대 RAZER FOCUS PRO 50K 옵티컬 센서", body: "지능형 기능 및 1단계 DPI 조정으로 보다 정밀한 조준과 제어를 지원하여 유리 등의 다양한 표면에서 동급 최고의 트래킹 성능을 경험할 수 있습니다." },
            { icon: green("icons/hyperpolling-wireless.svg"), title: "RAZER HYPERPOLLING 8000HZ 기술", body: "HyperPolling Wireless Dongle로 반응성은 더욱 높이고, 신호가 끊기지 않도록 합니다." },
        ],
    },
    {
        id: "deathadder",
        title: "RAZER DEATHADDER V4 PRO\nESPORTS GREEN EDITION",
        body: "차세대 기술을 기반으로 하는 DeathAdder V4 Pro는 20년이 넘는 엔지니어링 우수성의 정점으로, 다시 한 번 게이밍 마우스의 새로운 기준을 제시하는 대담한 도약입니다.",
        links: [{ label: "자세히 알아보기", productId: 2034 }],
        award: { image: badge("no1-ergonomic-mouse.webp"), label: "1위 인체공학적 마우스", source: award2025b },
        images: [{ src: green("deathadder.webp"), alt: "공중에 뜬 DeathAdder V4 Pro Esports Green Edition" }],
        features: [
            { icon: green("icons/lightweight.svg"), title: "58G의 초경량 디자인", body: "무게 최적화와 부드러운 터치감으로 재설계된 최신 DeathAdder 게이밍 마우스는 이전 제품보다 10% 이상 가벼워졌습니다." },
            { icon: green("icons/hyperspeed.svg"), title: "RAZER HYPERSPEED WIRELESS 2세대", body: "이제 63% 더 효율적이고*, 37% 더 낮은 지연 시간, 진정한 8000Hz 폴링을 지원하는 챔피언십급 플레이를 위해 구축된 매우 안정적인 무선 연결로 차이를 느껴보세요." },
            { icon: green("icons/scroll-wheel.svg"), title: "RAZER 옵티컬 스크롤 휠", body: "기계식 제품보다 더 정밀하고 내구성이 뛰어난 Razer 최초의 e스포츠 마우스용 옵티컬 스크롤은 고정밀 게이밍에 필요한 프로급 트래킹과 중요한 촉각 피드백을 제공합니다." },
        ],
        note: "*표준 테스트 조건 하에서",
    },
    {
        id: "huntsman",
        title: "RAZER HUNTSMAN V3 PRO TENKEYLESS 8KHZ\nESPORTS GREEN EDITION",
        body: "프로를 위해 설계된 가장 빠르고 반응성이 뛰어난 아날로그 옵티컬 키보드인 Huntsman V3 Pro TKL 8KHz로 경쟁에서 우위를 점하세요.",
        links: [{ label: "자세히 알아보기", productId: 1029 }],
        award: { image: badge("no1-keyboard.webp"), label: "1위 키보드", source: award2025 },
        images: [{ src: green("huntsman.webp"), alt: "초록 빛줄기 위의 Huntsman V3 Pro TKL 8KHz Esports Green Edition" }],
        features: [
            { icon: green("icons/analog-switch.svg"), title: "2세대 RAZER™ 아날로그 옵티컬 스위치", body: "초고속 반복 입력을 실행하는 래피드 트리거, 0.1~4.0mm로 조절 가능한 작동점 범위 및 1억 회의 키스트로크 수명을 지원하며, Razer 최고급 스위치를 갖춘 텐키리스(TKL) 키보드로 정밀도와 반응성을 극대화하세요." },
            { icon: green("icons/hyperpolling.svg"), title: "진정한 8000HZ HYPERPOLLING", body: "업계 표준보다 8배 빠른 엄청난 속도의 폴링레이트로 순식간에 상대방보다 우위를 점할 수 있습니다. 가장 빠른 응답을 경험하고 모든 플레이를 지체 없이 실행하세요." },
            { icon: green("icons/keypress.svg"), title: "최적화된 키 입력감", body: "개별적으로 윤활 처리되어 매우 부드러운 작동을 보장하는 각 스위치는 고밀도 폼 층에 장착되어 깔끔하고 음소거된 타이핑 음향을 보장하여 몰입을 방해하지 않습니다." },
        ],
    },
    {
        id: "blackshark",
        title: "RAZER BLACKSHARK V3 PRO (PC/XBOX)\nESPORTS GREEN EDITION",
        body: "e스포츠 프로들이 사용하는 최고의 헤드셋이 업계를 선도하는 성능으로 새로운 시대를 열었습니다. PC와 Xbox에서 경쟁 플레이를 위해 설계된 최고급 무선 ANC 전용 헤드셋으로 원하는 플랫폼을 정복하세요.",
        links: [{ label: "자세히 알아보기 (PC)", productId: 4012 }, { label: "자세히 알아보기 (Xbox)", productId: 4013 }],
        award: { image: badge("no1-headset-brand.webp"), label: "1위 헤드셋 브랜드", source: award2025 },
        images: [{ src: green("blackshark.webp"), alt: "PC와 Xbox 셋업 위의 BlackShark V3 Pro Esports Green Edition" }],
        features: [
            { icon: green("icons/hyperspeed.svg"), title: "RAZER™ HYPERSPEED WIRELESS 2세대", body: "10ms의 초저지연에 최적화된 가장 빠른 무선 기술로 모든 경쟁사를 압도하여 거의 즉각적인 오디오를 전달합니다. 클러치 플레이와 순간적인 결정에 적합합니다." },
            { icon: green("icons/microphone.svg"), title: "탈착식 RAZER™ HYPERCLEAR 풀 밴드 12MM 마이크", body: "12mm 대형 캡슐로 무장한 이 차세대 풀 밴드 마이크는 단방향 픽업 패턴으로 샷콜의 모든 디테일을 선명하게 포착하고 배경 소음을 효과적으로 억제합니다." },
            { icon: green("icons/noise-cancelling.svg"), title: "하이브리드 액티브 노이즈 캔슬링", body: "이 e스포츠 게이밍 헤드셋의 고급 하이브리드 ANC로 집중력을 유지하고 모든 방해 요소를 차단하세요. 회전식 이어컵과 하이브리드 메모리폼 이어 쿠션이 완벽한 밀폐를 형성하여 뛰어난 사운드 차단 효과를 제공합니다. 4가지 노이즈 캔슬링 레벨로 커스터마이징할 수 있으며, PC의 Razer Synapse, 모바일의 Razer Audio 앱 또는 Xbox의 Razer Audio Setup 앱을 통해 조정할 수 있습니다." },
        ],
    },
    {
        id: "wolverine",
        title: "RAZER WOLVERINE V3 PRO\nESPORTS GREEN EDITION",
        body: "프로게이머와의 협업으로 제작되었으며, Xbox에서 공식 라이선스를 획득하고 PC와 호환되는 최고의 무선 e스포츠 컨트롤러로 게임의 수준을 높여보세요. 마우스 클릭 백 버튼 4개, 클로 그립 범퍼 2개, 초고속 트리거, 홀 효과 썸스틱 등을 갖춘 최고급 컨트롤러입니다.",
        links: [{ label: "자세히 알아보기", productId: 5005 }],
        images: [{ src: green("wolverine.webp"), alt: "손 위에 뜬 Wolverine V3 Pro Esports Green Edition" }],
        features: [
            { icon: green("icons/back-buttons.svg"), title: "마우스 클릭 백 버튼 4개 및 클로 그립 범퍼 2개", body: "엄지를 스틱에서 떼지 않고도 더 많은 동작을 실행할 수 있도록 마우스 클릭감의 백 버튼과 범퍼를 원하는 기능으로 매핑하세요." },
            { icon: green("icons/hypertrigger.svg"), title: "RAZER™ PRO HYPERTRIGGER", body: "컨트롤러 뒷면의 슬라이더로 트리거를 마우스 클릭처럼 짧게 바꿔 더 빠르게 사격할 수 있습니다." },
            { icon: green("icons/clickable-thumbstick.svg"), title: "홀 효과 정밀 썸스틱", body: "자기 센서 방식으로 오래 써도 정확도가 떨어지지 않고 스틱 쏠림을 줄여 줍니다." },
        ],
    },
    {
        id: "wolverine-8k",
        title: "RAZER WOLVERINE V3 PRO 8K PC\nESPORTS GREEN EDITION",
        body: "유선과 무선 모두 8000Hz 폴링을 지원하는 PC 전용 e스포츠 컨트롤러로, 가볍고 빠른 입력이 필요한 경쟁 플레이에 맞춰 설계되었습니다.",
        links: [{ label: "자세히 알아보기", productId: 5008 }],
        images: [{ src: green("wolverine-8k.webp"), alt: "Wolverine V3 Pro 8K PC Esports Green Edition" }],
        features: [
            { icon: green("icons/hyperpolling.svg"), title: "Razer™ 8KHz HyperPolling 기술", body: "최대 8000Hz 폴링으로 입력이 화면에 반영되기까지의 지연을 줄입니다." },
            { icon: green("icons/thumbstick.svg"), title: "캡을 교체할 수 있는 TMR 썸스틱", body: "정밀한 TMR 센서 스틱과 교체용 캡으로 손에 맞는 높이와 그립을 고를 수 있습니다." },
            { icon: green("icons/lightweight.svg"), title: "RAZER의 가장 가벼운 무선 e스포츠 컨트롤러", body: "가벼운 무게로 장시간 경기에서도 손의 피로를 줄여 줍니다." },
        ],
    },
    {
        id: "raiju",
        title: "RAZER RAIJU V3 PRO\nESPORTS GREEN EDITION",
        body: "PS5와 PC에서 사용할 수 있는 무선 e스포츠 컨트롤러로, 분리 가능한 백 버튼과 대칭형 스틱 배열로 경쟁 플레이에 맞춰 구성할 수 있습니다.",
        links: [{ label: "자세히 알아보기", productId: 5006 }],
        images: [{ src: green("raiju.webp"), alt: "Raiju V3 Pro Esports Green Edition" }],
        features: [
            { icon: green("icons/back-buttons.svg"), title: "4개의 분리 가능한 마우스 클릭 백 버튼 및 2개의 클로 그립 범퍼", body: "필요한 버튼만 끼워 쓰고, 마우스 클릭감의 버튼으로 빠르게 입력하세요." },
            { icon: green("icons/thumbstick.svg"), title: "캡을 교체할 수 있는 대칭형 TMR 썸스틱", body: "대칭형 스틱 배열과 교체용 캡으로 손에 맞는 조작감을 만들 수 있습니다." },
            { icon: green("icons/hypertrigger.svg"), title: "RAZER PRO HYPERTRIGGER", body: "트리거를 짧게 바꿔 클릭처럼 빠르게 반응하도록 설정할 수 있습니다." },
        ],
    },
    {
        id: "kitsune",
        title: "RAZER KITSUNE\nESPORTS GREEN EDITION",
        body: "격투 게임을 위한 올버튼 옵티컬 컨트롤러로, 레버 대신 버튼으로 방향을 입력해 더 빠르고 정확한 커맨드를 실행할 수 있습니다.",
        links: [{ label: "자세히 알아보기", productId: 5007 }],
        images: [{ src: green("kitsune.webp"), alt: "Kitsune Esports Green Edition" }],
        features: [
            { icon: green("icons/quad-buttons.svg"), title: "정밀한 쿼드 무브먼트 버튼 레이아웃", body: "네 방향 이동 버튼으로 레버보다 짧고 정확하게 방향을 입력합니다." },
            { icon: green("icons/analog-switch.svg"), title: "RAZER™ 리니어 로우 프로파일 옵티컬 스위치", body: "얕은 키 이동 거리와 빛 신호 방식으로 빠르고 일정한 입력을 지원합니다." },
            { icon: green("icons/portable.svg"), title: "슬림한 휴대용 폼팩터", body: "얇고 가벼워 대회장이나 친구 집에 가져가기 좋습니다." },
        ],
    },
];

// 스타일을 완성하세요 · RAZER AXON (배경화면 43장이 기울어진 채로 흐름)
export const greenAxon = {
    title: "스타일을 완성하세요.",
    name: "RAZER AXON",
    body: "Razer Axon에서 Esports Green 셋업에 어울리는 배경화면을 받아 보세요. 배경화면과 장비의 Chroma RGB 조명이 함께 어우러집니다.",
    platforms: "Windows 11, Windows 10",
    logo: green("axon-logo.webp"),
    wallpapers: Array.from({ length: 43 }, (_, i) => green("wallpapers/" + String(i + 1).padStart(2, "0") + ".webp")),
};

// 다른 색상 둘러보기 (외부 페이지라 버튼 없이 설명만)
export const greenColorways = {
    title: "다른 색상 둘러보기",
    items: [
        { image: green("colorways/phantom-white.webp"), title: "RAZER PHANTOM WHITE 컬렉션.", body: "레트로 무드와 미니멀리즘" },
        { image: green("colorways/phantom-green.webp"), title: "RAZER PHANTOM GREEN 컬렉션.", body: "그린 컬러 디자인" },
        { image: green("colorways/mercury-white.webp"), title: "RAZER WHITE 컬렉션.", body: "산뜻한 현대적 셋업" },
        { image: green("colorways/quartz-pink.webp"), title: "RAZER QUARTZ 컬렉션.", body: "핑크 컬러웨이" },
    ],
};

export const greenFaq = [
    { q: "각 제품의 특징에 대한 자세한 정보는 어디에서 확인할 수 있나요?", a: "위 제품 목록에서 '자세한 정보'를 누르면 각 제품의 상세 페이지에서 사양과 기능을 확인할 수 있습니다." },
    { q: "Esports Green Edition은 성능에 차이가 있나요?", a: "아니요. Esports Green Edition은 색상만 다르며, 센서 · 스위치 · 무선 연결 등 성능은 같은 기본 모델과 동일합니다." },
    { q: "Esports Green 컬렉션의 제품 중 8000Hz 폴링레이트를 지원하는 제품이 있나요?", a: "Viper V4 Pro, DeathAdder V4 Pro, Huntsman V3 Pro TKL 8KHz, Wolverine V3 Pro 8K PC가 8000Hz 폴링을 지원합니다. 무선 마우스는 HyperPolling 동글을 사용할 때 적용됩니다." },
    { q: "Esports Green의 마감은 시간이 지나면 마모되나요?", a: "일상적인 사용을 견디도록 코팅되어 있지만, 오래 쓰면 손이 닿는 부분에 자연스러운 사용감이 생길 수 있습니다. 부드러운 천으로 닦아 관리해 주세요." },
];

// =========================================================
// NiKo 프로필
// =========================================================
export const nikoProfile = {
    hero: { image: niko("hero.webp"), mobile: niko("hero-mobile.webp") },
    title: "NIKO | COUNTER-STRIKE 역사상 가장 위대한 라이플러",
    subtitle: "우리는 승리하기 위해 플레이합니다",
    intro: "세계 최고의 프로들은 승리하기 위해 Razer를 선택합니다. NiKo가 고른 장비로 당신만의 이야기를 써 내려가세요.",
    recordTitle: "IEM COLOGNE 2026 메이저 챔피언",
    // [숫자, 설명]
    records: [
        ["1회", "MAJOR 우승"],
        ["10회", "HLTV 올해의 TOP 20 선수 선정"],
        ["52킬", "메이저 대회 단일 맵 최다 킬 기록"],
        ["52회", "커리어 통산 EVP 수상"],
        ["1.70", "대형 대회 최고 레이팅 (ESL One: New York 2017)"],
        ["1st", "3년 연속 HLTV MVP 다관왕 선수"],
    ] as const,
    storyTitle: "불꽃을 느껴보세요",
    story: "NiKo 컬렉션은 멈추지 않는 그의 승부욕을 기념합니다. 'Deagle God'이라는 별명을 안겨 준 데저트 이글의 불꽃 무늬를 바탕으로, 그의 강렬함과 정밀함, 그리고 열정을 담았습니다.",
    video: { src: "/videos/esports/niko-intro.mp4", poster: niko("intro-poster.jpg") },
    gearTitle: "DEAGLE GOD처럼 플레이하세요",
    // [상품 id, 한 줄 설명]
    gear: [
        [2028, "모든 픽셀을 놓치지 않는 정밀한 트래킹과 미세 조정"],
        [1022, "빠른 무빙과 피킹을 위한 래피드 트리거와 아날로그 입력"],
        [4009, "적의 위치를 파악하고 팀과 소통하는 선명한 사운드"],
        [3014, "라이플 트래킹을 위한 미끄러짐과 멈춤의 균형을 갖춘 직조 표면"],
    ] as const,
    thanksTitle: "고마워요, NIKO.",
    thanks: "모든 경기에서 보여준 열정과 침착함, 그리고 불꽃 같은 투지에 감사드립니다.",
    // 자동으로 넘어가는 슬라이드 (NiKo 장면 → 제품 장면 · 지금 쇼핑하기 = 상품 상세)
    carousel: [
        { image: niko("carousel/huntsman-niko.webp"), alt: "NiKo와 Huntsman V3 Pro TKL 8KHz", productId: 1026 },
        { image: niko("carousel/huntsman.webp"), alt: "Huntsman V3 Pro TKL 8KHz", productId: 1026 },
        { image: niko("carousel/deathadder-niko.webp"), alt: "NiKo와 DeathAdder V4 Pro", productId: 2043 },
        { image: niko("carousel/deathadder.webp"), alt: "DeathAdder V4 Pro", productId: 2043 },
        { image: niko("carousel/blackshark-niko.webp"), alt: "NiKo와 BlackShark V3 Pro", productId: 4021 },
        { image: niko("carousel/blackshark.webp"), alt: "BlackShark V3 Pro", productId: 4021 },
    ],
    source: award2025b,
    related: [
        { title: "TEAM RAZER", body: "세계 최고의 무대에서 Razer와 함께 승리하는 선수들을 만나보세요.", image: niko("team-razer.webp"), to: "/info/promotion/esports" },
        { title: "신뢰할 수 있는 기술", body: "프로들이 믿고 쓰는 Razer의 핵심 기술을 살펴보세요.", image: niko("trusted-technology.webp"), to: "/info/promotion/technology" },
    ],
};
