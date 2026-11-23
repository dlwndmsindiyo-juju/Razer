import { create } from "zustand";
import type { AppUser, AuthState } from "../types/auth";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithCustomToken,
    signInWithPopup,
    getAdditionalUserInfo,
    signOut,
    updateProfile,
} from "firebase/auth";
import { auth, db, googleProvider, twitchProvider } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
// 로그인하면 계정의 찜·주문 조회, 로그아웃하면 목록 초기화
import { useProductStore } from "./useProductStore";

// 회원가입 중인 정보 (initAuth가 기본 프로필로 덮어쓰지 않도록 공유)
let pendingSignup: Partial<AppUser> | null = null;

// 가입되지 않은 이메일인지
export const isNoAccountError = (error: unknown) =>
    (error as { code?: string })?.code === "auth/user-not-found";

// 가입 이메일 목록 (registeredEmails/{소문자 이메일})
// Firebase '이메일 열거 보호'가 켜져 있으면 없는 계정과 틀린 암호가 같은 에러로 와서,
// 이 목록으로 실제 가입 여부를 구분함
const emailRef = (email: string) => doc(db, "registeredEmails", email.trim().toLowerCase());

const registerEmail = async (email: string | null) => {
    if (!email) return;
    try {
        await setDoc(emailRef(email), { registered: true }, { merge: true });
    } catch (error) {
        console.error("가입 이메일 등록 실패", error);
    }
};

// true: 가입됨 / false: 없음 / null: 확인 불가(규칙 미설정 등)
const isRegisteredEmail = async (email: string): Promise<boolean | null> => {
    try {
        return (await getDoc(emailRef(email))).exists();
    } catch (error) {
        // 대부분 Firestore 규칙에 registeredEmails 읽기 허용이 없어서 생김
        console.warn("[로그인] 가입 여부를 확인하지 못했어요. Firestore 규칙의 registeredEmails를 확인하세요.", error);
        return null;
    }
};

// Firebase 에러 코드를 화면에 보여줄 문구로 변환
export const getAuthErrorMessage = (error: unknown): string => {
    const code = (error as { code?: string })?.code ?? "";
    switch (code) {
        case "auth/invalid-credential":
        case "auth/invalid-login-credentials":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "이메일 또는 암호가 올바르지 않습니다.";
        case "auth/invalid-email":
            return "올바른 이메일 주소를 입력하세요";
        case "auth/email-already-in-use":
            return "이미 가입된 이메일 주소입니다.";
        case "auth/weak-password":
            return "암호는 6자 이상 입력하세요";
        case "auth/too-many-requests":
            return "시도 횟수가 많아 잠시 후 다시 시도해주세요.";
        case "auth/popup-blocked":
            return "브라우저가 로그인 창을 막았습니다. 팝업 차단을 해제해주세요.";
        case "auth/account-exists-with-different-credential":
            return "같은 이메일로 다른 방법(이메일·구글 등)으로 가입된 계정이 있습니다. 그 방법으로 로그인해주세요.";
        case "auth/unauthorized-domain":
            return "로그인이 허용되지 않은 주소입니다. Firebase 승인된 도메인을 확인해주세요.";
        case "auth/operation-not-allowed":
            return "이 로그인 방식이 Firebase에서 꺼져 있습니다.";
        case "auth/network-request-failed":
            return "네트워크 연결을 확인해주세요.";
        default:
            return "요청을 처리하지 못했습니다. 다시 시도해주세요.";
    }
};

// Firebase 인증 성공 여부를 로그인 화면에 반환
// 사용자가 직접 창을 닫거나 취소한 경우 (오류가 아니므로 알림 없음)
const cancelledCodes = ["auth/popup-closed-by-user", "auth/cancelled-popup-request", "auth/user-cancelled"];

