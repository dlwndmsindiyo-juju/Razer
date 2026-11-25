import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// 로그인 정보 때문에 외부에서 사용하게끔 변수 값을 만들기
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// 매번 구글 계정 선택 창 표시 (여러 계정 테스트 · 계정 전환용)
googleProvider.setCustomParameters({ prompt: "select_account" });
// 트위치 로그인
export const twitchProvider = new OAuthProvider("oidc.twitch");
// 트위치는 요청해야만 이메일·닉네임·프로필 사진을 보내줌
twitchProvider.addScope("user:read:email");
twitchProvider.setCustomParameters({
    claims: JSON.stringify({
        id_token: { email: null, email_verified: null, preferred_username: null, picture: null },
    }),
    // 매번 트위치 권한 허용 화면을 보여줌 (없으면 한 번 승인한 뒤로는 바로 로그인됨)
    force_verify: "true",
});
// 쇼핑 리스트, 찜 리스트 정보 저장(파이어스토어 사용 필요)
export const db = getFirestore(app);