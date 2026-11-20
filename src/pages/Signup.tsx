import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getAuthErrorMessage, useAuthStore } from "../store/useAuthStore";
import { AuthField } from "../components/auth/AuthField";
import { AuthDivider, SocialLogin } from "../components/auth/SocialLogin";
import { AuthSelect } from "../components/auth/AuthSelect";
import { useErrorDisplay } from "../components/auth/useErrorDisplay";
import {
    formatBirth,
    signupLocations,
    signupTerms,
    validateBirth,
    validateEmail,
    validateLocation,
    validateNickname,
    validatePassword,
} from "../data/authData";

const initialForm = { nickname: "", password: "", birth: "", email: "", location: "" };
type FormKey = keyof typeof initialForm;

// 회원가입 (/signup)
export const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, onMember } = useAuthStore();
    const routeState = location.state as { from?: string; email?: string } | null;
    const redirectTo = routeState?.from ?? "/";

    // 로그인의 '회원 정보 없음' 팝업에서 넘어오면 이메일 미리 채우기
    const [form, setForm] = useState({ ...initialForm, email: routeState?.email ?? "" });
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const errors: Record<FormKey, string> = {
        nickname: validateNickname(form.nickname),
        password: validatePassword(form.password),
        birth: validateBirth(form.birth),
        email: validateEmail(form.email),
        location: validateLocation(form.location),
    };
    const hasError = Object.values(errors).some(Boolean);
    const { show: showError, touch, markSubmitted, attempt } = useErrorDisplay(errors, form);

    const update = (key: FormKey) => (value: string) =>
        setForm((prev) => ({ ...prev, [key]: key === "birth" ? formatBirth(value) : value }));

    if (user && !loading) return <Navigate to={redirectTo} replace />;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        markSubmitted();
        setFormError("");
        if (hasError) {
            setFormError("일부 항목에 오류가 있습니다. 계속하려면 수정해주세요.");
            return;
        }

        setLoading(true);
        try {
            await onMember({ ...form, nickname: form.nickname.trim(), email: form.email.trim() });
            navigate(redirectTo, { replace: true });
        } catch (error) {
            setFormError(getAuthErrorMessage(error));
            setLoading(false);
        }
    };

    return (
        <section className="auth">
            <div className="auth__card auth__card--signup">
                <div className="auth__head">
                    <Link to="/" className="auth__logo" aria-label="Razer 홈">
                        <img src="/icons/logo.svg" alt="Razer" />
                    </Link>
                    <h1 className="auth__title">Razer ID 계정 만들기</h1>
                    <p className="auth__desc">Razer ID는 모든 Razer 서비스에서 사용할 수 있는 통합 계정입니다.</p>
                </div>

                <SocialLogin redirectTo={redirectTo} />
                <AuthDivider />

                <form className="auth__form" onSubmit={handleSubmit} noValidate>
                    <p className="auth__required">모든 항목은 필수 입력입니다.</p>

                    <AuthField
                        label="RAZER ID (게이머 명)"
                        autoComplete="nickname"
                        maxLength={20}
                        value={form.nickname}
                        onChange={update("nickname")}
                        onBlur={touch("nickname")}
                        shakeKey={attempt}
                        error={showError("nickname")}
                    />
                    <AuthField
                        label="암호"
                        type="password"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={update("password")}
                        onBlur={touch("password")}
                        shakeKey={attempt}
                        error={showError("password")}
                    />
                    <AuthField
                        label="생년월일 (YYYY/MM/DD)"
                        inputMode="numeric"
                        autoComplete="bday"
                        value={form.birth}
                        onChange={update("birth")}
                        onBlur={touch("birth")}
                        shakeKey={attempt}
                        error={showError("birth")}
                    />
                    <AuthField
                        label="이메일 주소"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={update("email")}
                        onBlur={touch("email")}
                        shakeKey={attempt}
                        error={showError("email")}
                    />

                    <AuthSelect
                        label="위치"
                        options={signupLocations}
                        value={form.location}
                        onChange={update("location")}
                        shakeKey={attempt}
                        error={showError("location")}
                    />

                    <div className="auth__terms">
                        <h2 className="auth__terms-title">약관</h2>
                        {signupTerms.map((lines, i) => (
                            <p key={i}>
                                {lines.map((line, j) => (
                                    <span key={j}>{line}</span>
                                ))}
                            </p>
                        ))}
                    </div>

                    {/* 에러 문구는 버튼 위에 겹쳐 표시 (레이아웃 고정) */}
                    <div className="auth__submit-wrap">
                        {formError && <p className="auth__form-error" role="alert">{formError}</p>}
                        <button type="submit" className="auth__submit" disabled={loading}>
                            {loading ? "계정 만드는 중..." : "동의 및 생성"}
                        </button>
                    </div>
                </form>

                <div className="auth__switch">
                    <p>이미 계정이 있으신가요?</p>
                    <Link to="/login" state={location.state}>로그인</Link>
                </div>
            </div>
        </section>
    );
};
