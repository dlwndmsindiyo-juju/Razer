import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthField } from "../components/auth/AuthField";
import { validateEmail } from "../data/authData";
import { getAuthErrorMessage, useAuthStore } from "../store/useAuthStore";

export function PasswordReset() {
    const location = useLocation();
    const [email, setEmail] = useState(() => typeof location.state?.email === "string" ? location.state.email : "");
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);
    const [pending, setPending] = useState(false);
    const resetPassword = useAuthStore((state) => state.onResetPassword);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        const validation = validateEmail(email);
        setError(validation ?? "");
        if (validation) return;
        setPending(true);
        try {
            await resetPassword(email.trim());
            setSent(true);
        } catch (reason) {
            setError(getAuthErrorMessage(reason));
        } finally {
            setPending(false);
        }
    };

    return <section className="auth design-password">
        <div className="auth__card design-reset">
            <div className="auth__head">
                <Link to="/" className="auth__logo"><img src="/icons/logo.svg" alt="Razer 홈" /></Link>
                <h1 className="auth__title">비밀번호 찾기</h1>
                <ul className="design-reset__help">
                    <li>비밀번호는 암호화로 저장되어 분실 시 찾아드릴 수 없는 정보입니다.</li>
                    <li>본인 확인을 통해 비밀번호를 재설정하실 수 있습니다.</li>
                </ul>
            </div>
            <form className="auth__form" onSubmit={submit} noValidate>
                <input className="auth-field__input design-reset__optional" aria-label="아이디" placeholder="아이디" autoComplete="username" />
                <input className="auth-field__input design-reset__optional" aria-label="이름" placeholder="이름" autoComplete="name" />
                <AuthField label="이메일 주소" type="email" autoComplete="email" value={email}
                    onChange={(value) => { setEmail(value); setError(""); setSent(false); }} error={error} />
                {sent && <p role="status">재설정 메일을 보냈습니다. 메일함을 확인해주세요.</p>}
                <fieldset className="design-reset__methods">
                    <legend>비밀번호 찾기 방법을 선택해주세요.</legend>
                    <label><input type="radio" name="reset-method" defaultChecked /> 이메일로 받기</label>
                    <label><input type="radio" name="reset-method" disabled /> 휴대폰으로 받기</label>
                </fieldset>
                <div className="design-reset__links"><Link to="/login">로그인</Link><Link to="/info/service/support">아이디 찾기</Link><Link to="/signup">회원가입</Link></div>
                <button className="btn btn--primary" disabled={pending}>{pending ? "보내는 중…" : "비밀번호 찾기"}</button>
            </form>
        </div>
    </section>;
}
