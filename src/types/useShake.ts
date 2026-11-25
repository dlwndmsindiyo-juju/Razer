import { useEffect, useState } from "react";

// 에러가 새로 생기거나 바뀔 때, 또는 다시 제출할 때 입력칸을 한 번 흔듦
export const useShake = (error: string | undefined, shakeKey = 0) => {
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (!error) return;
        // 클래스를 뺐다가 다음 프레임에 다시 넣어야 애니메이션이 처음부터 재생됨
        setIsShaking(false);
        const frame = requestAnimationFrame(() => setIsShaking(true));
        return () => cancelAnimationFrame(frame);
    }, [error, shakeKey]);

    return { isShaking, stop: () => setIsShaking(false) };
};
