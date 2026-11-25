import { NavLink, Navigate, useParams } from "react-router-dom";
import { technologyImage, technologyImages } from "../../data/pageImages";
import { technologyCategories } from "../../data/technologyData";
import { PageHeading } from "./PageLayout";

const basePath = "/info/promotion/technology";
// ALL(첫 칸)은 /icons/logo.svg 모양을 CSS로 칠해서 이미지 없음
const { icons: icon } = technologyImages;
const icons = ["", icon.mouse, icon.keyboard, icon.headset, icon.speaker];

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
                        <span className="design-tech__icon">
                            {/* ALL: 배경 없는 Razer 로고 (색은 CSS) */}
                            {index === 0 ? <span className="design-tech__logo" aria-hidden="true" />
                                : <img src={icons[index]} alt="" />}
                        </span>
                        <span className="design-tech__label">{label}</span>
                    </NavLink>
                ))}
            </nav>
            <PageHeading title={category.title} description={category.description} as="h2" />
            {category.panels.map(({ title, description, image }) => (
                <section className="design-tech__panel" key={title || image}
                    data-media={image.includes("logo") ? "logo" : image ? "cover" : "none"}>
                    {image && <img src={technologyImage(image)} alt="" loading="lazy" />}
                    <div className="design-container">
                        {title && <h2>{title}</h2>}
                        {description && <p>{description}</p>}
                    </div>
                </section>
            ))}
        </div>
    );
}
