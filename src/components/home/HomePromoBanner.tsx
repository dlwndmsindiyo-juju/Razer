import { homeImages } from "../../data/homeData";

// 풀폭 홍보배너 (1920 x 476)
// 영상 → 이미지 → 텍스트 순으로 표시
export const HomePromoBanner = () => {
    const { promoVideo, promoBanner } = homeImages;

    return (
        <section
            className="home-promo"
            aria-label="홍보배너"
            style={!promoVideo && promoBanner ? { backgroundImage: `url(${promoBanner})` } : undefined}
        >
            {promoVideo ? (
                <video
                    className="home-promo__video"
                    src={promoVideo}
                    poster={promoBanner}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
            ) : (
                !promoBanner && <span className="home-promo__no-image">Promotion Banner</span>
            )}
        </section>
    );
};
