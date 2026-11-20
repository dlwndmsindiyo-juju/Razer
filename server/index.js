// Discord 간편로그인 서버
// 흐름: 사이트 → /start → 디스코드 권한 허용 → /callback → Firebase 커스텀 토큰 발급 → 사이트(/login/discord)
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import express from "express";
import admin from "firebase-admin";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// 프로젝트 루트의 .env 사용 (VITE_ 변수와 같은 파일)
dotenv.config({ path: path.join(dirname, "../.env") });

const {
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    DISCORD_REDIRECT_URI = "http://localhost:3000/api/auth/discord/callback",
    CLIENT_URL = "http://localhost:5173", // 로그인 후 돌아갈 사이트 주소
    FIREBASE_SERVICE_ACCOUNT_PATH = "./serviceAccountKey.json",
    PORT = "3000",
} = process.env;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    console.error("[설정 오류] .env에 DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET을 넣어주세요.");
    process.exit(1);
}

// ---------- Firebase Admin (커스텀 토큰 발급용) ----------
const keyPath = path.resolve(dirname, FIREBASE_SERVICE_ACCOUNT_PATH);
if (!fs.existsSync(keyPath)) {
    console.error(`[설정 오류] 서비스 계정 키가 없어요: ${keyPath}`);
    console.error("Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성 → server/serviceAccountKey.json 으로 저장");
    process.exit(1);
}
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

// ---------- 공통 ----------
const app = express();
const STATE_COOKIE = "discord_oauth_state";
const ORIGIN_COOKIE = "discord_oauth_origin";

// 돌아갈 사이트 주소 허용 목록: CLIENT_URL + 개발 중 localhost(포트 무관)
const isAllowedOrigin = (origin) => {
    try {
        const url = new URL(origin);
        if (url.origin === new URL(CLIENT_URL).origin) return true;
        return ["localhost", "127.0.0.1"].includes(url.hostname);
    } catch {
        return false;
    }
};

// 쿠키에서 값 하나 읽기
const readCookie = (req, name) => {
    const found = (req.headers.cookie ?? "")
        .split(";")
        .map((part) => part.trim().split("="))
        .find(([key]) => key === name);
    return found ? decodeURIComponent(found[1]) : null;
};

// 사이트 콜백 페이지로 결과 전달 (토큰은 # 뒤에 넣어 서버 로그·Referer에 남지 않게)
const backToClient = (req, res, params) => {
    // 버튼을 누른 사이트 주소로 돌아감 (Vite 포트가 5174 등으로 바뀌어도 동작)
    const savedOrigin = readCookie(req, ORIGIN_COOKIE);
    const clientOrigin = savedOrigin && isAllowedOrigin(savedOrigin) ? savedOrigin : CLIENT_URL;
    res.clearCookie(ORIGIN_COOKIE);

    const hash = new URLSearchParams(params).toString();
    res.redirect(`${clientOrigin}/login/discord#${hash}`);
};

// 디스코드 정보로 Firebase 사용자 만들기 / 갱신
const upsertFirebaseUser = async (uid, discordUser) => {
    const profile = {
        displayName: discordUser.global_name || discordUser.username,
        photoURL: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : undefined,
    };
    // 인증된 이메일만 사용
    const email = discordUser.verified && discordUser.email ? discordUser.email.toLowerCase() : undefined;

    const save = async (data) => {
        try {
            await admin.auth().updateUser(uid, data);
        } catch (error) {
            if (error.code !== "auth/user-not-found") throw error;
            await admin.auth().createUser({ uid, ...data });
        }
    };

    try {
        await save({ ...profile, ...(email && { email, emailVerified: true }) });
    } catch (error) {
        // 같은 이메일로 이미 가입한 다른 계정(이메일·구글 등)이 있으면 이메일 없이 저장
        if (error.code !== "auth/email-already-exists") throw error;
        await save(profile);
    }
};

// ---------- 1. 디스코드 로그인 시작 ----------
app.get("/api/auth/discord/start", (req, res) => {
    // CSRF 방지용 state (쿠키에 저장 후 콜백에서 비교)
    const state = crypto.randomBytes(16).toString("hex");
    res.cookie(STATE_COOKIE, state, { httpOnly: true, sameSite: "lax", maxAge: 10 * 60 * 1000 });

    // 로그인 후 돌아갈 사이트 주소 기억 (?origin=http://localhost:5173)
    const origin = String(req.query.origin ?? "");
    if (isAllowedOrigin(origin)) {
        res.cookie(ORIGIN_COOKIE, new URL(origin).origin, { httpOnly: true, sameSite: "lax", maxAge: 10 * 60 * 1000 });
    }

    const params = new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        redirect_uri: DISCORD_REDIRECT_URI,
        response_type: "code",
        scope: "identify email",
        state,
        // 매번 디스코드 권한 허용 화면 표시 ('본인이 아닌가요?'로 계정 전환 가능)
        prompt: "consent",
    });
    res.redirect(`https://discord.com/oauth2/authorize?${params}`);
});

// ---------- 2. 디스코드에서 돌아옴 ----------
app.get("/api/auth/discord/callback", async (req, res) => {
    const { code, state, error } = req.query;
    console.log("[디스코드] 콜백 도착", error ? `(취소: ${error})` : "");
    const savedState = readCookie(req, STATE_COOKIE);
    res.clearCookie(STATE_COOKIE);

    // 사용자가 '취소'를 누른 경우
    if (error) return backToClient(req, res, { error: "cancelled" });
    if (!code || !state || state !== savedState) return backToClient(req, res, { error: "invalid_state" });

    try {
        // 2-1. code → 디스코드 access token
        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: DISCORD_CLIENT_ID,
                client_secret: DISCORD_CLIENT_SECRET,
                grant_type: "authorization_code",
                code: String(code),
                redirect_uri: DISCORD_REDIRECT_URI,
            }),
        });
        if (!tokenRes.ok) throw new Error(`토큰 교환 실패 (${tokenRes.status}) ${await tokenRes.text()}`);
        const { access_token: accessToken } = await tokenRes.json();

        // 2-2. 디스코드 사용자 정보
        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!userRes.ok) throw new Error(`사용자 정보 조회 실패 (${userRes.status})`);
        const discordUser = await userRes.json();

        // 2-3. Firebase 사용자 준비 + 커스텀 토큰 발급
        const uid = `discord:${discordUser.id}`;
        await upsertFirebaseUser(uid, discordUser);
        const firebaseToken = await admin.auth().createCustomToken(uid, { provider: "discord" });

        backToClient(req, res, { token: firebaseToken });
    } catch (err) {
        console.error("[디스코드 로그인 실패]", err);
        backToClient(req, res, { error: "server" });
    }
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(Number(PORT), () => {
    console.log(`디스코드 로그인 서버 실행: http://localhost:${PORT}`);
    console.log(`디스코드 리디렉션 주소: ${DISCORD_REDIRECT_URI}`);
});
