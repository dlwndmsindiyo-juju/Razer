// 마이페이지 아이콘 (public/icons/mypage/*.svg · 흰색 선)
const Icon = ({ name }: { name: string }) => <img src={`/icons/mypage/${name}.svg`} alt="" aria-hidden="true" />;

export const CartIcon = () => <Icon name="cart" />; // 최근 주문
export const TruckIcon = () => <Icon name="delivery" />; // 배송 중
export const BoxIcon = () => <Icon name="delivered" />; // 배송 완료
export const HeartIcon = () => <Icon name="wishlist" />; // 찜한 제품
export const ChevronIcon = () => <Icon name="chevron-right" />; // 전체 보기 · 주문 상세 >
