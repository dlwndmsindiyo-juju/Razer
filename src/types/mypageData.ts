
// 마이페이지 탭 (/mypage?tab=…)
export const mypageTabs = [
    { key: "home", label: "마이페이지" },
    { key: "orders", label: "주문 내역" },
    { key: "warranty", label: "등록 제품·보증" },
    { key: "account", label: "계정 관리" },
] as const;
export type MypageTab = (typeof mypageTabs)[number]["key"];

// 주문 상태 (Firestore 주문의 status 값)
export type OrderStatus = "배송 중" | "배송 완료" | "취소" | "반품";
export const isCancelStatus = (status: string) => status === "취소" || status === "반품";

// 주문 내역 필터 탭
export const orderFilters = [
    { key: "all", label: "전체", match: () => true },
    { key: "shipping", label: "배송 중", match: (status: string) => status === "배송 중" },
    { key: "done", label: "배송 완료", match: (status: string) => status === "배송 완료" },
    { key: "cancel", label: "취소·반품", match: isCancelStatus },
] as const;
export type OrderFilter = (typeof orderFilters)[number]["key"];

// 주문 상태별 버튼 문구
export const orderActionLabel = (status: string) => {
    if (status === "배송 중") return "배송 조회";
    if (status === "배송 완료") return "반품 문의";
    return "주문 상세";
};

// 화면에 보이는 주문번호 (앞 10자리 - 나머지 · 예: 2425355443-554444)
export const formatOrderNumber = (id: number) => {
    const text = String(id);
    return text.length > 10 ? `${text.slice(0, 10)}-${text.slice(10)}` : text;
};

// 날짜 표시 (2026-11-18 · 2026/11/18 → 2026.11.18)
export const formatOrderDate = (date: string) => date.slice(0, 10).replace(/[-/]/g, ".");

// 마이페이지 홈에 보여줄 최근 주문 수
export const RECENT_ORDER_COUNT = 2;

// ---------- 주문 상세 ----------
// 010-1234-5678 → 010-****-5678
export const maskPhone = (phone: string) => phone.replace(/^(\d{2,3})-?(\d{3,4})-?(\d{4})$/, "$1-****-$3");

// 서울특별시 강남구 테헤란로 123 → 서울특별시 강남구 · 상세 주소 마스킹
export const maskAddress = (address: string) => `${address.split(" ").slice(0, 2).join(" ")} · 상세 주소 마스킹`;

// 결제 수단 (Visa •••• 4242)
export const formatPayment = (payment?: { method: string; last4?: string }) =>
    payment ? [payment.method, payment.last4 && `•••• ${payment.last4}`].filter(Boolean).join(" ") : "결제 수단 확인 중";

// ---------- 등록 제품·보증 ----------
export const maskSerial = (serial: string) => `•••• ${serial.slice(-4)}`;

export const warrantyLabel = {
    pending: "구매 증빙 확인 필요",
    active: "보증 적용 중",
    expired: "보증 만료",
} as const;

export const warrantyText = (warranty: keyof typeof warrantyLabel, purchasedAt?: string, until?: string) => {
    const date = purchasedAt ? `구매일 ${formatOrderDate(purchasedAt)} · ` : "";
    if (warranty === "pending") return `${date}구매 증빙 확인 후 보증 적용 여부를 안내합니다.`;
    if (warranty === "active") return `${date}보증 기간 ${until ? `${formatOrderDate(until)}까지` : "확인 중"}`;
    return `${date}보증 기간이 끝났어요. 유상 수리는 지원 요청으로 문의해 주세요.`;
};
