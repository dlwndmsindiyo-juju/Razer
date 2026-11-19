import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productData } from "../data/productData";
import type { Product } from "../types/product";
import {
    applyFilters,
    recommendedIds,
    sortProducts,
    toCardProduct,
    type SelectedFilters,
    type SortId,
} from "../data/searchData";
import { HomeProductList } from "../components/home/HomeProductList";
import { FilterPanel } from "../components/search/FilterPanel";
import { SortDropdown } from "../components/search/SortDropdown";

// 검색 결과 페이지 (헤더 검색창에서 엔터 → /search?q=검색어)
export const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";
    const [keyword, setKeyword] = useState(query);

    // 헤더 검색창 · 인기 검색으로 주소가 바뀌면 입력창도 바꾸기
    useEffect(() => {
        setKeyword(query);
    }, [query]);

    // 입력창을 고치면 결과와 주소(q)도 바로 바꾸기
    const changeKeyword = (value: string) => {
        setKeyword(value);
        setSearchParams(value.trim() ? { q: value } : {}, { replace: true });
    };
    const [sortId, setSortId] = useState<SortId>("recommended");
    const [selected, setSelected] = useState<SelectedFilters>({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // 검색어 → 필터 → 정렬 순서로 적용
    const results = useMemo(() => {
        const word = keyword.trim().toLowerCase();
        const searched = word ? productData.filter((p) => p.title.toLowerCase().includes(word)) : productData;
        return sortProducts(applyFilters(searched, selected), sortId).map(toCardProduct);
    }, [keyword, selected, sortId]);

    const recommended = useMemo(
        () =>
            recommendedIds
                .map((id) => productData.find((p) => p.id === id))
                .filter((p): p is Product => p !== undefined)
                .map(toCardProduct),
        [],
    );

    const toggleFilter = (groupId: string, optionId: string) => {
        setSelected((prev) => {
            const ids = prev[groupId] ?? [];
            const next = ids.includes(optionId) ? ids.filter((id) => id !== optionId) : [...ids, optionId];
            return { ...prev, [groupId]: next };
        });
    };

    const closeFilter = useCallback(() => setIsFilterOpen(false), []);
    const selectedCount = Object.values(selected).reduce((sum, ids) => sum + ids.length, 0);

    return (
        <div className="search-page">
            {/* 검색창 */}
            <form className="search-page__bar" role="search" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="search"
                    className="search-page__input"
                    placeholder="무엇을 찾으시나요?"
                    aria-label="검색어"
                    value={keyword}
                    onChange={(e) => changeKeyword(e.target.value)}
                />
                <button type="submit" className="search-page__submit" aria-label="검색">
                    <img src="/icons/search.svg" alt="" />
                </button>
            </form>

            {/* 검색 결과 */}
            <section className="home-section search-page__results">
                <div className="search-page__toolbar">
                    <button type="button" className="search-page__filter-btn" onClick={() => setIsFilterOpen(true)}>
                        <img src="/icons/filter.svg" alt="" />
                        모든 필터{selectedCount > 0 && ` (${selectedCount})`}
                    </button>
                    <SortDropdown value={sortId} onChange={setSortId} />
                </div>

                {results.length > 0 ? (
                    <HomeProductList products={results} />
                ) : (
                    <p className="home-section__empty">조건에 맞는 상품이 없어요.</p>
                )}
            </section>

            {/* 추천상품 */}
            <section className="home-section search-page__recommend">
                <div className="home-section__header">
                    <h2 className="home-section__title">추천상품</h2>
                </div>
                <HomeProductList products={recommended} />
            </section>

            <FilterPanel isOpen={isFilterOpen} selected={selected} onToggle={toggleFilter} onClose={closeFilter} />
        </div>
    );
};
