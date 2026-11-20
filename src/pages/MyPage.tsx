import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// 마이페이지 (/mypage) · 기본 회원 정보만 (상세 디자인은 추후)
export const MyPage = () => {
    const { user, authReady } = useAuthStore();

    // 로그인 확인 전에는 대기, 비로그인이면 로그인 페이지로
    if (!authReady) return null;
    if (!user) return <Navigate to="/login" state={{ from: "/mypage" }} replace />;

    const rows = [
        { label: "Razer ID", value: user.nickname || user.name },
        { label: "이메일", value: user.email },
        { label: "생년월일", value: user.birth },
        { label: "위치", value: user.location },
    ];

    return (
        <section className="mypage">
            <h1 className="mypage__title">마이페이지</h1>
            <dl className="mypage__info">
                {rows.map((row) => (
                    <div key={row.label} className="mypage__row">
                        <dt>{row.label}</dt>
                        <dd>{row.value || "-"}</dd>
                    </div>
                ))}
            </dl>
            <Link to="/cart" className="btn btn--primary btn--sm">장바구니 보기</Link>
        </section>
    );
};
