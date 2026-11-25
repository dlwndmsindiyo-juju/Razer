import { NavLink, Navigate, useParams } from "react-router-dom";
import { figmaImage } from "../../data/figmaPageAssets";
import { technologyCategories } from "../../data/technologyData";
import { PageHeading } from "./PageLayout";

const basePath = "/info/promotion/technology";
const icons = ["Frame706", "IconDevicesMouse", "IconDevicesKeyboard", "IconDevicesHeadset", "Group"];

export function TechnologyPage() {
    const { technology = "" } = useParams();
    const category = technologyCategories.find(({ slug }) => slug === technology);
    if (!category) return <Navigate to={basePath} replace />;

    return (
        <div className="design-page">
            <PageHeading title="제품 기술" />
            <nav className="design-tech__nav" aria-label="제품 기술 카테고리">
                {technologyCategories.map(({ slug, label }, index) => (
                    <NavLink key={label} to={slug ? basePath + "/" + slug : basePath} end>
                        <span className="design-tech__icon"><img src={figmaImage(technologyCategories[0].id, icons[index])} alt="" /></span>
                        <span className="design-tech__label">{label}</span>
                    </NavLink>
                ))}
            </nav>
            <PageHeading title={category.title} description={category.description} as="h2" />
            {category.panels.map(({ title, description, layer }) => (
                <section className="design-tech__panel" key={title || layer}
                    data-media={layer === "Rectangle274" ? "logo" : layer ? "cover" : "none"}>
                    {layer && <img src={figmaImage(category.id, layer)} alt="" loading="lazy" />}
                    <div className="design-container">
                        {title && <h2>{title}</h2>}
                        {description && <p>{description}</p>}
                    </div>
                </section>
            ))}
        </div>
    );
}
