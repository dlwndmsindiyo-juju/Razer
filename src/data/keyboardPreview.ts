import type { Product } from "../types/product";
import keyboardArchiveModels from "./keyboardArchiveModels.json";

const base = import.meta.env.BASE_URL;
const archiveProductIds = new Set(keyboardArchiveModels);
export function getKeyboardPreview(product: Product) {
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
