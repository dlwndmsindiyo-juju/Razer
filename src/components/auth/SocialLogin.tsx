import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

// 간편 로그인 버튼 (구글 · 트위치 · 디스코드)
export const SocialLogin = ({ redirectTo = "/" }: { redirectTo?: string }) => {
    const navigate = useNavigate();
    const { onGoogleLogin, onTwitchLogin, onDiscordLogin } = useAuthStore();

    const popupLogin = async (login: () => Promise<boolean>) => {
        if (await login()) navigate(redirectTo, { replace: true });
    };

    return (
        <div className="auth-social">
            <button type="button" className="auth-social__btn" aria-label="Google로 로그인" onClick={() => popupLogin(onGoogleLogin)}>
                <img src="/icons/google.svg" alt="" />
            </button>
            <button type="button" className="auth-social__btn" aria-label="Twitch로 로그인" onClick={() => popupLogin(onTwitchLogin)}>
                <img src="/icons/twitch.svg" alt="" />
            </button>
            <button type="button" className="auth-social__btn auth-social__btn--discord" aria-label="Discord로 로그인" onClick={onDiscordLogin}>
                <img src="/icons/discord.svg" alt="" />
            </button>
        </div>
    );
};

// "또는" 구분선
export const AuthDivider = () => (
    <div className="auth-divider" role="separator">
        <span>또는</span>
    </div>
);
