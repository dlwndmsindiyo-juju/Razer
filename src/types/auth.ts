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
}