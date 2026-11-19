// 상품 카테고리 (주소 /products/:category/:productId 의 category)
export type ProductCategory = "keyboards" | "mice" | "mousepads" | "headphones" | "controllers";

// 카테고리와 별개로 묶어 보여줄 컬렉션 (한 상품이 여러 개에 속할 수 있음)
export type ProductCollection = "exclusive" | "collab";

// 상품 목록, 상세, 찜 목록에서 공통으로 사용하는 상품 정보
export interface Product {
    id: number; // 카테고리별 번호대 (키보드 1000 · 마우스 2000 · 마우스패드 3000 · 헤드폰 4000 · 컨트롤러 5000)
    title: string; // 사이트 표기 상품명
    category: ProductCategory;
    series?: string; // 같은 모델 묶음 (예: "viper-v4-pro")
    sku?: string; // Razer 상품 코드 (상세 데이터 연결용)
    price: number | null; // 가격 미표시 상품은 null
    originalPrice?: number; // 할인 전 가격 (할인 중일 때만)
    image: string; // 목록 · 카드용 대표 이미지
    collections?: ProductCollection[]; // 독점 · 콜라보
    soldOut?: boolean; // 재고 부족 · 재입고 알림

    // 3D 모델을 만든 상품에만 추가
    model3d?: {
        src: string; // 웹용 .glb 경로
        poster: string; // 모델 로딩 전 대표 이미지
        alt: string; // 모델 설명
    };
}

// 장바구니와 주문에 담긴 상품의 옵션 및 수량
export interface CartItem extends Product {
    size: string; // 기존 코드의 옵션 식별 필드. 키보드에서는 선택한 옵션 값 저장
    count: number;
}

// Firestore users/{uid} 문서에서 읽어오는 주문 내역
export interface Order {
    id: number;
    date: string;
    items: CartItem[];
    price: number;
    status: string;
}

// 상품 스토어에서 관리하는 상태와 메서드
export interface ProductState {
    items: Product[];
    hearts: Product[];
    orderList: Order[];

    // 로그인한 계정의 찜과 주문 불러오기
    loadUserData: (uid: string) => Promise<void>;

    // 로그아웃 시 화면에 남아 있는 찜과 주문 비우기
    clearUserData: () => void;
}