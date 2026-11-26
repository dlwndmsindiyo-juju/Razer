import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getProductById, getSeriesProducts } from "../../data/productData";
import { getProductPreview } from "../../data/keyboardPreview";
import { keyboardActions } from "../../data/detailData";
import type { Product } from "../../types/product";
import type { mountKeyboardScene, SwitchFeel, ViewAngle } from "./keyboardScene";
import "../../style/ProductCustomize.scss";

const tabs = [
    { id: "size", label: "사이즈", icon: "keyboard" },
    { id: "switch", label: "스위치", icon: "switch" },
    { id: "connection", label: "연결", icon: "plug" },
    { id: "rgb", label: "Chroma RGB", icon: "spark" },
    { id: "media", label: "미디어 키", icon: "media" },
] as const;
const views: { id: ViewAngle; label: string }[] = [
    { id: "hero", label: "기본 각도" },
    { id: "top", label: "상단" },
    { id: "left", label: "왼쪽" },
    { id: "right", label: "오른쪽" },
];
const feelLabels = { clicky: "클릭키", tactile: "택타일", linear: "리니어" };
const compatibleOptionLabels = ["색상 / 디자인", "키보드 레이아웃"];
const iconPaths = {
    keyboard: "M3 6h18v12H3zM6 10h2m2 0h2m2 0h2m2 0h1M6 14h2m2 0h8",
    switch: "M4 4h16v16H4zM10 7h4v3h3v4h-3v3h-4v-3H7v-4h3z",
    plug: "M8 3v5m8-5v5M6 8h12v3a6 6 0 0 1-6 6v4m0-4a6 6 0 0 1-6-6z",
    spark: "m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8z",
    media: "M4 4h16v16H4zM10 8l6 4-6 4z",
};

function getSpecs(product: Product) {
    const read = (code: string) => (product.technicalSpecifications ?? [])
        .flatMap(group => group.features).find(feature => feature.code === code)?.values ?? [];
    const readFilter = (code: string) => (product.filters ?? [])
        .flatMap(group => group.features).find(feature => feature.code === code)?.values ?? [];
    const prefer = (primary: string[], secondary: string[]) => primary.length ? primary : secondary;
    const switches = prefer(read("switch-type"), product.specs?.switches ?? []);
    const lighting = product.specs?.chroma;
    const text = [...switches, ...(product.specs?.switches ?? []), product.title].join(" ");
    // 상품명은 실제 장착 스위치를 우선 판별하는 데 사용합니다.
    const skuSwitch = /오렌지|orange/i.test(product.title) ? "tactile"
        : /그린 스위치|green switch/i.test(product.title) ? "clicky"
            : /옐로우|yellow/i.test(product.title) ? "linear" : undefined;
    const feel: SwitchFeel | undefined = skuSwitch ?? (/택타일|tactile/i.test(text) ? "tactile"
        : /클릭키|clicky/i.test(text) ? "clicky" : /리니어|linear/i.test(text) ? "linear" : undefined);
    return {
        feel,
        values: {
            size: prefer(read("size"), readFilter("keyboard-size")),
            switch: switches,
            connection: prefer(read("connectivity"), product.specs?.connectionDetails ?? product.specs?.connection
                ?.map(mode => mode === "wired" ? "유선" : "무선") ?? []),
            rgb: prefer(read("lighting"), lighting == null ? [] : [lighting ? "Chroma RGB 지원" : "Chroma RGB 미지원"]),
            media: prefer(read("media-keys"), readFilter("media-keys")),
        },
    };
}

type SceneControls = Parameters<Parameters<typeof mountKeyboardScene>[2]["onReady"]>[0];

