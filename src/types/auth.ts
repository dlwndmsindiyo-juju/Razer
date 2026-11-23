// 사용자와 관련된 타입
export interface AppUser {
    uid: string;
    name: string | null;
    nickname: string;
    email: string | null;
    phone: string | null;
    profile: string;
    birth?: string; // 생년월일 (YYYY/MM/DD)
    location?: string; // 위치(국가)
    // ↓ 마이페이지 · 계정 관리 (Firestore users/{uid} 문서에 같이 저장)
    addresses?: Address[]; // 배송지
    cards?: PaymentCard[]; // 결제 수단 (끝 4자리만)
    notify?: { event: boolean; product: boolean }; // 알림 설정 (이메일 수신)
    twoFactor?: boolean; // 2단계 인증
    passwordChangedAt?: string; // 최근 비밀번호 변경일
}

// 배송지
export interface Address {
    id: string;
    name: string;
    phone: string;
    address: string;
    isDefault?: boolean;
}

// 결제 카드 (카드번호 전체는 저장하지 않음)
export interface PaymentCard {
    id: string;
    brand: "VISA" | "Mastercard" | string;
    last4: string;
    issuer?: string; // 신한카드
    expiry?: string; // 12/28
    isDefault?: boolean;
}

// 회원가입 폼 입력값
export interface SignupForm {
    nickname: string; // Razer ID (게이머 명)
    password: string;
    birth: string;
    email: string;
    location: string;
}

export interface AuthState {
    user: AppUser | null;
    authReady: boolean;
    initAuth: () => () => void;
    // 이메일 회원가입·로그인 (실패 시 에러를 던짐 → 화면에서 문구 표시)
    onMember: (form: SignupForm) => Promise<void>;
    onLogin: (email: string, password: string) => Promise<void>;
    // 암호 재설정 메일 발송
    onResetPassword: (email: string) => Promise<void>;
    // 구글·트위치 팝업 로그인 성공 여부를 반환
    onGoogleLogin: () => Promise<boolean>;
    onTwitchLogin: () => Promise<boolean>;

    // 디스코드 인증을 시작하는 서버 주소로 이동
    onDiscordLogin: () => void;

    // 서버에서 받은 Firebase 커스텀 토큰으로 로그인 완료
    completeDiscordLogin: (firebaseCustomToken: string) => Promise<boolean>;
    onLogout: () => Promise<void>;

    // 프로필 · 계정 설정 저장 (Firestore users/{uid} 에 합쳐서 저장)
    onUpdateProfile: (changes: Partial<AppUser>) => Promise<void>;
}