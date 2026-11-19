import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Search } from "./pages/Search";
import { Cart } from "./pages/Cart";
import { Payment } from "./pages/Payment";

import { useAuthStore } from "./store/useAuthStore";
import "./App.scss";
import { ProductsDetail } from "./pages/products/ProductsDetail";
import { InfoPage } from "./pages/InfoPage";


function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    // 첫 방문과 새로고침 시 Firebase 로그인 상태 확인
    // initAuth가 반환하는 구독 해제 함수를 React에 전달
    return initAuth();
  }, [initAuth]);

  return (
    <>
      <Header />

      {/* 주소에 따라 메인 영역의 페이지만 변경 */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Payment />} />
          <Route
            path="/products/:category/:productId"
            element={<ProductsDetail />}
          />
          {/* 푸터 내부 링크 페이지 */}
          <Route path="/info/:group/:page" element={<InfoPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;