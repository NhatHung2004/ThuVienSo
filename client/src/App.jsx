import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./pages/Home";
import AllBooks from "./pages/AllBooks";
import BookDetails from "./pages/BookDetail";
import HistoryReq from "./pages/HistoryReq";
import Cart from "./pages/Cart";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<AllBooks />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/history" element={<HistoryReq />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
