import { useId, useState, type InputHTMLAttributes } from "react";
import { useShake } from "../../types/useShake";

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    label: string; // 플레이스홀더 겸 접근성 이름
    value: string;
    onChange: (value: string) => void;
    error?: string;
    shakeKey?: number; // 제출 시도 횟수 (바뀌면 에러 칸을 다시 흔듦)
}

// 로그인 · 회원가입 입력칸 (암호는 눈 아이콘으로 보기 전환)
export const AuthField = ({ label, value, onChange, error, shakeKey, type = "text", ...rest }: AuthFieldProps) => {
    const errorId = useId();
    const [isVisible, setIsVisible] = useState(false);
    const isPassword = type === "password";
    const shake = useShake(error, shakeKey);

    // 입력값이 비워지면(리셋) 암호를 다시 가림
    if (isVisible && value === "") setIsVisible(false);

    return (
        <div className={`auth-field${error ? " has-error" : ""}`}>
            <div className={`auth-field__box${shake.isShaking ? " is-shaking" : ""}`} onAnimationEnd={shake.stop}>
                <input
                    {...rest}
                    className={`auth-field__input${isPassword ? " auth-field__input--password" : ""}`}
                    type={isPassword && isVisible ? "text" : type}
                    value={value}
                    placeholder={label}
                    aria-label={label}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    onChange={(e) => onChange(e.target.value)}
                />
                {isPassword && (
                    <button
                        type="button"
                        className={`auth-field__toggle${isVisible ? " is-visible" : ""}`}
                        aria-label={isVisible ? "암호 숨기기" : "암호 보기"}
                        aria-pressed={isVisible}
                        // Tab 이동·Enter·Space로는 눌리지 않고 마우스·터치로만 전환
                        tabIndex={-1}
                        onMouseDown={(e) => e.preventDefault()} // 입력칸 커서 유지
                        onKeyDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                            if (e.detail === 0) return; // 키보드로 발생한 클릭 무시
                            setIsVisible((prev) => !prev);
                        }}
                    >
                        <img src="/icons/password.svg" alt="" />
                    </button>
                )}
            </div>
            {error && <p id={errorId} className="auth-field__error">{error}</p>}
        </div>
    );
};
