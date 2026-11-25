import { useCallback, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getAuthErrorMessage, isNoAccountError, useAuthStore } from "../store/useAuthStore";
import { AuthField } from "../components/auth/AuthField";
import { AuthDivider, SocialLogin } from "../components/auth/SocialLogin";
import { validateEmail, validatePassword } from "../data/authData";
import { useErrorDisplay } from "../components/auth/useErrorDisplay";
import { AuthModal } from "../components/auth/AuthModal";

// 로그인 (/login)
export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, onLogin } = useAuthStore();

    // 로그인 후 돌아갈 곳 (이전 페이지가 넘겨준 경로, 없으면 홈)
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const [noAccountEmail, setNoAccountEmail] = useState(""); // 회원 정보 없음 팝업 (입력했던 이메일)

    // 팝업 닫고 비워진 이메일 칸으로 돌아가기
    const closeNoAccount = useCallback(() => {
        setNoAccountEmail("");
        document.getElementById("login-email")?.focus();
    }, []);

    const errors = {
        email: validateEmail(email),
        password: validatePassword(password),
    };
    const { show, touch, markSubmitted, attempt, resetDisplay } = useErrorDisplay(errors, { email, password });

    // 없는 계정: 팝업을 띄우고 입력한 로그인 정보 리셋
    const openNoAccount = () => {
        setNoAccountEmail(email.trim());
        setEmail("");
        setPassword("");
        setFormError("");
        resetDisplay();
    };

    if (user) return <Navigate to={redirectTo} replace />;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        markSubmitted();
        setFormError("");
        if (errors.email || errors.password) return;

        setLoading(true);
        try {
            await onLogin(email.trim(), password);
            navigate(redirectTo, { replace: true });
        } catch (error) {
            // 가입되지 않은 이메일이면 팝업, 그 외(암호 틀림 등)는 암호 칸 아래 문구
            if (isNoAccountError(error)) openNoAccount();
            else setFormError(getAuthErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth">
            <div className="auth__card">
                <div className="auth__head">
                    <Link to="/" className="auth__logo" aria-label="Razer 홈">
                        <img src="/icons/logo.svg" alt="Razer" />
                    </Link>
                    <h1 className="auth__title">Razer ID로 로그인 하기</h1>
                </div>

                <form className="auth__form" onSubmit={handleSubmit} noValidate>
                    <AuthField
                        id="login-email"
                        label="이메일 주소"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={setEmail}
                        onBlur={touch("email")}
                        shakeKey={attempt}
                        error={show("email")}
                    />
                    <AuthField
                        label="암호"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(value) => {
                            setPassword(value);
                            setFormError("");
                        }}
                        onBlur={touch("password")}
                        shakeKey={attempt}
                        error={show("password") || formError}
                    />

                    <div className="auth__links">
                        <Link to="/signup" state={location.state}>Razer ID 만들기</Link>
                        <span aria-hidden="true">|</span>
                        <Link to="/password-reset" state={{ email }}>비밀번호 찾기</Link>
                    </div>


                    <button type="submit" className="auth__submit" disabled={loading}>
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <AuthDivider />
                <SocialLogin redirectTo={redirectTo} />
            </div>

            {noAccountEmail && (
                <AuthModal
                    title="회원 정보가 없습니다"
                    onClose={closeNoAccount}
                    actions={
                        <>
                            <button type="button" className="auth-modal__btn" onClick={closeNoAccount}>
                                다시 입력
                            </button>
                            <Link
                                to="/signup"
                                state={{ ...(location.state as object | null), email: noAccountEmail }}
                                className="auth-modal__btn auth-modal__btn--primary"
                            >
                                Razer ID 만들기
                            </Link>
                        </>
                    }
                >
                    <p><strong>{noAccountEmail}</strong></p>
                    <p>위 이메일로 가입된 Razer ID가 없습니다.</p>
                    <p>이메일 주소를 다시 확인하거나 새 계정을 만들어주세요.</p>
                </AuthModal>
            )}
        </section>
    );
};
