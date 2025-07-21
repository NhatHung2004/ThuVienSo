import React, { useContext } from "react";
import "../layouts/Home.css";
import Book from "../components/layouts/Book";
import LoginRequire from "../components/layouts/LoginRequire";
import { useNavigate, Link } from "react-router-dom";
import { MyUserContext } from "../configs/MyContext";

const Home = () => {
  const navigate = useNavigate();
  const user = useContext(MyUserContext);
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="relative w-full p-6">
        <h1
          style={{ color: "#214E99" }}
          className="text-4xl font-bold text-blue-600 text-center"
        >
          Tri thức mở
          <br />
          Kết nối không giới hạn
        </h1>
        <p className="text-xl text-gray-400 text-center mt-7 font-semibold">
          Một trang sách là một hành trình mới. Bắt đầu chuyến đi của bạn hôm
          nay.
        </p>
        <div className="w-full flex justify-center gap-x-8 md:gap-x-20 mt-6 px-4 md:mt-24 flex-wrap">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-40 h-40 sm:w-50 sm:h-50 md:w-60 md:h-60 bg-white border-2 border-blue-300 rounded-lg mb-5"
            ></div>
          ))}
        </div>
      </div>

      <div className="relative w-full bg-white mt-20 md:mt-40 ">
        <div className="flex flex-col md:flex-row relative">
          {/* Text */}
          <div className="md:w-1/2 px-4 md:px-0 mx-auto md:mx-0">
            <h2
              style={{ color: "#214E99" }}
              className="text-4xl md:text-4xl md:mt-10 font-bold text-center md:text-left md:ml-40"
            >
              Khám Phá Thế Giới Sách
            </h2>
            <h2
              style={{ color: "#214E99" }}
              className="text-4xl md:text-4xl font-bold text-center md:text-left md:ml-40"
            >
              Phong Phú
            </h2>
            <p className="text-5sm text-gray-400 text-center md:text-left mt-10 font-semibold md:ml-40">
              Chúng tôi cung cấp hàng ngàn đầu sách và tài liệu học tập. Truy
              cập và mượn dễ dàng và nhanh chóng để nâng cao kiến thức của bạn.
            </p>

            <div className="flex flex-row md:mt-20 ">
              <div className="flex flex-col justify-end items-start md:ml-29 ml-5">
                <div
                  style={{ background: "#214E99" }}
                  className="inline-block w-fit h-fit md:flex md:items-center md:justify-center rounded-lg md:ml-10 flex-col mt-10 md:mt-0 md:w-20 md:h-20"
                >
                  <img
                    src="../../public/book-2.svg"
                    alt="Khám phá sách"
                    style={{ filter: "invert(100%) brightness(200%)" }}
                    className="w-15 h-15 object-cover rounded-lg shadow-lg "
                  />
                </div>
                <p className="md:ml-10 md:text-start  font-bold text-10sm mt-5 text-lg">
                  Tài liệu học tập
                </p>
                <p className="md:ml-10 break-words md:text-start  text-10sm font-semibold opacity-50">
                  Cung cấp tài liệu học tập phong phú cho học sinh và sinh viên
                </p>
              </div>

              <div className="flex flex-col justify-end items-start md:ml-29 ml-40 ">
                <div
                  style={{ background: "#214E99" }}
                  className="inline-block w-fit h-fit md:flex md:items-center md:justify-center rounded-lg md:ml-20  flex-col mt-10 md:mt-0 md:w-20 md:h-20"
                >
                  <img
                    src="../../public/book.svg"
                    alt="Khám phá sách"
                    style={{ filter: "invert(100%) brightness(200%)" }}
                    className="w-15 h-15 object-cover rounded-lg shadow-lg "
                  />
                </div>
                <p className="md:ml-20 md:text-start  font-bold text-10sm mt-5 text-lg">
                  Tài liệu học tập
                </p>
                <p className="md:ml-20 break-words md:text-start  text-10sm font-semibold opacity-50 ">
                  Cung cấp tài liệu học tập phong phú cho học sinh và sinh viên
                </p>
              </div>
            </div>
          </div>

          {/* Ảnh */}
          <div className="md:w-1/2 w-full mt-10 md:mt-0 flex justify-center md:justify-end relative">
            <div className="hidden md:mr-20 md:block w-[600px] aspect-[3/2]">
              <img
                src="https://images.pexels.com/photos/1046125/pexels-photo-1046125.jpeg"
                alt="Khám phá sách"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="md:hidden w-full max-w-md aspect-[3/2]">
              <img
                src="https://images.pexels.com/photos/1046125/pexels-photo-1046125.jpeg"
                alt="Khám phá sách"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-10 md:mt-18 md:mb-20 mb-10 gap-10 justify-center md:justify-start md:ml-37">
          <button
            onClick={() => navigate("/books")}
            className="bg-white text-[#214E99] border border-[#214E99] font-semibold px-6 py-3 rounded-lg shadow-md cursor-pointer transition duration-300 transform hover:-translate-y-1"
          >
            Khám phá ngay
          </button>

          <button className="bg-white font-semibold px-6 py-3 rounded-lg duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center gap-2">
            <Link to="/login">
              <span className="bg-gradient-to-r from-[#214E99] to-[#0B1A33] bg-clip-text text-transparent font-semibold hover:underline hover:opacity-80 transition">
                Đăng nhập
              </span>
            </Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              h
              className="h-5 w-5 text-[#214E99]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col relative w-full bg-white mt-25 p-6 mb-15">
        <h2
          style={{ color: "#214E99" }}
          className="text-4xl md:text-5xl font-bold text-center md:text-left md:ml-29"
        >
          Sách nổi bật
        </h2>

        <p className="text-xl text-gray-400 text-center md:text-left mt-10 font-semibold md:ml-29">
          Những cuốn sách được đánh giá cao bởi độc giả.
        </p>

        <div className="flex flex-row overflow-x-auto whitespace-nowrap  bg-white px-4">
          <Book />
          <Book />
          <Book />
          <Book />
          <Book />
          <Book />
          <Book />
          <Book />
        </div>
        <hr className="w-full h-[1px] bg-gray-300 my-4 border-none mt-15" />
        {!user && (
          <div className="w-full">
            <LoginRequire />
          </div>
        )}
        <hr className="w-full h-[1px] bg-gray-300 my-4 border-none" />
      </div>
    </div>
  );
};

export default Home;
