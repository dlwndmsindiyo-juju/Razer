// 상품 상세페이지에서 쓰는 데이터

// 색상 / 디자인 동그라미 색 (없는 값은 그 옵션 상품 이미지로 표시)
export const swatchColors: Record<string, string> = {
    블랙: "#111111",
    화이트: "#F2F2F2",
    Quartz: "#F6C6D8",
    Mercury: "#D9DADB",
    녹색: "#44D62C",
    "Esports Green Edition": "#44D62C",
    "Phantom Green Edition": "#7CFF5B",
    "Phantom White Edition": "#E6E6E6",
    "Carbon Fiber Edition": "#3A3A3A",
};

// 사은품 (모든 상품 공통 · 이미지가 없으면 글자로 표시)
export interface DetailGift {
    title: string;
    price: string;
    desc: string;
    image?: string;
}

export const detailGifts: DetailGift[] = [
    {
        title: "46,000원 반환 크레딧",
        price: "46,000원",
        desc: "교환 세부 정보는 주문이 완료된 후 이메일로 전송됩니다.",
    },
];

// 이미지 위 버튼 (키보드만)
export const keyboardActions = {
    soundLabel: "타건음 체험하기",
    soundIcon: "/icons/headset.svg", // 헤드셋 아이콘 (파일이 없으면 글자만 표시)
    soundSrc: (series?: string) => `/sounds/keyboards/${series ?? "default"}.mp3`, // 타건음 파일 위치
    customizeLabel: "커스터마이징 시작",
    customizeTo: (productId: number) => `/products/keyboards/${productId}/customize`,
};

// 상품 상세(아래 긴 소개) 공통 문구
export const detailCopy = {
    notice: "본 제품은 Razer 공식 스토어 정품이며, 국내 공식 A/S 를 받으실 수 있습니다.",
    bandTitle: "FEEL THE DIFFERENCE",
    warrantyTitle: "RAZER 정품 인증",
    warrantyText: "본 상품은 국내 정식 수입 제품으로 구매일로부터 2년간 무상 A/S 를 제공합니다.",
    warrantyBadge: "2 YEAR",
};

// 소개에서 크게 보여줄 사양 (먼저 나온 것부터 · 없으면 표 순서대로)
export const highlightSpecCodes = [
    "sensor", "switch-type", "drivertype", "connectivity", "connection-type", "battery-life", "weight",
    "max-sensitivity", "noise-cancelling", "lighting", "keycaps", "surface", "size", "polling-rate-interval",
];

// 옵션 이름 · 값 표기 (데이터 원문 → 화면 문구)
export const optionLabelNames: Record<string, string> = {
    "키보드 레이아웃": "자판 유형",
};
export const optionValueNames: Record<string, string> = {
    "미국 배치": "US",
    "한국 레이아웃": "한국식",
    "전통 중국어 레이아웃": "중국어(번체)",
};
// 화면에 보여주지 않는 옵션 (데이터 수집 때 섞인 값)
export const hiddenOptionLabels = ["Invisible Dropdown"];
// 큰 버튼(200 x 100)으로 보여줄 옵션 · 나머지는 작은 버튼
export const largeOptionLabels = ["모델"];
