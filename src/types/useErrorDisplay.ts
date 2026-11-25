import { useState } from "react";
import { hasKorean } from "../data/authData";

// 에러 문구를 언제 보여줄지 관리
// - 제출 버튼을 누른 뒤: 모든 칸
// - 입력하고 칸을 벗어난 뒤(blur): 그 칸
// - 한글을 입력한 순간: 바로
// attempt는 입력칸 흔들림(shake) 다시 실행용
export const useErrorDisplay = <K extends string>(errors: Record<K, string>, values: Record<K, string>) => {
    const [submitted, setSubmitted] = useState(false);
    const [attempt, setAttempt] = useState(0); // 제출할 때마다 +1 → 같은 에러여도 다시 흔들기
    const [touched, setTouched] = useState<Partial<Record<K, boolean>>>({});

    const show = (key: K) => {
        const visible = submitted || (touched[key] && values[key] !== "") || hasKorean(values[key]);
        return visible ? errors[key] : "";
    };

    const touch = (key: K) => () => setTouched((prev) => ({ ...prev, [key]: true }));

    // 제출 시도 기록
    const markSubmitted = () => {
        setSubmitted(true);
        setAttempt((n) => n + 1);
    };

    // 입력값을 리셋할 때 에러 표시도 처음 상태로
    const resetDisplay = () => {
        setSubmitted(false);
        setTouched({});
    };

    return { show, touch, submitted, markSubmitted, attempt, resetDisplay };
};
