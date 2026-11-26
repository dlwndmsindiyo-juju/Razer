import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { TopButton } from "./components/common/TopButton";
import { useDragScroll } from "./types/useDragScroll";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { MyPage } from "./pages/MyPage";
import { DiscordCallback } from "./pages/DiscordCallback";
import { CatalogPage, Search } from "./pages/Search";
import { Cart } from "./pages/Cart";
import { Payment } from "./pages/Payment";

import { useAuthStore } from "./store/useAuthStore";
import "./App.scss";
import { ProductsDetail } from "./pages/products/ProductsDetail";
import { InfoPage } from "./pages/InfoPage";
import { CollabPage } from "./pages/CollabPage";
import { PromotionPage } from "./pages/PromotionPage";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { PasswordReset } from "./pages/PasswordReset";
import { OrderComplete } from "./pages/OrderComplete";
import { AboutPage, EsportsPage } from "./pages/info/BrandPages";
import { NikoPage } from "./pages/info/NikoPage";
import { EsportsGreenPage } from "./pages/info/EsportsGreenPage";
import { FaqPage, SupportPage, WarrantyPage } from "./pages/info/ServicePages";
import { CareersPage, ContactPage, RazerCarePage, SustainabilityPage, ZVenturesPage } from "./pages/info/CompanyPages";
import { BuyingGuidePage, ExclusivesPage, MembershipPage } from "./pages/info/StorePages";
import { TechnologyPage } from "./pages/info/TechnologyPage";

const ProductCustomize = lazy(() => import("./pages/products/ProductCustomize")
  .then(({ ProductCustomize }) => ({ default: ProductCustomize })));

function App() {
  useDragScroll(); // 가로 목록 마우스 드래그
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    // 첫 방문과 새로고침 시 Firebase 로그인 상태 확인
    // initAuth가 반환하는 구독 해제 함수를 React에 전달
    return initAuth();
  }, [initAuth]);

  return (
    <>
      {/* 페이지 이동 시 맨 위로 */}
      <ScrollToTop />
      <Header />

      {/* 주소에 따라 메인 영역의 페이지만 변경 */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          {/* 디스코드 로그인 서버에서 돌아오는 주소 */}
          <Route path="/login/discord" element={<DiscordCallback />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/products/:catalogSlug" element={<CatalogPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Payment />} />
          <Route path="/checkout/complete" element={<OrderComplete />} />
          <Route
            path="/products/:category/:productId"
            element={<ProductsDetail />}
          />
          <Route
            path="/products/:category/:productId/customize"
            element={<Suspense fallback={<p role="status">커스텀 페이지를 불러오는 중이에요.</p>}><ProductCustomize /></Suspense>}
          />
          {/* 푸터 내부 링크 페이지 */}
          {/* 그룹 메뉴 페이지 (헤더 메뉴 → 왼쪽 메뉴만) */}
          <Route path="/info/:group" element={<InfoPage />} />
          {/* 프로모션 알아보기 (PDF 화면) · 콜라보 상세 (콜라보 카드에서 이동) */}
          <Route path="/info/promotion/promotions" element={<PromotionPage />} />
          <Route path="/info/product/how-to-buy" element={<BuyingGuidePage />} />
          <Route path="/info/product/razer-exclusives" element={<ExclusivesPage />} />
          <Route path="/info/product/membership" element={<MembershipPage />} />
          <Route path="/info/promotion/technology/:technology?" element={<TechnologyPage />} />
          <Route path="/info/promotion/esports" element={<EsportsPage />} />
          <Route path="/info/promotion/esports/niko" element={<NikoPage />} />
          <Route path="/info/promotion/esports/green" element={<EsportsGreenPage />} />
          <Route path="/info/service/faq" element={<FaqPage />} />
          <Route path="/info/service/registration-warranty" element={<WarrantyPage />} />
          <Route path="/info/service/support" element={<SupportPage />} />
          <Route path="/info/company/about" element={<AboutPage />} />
          <Route path="/info/company/sustainability" element={<SustainabilityPage />} />
          <Route path="/info/company/careers" element={<CareersPage />} />
          <Route path="/info/company/zventures" element={<ZVenturesPage />} />
          <Route path="/info/company/contact" element={<ContactPage />} />
          <Route path="/info/service/razercare" element={<RazerCarePage />} />
          <Route path="/promotion/collab/:collabSlug" element={<CollabPage />} />
          <Route path="/info/:group/:page" element={<InfoPage />} />
        </Routes>
      </main>

      <Footer />
      {/* TOP 버튼: 메인부터 모든 페이지에 항상 표시 */}
      <TopButton />
    </>
  );
}

export default App;
