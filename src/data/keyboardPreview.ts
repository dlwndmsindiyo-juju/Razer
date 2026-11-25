import type { Product } from "../types/product";
import keyboardArchiveModels from "./keyboardArchiveModels.json";

const base = import.meta.env.BASE_URL;
const archiveProductIds = new Set(keyboardArchiveModels);
const suppliedProductIds = new Set([1016, 1030, 1045, 1059, 1061, 2001, 2018, 2026, 2027, 2055, 2075, 5001]);

export function getProductPreview(product: Product) {
    if (suppliedProductIds.has(product.id)) {
        return {
            src: `${base}demos/products/supplied/${product.id}.glb`,
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