function ProductViewer({ product }: { product: Product }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const isKeyboard = product.category === "keyboards";
    const preview = getProductPreview(product);
    const modelUrl = preview?.src;
    const specs = getSpecs(product);
    const feel = specs.feel;
    const supportsLighting = product.specs?.chroma ?? specs.values.rgb.some(value => /chroma/i.test(value));
    const lightingFallback = product.id === 1091 ? "lavender" : (isKeyboard && supportsLighting) || product.id === 1090 ? "rainbow" : undefined;
    const edgeLighting = product.series === "blackwidow-v4-pro";
    const visibleOptions = compatibleOptionLabels.flatMap(label => {
        const option = product.selectedOptions?.find(item => item.label === label);
        return option ? [option] : [];
    });
    const originalId = typeof state?.originalId === "number" ? state.originalId : product.id;
    const choices = (isKeyboard ? getSeriesProducts(product) : []).flatMap(variant => {
        const model = getProductPreview(variant);
        if (variant.id !== product.id && (!model || model.sample || !compatibleOptionLabels.every(label => {
            const selected = product.selectedOptions?.find(option => option.label === label)?.value;
            return selected && variant.selectedOptions?.some(option => option.label === label && option.value === selected);
        }))) return [];
        const variantFeel = getSpecs(variant).feel;
        return variantFeel ? [{ variant, feel: variantFeel }] : [];
    });
    const stage = useRef<HTMLDivElement>(null);
    const captureButton = useRef<HTMLButtonElement>(null);
    const scene = useRef<SceneControls | null>(null);
    const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("switch");
    const [view, setView] = useState<ViewAngle>("hero");
    const [panelOpen, setPanelOpen] = useState(false);
    const [ready, setReady] = useState(false);
    const [canType, setCanType] = useState(false);
    const [canLight, setCanLight] = useState(false);
    const [capture, setCapture] = useState(false);
    const [lighting, setLighting] = useState(true);
    const [lastKey, setLastKey] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!stage.current || !modelUrl) return;
        const controller = new AbortController();
        const container = stage.current;
        const failed = (message: string) => {
            scene.current = null;
            setReady(false);
            setCanType(false);
            setCanLight(false);
            setCapture(false);
            setError(message);
        };
        void import("./keyboardScene").then(({ mountKeyboardScene }) => mountKeyboardScene(container, modelUrl, {
            signal: controller.signal,
            getFeel: () => feel,
            lightingFallback,
            edgeLighting,
            onReady: controls => {
                scene.current = controls;
                setCanType(controls.canType);
                setCanLight(controls.canLight);
                setReady(true);
            },
            onCapture: enabled => {
                setCapture(enabled);
                setLastKey("");
            },
            onKey: setLastKey,
            onError: failed,
        })).catch(() => {
            if (!controller.signal.aborted) failed("3D 뷰어를 불러오지 못했어요. 새로고침해서 다시 시도해 주세요.");
        });
        return () => {
            controller.abort();
            scene.current = null;
        };
    }, [modelUrl, feel, lightingFallback, edgeLighting]);

    function changeView(next: ViewAngle) {
        scene.current?.setView(next);
        setView(next);
    }
    function updateLighting(enabled: boolean) {
        scene.current?.setLighting(enabled);
        setLighting(enabled);
    }
    function reset() {
        if (originalId !== product.id) {
            navigate(keyboardActions.customizeTo(originalId), { replace: true });
            return;
        }
        scene.current?.setCapture(false);
        changeView("hero");
        updateLighting(true);
        setTab("switch");
        setPanelOpen(false);
        setLastKey("");
    }
    const status = error || (!preview ? "이 상품의 3D 모델을 준비 중이에요." : !ready ? "3D 모델을 불러오는 중이에요." : "");
    const canChangeLighting = ready && canLight;

    return (
        <section className="keyboard-customize">
            <div className="keyboard-customize__heading">
                <div>
                    <Link to={`/products/${product.category}/${product.id}`}>← 상품 상세</Link>
                    <h2>{product.title}</h2>
                </div>
            </div>
            <div className="keyboard-customize__viewer">
                <div className="keyboard-customize__workspace">
                    <div
                        className="keyboard-customize__stage"
                        ref={stage}
                        tabIndex={-1}
                        aria-label={isKeyboard ? "3D 키보드 체험 화면" : "3D 상품 보기"}
                        onKeyDown={event => {
                            if (event.key === "Escape" && capture) captureButton.current?.focus();
                        }}
                    >
                        {status && (
                            <div className="keyboard-customize__poster">
                                <img src={preview?.poster || product.image} alt={preview?.alt || product.title} />
                                <p role="status">{status}</p>
                            </div>
                        )}
                        {preview?.sample && <p className="keyboard-customize__sample">BlackWidow V4 Pro 샘플 모델</p>}
                    </div>
                    {isKeyboard && <div className="keyboard-customize__aside">
                        <button
                            type="button"
                            className="keyboard-customize__toggle"
                            aria-expanded={panelOpen}
                            aria-controls="keyboard-product-panel"
                            onClick={() => setPanelOpen(open => !open)}
                        >
                            {panelOpen ? "옵션 닫기" : "커스텀하기"}
                        </button>
                        <aside className="keyboard-customize__panel" id="keyboard-product-panel" hidden={!panelOpen}>
                            <h2>제품 필터</h2>
                            <div className="keyboard-customize__tabs" aria-label="제품 정보">
                                {tabs.map(item => (
                                    <button key={item.id} type="button" aria-pressed={tab === item.id} onClick={() => setTab(item.id)}>
                                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" aria-hidden="true">
                                            <path d={iconPaths[item.icon]} />
                                        </svg>
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                            <ul className="keyboard-customize__values">
                                {(specs.values[tab].length ? specs.values[tab] : ["확인된 사양이 없어요."]).map(value => (
                                    <li key={value}>{value}</li>
                                ))}
                            </ul>
                            {tab === "switch" && choices.length > 0 && (
                                <>
                                    <div className="keyboard-customize__switches" aria-label="스위치 옵션">
                                        {choices.map(choice => (
                                            <button
                                                key={choice.variant.id}
                                                type="button"
                                                className={`keyboard-customize__feel keyboard-customize__feel--${choice.feel}`}
                                                aria-pressed={choice.variant.id === product.id}
                                                onClick={() => {
                                                    if (choice.variant.id !== product.id) {
                                                        navigate(keyboardActions.customizeTo(choice.variant.id), { state: { originalId } });
                                                    }
                                                }}
                                            >
                                                <span aria-hidden="true" />{feelLabels[choice.feel]}
                                            </button>
                                        ))}
                                    </div>
                                    {canType && <p className="keyboard-customize__sound-note">체험용 합성 타건음</p>}
                                </>
                            )}
                            {tab === "rgb" && canChangeLighting && (
                                <button type="button" aria-pressed={lighting} onClick={() => updateLighting(!lighting)}>
                                    {lighting ? "조명 끄기" : "조명 켜기"}
                                </button>
                            )}
                            {visibleOptions.length > 0 && (
                                <ul className="keyboard-customize__selected">
                                    {visibleOptions.map(option => (
                                        <li key={option.label}>
                                            <span className="keyboard-customize__selected-label">{option.label}</span>
                                            <span className="keyboard-customize__selected-value">{option.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </aside>
                    </div>}
                </div>
                <div className="keyboard-customize__toolbar">
                    <div className="keyboard-customize__views" aria-label="보기 각도">
                        {views.map(angle => (
                            <button key={angle.id} type="button" disabled={!ready} aria-pressed={view === angle.id} onClick={() => changeView(angle.id)}>
                                {angle.label}
                            </button>
                        ))}
                    </div>
                    <span className="keyboard-customize__key-status" role="status">
                        {lastKey ? `입력 · ${lastKey}` : ""}
                    </span>
                    <div className="keyboard-customize__actions">
                        <button type="button" onClick={reset}>초기화</button>
                        {isKeyboard && <button type="button" ref={captureButton} disabled={!canType} aria-pressed={capture} onClick={() => scene.current?.setCapture(!capture)}>
                            {capture ? "입력 체험 종료" : "키 입력 체험"}
                        </button>}
                    </div>
                </div>
            </div>
        </section>
    );
}

const mobileQuery = "(max-width: 720px)";
function subscribeToMobile(onChange: () => void) {
    const media = window.matchMedia(mobileQuery);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}
const isMobileViewport = () => window.matchMedia(mobileQuery).matches;

export function ProductCustomize() {
    const { category, productId } = useParams();
    const isMobile = useSyncExternalStore(subscribeToMobile, isMobileViewport);
    const product = /^\d+$/.test(productId ?? "") ? getProductById(Number(productId)) : undefined;
    if (!product || product.category !== category || (category !== "keyboards" && !getProductPreview(product))) {
        return <section className="keyboard-customize"><h1>3D로 볼 수 있는 상품을 찾을 수 없어요.</h1><Link to="/search">전체 상품 보기</Link></section>;
    }
    if (isMobile) return <section className="product-customize-unavailable" aria-label="상품 커스텀">
        <div className="product-customize-unavailable__art">
            <img src="/images/product-customize/mobile-unavailable.png" alt="" />
        </div>
        <p>모바일에서는 <strong>지원하지 않는 기능</strong>입니다.</p>
        <p><strong>PC버전</strong>을 이용해주세요.</p>
    </section>;
    return <ProductViewer key={product.id} product={product} />;
}
