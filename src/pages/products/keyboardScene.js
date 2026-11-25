import { Box3, Color, DirectionalLight, HemisphereLight, MathUtils, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer, ACESFilmicToneMapping } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { AdditiveBlending, DataTexture, DoubleSide, InstancedMesh, LinearFilter, Matrix4, MeshBasicMaterial, PlaneGeometry, RGBAFormat } from "three";

const angles = {
    hero: [.20, .66, .81],
    top: [0, 1, .012],
    left: [-1, .34, .20],
    right: [1, .34, .20],
};
const profiles = {
    tactile: { depth: .0027, frequency: 166, duration: .065 },
    clicky: { depth: .0029, frequency: 950, duration: .085 },
    linear: { depth: .0020, frequency: 95, duration: .045 },
};
const codeLabels = {
    Escape: "Esc", PrintScreen: "PrtSc", ScrollLock: "ScrLk", Pause: "Pause",
    Backquote: "`", Minus: "-", Equal: "=", BracketLeft: "[", BracketRight: "]", Backslash: "\\",
    Semicolon: ";", Quote: "'", Comma: ",", Period: ".", Slash: "/",
    CapsLock: "Caps", ShiftLeft: "Shift", ShiftRight: "Shift", ControlLeft: "Ctrl", ControlRight: "Ctrl",
    AltLeft: "Alt", AltRight: "Alt", MetaLeft: "Win", MetaRight: "Win", ContextMenu: "Menu",
    Insert: "Ins", Delete: "Del", PageUp: "PgUp", PageDown: "PgDn",
    ArrowUp: "↑", ArrowDown: "↓", ArrowLeft: "←", ArrowRight: "→",
    NumLock: "Numpad Num", NumpadDivide: "Numpad /", NumpadMultiply: "Numpad *",
    NumpadSubtract: "Numpad -", NumpadAdd: "Numpad +", NumpadDecimal: "Numpad .", NumpadEnter: "Numpad Enter",
};

function addLightSpill(scene, sources, resources, aroundKeys = false) {
    if (!sources.length) return null;
    const resolution = 64;
    const pixels = new Uint8Array(resolution * resolution * 4);
    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            const radius = Math.hypot(2 * x / (resolution - 1) - 1, 2 * y / (resolution - 1) - 1);
            const edgeFade = aroundKeys ? MathUtils.smoothstep(radius, .18, .48) : 1;
            const fade = MathUtils.smoothstep(1 - radius, 0, 1) * edgeFade;
            const index = (y * resolution + x) * 4;
            pixels.set([0, Math.round(255 * fade), 0, 255], index);
        }
    }
    const mask = new DataTexture(pixels, resolution, resolution, RGBAFormat);
    mask.minFilter = mask.magFilter = LinearFilter;
    mask.needsUpdate = true;
    const material = new MeshBasicMaterial({
        alphaMap: mask, opacity: aroundKeys ? .52 : .38, transparent: true, depthWrite: false,
        blending: AdditiveBlending, side: DoubleSide, forceSinglePass: true, toneMapped: false,
    });
    const plane = new PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
    const spill = new InstancedMesh(plane, material, sources.length);
    const matrix = new Matrix4();
    sources.forEach(({ center, width, depth, color }, index) => {
        matrix.makeScale(width, 1, depth).setPosition(center);
        spill.setMatrixAt(index, matrix);
        spill.setColorAt(index, color);
    });
    spill.computeBoundingSphere();
    spill.renderOrder = 2;
    scene.add(spill);
    [spill, plane, material, mask].forEach(resource => resources.add(resource));
    return spill;
}

