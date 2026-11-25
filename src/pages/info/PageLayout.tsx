import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { categoryLabels } from "../../data/productData";
import type { Product } from "../../types/product";
import "../../style/DesignPages.scss";
import { commonImages } from "../../data/pageImages";

export function PageHeading({ title, description, as: Heading = "h1" }: {
    title: string;
    description?: string;
    as?: "h1" | "h2";
}) {
    return <header className="design-heading">
        <Heading>{title}</Heading>
        {description && <p>{description}</p>}
    </header>;
}

export function PageHero({ src, mobileSrc, children }: { src: string; mobileSrc?: string; children?: ReactNode }) {
    return <div className="design-hero">
        <picture>{mobileSrc && <source srcSet={mobileSrc} media="(max-width: 720px)" />}<img src={src} alt="" /></picture>
        {children && <div className="design-hero__content design-container">{children}</div>}
    </div>;
}

export function CatalogCard({ product, featured = false, badge, description }: {
    product: Product; featured?: boolean; badge?: string; description?: string;
}) {
    const to = "/products/" + product.category + "/" + product.id;
    return <div className={"design-recommendation" + (featured ? " design-recommendation--featured" : "")}>
        {badge && <span className="design-recommendation__badge">{badge}</span>}
        <div className="design-recommendation__art">
            <img src={product.image} alt="" loading="lazy" />
        </div>
        <div className="design-recommendation__copy">
            <h3>{product.title}</h3>
            <p>{description ?? categoryLabels[product.category]}</p>
            <Link className="design-explore" to={to} aria-label={product.title + " 자세히 보기"}>
                EXPLORE <img src={commonImages.explore} alt="" />
            </Link>
        </div>
    </div>;
}

export function ProductRail({ products, title }: { products: Product[]; title: string }) {
    const list = useRef<HTMLDivElement>(null);
    const scroll = (direction: number) => {
        const track = list.current;
        if (track) track.scrollBy({ left: direction * Math.min(track.clientWidth, 650), behavior: "smooth" });
    };

    return <div className="design-rail">
        <button aria-label={title + " 이전"} type="button" disabled={products.length < 2} onClick={() => scroll(-1)}><img src={commonImages.railLeft} alt="" /></button>
        <div className="design-rail__track" ref={list} tabIndex={0} aria-label={title}>
            {products.map((product) => <CatalogCard key={product.id} product={product} />)}
        </div>
        <button aria-label={title + " 다음"} type="button" disabled={products.length < 2} onClick={() => scroll(1)}><img src={commonImages.railRight} alt="" /></button>
    </div>;
}
