import { useState, type FormEvent } from "react";
import { passwordResetImages } from "../data/pageImages";
import { Link, useLocation } from "react-router-dom";
import { AuthField } from "../components/auth/AuthField";
import { validateEmail } from "../data/authData";
import { getAuthErrorMessage, useAuthStore } from "../store/useAuthStore";

// 비밀번호 찾기 · 아이디 찾기: 같은 화면 (워딩 · 칸만 다름)
const copy = {
    password: {
        title: "비밀번호 찾기",
        // [앞 글(PC 만) · 굵은 단어 · 뒤 글]
        help: [["비밀번호의 경우 ", "암호화", "로 저장되어 분실 시 찾아드릴 수 없는 정보입니다."], ["", "본인 확인", "을 통해 비밀번호를 재설정하실 수 있습니다."]],
        legend: "비밀번호 찾기 방법을 선택해주세요.",
        button: "비밀번호 찾기",
        links: [["/login", "로그인"], ["/find-id", "아이디 찾기"], ["/signup", "회원가입"]],
    },
    id: {
        title: "아이디 찾기",
        help: [["", "가입할 때 입력한 정보", "로 아이디를 찾을 수 있습니다."], ["", "본인 확인", "을 통해 가입된 아이디를 안내해 드립니다."]],
        legend: "아이디 찾기 방법을 선택해주세요.",
        button: "아이디 찾기",
        links: [["/login", "로그인"], ["/password-reset", "비밀번호 찾기"], ["/signup", "회원가입"]],
    },
} as const;

export function PasswordReset() {
    return <AccountFind mode="password" />;
}

export function FindId() {
    return <AccountFind mode="id" />;
}

function AccountFind({ mode }: { mode: keyof typeof copy }) {
    const text = copy[mode];
    const location = useLocation();
    const [email, setEmail] = useState(() => typeof location.state?.email === "string" ? location.state.email : "");
    const [error, setError] = useState("");
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [submitted, setSubmitted] = useState(false); // 한 번 눌러본 뒤부터 빈 칸 안내
    const idError = mode === "password" && submitted && !userId.trim() ? "올바른 아이디를 입력해주세요" : "";
    const idOk = mode === "id" || !!userId.trim(); // 아이디 찾기는 아이디 칸 없음
    const nameError = submitted && !name.trim() ? "올바른 이름을 입력해주세요" : "";
    const [method, setMethod] = useState<"email" | "phone">("email"); // 받는 방법
    const [phone, setPhone] = useState("");
    const phoneDigits = phone.replace(/\D/g, "");
    const phoneError = submitted && method === "phone" && !/^01\d{8,9}$/.test(phoneDigits) ? "올바른 휴대폰 번호를 입력해주세요" : "";
    const [notice, setNotice] = useState(""); // 휴대폰 안내
    const [sent, setSent] = useState(false);
    const [pending, setPending] = useState(false);
    const resetPassword = useAuthStore((state) => state.onResetPassword);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitted(true);
        setNotice("");
        if (method === "phone") {
            // 문자 발송 기능이 아직 없어서 안내만 (번호 형식은 확인)
            if (!/^01\d{8,9}$/.test(phoneDigits) || !idOk || !name.trim()) return;
            setNotice("휴대폰 인증은 준비 중이에요. 지금은 이메일로 받기를 이용해 주세요.");
            return;
        }
        const validation = validateEmail(email);
        setError(validation ?? "");
        if (validation || !idOk || !name.trim()) return;
        // 아이디 찾기: 이 사이트는 가입한 이메일 주소로 로그인 (Razer ID = 이메일)
        if (mode === "id") {
            setNotice("가입하신 이메일 주소가 로그인 아이디입니다. 이메일 주소로 로그인해 주세요.");
            return;
        }
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
                <h1 className="auth__title">{text.title}</h1>
                <ul className="design-reset__help">
                    {text.help.map(([lead, bold, rest]) => (
                        <li key={bold}>
                            <img src={passwordResetImages.check} alt="" />
                            <span className="design-reset__text">
                                {lead}
                                {bold}
                                {rest}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <form className="auth__form" onSubmit={submit} noValidate>
                {mode === "password" && <AuthField label="아이디" autoComplete="username" value={userId} onChange={setUserId} error={idError} />}
                <AuthField label="이름" autoComplete="name" value={name} onChange={setName} error={nameError} />
                {/* 받는 방법에 따라 이메일 / 휴대폰 번호 칸 */}
                {method === "email" ? (
                    <AuthField label="이메일 주소" type="email" autoComplete="email" value={email}
                        onChange={(value) => { setEmail(value); setError(""); setSent(false); }} error={error} />
                ) : (
                    <AuthField label="휴대폰 번호" type="tel" inputMode="numeric" autoComplete="tel" value={phone}
                        onChange={(value) => {
                            const d = value.replace(/\D/g, "").slice(0, 11);
                            setPhone(d.length > 7 ? `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}` : d.length > 3 ? `${d.slice(0, 3)}-${d.slice(3)}` : d);
                            setNotice("");
                        }} error={phoneError} />
                )}
                {sent && method === "email" && <p role="status">재설정 메일을 보냈습니다. 메일함을 확인해주세요.</p>}
                {notice && <p role="status" className="design-reset__notice">{notice}</p>}
                <fieldset className="design-reset__methods">
                    <legend><img src={passwordResetImages.info} alt="" />{text.legend}</legend>
                    <div className="design-reset__methods-box">
                        <label><input type="radio" name="reset-method" checked={method === "email"} onChange={() => { setMethod("email"); setNotice(""); }} /> 이메일로 받기</label>
                        <label><input type="radio" name="reset-method" checked={method === "phone"} onChange={() => { setMethod("phone"); setSent(false); }} /> 휴대폰으로 받기</label>
                    </div>
                </fieldset>
                <div className="design-reset__links">{text.links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</div>
                <button className="btn btn--primary" disabled={pending}>{pending ? "보내는 중…" : text.button}</button>
            </form>
        </div>
    </section>;
}
