import { useState } from "react";
import { Link } from "react-router-dom";
import { getProductById } from "../../data/productData";
import { CatalogCard, PageHeading } from "./PageLayout";

const platforms = {
    PC: [
        [2018, "3세대 Focus Pro 50K 센서와 최대 8,000Hz 폴링을 지원하는 무선 마우스."],
        [2034, "2세대 HyperSpeed Wireless 연결과 옵티컬 스크롤 휠을 갖춘 인체공학 마우스."],
        [1029, "아날로그 옵티컬 스위치와 래피드 트리거를 지원하는 8KHz 텐키리스 키보드."],
        [4012, "액티브 노이즈 캔슬링을 지원하는 PC용 무선 헤드셋."],
        [5008, "유선과 무선 모두 최대 8,000Hz로 동작하는 PC용 컨트롤러."],
    ],
    콘솔: [
        [4013, "액티브 노이즈 캔슬링을 지원하는 Xbox용 무선 헤드셋."],
        [5005, "홀 이펙트 스틱과 매핑 가능한 추가 버튼을 갖춘 컨트롤러."],
        [5006, "TMR 스틱과 조절 가능한 트리거를 갖춘 PS5 컨트롤러."],
        [5007, "격투 게임을 위한 USB-C 올버튼 옵티컬 컨트롤러."],
    ],
} as const;

const platformOptions = Object.keys(platforms) as (keyof typeof platforms)[];

export function EsportsGreenPage() {
    const [platform, setPlatform] = useState<keyof typeof platforms>("PC");

    return <div className="design-page esports-green">
        <div className="design-container">
            <Link className="esports-green__back" to="/info/promotion/esports">‹ e스포츠</Link>
            <section className="esports-green__intro">
                <PageHeading title="Razer Esports Green 컬렉션"
                    description="마우스부터 컨트롤러까지, PC와 콘솔에서 사용할 수 있는 Esports Green Edition 장비를 살펴보세요." />
                <img src="/images/esports/green/collection.webp" alt="Esports Green 컬렉션 장비" />
            </section>
            <section aria-labelledby="esports-green-gear">
                <h2 id="esports-green-gear">플랫폼별 e스포츠 장비</h2>
                <div className="design-tabs" role="group" aria-label="플랫폼 선택">
                    {platformOptions.map((option) => <button key={option} type="button"
                        aria-pressed={option === platform} onClick={() => setPlatform(option)}>{option}</button>)}
                </div>
                <div className="design-grid design-grid--three" aria-label={platform + " 제품"}>
                    {platforms[platform].map(([id, description]) => {
                        const product = getProductById(id);
                        return product && <CatalogCard key={id} product={product} description={description} featured />;
                    })}
                </div>
            </section>
        </div>
    </div>;
}
