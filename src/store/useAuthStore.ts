import { create } from "zustand";
import type { AppUser, AuthState } from "../types/auth";
import {
    onAuthStateChanged,
    signInWithCustomToken,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { auth, db, googleProvider, twitchProvider } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
// 로그인하면 계정의 찜·주문 조회, 로그아웃하면 목록 초기화
import { useProductStore } from "./useProductStore";

// Firebase 인증 성공 여부를 로그인 화면에 반환
const runLogin = async (login: () => Promise<unknown>): Promise<boolean> => {
    try {
        await login();
        return true;
    } catch (error) {
        alert(error instanceof Error ? error.message : "로그인에 실패했어요.");
        return false;
    }
};

export const useAuthStore = create<AuthState>((set) => ({
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
                    };

                if (auth.currentUser?.uid !== firebaseUser.uid) return;

                if (!snapshot.exists()) {
                    await setDoc(userRef, profile, { merge: true });
                }

                if (auth.currentUser?.uid !== firebaseUser.uid) return;

                set({ user: profile });
                await useProductStore.getState().loadUserData(firebaseUser.uid);
            } catch (error) {
                console.error("사용자 정보를 불러오지 못했어요.", error);
            } finally {
                set({ authReady: true });
            }
        }),

    // 기존 회원가입·이메일 로그인 자리
    onMember: async () => { },
    onLogin: async () => { },

    onGoogleLogin: () =>
        runLogin(() => signInWithPopup(auth, googleProvider)),

    onTwitchLogin: () =>
        runLogin(() => signInWithPopup(auth, twitchProvider)),

    // 예시: Discord 로그인 서버를 localhost:3000에서 실행하는 경우
    onDiscordLogin: () => {
        window.location.assign("http://localhost:3000/api/auth/discord/start");
    },

    // 서버에서 발급한 Firebase 커스텀 토큰을 받은 뒤 호출
    completeDiscordLogin: (firebaseCustomToken) =>
        runLogin(() => signInWithCustomToken(auth, firebaseCustomToken)),

    onLogout: async () => {
        await signOut(auth);
        set({ user: null });
    },
}));