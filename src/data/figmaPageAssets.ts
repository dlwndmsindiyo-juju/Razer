const assets: Record<string, Record<string, string>> = {
    "1404:27870": {
        "Rectangle197": "exclusive/hero-desktop.webp",
        "Rectangle198": "exclusive/collab-honkai.webp",
        "Rectangle199": "exclusive/collab-pompompurin.webp",
        "Rectangle200": "exclusive/collab-blackpink.webp",
        "Rectangle201": "exclusive/collab-evangelion.webp",
        "Rectangle202": "exclusive/collab-wuthering-waves.webp"
    },
    "1404:27912": {
        "Rectangle199": "membership/hero.webp",
        "Rectangle201": "membership/cyber-weekend.webp",
        "Rectangle204": "membership/rewards-ecosystem.webp",
        "Rectangle206": "membership/rewards-redemption.webp",
        "Rectangle211": "membership/earn-cortex.webp",
        "Rectangle214": "membership/earn-insider.webp",
        "Rectangle216": "membership/earn-partners.webp",
        "Group": "membership/benefit-earn.svg",
        "Frame": "membership/benefit-redeem.svg",
        "Group1": "membership/promo-email.svg",
        "Group2": "membership/benefit-events.svg",
        "Group3": "membership/promo-coupon.svg"
    },
    "1404:28006": {
        "Rectangle208": "buying-guide/affiliate.webp",
        "Rectangle209": "buying-guide/education.webp",
        "Rectangle210": "buying-guide/partner.webp"
    },
    "1404:27724": {
        "Rectangle182": "warranty/hero.webp",
        "Frame": "warranty/benefit-resources.svg",
        "Frame1": "warranty/benefit-support.svg",
        "Frame2": "warranty/benefit-updates.svg",
        "Frame3": "warranty/benefit-feedback.svg"
    },
    "1404:27645": {
        "MaskGroup": "order-complete/bag.svg"
    },
    "1401:24703": {
        "Rectangle172": "about/awards-service-background.webp",
        "Rectangle167": "about/razer-city.webp",
        "Rectangle170": "about/milestones-2023.webp",
        "Rectangle168": "about/chroma-banner.webp",
        "Rectangle180": "about/sustainability-banner.webp",
        "Rectangle183": "about/careers-banner.webp",
        "Rectangle173": "about/awards-console.webp",
        "Rectangle174": "about/awards-mobile.webp",
        "Rectangle175": "about/awards-lifestyle.webp",
        "Rectangle176": "about/awards-service.webp",
        "Rectangle185": "about/leadership-min-liang-tan.webp",
        "Rectangle186": "about/leadership-chong-neng-tan.webp",
        "Rectangle187": "about/leadership-choo-wei-pin.webp",
        "Rectangle188": "about/leadership-kheng-joo-khaw.webp",
        "Rectangle189": "about/leadership-li-meng-lee.webp"
    },
    "1403:26959": {
        "Property1Default": "esports/team-player.webp",
        "Rectangle199": "esports/team-hero.webp",
        "Rectangle242": "esports/event-photo-01.webp",
        "Rectangle243": "esports/event-photo-02.webp",
        "Rectangle247": "esports/event-photo-06.webp",
        "Rectangle251": "esports/event-photo-10.webp",
        "Rectangle255": "esports/event-photo-14.webp",
        "Rectangle259": "esports/event-photo-18.webp",
        "Rectangle260": "esports/event-photo-19.webp",
        "Rectangle261": "esports/event-photo-20.webp",
        "Rectangle244": "esports/event-photo-03.webp",
        "Rectangle248": "esports/event-photo-07.webp",
        "Rectangle252": "esports/event-photo-11.webp",
        "Rectangle256": "esports/event-photo-15.webp",
        "Rectangle245": "esports/event-photo-04.webp",
        "Rectangle249": "esports/event-photo-08.webp",
        "Rectangle253": "esports/event-photo-12.webp",
        "Rectangle257": "esports/event-photo-16.webp",
        "Rectangle246": "esports/event-photo-05.webp",
        "Rectangle250": "esports/event-photo-09.webp",
        "Rectangle254": "esports/event-photo-13.webp",
        "Rectangle258": "esports/event-photo-17.webp",
        "Layer2": "esports/icon-trophy.svg",
        "Layer3": "esports/icon-aim.svg"
    },
    "1403:25944": {
        "Frame720": "technology/wireless-charging.webp",
        "Frame721": "technology/hyperpolling-wireless.webp",
        "Frame722": "technology/snap-tap.webp",
        "Frame723": "technology/sensa-hd-haptics.webp",
        "IconDevicesMouse": "technology/icon-mouse.svg",
        "IconDevicesKeyboard": "technology/icon-keyboard.svg",
        "IconDevicesHeadset": "technology/icon-headset.svg",
        "Group": "technology/icon-speaker.svg"
    },
    "1403:25960": {
        "Frame719": "technology/mouse-scroll-wheel.webp",
        "Frame720": "technology/mouse-scroll-wheel-detail.webp",
        "Frame721": "technology/mouse-focus-pro-sensor.webp",
        "Frame722": "technology/mouse-hyperspeed-wireless.webp",
        "Frame723": "technology/mouse-optical-switch.webp",
        "Frame724": "technology/mouse-chroma-rgb.webp"
    },
    "1403:25978": {
        "Frame719": "technology/keyboard-low-profile-switch.webp",
        "Frame720": "technology/keyboard-snap-tap.webp",
        "Frame721": "technology/keyboard-rapid-trigger.webp",
        "Frame722": "technology/keyboard-analog-optical-switch.webp",
        "Frame723": "technology/keyboard-mechanical-switch.webp",
        "Frame724": "technology/keyboard-optical-switch.webp",
        "Frame725": "technology/keyboard-hyperspeed-wireless.webp",
        "Frame726": "technology/keyboard-chroma-rgb.webp"
    },
    "1403:25998": {
        "Frame726": "technology/headset-chroma-rgb.webp",
        "Rectangle274": "technology/headset-sensa-haptics-logo.webp"
    },
    "1403:26018": {
        "Frame726": "technology/speaker-chroma-rgb.webp",
        "Frame720": "technology/speaker-beamforming.webp"
    }
};

// 페이지 · 섹션별 폴더 (public/images/<페이지>/파일)
export const figmaImage = (frame: string, layer: string) => `/images/${assets[frame][layer]}`;
