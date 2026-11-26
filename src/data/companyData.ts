// 회사 · 서비스 안내 페이지 내용 (예전 외부 링크를 사이트 안 페이지로)
// 지속가능성 · 채용 · zVentures · 연락처 · RazerCare
// 출처: razer.com/go-green · careers.razer.com · razer.com/razercare 구성을 한국어로 정리

export type InfoCard = { title: string; text: string; to?: string };

// ---------- 지속가능성 (/info/company/sustainability) ----------
export const sustainabilityPillars: InfoCard[] = [
    { title: "Green Organization", text: "사무실과 일하는 방식부터 더 친환경적으로 바꾸고, 그 실천을 꾸준히 개선해 나갑니다." },
    { title: "Green Products", text: "제품 설계 · 생산 · 배송 전 과정에서 환경에 주는 영향을 줄이는 지속 가능한 방식을 찾습니다." },
    { title: "Green Community", text: "마스코트 Sneki Snek과 함께 커뮤니티와 파트너사에 친환경적인 생각을 퍼뜨립니다." },
    { title: "Green Investments", text: "환경과 지속가능성 분야의 스타트업을 지원하고 투자합니다.", to: "/info/company/zventures" },
];
export const sustainabilityNote =
    "Razer는 홍콩증권거래소의 ESG 가이드라인을 따르고 있으며, 이를 최소한의 기준으로 삼아 그 이상을 목표로 합니다.";

// ---------- 채용 (/info/company/careers) ----------
export const careerSections: InfoCard[] = [
    { title: "최고의 게이밍 기술", text: "혁신적인 하드웨어와 소프트웨어로 게이밍 업계를 이끄는 것을 목표로 합니다." },
    { title: "함께 일하는 팀", text: "투명함과 협업을 중요하게 여기며, 일과 플레이를 똑같이 소중하게 생각합니다." },
    { title: "For Gamers. By Gamers.", text: "구성원 모두가 게이머입니다. 팀워크와 창의적인 문제 해결, 끈기를 일에 그대로 가져옵니다." },
];
export const careerFacts = [
    { value: "15", label: "전 세계 오피스" },
    { value: "3", label: "R&D 연구소" },
];
// 채용 공고 (등록된 공고가 없으면 빈 상태로 표시)
export const careerOpenings: { title: string; team: string; location: string }[] = [];

// ---------- 연락처 (/info/company/contact) ----------
export const contactChannels: InfoCard[] = [
    { title: "1 : 1 문의", text: "주문 · 배송 · 제품 문의를 남겨 주시면 답변해 드립니다.", to: "/info/service/faq?topic=contact" },
    { title: "주문 조회", text: "주문 상태와 배송 현황을 마이페이지에서 확인하세요.", to: "/mypage?tab=orders" },
    { title: "등록 및 보증", text: "제품을 등록하고 보증 기간과 청구 방법을 확인하세요.", to: "/info/service/registration-warranty" },
    { title: "자주 묻는 질문", text: "자주 묻는 질문에서 빠르게 답을 찾아보세요.", to: "/info/service/faq" },
    { title: "교환 및 환불", text: "교환 · 반품 · 환불 기준과 절차를 안내합니다.", to: "/info/service/faq?topic=returns" },
    { title: "지원", text: "Razer Store 이용에 필요한 지원 메뉴를 모았습니다.", to: "/info/service/support" },
];

// ---------- zVentures (/info/company/zventures) ----------
export const zventuresFocus: InfoCard[] = [
    { title: "게이밍 · e스포츠", text: "Razer 생태계와 함께 성장할 게임 · e스포츠 분야의 스타트업을 찾습니다." },
    { title: "새로운 기술", text: "하드웨어 · 소프트웨어 · 서비스 전반의 새로운 기술에 투자합니다." },
    { title: "지속가능성", text: "환경과 지속가능성 분야의 스타트업 투자로 #GoGreenWithRazer를 함께 실천합니다.", to: "/info/company/sustainability" },
];

// ---------- RazerCare (/info/service/razercare) ----------
export const razerCarePlans = [
    {
        name: "RazerCare Essential",
        points: ["기계적 · 전기적 고장 보장", "구매 첫날부터 전원 서지 보호", "자동 등록 · 24시간 청구 지원"],
        window: "제품 구매 후 11개월 이내 가입",
    },
    {
        name: "RazerCare Elite",
        points: ["Essential의 모든 보장", "구매 첫날부터 사고로 인한 손상 보장 (떨어뜨림 · 액체 쏟음 · 충돌)"],
        window: "제품 구매 후 15일 이내 가입",
    },
];
export const razerCareBenefits = [
    "자기부담금 0원",
    "수리 시 왕복 배송 무료",
    "Razer 공인 서비스 센터에서 수리",
    "주변기기는 새 제품으로 교체",
    "새 소유자에게 무료로 양도 가능",
];
export const razerCarePeriods = [
    { product: "노트북 · eGPU", period: "기본 보증 + 2년 연장 (총 3년)" },
    { product: "헤드셋 · 키보드 · 마우스 · 컨트롤러", period: "기본 보증 + 1년 연장 (총 3년)" },
];
export const razerCareNotes = [
    "전원 서지 보호(두 플랜)와 사고 손상 보장(Elite)은 구매 첫날부터, 나머지 보장은 제조사 보증이 끝난 뒤부터 시작됩니다.",
    "제품을 산 뒤 늦게 가입하면 사고 손상 · 전원 서지 청구에 30일 대기 기간이 있습니다.",
    "청구 횟수 제한은 없지만, 총 보상액은 기기 구매 금액까지입니다.",
    "현재 미국(속령 제외) · 캐나다 · 싱가포르 · 홍콩에서 Razer.com으로 구매한 제품만 가입할 수 있습니다.",
];
