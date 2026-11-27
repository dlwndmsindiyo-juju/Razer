import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSearchPath, popularKeywords } from "../../data/searchData";
import { searchCategories } from "../../data/navData";

interface SearchOverlayProps {
    onClose: () => void;
}

// 헤더 검색 아이콘 → 펼쳐지는 검색창 (엔터 누르면 검색 결과 페이지로)
// 모바일: 전체 화면 패널 (← · 검색칸 → 인기 검색 TOP 5 → 카테고리로 찾기)
export const SearchOverlay = ({ onClose }: SearchOverlayProps) => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // 열리면 바로 입력할 수 있게
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        navigate(getSearchPath(keyword));
        onClose();
    };

    return (
        <>
            <div id="search-overlay" className="search-overlay">
                <div className="search-overlay__inner">
                    <form className="search-overlay__form" role="search" onSubmit={handleSubmit}>
                        {/* 모바일: 뒤로 (닫기) */}
                        <button type="button" className="search-overlay__back" aria-label="검색 닫기" onClick={onClose}>
                            <img src="/icons/ui/chevron-left.svg" alt="" />
                        </button>
                        <div className="search-overlay__bar">
                            <input
                                ref={inputRef}
                                type="search"
                                className="search-overlay__input"
                                placeholder="무엇을 찾으시나요?"
                                aria-label="검색어"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            {/* 입력 중이면 지우기 (X) · 비어 있으면 검색 */}
                            {keyword ? (
                                <button type="button" className="search-overlay__submit" aria-label="검색어 지우기"
                                    onClick={() => { setKeyword(""); inputRef.current?.focus(); }}>
                                    <img src="/icons/ui/close.svg" alt="" />
                                </button>
                            ) : (
                                <button type="submit" className="search-overlay__submit" aria-label="검색">
                                    <img src="/icons/search.svg" alt="" />
                                </button>
                            )}
                        </div>

                        <button type="button" className="search-overlay__close" aria-label="검색창 닫기" onClick={onClose}>
                            <img src="/icons/close.svg" alt="" />
                        </button>
                    </form>

                    <div className="search-overlay__popular">
                        <div className="search-overlay__popular-head">
                            <strong className="search-overlay__popular-title">인기 검색</strong>
                            <span className="search-overlay__top">TOP {popularKeywords.length}</span>
                        </div>
                        <ul>
                            {popularKeywords.map((word, i) => (
                                <li key={word}>
                                    <Link to={getSearchPath(word)} onClick={onClose}>
                                        <span className="search-overlay__rank">{String(i + 1).padStart(2, "0")}</span>
                                        <span className="search-overlay__word">{word}</span>
                                        <img src="/icons/ui/chevron-right.svg" alt="" className="search-overlay__arrow" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 모바일: 카테고리로 찾기 */}
                    <div className="search-overlay__categories">
                        <strong>카테고리로 찾기</strong>
                        <ul>
                            {searchCategories.map((category) => (
                                <li key={category.to}>
                                    <Link to={category.to} onClick={onClose}>{category.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* 뒤 배경 (누르면 닫기) */}
            <div className="search-overlay__dim" onClick={onClose} />
        </>
    );
};
