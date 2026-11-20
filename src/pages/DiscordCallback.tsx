import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { DISCORD_REDIRECT_KEY } from "../components/auth/SocialLogin";

// 서버가 넘겨주는 실패 사유
const errorMessages: Record<string, string> = {
    cancelled: "디스코드 로그인을 취소했습니다.",
    invalid_state: "로그인 요청이 만료되었습니다. 다시 시도해주세요.",
    server: "디스코드 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
};

// 디스코드 로그인 완료 처리 (/login/discord#token=...)
export const DiscordCallback = () => {
    const navigate = useNavigate();
    const completeDiscordLogin = useAuthStore((state) => state.completeDiscordLogin);
    const [error, setError] = useState("");
    const started = useRef(false); // StrictMode 두 번 실행 방지

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        const params = new URLSearchParams(window.location.hash.slice(1));
        const token = params.get("token");
        const reason = params.get("error");

        // 토큰이 주소창·방문 기록에 남지 않도록 # 제거
        window.history.replaceState(null, "", window.location.pathname);

        if (!token) {
            setError(errorMessages[reason ?? ""] ?? errorMessages.server);
            return;
        }

        completeDiscordLogin(token).then((ok) => {
            if (!ok) {
                setError(errorMessages.server);
                return;
            }
            const redirectTo = sessionStorage.getItem(DISCORD_REDIRECT_KEY) ?? "/";
            sessionStorage.removeItem(DISCORD_REDIRECT_KEY);
            navigate(redirectTo, { replace: true });
        });
    }, [completeDiscordLogin, navigate]);

    return (
        <section className="auth">
            <div className="auth__card auth__card--status">
                <div className="auth__head">
                    <img className="auth__logo-img" src="/icons/logo.svg" alt="Razer" />
                    <h1 className="auth__title">{error ? "로그인에 실패했습니다" : "디스코드 계정으로 로그인 중..."}</h1>
                    {error && <p className="auth__desc">{error}</p>}
                </div>
                {error && (
                    <Link to="/login" className="auth__submit auth__submit--link">
                        로그인 페이지로 돌아가기
                    </Link>
                )}
            </div>
        </section>
    );
};
