# Discord 로그인 서버

## 준비
1. Discord Developer Portal → OAuth2 → 리디렉션에 추가
   `http://localhost:3000/api/auth/discord/callback`
2. 프로젝트 루트 `.env`
   ```
   DISCORD_CLIENT_ID=...
   DISCORD_CLIENT_SECRET=...
   DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord/callback
   ```
3. Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성
   → 받은 파일을 `server/serviceAccountKey.json` 으로 저장 (깃허브 업로드 금지)

## 실행
```
cd server
npm install
npm run dev
```
사이트(`npm run dev`, 5173)와 이 서버(3000)를 같이 켜둔 상태에서 디스코드 버튼을 누르면 돼요.
