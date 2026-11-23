import type { Product } from "../types/product";

const base = import.meta.env.BASE_URL;
const blackWidow = {
    src: `${base}demos/keyboard/blackwidow-v4-pro.glb`,
    poster: `${base}demos/keyboard/preview.jpg`,
    alt: "BlackWidow V4 Pro",
};
const blackWidowVariants = new Set([1052, 1071, 1073]);
const keyboardModels = new Map([
    [1001, "blackwidow-v4-tkl-honkai"],
    [1002, "blackwidow-v4-tkl-eva01"],
    [1016, "blackwidow-v4-tkl-wuthering"],
    [1041, "blackwidow-v4-tkl-black-us"],
    [1042, "blackwidow-v4-tkl-black-kr"],
    [1051, "blackwidow-v4-pro-white-us"],
    [1072, "blackwidow-v4-pro-black-kr"],
    [1074, "blackwidow-v4-pro-black-kr"],
]);

export function getKeyboardPreview(product: Product) {
    if (product.model3d) return { ...product.model3d, sample: false };
    const model = keyboardModels.get(product.id);
    if (model) {
        return {
            src: `${base}demos/keyboard/${model}.glb`,
            poster: product.image,
            alt: product.title,
            sample: false,
        };
    }
    if (blackWidowVariants.has(product.id)) return { ...blackWidow, sample: false };
    return undefined;
}
