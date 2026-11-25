import { useAuthStore } from "../store/useAuthStore";
import { useProductStore } from "../store/useProductStore";
import { productData } from "../data/productData";
import type { RegisteredProduct } from "./product";

export interface RegisterValues {
    title: string;
    serial: string;
    purchasedAt: string; // YYYY.MM.DD
    proof?: string;
}

// 모델명 자동완성 목록
export const registerProductNames = [...new Set(productData.map((p) => p.title.split(" - ")[0]))];

// 제품 등록 · 수정 → 계정 문서의 registeredProducts (마이페이지 · 등록 및 보증 페이지 공용)
export const useRegisterProduct = () => {
    const onUpdateProfile = useAuthStore((state) => state.onUpdateProfile);
    const registeredList = useProductStore((state) => state.registeredList);

    return async (prev: RegisteredProduct | undefined, values: RegisterValues) => {
        const product = productData.find((p) => p.title.startsWith(values.title));
        const item: RegisteredProduct = {
            ...prev,
            id: product?.id ?? prev?.id ?? 0,
            title: values.title,
            image: product?.image ?? prev?.image,
            serial: values.serial,
            purchasedAt: values.purchasedAt.replace(/\./g, "-"),
            warranty: prev?.warranty ?? "pending", // 구매 증빙 확인 후 보증 적용
        };
        const list = prev ? registeredList.map((r) => (r === prev ? item : r)) : [...registeredList, item];
        await onUpdateProfile({ registeredProducts: list });
        useProductStore.setState({ registeredList: list });
    };
};
