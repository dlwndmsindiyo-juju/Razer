import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { productData } from "../data/productData";
import type { Order, Product, ProductState } from "../types/product";

export const useProductStore = create<ProductState>((set) => ({
    // 홈과 상품 목록에서 사용할 기본 상품 데이터
    items: productData,

    // 로그인 후 Firestore에서 채울 계정별 데이터
    hearts: [],
    orderList: [],

    loadUserData: async (uid) => {
        // 로그인 중인 계정과 요청한 계정이 같은지 확인
        if (auth.currentUser?.uid !== uid) return;

        // 새 계정 데이터를 기다리는 동안 이전 목록 비우기
        set({ hearts: [], orderList: [] });

        const snapshot = await getDoc(doc(db, "users", uid));

        // 조회 도중 로그아웃하거나 계정이 바뀌면 결과 적용 멈추기
        if (auth.currentUser?.uid !== uid) return;

        const data = snapshot.data() as {
            likes?: Product[];
            orderList?: Order[];
            OrderList?: Order[];
        } | undefined;

        set({
            hearts: data?.likes ?? [],
            // 이전 코드에서 대문자로 저장한 주문 필드도 읽기
            orderList: data?.orderList ?? data?.OrderList ?? [],
        });
    },

    clearUserData: () => {
        // 로그아웃 시 화면의 목록 초기화
        set({ hearts: [], orderList: [] });
    },
}));