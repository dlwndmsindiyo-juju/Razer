import { useEffect, useState, type ReactNode } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProductStore } from "../store/useProductStore";
import { useCartStore } from "../store/useCartStore";
import { getProductById } from "../data/productData";
import { formatPrice } from "../data/searchData";
import { bestProductIds } from "../data/homeData";
import { supportPath } from "../data/collabData";
import {
    RECENT_ORDER_COUNT,
    formatPayment,
    maskAddress,
    maskPhone,
    maskSerial,
    warrantyLabel,
    warrantyText,
    formatOrderDate,
    formatOrderNumber,
    isCancelStatus,
    mypageTabs,
    orderActionLabel,
    orderFilters,
    type MypageTab,
    type OrderFilter,
} from "../data/mypageData";
import { ImageOrText } from "../components/common/ImageOrText";
import { BoxIcon, CartIcon, ChevronIcon, HeartIcon, TruckIcon } from "../components/mypage/MypageIcons";
import type { Order, Product, RegisteredProduct } from "../types/product";

// 섹션 제목 + 오른쪽 "전체 … 보기 >" 링크
const SectionHead = ({ title, more }: { title: string; more?: { to: string; label: string } }) => (
    <div className="mypage__section-head">
        <h2 className="mypage__section-title">{title}</h2>
        {more && (
            <Link to={more.to} className="mypage__more">
                {more.label}
                <span className="mypage__chevron">
                    <ChevronIcon />
                </span>
            </Link>
        )}
    </div>
);

// 나의 쇼핑 현황 (최근 주문 · 배송 중 · 배송 완료 · 찜한 제품)
const StatsBoard = ({ orders, likes }: { orders: Order[]; likes: number }) => {
    const stats: { label: string; value: number; icon: ReactNode; highlight?: boolean; to?: string }[] = [
        { label: "최근 주문", value: orders.length, icon: <CartIcon />, to: "/mypage?tab=orders" },
        { label: "배송 중", value: orders.filter((o) => o.status === "배송 중").length, icon: <TruckIcon />, highlight: true, to: "/mypage?tab=orders" },
        { label: "배송 완료", value: orders.filter((o) => o.status === "배송 완료").length, icon: <BoxIcon />, to: "/mypage?tab=orders" },
        { label: "찜한 제품", value: likes, icon: <HeartIcon />, to: "/mypage?view=wishlist" },
    ];
    return (
        <ul className="mypage__stats">
            {stats.map((stat) => (
                <li key={stat.label} className="mypage__stat">
                    {stat.to && <Link to={stat.to} className="mypage__stat-link" aria-label={`${stat.label} 보기`} />}
                    <span className="mypage__stat-icon">{stat.icon}</span>
                    <span className="mypage__stat-label">{stat.label}</span>
                    <strong className={`mypage__stat-value ${stat.highlight && stat.value > 0 ? "is-highlight" : ""}`}>
                        {stat.value}
                    </strong>
                </li>
            ))}
        </ul>
    );
};

// 주문 상세 주소
const orderDetailPath = (id: number) => `/mypage?tab=orders&order=${id}`;

// 상태별 버튼: 배송 조회 (송장 주소가 있으면 새 창) · 반품 문의 (지원 페이지)
const OrderAction = ({ order }: { order: Order }) => {
    const label = orderActionLabel(order.status);
    if (order.status === "배송 완료" || isCancelStatus(order.status)) {
        return (
            <Link to={order.status === "배송 완료" ? supportPath : orderDetailPath(order.id)} className="mypage__line-btn">
                {label}
            </Link>
        );
    }
    return order.trackingUrl ? (
        <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="mypage__line-btn">
            {label}
        </a>
    ) : (
        <Link to={orderDetailPath(order.id)} className="mypage__line-btn">
            {label}
        </Link>
    );
};