function addKeyLightLeak(scene, sources, resources) {
    if (!sources.length) return null;
    const resolution = 64;
    const pixels = new Uint8Array(resolution * resolution * 4);
    for (let y = 0; y < resolution; y++) {
        const height = Math.abs(2 * y / (resolution - 1) - 1);
        const falloff = 1 - MathUtils.smoothstep(height, .08, 1);
        const core = 1 - MathUtils.smoothstep(height, .05, .28);
        for (let x = 0; x < resolution; x++) {
            const endFade = MathUtils.smoothstep(1 - Math.abs(2 * x / (resolution - 1) - 1), 0, .28);
            const alpha = endFade * (.50 * falloff + .50 * core);
            pixels.set([255, Math.round(alpha * 255), 255, 255], (y * resolution + x) * 4);
        }
    }
    const mask = new DataTexture(pixels, resolution, resolution, RGBAFormat);
    mask.minFilter = mask.magFilter = LinearFilter;
    mask.needsUpdate = true;
    const material = new MeshBasicMaterial({
        alphaMap: mask, opacity: .83, transparent: true, depthWrite: false,
        blending: AdditiveBlending, side: DoubleSide, forceSinglePass: true, toneMapped: false,
    });
    const geometry = new PlaneGeometry();
    const leak = new InstancedMesh(geometry, material, sources.length * 4);
    const matrix = new Matrix4();
    const offset = .00115;
    sources.forEach(({ cap, color }, index) => {
        const { center, size, bottom } = cap;
        const coreColor = new Color().copy(color).lerp(new Color(1, 1, 1), .24);
        for (let side = 0; side < 4; side++) {
            const end = side % 2 ? -1 : 1;
            const across = side < 2;
            matrix.makeRotationY(across ? 0 : Math.PI / 2);
            matrix.scale(new Vector3((across ? size.x : size.z) + .003, .012, 1));
            matrix.setPosition(
                center.x + (across ? 0 : end * (size.x / 2 + offset)),
                bottom - .00045,
                center.z + (across ? end * (size.z / 2 + offset) : 0),
            );
            leak.setMatrixAt(index * 4 + side, matrix);
            leak.setColorAt(index * 4 + side, coreColor);
        }
    });
    leak.computeBoundingSphere();
    leak.renderOrder = 3;
    scene.add(leak);
    [leak, geometry, material, mask].forEach(resource => resources.add(resource));
    return leak;
}

