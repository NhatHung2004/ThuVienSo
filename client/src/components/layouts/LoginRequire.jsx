import React from "react";
import { Link } from "react-router-dom";

const LoginRequire = () => {
  return (
    <div className="relative w-full bg-white">
      <div className="flex flex-col md:flex-row items-start justify-between px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Text Content */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <h2
            style={{ color: "#214E99" }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left leading-tight"
          >
            Khám Phá Thư Viện
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center md:text-left mt-4 sm:mt-6 lg:mt-8 font-normal text-[#214E99] leading-relaxed">
            Đăng ký tài khoản miễn phí để có thể mượn và sử dụng hết chức năng
            của thư viện số.
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 sm:gap-6">
          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[#0057E8] text-white border font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-md cursor-pointer transition duration-300 transform hover:-translate-y-1 whitespace-nowrap">
              Đăng nhập ngay
            </button>
          </Link>

          <Link to="/register" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2 border border-gray-200 hover:border-[#214E99] whitespace-nowrap">
              <span className="bg-gradient-to-r from-[#214E99] to-[#0B1A33] bg-clip-text text-transparent">
                Đăng Ký
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginRequire;
