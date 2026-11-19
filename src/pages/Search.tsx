import { useCallback, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { productData } from "../data/productData";
import type { Product } from "../types/product";
import {
    applyFilters,
    getCatalogScope,
    getFilterGroups,
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
const PAGE_SIZE = 24;

export const CatalogPage = () => {
    const { catalogSlug } = useParams();
    const scope = catalogSlug ? getCatalogScope(catalogSlug) : undefined;
    if (!scope) return <section className="home-section search-page"><h1>상품 목록을 찾을 수 없어요.</h1><Link to="/search">전체 상품 보기</Link></section>;
    return <Search key={catalogSlug} title={scope.title} products={scope.products} />;
};

export const Search = ({ title, products = productData }: { title?: string; products?: Product[] }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("q") ?? "";
    const changeKeyword = (value: string) => {
        setLimit(PAGE_SIZE);
        setSearchParams(value ? { q: value } : {}, { replace: true });
    };
    const [sortId, setSortId] = useState<SortId>("recommended");
    const [selected, setSelected] = useState<SelectedFilters>({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [limit, setLimit] = useState(PAGE_SIZE);
    const groups = useMemo(() => getFilterGroups(products), [products]);

    // 검색어 → 필터 → 정렬 순서로 적용
    const results = useMemo(() => {
        const word = keyword.trim().toLowerCase();
        const searched = word ? products.filter((p) => [p.title, p.sku, p.summary].some((text) => text?.toLowerCase().includes(word))) : products;
        return sortProducts(applyFilters(searched, selected, groups), sortId);
    }, [keyword, selected, sortId, products, groups]);

    const recommended = useMemo(
        () =>
            recommendedIds
                .map((id) => productData.find((p) => p.id === id))
                .filter((p): p is Product => p !== undefined)
                .map(toCardProduct),
        [],
    );

    const toggleFilter = (groupId: string, optionId: string) => {
        setLimit(PAGE_SIZE);
        setSelected((prev) => {
            const ids = prev[groupId] ?? [];
            const next = ids.includes(optionId) ? ids.filter((id) => id !== optionId) : [...ids, optionId];
            return { ...prev, [groupId]: next };
        });
    };

    const filterButton = useRef<HTMLButtonElement>(null);
    const closeFilter = useCallback(() => {
        setIsFilterOpen(false);
        filterButton.current?.focus();
    }, []);
    const selectedCount = Object.values(selected).reduce((sum, ids) => sum + ids.length, 0);

    return (
        <div className="search-page">
            {title && <h1 className="search-page__title">{title}</h1>}
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
                    <button ref={filterButton} type="button" className="search-page__filter-btn" aria-haspopup="dialog" aria-expanded={isFilterOpen} onClick={() => setIsFilterOpen(true)}>
                        <img src="/icons/filter.svg" alt="" />
                        모든 필터{selectedCount > 0 && ` (${selectedCount})`}
                    </button>
                    <SortDropdown value={sortId} onChange={(value) => { setSortId(value); setLimit(PAGE_SIZE); }} />
                    <span className="search-page__count" aria-live="polite">{results.length}개 상품</span>
                </div>

                {results.length > 0 ? (
                    <HomeProductList products={results.slice(0, limit).map(toCardProduct)} />
                ) : (
                    <p className="home-section__empty">조건에 맞는 상품이 없어요.</p>
                )}
            </section>

            {results.length > limit && (
                <button type="button" className="search-page__more" onClick={() => setLimit((value) => value + PAGE_SIZE)}>상품 더 보기</button>
            )}

            {/* 추천상품 */}
            {!title && <section className="home-section search-page__recommend">
                <div className="home-section__header">
                    <h2 className="home-section__title">추천상품</h2>
                </div>
                <HomeProductList products={recommended} />
            </section>}

            <FilterPanel isOpen={isFilterOpen} groups={groups} selected={selected} onToggle={toggleFilter} onClose={closeFilter} onClear={() => { setSelected({}); setLimit(PAGE_SIZE); }} />
        </div>
    );
};


