import type { Product } from "../types/product";
import keyboardArchiveModels from "./keyboardArchiveModels.json";

const base = import.meta.env.BASE_URL;
const archiveProductIds = new Set(keyboardArchiveModels);
const suppliedProductIds = new Set([1016, 1030, 1045, 2001, 2018, 2026, 2027, 2055, 2075, 5001]);
const usLayoutsFromKr = new Set([
    1004, 1006, 1013, 1015, 1017, 1025, 1027, 1034, 1036, 1040, 1041, 1053,
    1055, 1057, 1059, 1061, 1063, 1065, 1068, 1071, 1073, 1076, 1087,
]);

export function getProductPreview(product: Product) {
    if (usLayoutsFromKr.has(product.id) || suppliedProductIds.has(product.id)) {
        const folder = usLayoutsFromKr.has(product.id) ? "us-from-kr" : "supplied";
        return {
            src: `${base}demos/products/${folder}/${product.id}.glb`,
            poster: product.image,
            alt: product.title,
            sample: false,
        };
    }
    if (product.model3d) return { ...product.model3d, sample: false };
    if (archiveProductIds.has(product.id)) {
        return {
            src: `${base}demos/keyboard/catalog/${product.id}.glb`,
            poster: product.image,
            alt: product.title,
            sample: false,
        };
    }
    return undefined;
}
