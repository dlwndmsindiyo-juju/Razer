// Product에 model3d 선택 필드 추가

// 상품 목록, 상세, 찜 목록에서 공통으로 사용하는 상품 정보
export interface Product {
    id: number;
    title: string;
    category: string; // 예: "keyboards"
    series?: string; // 예: "huntsman"
    price: number;
    image: string;

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