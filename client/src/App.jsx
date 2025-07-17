import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./pages/Home";
import AllBooks from "./pages/AllBooks";
import BookDetails from "./pages/BookDetail";
import HistoryReq from "./pages/HistoryReq";
import Cart from "./pages/Cart";
import Login from "./pages/Login";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isBookDetailsPage = location.pathname.includes("/book-detail");

  return (
    <>
      {!isLoginPage && !isBookDetailsPage && <Header />}
      {children}
      {!isLoginPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<AllBooks />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/history" element={<HistoryReq />} />
          <Route path="/book-detail" element={<BookDetails />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
