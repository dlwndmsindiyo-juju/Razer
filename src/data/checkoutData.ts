import type { CartItem } from "../types/product";

export const money = (value: number) => value.toLocaleString("ko-KR") + "원";
export const subtotal = (items: CartItem[]) => items.reduce((sum, item) => sum + (item.price ?? 0) * item.count, 0);
