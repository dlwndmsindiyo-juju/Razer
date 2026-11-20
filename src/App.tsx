import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
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


function App() {
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
          {/* 디스코드 로그인 서버에서 돌아오는 주소 */}
          <Route path="/login/discord" element={<DiscordCallback />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/products/:catalogSlug" element={<CatalogPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Payment />} />
          <Route
            path="/products/:category/:productId"
            element={<ProductsDetail />}
          />
          {/* 푸터 내부 링크 페이지 */}
          {/* 그룹 메뉴 페이지 (헤더 메뉴 → 왼쪽 메뉴만) */}
          <Route path="/info/:group" element={<InfoPage />} />
          {/* 프로모션 알아보기 (PDF 화면) · 콜라보 상세 (콜라보 카드에서 이동) */}
          <Route path="/info/promotion/promotions" element={<PromotionPage />} />
          <Route path="/promotion/collab/:collabSlug" element={<CollabPage />} />
          <Route path="/info/:group/:page" element={<InfoPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