export async function mountKeyboardScene(stage, modelUrl, options) {
    const { signal } = options;
    if (signal.aborted) return;
    let renderer, controls, observer, voice;
    const resources = new Set();
    const bitmaps = new Set();
    const scene = new Scene();

    function dispose() {
        observer?.disconnect();
        controls?.dispose();
        renderer?.setAnimationLoop(null);
        renderer?.dispose();
        renderer?.domElement.remove();
        if (voice && voice.state !== "closed") void voice.close().catch(() => {});
        resources.forEach(resource => resource.dispose());
        resources.clear();
        bitmaps.forEach(bitmap => bitmap.close());
        bitmaps.clear();
    }
    signal.addEventListener("abort", dispose, { once: true });

    try {
        renderer = new WebGLRenderer({ antialias: true, alpha: true });
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = .95;
        renderer.domElement.setAttribute("aria-hidden", "true");
        renderer.domElement.addEventListener("webglcontextlost", event => {
            event.preventDefault();
            options.onError("그래픽 연결이 끊겼어요. 새로고침해서 다시 시도해 주세요.");
            dispose();
        }, { signal, once: true });
        stage.append(renderer.domElement);

        const response = await fetch(modelUrl, { signal });
        if (!response.ok) throw new Error("GLB HTTP " + response.status);
        const buffer = await response.arrayBuffer();
        if (signal.aborted) return;
        const { scene: model } = await new GLTFLoader().parseAsync(buffer, new URL(".", response.url).href);
        const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        const studioSurfaces = [];

        model.traverse(obj => {
            if (/^studio[ _]+(?:floor|surface|backdrop)(?:[_.]\d+)?$/i.test(obj.name)) {
                studioSurfaces.push(obj);
            }
            if (!obj.isMesh) return;
            resources.add(obj.geometry);
            for (const material of [obj.material].flat()) {
                if (material.userData.preservePhotoColor === true) material.toneMapped = false;
                resources.add(material);
                for (const value of Object.values(material)) {
                    if (!value?.isTexture) continue;
                    if (value === material.map || value === material.emissiveMap) value.anisotropy = anisotropy;
                    resources.add(value);
                    if (typeof ImageBitmap !== "undefined" && value.image instanceof ImageBitmap) bitmaps.add(value.image);
                }
            }
        });
        if (signal.aborted) {
            dispose();
            return;
        }

        // Imported studio props should not render or influence camera framing.
        for (const surface of studioSurfaces) surface.removeFromParent();
        scene.add(model);
        const bounds = new Box3().setFromObject(model);
        const center = bounds.getCenter(new Vector3());
        const size = bounds.getSize(new Vector3());
        const span = Math.max(size.x, size.z, .1);
        scene.add(new HemisphereLight("#edf0f6", "#3d3944", 1.55));
        for (const [color, intensity, x, y, z] of [["#f7f5f2", 2.45, -1, 2, 1], ["#a0b9ff", 1.25, 2, 1, -1]]) {
            const light = new DirectionalLight(color, intensity);
            light.position.set(x, y, z);
            scene.add(light);
        }

        const camera = new PerspectiveCamera(37, 1, .001, span * 30);
        controls = new OrbitControls(camera, renderer.domElement);
        let needsRender = true;
        controls.addEventListener("change", () => { needsRender = true; });
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = span * .46;
        controls.maxDistance = span * 4;
        controls.maxPolarAngle = Math.PI * .51;
        let currentView = "hero";
        function setView(view) {
            currentView = view;
            controls.target.copy(center);
            const distance = span * Math.max(view === "hero" ? 1.25 : 1.4, 1.65 / camera.aspect);
            camera.position.copy(center).add(new Vector3(...angles[view]).normalize().multiplyScalar(distance));
            controls.update();
            needsRender = true;
        }
        function resize() {
            const width = stage.clientWidth;
            const height = stage.clientHeight;
            if (!width || !height) return;
            const previousAspect = camera.aspect;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            // Keep small legends crisp while limiting the drawing buffer on large displays.
            const pixelRatio = Math.min(Math.max(devicePixelRatio, 1.35), 2, Math.sqrt(3_200_000 / (width * height)));
            if (renderer.getPixelRatio() !== pixelRatio) renderer.setPixelRatio(pixelRatio);
            renderer.setSize(width, height, false);
            needsRender = true;
            if (Math.abs(previousAspect - camera.aspect) > .01) setView(currentView);
        }
        observer = new ResizeObserver(resize);
        observer.observe(stage);
        resize();
        setView("hero");

        const keys = new Map();
        const caps = [];
        const glowing = new Map();
        const emitters = [];
        const scale = new Vector3();
        model.traverse(obj => {
            const { part, key_slot: slot, key_label: label } = obj.userData;
            if (obj.isMesh) {
                const isLight = /^(?:rgb(?:[ _]|$)|diffuser[ _]|switch[ _]light|media[ _]control[ _]rgb)|underglow|rgb[ _].*edge/i.test(obj.name)
                    || /^(?:rgb_diffuser|key_rgb|housing_rgb)$/.test(part ?? "");
                for (const material of [obj.material].flat()) {
                    if (!isLight || !material.emissive?.getHex() || material.emissiveIntensity <= 0) continue;
                    glowing.set(material, material.emissiveIntensity);
                    emitters.push({ obj, color: material.emissive });
                }
            }
            if (!slot || !label || !["keycap", "legend"].includes(part)) return;
            if (obj.parent?.userData.key_slot === slot && obj.parent.userData.part === part) return;
            if (!keys.has(slot)) keys.set(slot, { label, pieces: [], held: false, tapUntil: 0, amount: 0 });
            const key = keys.get(slot);
            key.pieces.push({ obj, y: obj.position.y, scale: obj.parent.getWorldScale(scale).y || 1 });
            if (part !== "keycap") return;
            key.cap = obj;
            if (obj.isMesh && !Array.isArray(obj.material) && !obj.material.map) {
                key.feedbackMaterial = obj.material = obj.material.clone();
                resources.add(obj.material);
            }
            obj.traverse(mesh => {
                if (!mesh.isMesh) return;
                mesh.userData.previewKey = key;
                caps.push(mesh);
            });
        });

        const box = new Box3();
        const capBounds = [...keys.values()].filter(key => key.cap).map(key => {
            box.setFromObject(key.cap);
            return { center: box.getCenter(new Vector3()), size: box.getSize(new Vector3()), bottom: box.min.y };
        });
        const pitch = .01905;
        const edgeSources = [];
        const litCaps = new Map();
        const sources = emitters.flatMap(({ obj, color }) => {
            box.setFromObject(obj);
            const position = box.getCenter(new Vector3());
            const dimensions = box.getSize(new Vector3());
            const edge = Math.max(dimensions.x, dimensions.z) > pitch * 3.6
                && /edge|strip|rim|under/i.test(obj.name);
            const cap = edge ? undefined : capBounds.find(({ center }) =>
                Math.abs(center.x - position.x) < .005 && Math.abs(center.z - position.z) < .007);
            if (cap) litCaps.set(cap, color);
            position.y = edge ? box.max.y + .0003 : Math.max(box.max.y + .00035, cap ? cap.bottom + .001 : -Infinity);
            const source = {
                center: position,
                width: Math.max(dimensions.x + pitch * 1.1, pitch * 1.6),
                depth: Math.max(dimensions.z + pitch * 1.1, pitch * 1.6),
                color,
            };
            if (!edge) return [source];
            edgeSources.push(source);
            return [];
        });
        if (!litCaps.size && options.lightingFallback) {
            const modelLights = [...sources];
            capBounds.forEach(cap => {
                const { center, size: dimensions, bottom } = cap;
                const position = center.clone();
                position.y = bottom + .001;
                const hue = MathUtils.clamp((position.x - bounds.min.x) / size.x, 0, 1) * .82;
                const nearestLight = modelLights.reduce((nearest, source) =>
                    !nearest || Math.abs(source.center.x - center.x) < Math.abs(nearest.center.x - center.x)
                        ? source : nearest, null);
                const fallbackColor = options.lightingFallback === "lavender"
                    ? new Color("#dd96f3") : new Color().setHSL(hue, 1, .53);
                const color = nearestLight?.color ?? fallbackColor;
                litCaps.set(cap, color);
                sources.push({
                    center: position, width: dimensions.x + pitch * 1.1, depth: dimensions.z + pitch * 1.1,
                    color,
                });
            });
        }
        if (options.edgeLighting && !edgeSources.length && sources.length) {
            const rest = new Box3();
            model.traverse(obj => {
                if (/^(?:palmrest|wrist[ _]rest)[ _|]/i.test(obj.name)) rest.expandByObject(obj);
            });
            if (!rest.isEmpty()) {
                const count = 14;
                const width = (rest.max.x - rest.min.x) / count;
                const floor = bounds.min.y - .0006;
                for (let i = 0; i < count; i++) {
                    edgeSources.push({
                        center: new Vector3(rest.min.x + width * (i + .5), floor, rest.max.z + .004),
                        width: width * 2.8, depth: .075, color: new Color().setHSL(i / (count - 1) * .82, 1, .54),
                    });
                }
                for (const x of [rest.min.x, rest.max.x]) {
                    edgeSources.push({
                        center: new Vector3(x, floor, (rest.min.z + rest.max.z) / 2),
                        width: .08, depth: (rest.max.z - rest.min.z) * 1.35, color: new Color("#e747ed"),
                    });
                }
            }
        }
        const lightSpill = addLightSpill(scene, sources, resources, true);
        const edgeSpill = addLightSpill(scene, edgeSources, resources);
        const keyLightLeak = addKeyLightLeak(scene, [...litCaps].map(([cap, color]) => ({ cap, color })), resources);
        for (const [material, intensity] of glowing) material.emissiveIntensity = Math.max(intensity, .85);

        const byLabel = new Map();
        for (const key of keys.values()) {
            if (!key.cap) continue;
            if (!byLabel.has(key.label)) byLabel.set(key.label, []);
            byLabel.get(key.label).push(key);
        }
        for (const group of byLabel.values()) group.sort((a, b) => a.cap.position.x - b.cap.position.x);

        async function enableSound() {
            if (signal.aborted || !window.AudioContext || !options.getFeel()) return;
            voice ??= new AudioContext();
            if (voice.state === "suspended") await voice.resume();
        }
        function playSwitch() {
            const profile = profiles[options.getFeel()];
            if (voice?.state !== "running" || !profile) return;
            const { frequency, duration } = profile;
            const now = voice.currentTime;
            const gain = voice.createGain();
            const tick = voice.createOscillator();
            tick.type = "triangle";
            tick.frequency.setValueAtTime(frequency, now);
            tick.frequency.exponentialRampToValueAtTime(Math.max(34, frequency * .26), now + duration);
            gain.gain.setValueAtTime(.065, now);
            gain.gain.exponentialRampToValueAtTime(.001, now + duration);
            tick.connect(gain).connect(voice.destination);
            tick.start(now);
            tick.stop(now + duration);
            tick.onended = () => { tick.disconnect(); gain.disconnect(); };
        }

        const held = new Map();
        let capture = false;
        function setCapture(enabled) {
            capture = enabled && caps.length > 0;
            for (const key of held.values()) key.held = false;
            held.clear();
            options.onCapture(capture);
            if (capture) {
                stage.focus({ preventScroll: true });
                void enableSound().catch(() => {});
            }
        }
        stage.addEventListener("focusout", event => {
            if (capture && !stage.contains(event.relatedTarget)) setCapture(false);
        }, { signal });
        window.addEventListener("blur", () => { if (capture) setCapture(false); }, { signal });
        stage.addEventListener("keydown", event => {
            if (!capture || event.isComposing) return;
            if (event.code === "Escape") {
                event.preventDefault();
                setCapture(false);
                return;
            }
            if (event.metaKey || (event.ctrlKey && !event.code.startsWith("Control"))) return;
            const label = codeLabels[event.code] ?? event.code
                .replace(/^Key([A-Z])$/, "$1").replace(/^Digit([0-9])$/, "$1").replace(/^Numpad([0-9])$/, "Numpad $1");
            const matches = byLabel.get(label);
            const key = /^(Shift|Control|Alt|Meta)Right$/.test(event.code) ? matches?.at(-1) : matches?.[0];
            if (!key) return;
            event.preventDefault();
            if (event.repeat || held.has(event.code)) return;
            held.set(event.code, key);
            key.held = true;
            void enableSound().then(playSwitch).catch(() => {});
            options.onKey(key.label);
        }, { signal });
        window.addEventListener("keyup", event => {
            const key = held.get(event.code);
            if (key) key.held = false;
            held.delete(event.code);
        }, { signal });

        const ray = new Raycaster();
        const pointer = new Vector2();
        let pointerDown;
        renderer.domElement.addEventListener("pointerdown", event => {
            if (event.isPrimary && event.button === 0) pointerDown = [event.clientX, event.clientY];
        }, { signal });
        renderer.domElement.addEventListener("pointercancel", () => { pointerDown = undefined; }, { signal });
        renderer.domElement.addEventListener("pointerup", event => {
            if (!event.isPrimary) return;
            const origin = pointerDown;
            pointerDown = undefined;
            if (!origin || Math.hypot(event.clientX - origin[0], event.clientY - origin[1]) > 6) return;
            const box = renderer.domElement.getBoundingClientRect();
            pointer.set(2 * (event.clientX - box.left) / box.width - 1, 1 - 2 * (event.clientY - box.top) / box.height);
            ray.setFromCamera(pointer, camera);
            const key = ray.intersectObjects(caps, false)[0]?.object.userData.previewKey;
            if (!key) return;
            void enableSound().then(playSwitch).catch(() => {});
            key.tapUntil = performance.now() + 145;
            options.onKey(key.label);
        }, { signal });

        const accent = new Color("#baff8a");
        let last = performance.now();
        renderer.setAnimationLoop(now => {
            const delta = Math.min((now - last) / 1000, .08);
            last = now;
            const depth = profiles[options.getFeel()]?.depth ?? .0027;
            for (const key of keys.values()) {
                if (!key.cap) continue;
                const down = key.held || now < key.tapUntil;
                if (Math.abs(key.amount - Number(down)) < .001) continue;
                key.amount = MathUtils.damp(key.amount, Number(down), down ? 38 : 21, delta);
                for (const { obj, y, scale } of key.pieces) obj.position.y = y - key.amount * depth / scale;
                if (key.feedbackMaterial) {
                    key.feedbackMaterial.emissive?.copy(accent);
                    key.feedbackMaterial.emissiveIntensity = key.amount * .7;
                }
                needsRender = true;
            }
            controls.update();
            if (needsRender) {
                renderer.render(scene, camera);
                needsRender = false;
            }
        });
        options.onReady({
            canType: caps.length > 0,
            canLight: lightSpill !== null || edgeSpill !== null,
            setView,
            setCapture,
            setLighting: enabled => {
                if (lightSpill) lightSpill.visible = enabled;
                if (edgeSpill) edgeSpill.visible = enabled;
                if (keyLightLeak) keyLightLeak.visible = enabled;
                for (const [material, intensity] of glowing) material.emissiveIntensity = enabled ? Math.max(intensity, .85) : 0;
                needsRender = true;
            },
        });
    } catch (error) {
        dispose();
        if (signal.aborted) return;
        console.error("Keyboard 3D preview:", error);
        options.onError(renderer
            ? "3D 모델을 불러오지 못했어요. 미리보기 사진을 표시합니다."
            : "이 브라우저에서 WebGL 3D 화면을 시작하지 못했어요. 미리보기 사진을 표시합니다.");
    }
}
