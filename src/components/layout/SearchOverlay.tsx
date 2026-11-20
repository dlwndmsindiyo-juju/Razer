import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSearchPath, popularKeywords } from "../../data/searchData";

interface SearchOverlayProps {
    onClose: () => void;
}

// 헤더 검색 아이콘 → 펼쳐지는 검색창 (엔터 누르면 검색 결과 페이지로)
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
                            <button type="submit" className="search-overlay__submit" aria-label="검색">
                                <img src="/icons/search.svg" alt="" />
                            </button>
                        </div>

                        <button type="button" className="search-overlay__close" aria-label="검색창 닫기" onClick={onClose}>
                            <img src="/icons/close.svg" alt="" />
                        </button>
                    </form>

                    <div className="search-overlay__popular">
                        <strong className="search-overlay__popular-title">인기 검색</strong>
                        <ul>
                            {popularKeywords.map((word) => (
                                <li key={word}>
                                    <Link to={getSearchPath(word)} onClick={onClose}>
                                        {word}
                                    </Link>
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
