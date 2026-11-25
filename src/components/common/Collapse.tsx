import type { ReactNode } from "react";

interface CollapseProps {
    open: boolean;
    id?: string;
    className?: string;
    children: ReactNode;
}

// 누르면 아래로 스르륵 펼쳐지는 영역 (FAQ · 아코디언 공용)
// 닫혀 있어도 DOM에 남겨 두고 높이만 0 ↔ 내용 높이로 바뀜 (스타일: App.scss .reveal)
export const Collapse = ({ open, id, className, children }: CollapseProps) => (
    <div id={id} className={"reveal" + (open ? " is-open" : "") + (className ? " " + className : "")}
        inert={!open} aria-hidden={!open}>
        <div className="reveal__inner">{children}</div>
    </div>
);
