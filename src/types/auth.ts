import type { User } from "firebase/auth";

// 사용자와 관련된 타입
export interface AppUser {
    uid: string;
    name: string | null;
    nickname: string;
    email: string | null;
    phone: string | null;
    profile: string;
}

export interface AuthState {
    user: AppUser | null;
    authReady: boolean;
    initAuth: () => () => void;
    onMember: (form: AppUser) => Promise<void>;
    onLogin: (email: string, password: string) => Promise<void>;
    // 구글·트위치 팝업 로그인 성공 여부를 반환
    onGoogleLogin: () => Promise<boolean>;
    onTwitchLogin: () => Promise<boolean>;

    // 디스코드 인증을 시작하는 서버 주소로 이동
    onDiscordLogin: () => void;

    // 서버에서 받은 Firebase 커스텀 토큰으로 로그인 완료
    completeDiscordLogin: (firebaseCustomToken: string) => Promise<boolean>;
    onLogout: () => Promise<void>;
}