// 주문 한 건 (날짜 · 주문번호 · 상품 · 상태 · 버튼)
const OrderCard = ({ order }: { order: Order }) => {
    const item = order.items[0];
    const rest = order.items.length - 1;
    const to = item ? `/products/${item.category}/${item.id}` : "/";
    const isShipping = order.status === "배송 중";
    return (
        <article className="order-card">
            <header className="order-card__head">
                <strong className="order-card__date">{formatOrderDate(order.date)}</strong>
                <span className="order-card__number">주문번호 {formatOrderNumber(order.id)}</span>
                <Link to={orderDetailPath(order.id)} className="order-card__detail">
                    주문 상세
                    <span className="mypage__chevron">
                        <ChevronIcon />
                    </span>
                </Link>
            </header>

            {item && (
                <div className="order-card__body">
                    <Link to={to} className="order-card__thumb" aria-label={`${item.title} 상세 보기`}>
                        <ImageOrText src={item.image} alt="" label="Image" />
                    </Link>
                    <div className="order-card__info">
                        <Link to={to} className="order-card__name">
                            {item.title.split(" - ")[0]}
                            {rest > 0 && ` 외 ${rest}개`}
                        </Link>
                        <p className="order-card__option">
                            {[item.size, `수량 ${item.count}개`].filter(Boolean).join(" · ")}
                        </p>
                        <strong className="order-card__price">{order.price.toLocaleString("ko-KR")}원</strong>
                    </div>
                    <span className={`order-card__status ${isCancelStatus(order.status) ? "is-cancel" : ""}`}>
                        <span className="order-card__status-icon">{isShipping ? <TruckIcon /> : <BoxIcon />}</span>
                        {order.status}
                    </span>
                    <OrderAction order={order} />
                </div>
            )}
        </article>
    );
};

// 주문 목록 + 상태 필터 (전체 · 배송 중 · 배송 완료 · 취소·반품)
const OrderList = ({ orders, limit }: { orders: Order[]; limit?: number }) => {
    const [filter, setFilter] = useState<OrderFilter>("all");
    const current = orderFilters.find((f) => f.key === filter) ?? orderFilters[0];
    const list = orders.filter((order) => current.match(order.status)).slice(0, limit);

    return (
        <>
            <div className="mypage__filters" role="tablist" aria-label="주문 상태">
                {orderFilters.map((f) => (
                    <button
                        key={f.key}
                        type="button"
                        role="tab"
                        aria-selected={filter === f.key}
                        className={`mypage__filter ${filter === f.key ? "is-active" : ""}`}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label} {orders.filter((order) => f.match(order.status)).length}
                    </button>
                ))}
            </div>

            {orders.length === 0 ? (
                <p className="mypage__empty">아직 주문 내역이 없어요.</p>
            ) : list.length > 0 ? (
                <div className="mypage__orders">
                    {list.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <p className="mypage__empty">해당하는 주문이 없어요.</p>
            )}
        </>
    );
};