const runLogin = async (login: () => Promise<unknown>): Promise<boolean> => {
    try {
        await login();
        return true;
    } catch (error) {
        const code = (error as { code?: string })?.code ?? "";
        if (cancelledCodes.includes(code)) return false;

        console.error("[간편로그인 실패]", code, error);
        alert(getAuthErrorMessage(error));
        return false;
    }
};

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    authReady: false,

    // 앱 시작 시 한 번 등록. 모든 로그인 방식의 프로필 처리를 여기서 담당
    initAuth: () =>
        onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (!firebaseUser) {
                    set({ user: null });
                    useProductStore.getState().clearUserData();
                    return;
                }

                const userRef = doc(db, "users", firebaseUser.uid);
                const snapshot = await getDoc(userRef);

                // 기존 프로필을 사용하고, 처음 로그인한 사용자만 문서 생성
                const profile: AppUser = snapshot.exists()
                    ? (snapshot.data() as AppUser)
                    : {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName,
                        nickname: "",
                        phone: firebaseUser.phoneNumber,
                        profile: "",
                        // 방금 이메일로 가입한 계정이면 가입 정보 사용
                        ...(pendingSignup?.email === firebaseUser.email ? pendingSignup : {}),
                    };

                if (auth.currentUser?.uid !== firebaseUser.uid) return;

                if (!snapshot.exists()) {
                    await setDoc(userRef, profile, { merge: true });
                }

                if (auth.currentUser?.uid !== firebaseUser.uid) return;

                set({ user: profile });
                // 기존 회원·간편로그인 회원도 로그인할 때 가입 이메일 목록에 등록
                registerEmail(firebaseUser.email);
                await useProductStore.getState().loadUserData(firebaseUser.uid);
            } catch (error) {
                console.error("사용자 정보를 불러오지 못했어요.", error);
            } finally {
                set({ authReady: true });
            }
        }),

    // 이메일 회원가입: 계정 생성 → 프로필 문서 저장
    onMember: async ({ nickname, password, birth, email, location }) => {
        pendingSignup = { email: email.toLowerCase(), name: nickname, nickname, birth, location };
        try {
            const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(firebaseUser, { displayName: nickname });

            const profile: AppUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: nickname,
                nickname,
                phone: firebaseUser.phoneNumber,
                profile: "",
                birth,
                location,
            };

            // initAuth가 먼저 만든 기본 문서가 있어도 가입 정보로 덮어씀
            await setDoc(doc(db, "users", firebaseUser.uid), profile, { merge: true });
            await registerEmail(firebaseUser.email);
            set({ user: profile });
        } finally {
            pendingSignup = null;
        }
    },

    // 이메일 로그인 (프로필 조회는 initAuth에서 처리)
    onLogin: async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            // 없는 계정인지 틀린 암호인지 가입 이메일 목록으로 구분
            const code = (error as { code?: string })?.code ?? "";
            console.info("[로그인] Firebase 에러 코드:", code);

            // 없는 계정·틀린 암호를 구분 못 하는 코드들 (Firebase 버전마다 이름이 다름)
            const ambiguous = ["auth/invalid-credential", "auth/invalid-login-credentials", "auth/wrong-password"];
            if (ambiguous.includes(code) && (await isRegisteredEmail(email)) === false) {
                throw { code: "auth/user-not-found" };
            }
            throw error;
        }
    },

    onResetPassword: async (email) => {
        // 재설정 메일은 없는 이메일이어도 에러가 안 나므로 먼저 확인
        if ((await isRegisteredEmail(email)) === false) throw { code: "auth/user-not-found" };
        await sendPasswordResetEmail(auth, email);
    },

    onGoogleLogin: () =>
        runLogin(() => signInWithPopup(auth, googleProvider)),

    // 트위치는 Firebase가 닉네임·이메일을 계정에 자동으로 채우지 않아서 직접 저장
    onTwitchLogin: () =>
        runLogin(async () => {
            const result = await signInWithPopup(auth, twitchProvider);
            const claims = (getAdditionalUserInfo(result)?.profile ?? {}) as {
                preferred_username?: string;
                email?: string;
                picture?: string;
            };
            const name = result.user.displayName || claims.preferred_username || null;
            const email = result.user.email || claims.email?.toLowerCase() || null;

            if (!result.user.displayName && name) {
                await updateProfile(result.user, { displayName: name, photoURL: claims.picture ?? null });
            }
            await setDoc(doc(db, "users", result.user.uid), { uid: result.user.uid, name, email }, { merge: true });
            await registerEmail(email);

            // initAuth가 먼저 불러온 프로필에도 반영
            set((state) => (state.user?.uid === result.user.uid ? { user: { ...state.user, name, email } } : {}));
        }),

    // 디스코드 로그인 서버(server 폴더)로 이동 → 끝나면 /login/discord 로 돌아옴
    onDiscordLogin: () => {
        const serverUrl = import.meta.env.VITE_AUTH_SERVER_URL ?? "http://localhost:3000";
        // 지금 사이트 주소를 넘겨서 로그인 후 같은 주소로 돌아오게 함
        const origin = encodeURIComponent(window.location.origin);
        window.location.assign(`${serverUrl}/api/auth/discord/start?origin=${origin}`);
    },

    // 서버에서 발급한 Firebase 커스텀 토큰을 받은 뒤 호출 (DiscordCallback 페이지)
    completeDiscordLogin: (firebaseCustomToken) =>
        runLogin(() => signInWithCustomToken(auth, firebaseCustomToken)),

    onLogout: async () => {
        await signOut(auth);
        set({ user: null });
    },

    onUpdateProfile: async (changes) => {
        const current = get().user;
        const firebaseUser = auth.currentUser;
        if (!current || !firebaseUser) return;
        await setDoc(doc(db, "users", firebaseUser.uid), changes, { merge: true });
        // 별명이 바뀌면 Firebase 프로필 이름도 같이
        if (changes.nickname) await updateProfile(firebaseUser, { displayName: changes.nickname });
        set({ user: { ...current, ...changes } });
    },
}));