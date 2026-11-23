export type ViewAngle = "hero" | "top" | "left" | "right";
export type SwitchFeel = "tactile" | "clicky" | "linear";

export function mountKeyboardScene(
    stage: HTMLElement,
    modelUrl: string,
    options: {
        signal: AbortSignal;
        getFeel: () => SwitchFeel | undefined;
        onReady: (scene: {
            canType: boolean;
            setView: (view: ViewAngle) => void;
            setCapture: (enabled: boolean) => void;
            setLighting: (enabled: boolean) => void;
        }) => void;
        onCapture: (enabled: boolean) => void;
        onKey: (label: string) => void;
        onError: (message: string) => void;
    },
): Promise<void>;

