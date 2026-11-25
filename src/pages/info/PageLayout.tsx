import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import "./DesignPages.scss";

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

export function CatalogCard({ product, title, featured = false }: { product: Product; title?: string; featured?: boolean }) {
    const to = "/products/" + product.category + "/" + product.id;
    return <article className={"design-recommendation" + (featured ? " design-recommendation--featured" : "")}>
        <div className="design-recommendation__art">
            <img src="/images/figma-pages/recommendation-mouse.png" alt="" loading="lazy" />
        </div>
        <div className="design-recommendation__copy">
            <h3>{title ?? product.title}</h3>
            <p>Section Title</p>
            <Link className="design-explore" to={to} aria-label={product.title + " 자세히 보기"}>
                EXPLORE <img src="/images/figma-pages/explore.svg" alt="" />
            </Link>
        </div>
    </article>;
}

export function ProductRail({ products, title }: { products: Product[]; title: string }) {
    const list = useRef<HTMLDivElement>(null);
    const scroll = (direction: number) => {
        const track = list.current;
        if (track) track.scrollBy({ left: direction * Math.min(track.clientWidth, 650), behavior: "smooth" });
    };

    return <div className="design-rail">
        <button aria-label={title + " 이전"} type="button" onClick={() => scroll(-1)}><img src="/images/figma-pages/rail-left.svg" alt="" /></button>
        <div className="design-rail__track" ref={list} tabIndex={0} aria-label={title}>
            {products.map((product) => <CatalogCard key={product.id} product={product} title="Category Title (카테고리 제목)" />)}
        </div>
        <button aria-label={title + " 다음"} type="button" onClick={() => scroll(1)}><img src="/images/figma-pages/rail-right.svg" alt="" /></button>
    </div>;
}
