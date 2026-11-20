import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "../types/product";

interface CartState {
    items: CartItem[];
    addItem: (product: Product, count?: number) => void;
    removeItem: (id: number) => void;
    updateCount: (id: number, count: number) => void;
    clearCart: () => void;
}

// 선택한 옵션을 한 줄로 (예: "블랙 · DeathAdder V4 Pro")
const optionText = (product: Product) => product.selectedOptions?.map((o) => o.value).join(" · ") ?? "";

// 장바구니 (새로고침해도 유지되도록 브라우저에 저장)
// 옵션이 다르면 상품 id 가 달라서 id 로 구분
export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],

            addItem: (product, count = 1) =>
                set((state) => {
                    const found = state.items.find((item) => item.id === product.id);
                    if (found) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id ? { ...item, count: Math.min(item.count + count, 99) } : item,
                            ),
                        };
                    }
                    return { items: [...state.items, { ...product, size: optionText(product), count }] };
                }),

            removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

            updateCount: (id, count) =>
                set((state) => ({
                    items: state.items.map((item) => (item.id === id ? { ...item, count: Math.max(1, Math.min(count, 99)) } : item)),
                })),

            clearCart: () => set({ items: [] }),
        }),
        {
            name: "razer-cart",
            // 상품 상세 데이터 전체가 아니라 필요한 값만 저장
            partialize: (state) => ({
                items: state.items.map(({ id, title, category, price, image, size, count }) => ({
                    id, title, category, price, image, size, count,
                })) as CartItem[],
            }),
        },
    ),
);
