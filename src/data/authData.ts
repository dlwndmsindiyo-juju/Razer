// 로그인 · 회원가입 화면에서 쓰는 데이터

// 회원가입 위치 선택
export const signupLocations = [
    "대한민국",
    "미국",
    "일본",
    "중국",
    "대만",
    "홍콩",
    "싱가포르",
    "기타",
];

// 회원가입 약관 문구 (줄 묶음 단위로 문단 구분)
export const signupTerms: string[][] = [
    ["Razer는 고객님의 동의에 따라 관심사와 일치하는 광고 및 추천을 커스터마이징 합니다."],
    ["Razer는 개인정보를 존중합니다.", "동의 설정은 Razer ID 프로필 페이지에서 언제든지 변경할 수 있습니다."],
    ["서비스 약관, Razer Silver 약관 및 개인정보 보호정책에 동의하십니까?"],
];

// 입력값 검사 (에러 문구 반환, 문제 없으면 빈 문자열)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const koreanPattern = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
const specialOnlyPattern = /^[^A-Za-z0-9]+$/; // 영문·숫자 없이 특수문자만
export const PASSWORD_MIN_LENGTH = 6;

// 한글은 입력 중에도 바로 알려주기 위해 따로 사용
export const hasKorean = (value: string) => koreanPattern.test(value);

export const validateEmail = (value: string) => {
    const email = value.trim();
    if (!email) return "이메일 주소를 입력하세요";
    if (hasKorean(email)) return "이메일에는 한글을 입력할 수 없습니다";
    if (!emailPattern.test(email)) return "올바른 이메일 주소를 입력하세요";
    return "";
};

export const validatePassword = (value: string) => {
    if (!value) return "암호를 입력하세요";
    if (hasKorean(value)) return "암호에는 한글을 입력할 수 없습니다";
    if (specialOnlyPattern.test(value)) return "특수문자만으로는 암호를 만들 수 없습니다";
    if (value.length < PASSWORD_MIN_LENGTH) return `암호는 ${PASSWORD_MIN_LENGTH}자 이상 입력하세요`;
    return "";
};

export const validateNickname = (value: string) => {
    const name = value.trim();
    if (!name) return "ID를 입력하세요";
    if (name.length < 3 || name.length > 20) return "ID는 3~20자로 입력하세요";
    return "";
};

export const validateBirth = (value: string) => {
    if (!value) return "생일을 입력하세요";
    const match = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(value);
    if (!match) return "생년월일을 YYYY/MM/DD 형식으로 입력하세요";

    const [, y, m, d] = match.map(Number);
    const date = new Date(y, m - 1, d);
    const isRealDate = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
    if (!isRealDate || y < 1900 || date > new Date()) return "올바른 생년월일을 입력하세요";
    return "";
};

export const validateLocation = (value: string) => (value ? "" : "위치를 선택하세요");

// 숫자만 받아 YYYY/MM/DD 모양으로 자동 입력
export const formatBirth = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    return [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean).join("/");
};
