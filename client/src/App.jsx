import React, { useReducer } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./pages/Home";
import AllBooks from "./pages/AllBooks";
import BookDetails from "./pages/BookDetail";
import HistoryReq from "./pages/HistoryReq";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LibrarianHome from "./pages/LibrarianHome";
import { MyUserContext, MyUserDispatchContext } from "./configs/MyContext";
import MyUserReducer from "./reducer/MyUserReducer";
const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isBookDetailsPage = location.pathname.includes("/book-detail");
  const isBookLibrarianHomePage = location.pathname.includes("/librarian-home");
  const isRegisterPage = location.pathname.includes("/register");
  return (
    <>
      {!isLoginPage &&
        !isBookDetailsPage &&
        !isBookLibrarianHomePage &&
        !isRegisterPage && <Header />}
      {children}
      {!isLoginPage && !isBookLibrarianHomePage && !isRegisterPage && (
        <Footer />
      )}
    </>
  );
};

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <MyUserContext.Provider value={user}>
      <MyUserDispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<AllBooks />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/history" element={<HistoryReq />} />
              <Route path="/register" element={<Register />} />
              <Route path="/book-detail" element={<BookDetails />} />
              <Route path="/librarian-home" element={<LibrarianHome />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </MyUserDispatchContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;