// 상품 카드 목록 (이미지 · 이름 · 가격 · 장바구니에 담기)
const ProductGrid = ({ products }: { products: Product[] }) => {
    const addItem = useCartStore((state) => state.addItem);
    const [added, setAdded] = useState<number | null>(null);

    const handleAdd = (product: Product) => {
        addItem(getProductById(product.id) ?? product);
        setAdded(product.id);
    };

    return (
        <ul className="mypage__best">
            {products.map((product) => {
                const to = `/products/${product.category}/${product.id}`;
                const canBuy = product.price !== null && !product.soldOut;
                return (
                    <li key={product.id} className="mypage__best-item">
                        <Link to={to} className="mypage__best-thumb" aria-label={`${product.title} 상세 보기`}>
                            <ImageOrText src={product.image} alt="" label="Image" />
                        </Link>
                        <Link to={to} className="mypage__best-name">
                            {product.title}
                        </Link>
                        <strong className="mypage__best-price">{formatPrice(product)}</strong>
                        <button type="button" className="mypage__cart-btn" disabled={!canBuy} onClick={() => handleAdd(product)}>
                            {!canBuy ? "구매 불가" : added === product.id ? "장바구니에 담았어요" : "장바구니에 담기"}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

// 함께 둘러볼 장비 (베스트 상품 4개)
const bestProducts = bestProductIds.flatMap((id) => getProductById(id) ?? []).slice(0, 4);

// 회색 상자 (주문 상세 · 등록 제품 · 위시리스트)
const Panel = ({ title, icon, children }: { title: ReactNode; icon?: ReactNode; children: ReactNode }) => (
    <section className="mypage__panel">
        <h3 className="mypage__panel-title">
            {icon && <span className="mypage__panel-icon">{icon}</span>}
            {title}
        </h3>
        {children}
    </section>
);

// 주문 상세 (/mypage?tab=orders&order=주문번호)
const OrderDetail = ({ order }: { order: Order }) => {
    const done = order.status === "배송 완료";
    const shipping = order.status === "배송 중";
    const statusLine = done
        ? `배송 완료 · ${order.deliveredAt ? formatOrderDate(order.deliveredAt) : "완료일 확인 중"}`
        : shipping
          ? `배송 중 · ${order.carrier ?? "배송사 확인 중"}`
          : order.status;
    const receiver = order.receiver;

    return (
        <section className="mypage__section">
            <SectionHead title="주문 상세" />
            <p className="mypage__meta">
                {formatOrderDate(order.date)} · 주문번호 {formatOrderNumber(order.id)}
            </p>

            <div className="mypage__panels">
                <Panel title="주문 상품">
                    <ul className="mypage__order-items">
                        {order.items.map((item) => (
                            <li key={item.id} className="mypage__order-item">
                                <Link to={`/products/${item.category}/${item.id}`} className="mypage__item-thumb" aria-label={`${item.title} 상세 보기`}>
                                    <ImageOrText src={item.image} alt="" label="Image" />
                                </Link>
                                <div className="mypage__item-info">
                                    <Link to={`/products/${item.category}/${item.id}`} className="mypage__item-name">
                                        {item.title.split(" - ")[0]}
                                    </Link>
                                    <p className="mypage__item-option">{[item.size, `수량 ${item.count}`].filter(Boolean).join(" · ")}</p>
                                    {typeof item.price === "number" && (
                                        <strong className="mypage__item-price">{(item.price * item.count).toLocaleString("ko-KR")}원</strong>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </Panel>

                <Panel title="배송 정보">
                    <p className={`mypage__status-line ${isCancelStatus(order.status) ? "is-cancel" : ""}`}>{statusLine}</p>
                    <p className="mypage__sub">
                        {done ? (
                            "배송 완료 내역"
                        ) : (
                            <>
                                배송 예정일 · {order.expectedAt ? formatOrderDate(order.expectedAt) : "확인 중"}
                                <br />
                                택배사 · {order.trackingNumber ? `송장번호 ${order.trackingNumber}` : "송장번호 업데이트 대기"}
                            </>
                        )}
                    </p>
                    {!isCancelStatus(order.status) &&
                        (order.trackingUrl ? (
                            <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="mypage__line-btn mypage__panel-btn">
                                배송 조회
                            </a>
                        ) : (
                            <button type="button" className="mypage__line-btn mypage__panel-btn" disabled>
                                배송 조회
                            </button>
                        ))}
                </Panel>

                <Panel title="결제·수령 정보">
                    <p className="mypage__pay">
                        결제금액 {order.price.toLocaleString("ko-KR")}원 · {formatPayment(order.payment)}
                    </p>
                    <p className="mypage__sub">
                        {receiver ? (
                            <>
                                {receiver.name} · {maskPhone(receiver.phone)}
                                <br />
                                {maskAddress(receiver.address)}
                            </>
                        ) : (
                            "수령 정보 확인 중"
                        )}
                    </p>
                </Panel>
            </div>

            <div className="mypage__actions">
                {!isCancelStatus(order.status) && (
                    <Link to={supportPath} className="mypage__line-btn">
                        취소 가능 여부 문의
                    </Link>
                )}
                {done && (
                    <Link to={supportPath} className="mypage__line-btn">
                        반품 신청
                    </Link>
                )}
                <Link to="/mypage?tab=orders" className="mypage__line-btn">
                    목록으로
                </Link>
            </div>
        </section>
    );
};

// 등록 제품 한 개
const RegisteredItem = ({ item }: { item: RegisteredProduct }) => {
    const product = getProductById(item.id);
    const to = product ? `/products/${product.category}/${product.id}` : undefined;
    const thumb = <ImageOrText src={item.image ?? product?.image} alt="" label="Image" />;
    return (
        <li className="mypage__registered">
            <div className="mypage__order-item">
                {to ? (
                    <Link to={to} className="mypage__item-thumb" aria-label={`${item.title} 상세 보기`}>
                        {thumb}
                    </Link>
                ) : (
                    <span className="mypage__item-thumb">{thumb}</span>
                )}
                <div className="mypage__item-info">
                    <strong className="mypage__item-name">{item.title.split(" - ")[0]}</strong>
                    {item.option && <p className="mypage__item-option">{item.option}</p>}
                    <p className="mypage__serial">시리얼 번호 · {maskSerial(item.serial)}</p>
                </div>
            </div>
            <p className={`mypage__status-line ${item.warranty === "expired" ? "is-cancel" : ""}`}>
                보증 정보 · {warrantyLabel[item.warranty]}
            </p>
            <p className="mypage__sub">{warrantyText(item.warranty, item.purchasedAt, item.warrantyUntil)}</p>
            <div className="mypage__actions mypage__actions--panel">
                {item.warranty === "pending" && (
                    <Link to={supportPath} className="mypage__line-btn">
                        구매 증빙 등록
                    </Link>
                )}
                <Link to={supportPath} className="mypage__line-btn">
                    지원 요청
                </Link>
                <Link to={registrationPath} className="mypage__line-btn">
                    등록 정보 수정
                </Link>
            </div>
        </li>
    );
};

// 제품 등록 · 보증 안내 페이지
const registrationPath = "/info/service/registration-warranty";

// 마이페이지 (/mypage?tab=home|orders|warranty|account)
// - 주문 상세: /mypage?tab=orders&order=주문번호
// - 위시리스트: /mypage?view=wishlist (탭은 마이페이지)
export const MyPage = () => {
    const { user, authReady } = useAuthStore();
    const { hearts, orderList, registeredList } = useProductStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get("tab");
    const tab: MypageTab = mypageTabs.some((t) => t.key === tabParam) ? (tabParam as MypageTab) : "home";
    const orderParam = searchParams.get("order");
    const isWishlist = tab === "home" && searchParams.get("view") === "wishlist";

    // 탭 · 주문 상세 · 위시리스트로 바뀌면 맨 위부터
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [tab, orderParam, isWishlist]);

    // 로그인 확인 전에는 대기, 비로그인이면 로그인 페이지로
    if (!authReady) return null;
    if (!user) return <Navigate to="/login" state={{ from: "/mypage" }} replace />;

    // 계정의 실제 주문만 (최신 주문이 위로)
    const orders = [...orderList].sort((a, b) => b.date.localeCompare(a.date));
    const name = user.nickname || user.name || "Razer 회원";
    const changeTab = (key: MypageTab) => setSearchParams(key === "home" ? {} : { tab: key });
    const detailOrder = tab === "orders" && orderParam ? orders.find((o) => String(o.id) === orderParam) : undefined;

    const accountRows = [
        { label: "Razer ID", value: user.nickname || user.name },
        { label: "이메일", value: user.email },
        { label: "생년월일", value: user.birth },
        { label: "위치", value: user.location },
    ];

    return (
        <div className="mypage">
            {/* 프로필 */}
            <section className="mypage__profile">
                <div className="mypage__container mypage__profile-inner">
                    <span className="mypage__avatar">
                        {user.profile ? <img src={user.profile} alt="" /> : <img src="/icons/user.svg" alt="" className="mypage__avatar-default" />}
                    </span>
                    <h1 className="mypage__name">{name}님</h1>
                    {/* 프로필 설정은 마이페이지 첫 화면에만 */}
                    {tab === "home" && !isWishlist && (
                        <button type="button" className="mypage__line-btn mypage__profile-btn" onClick={() => changeTab("account")}>
                            프로필 설정
                        </button>
                    )}
                </div>
            </section>

            {/* 탭 */}
            <nav className="mypage__tabs" aria-label="마이페이지 메뉴">
                <div className="mypage__container mypage__tabs-inner">
                    {mypageTabs.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            className={`mypage__tab ${tab === t.key ? "is-active" : ""}`}
                            aria-current={tab === t.key ? "page" : undefined}
                            onClick={() => changeTab(t.key)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </nav>

            <div className="mypage__container mypage__content">
                {isWishlist && (
                    <section className="mypage__section">
                        <Panel title="위시리스트" icon={<HeartIcon />}>
                            {hearts.length > 0 ? (
                                <ProductGrid products={hearts} />
                            ) : (
                                <>
                                    <p className="mypage__sub mypage__sub--lg">아직 찜한 제품이 없습니다.</p>
                                    <Link to="/search" className="mypage__primary-btn">
                                        제품 둘러보기
                                    </Link>
                                </>
                            )}
                        </Panel>
                    </section>
                )}

                {tab === "home" && !isWishlist && (
                    <>
                        <section className="mypage__section">
                            <SectionHead title="나의 쇼핑 현황" />
                            <StatsBoard orders={orders} likes={hearts.length} />
                        </section>

                        <section className="mypage__section">
                            <SectionHead title="최근 주문 내역" more={{ to: "/mypage?tab=orders", label: "전체 주문 보기" }} />
                            <OrderList orders={orders} limit={RECENT_ORDER_COUNT} />
                        </section>

                        <section className="mypage__section">
                            <SectionHead title="함께 둘러볼 장비" more={{ to: "/search", label: "전체 제품 보기" }} />
                            <ProductGrid products={bestProducts} />
                        </section>
                    </>
                )}

                {tab === "orders" &&
                    (detailOrder ? (
                        <OrderDetail order={detailOrder} />
                    ) : (
                        <section className="mypage__section">
                            <SectionHead title="주문 내역" />
                            {orderParam && <p className="mypage__meta">주문을 찾을 수 없어요. 전체 주문 내역을 보여드려요.</p>}
                            <OrderList orders={orders} />
                        </section>
                    ))}

                {tab === "warranty" && (
                    <section className="mypage__section">
                        <SectionHead title="등록 제품·보증" />
                        <Link to={registrationPath} className="mypage__primary-btn mypage__register-btn">
                            제품 등록
                        </Link>
                        <div className="mypage__panels">
                            <Panel title={`등록 제품 ${registeredList.length}`}>
                                {registeredList.length > 0 ? (
                                    <ul className="mypage__registered-list">
                                        {registeredList.map((item) => (
                                            <RegisteredItem key={`${item.id}-${item.serial}`} item={item} />
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mypage__sub mypage__sub--lg">아직 등록된 제품이 없습니다.</p>
                                )}
                            </Panel>
                        </div>
                    </section>
                )}

                {tab === "account" && (
                    <section className="mypage__section">
                        <SectionHead title="계정 관리" />
                        <dl className="mypage__account">
                            {accountRows.map((row) => (
                                <div key={row.label} className="mypage__account-row">
                                    <dt>{row.label}</dt>
                                    <dd>{row.value || "-"}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                )}
            </div>
        </div>
    );
};
