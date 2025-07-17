import React from "react";

const LoginRequire = () => {
  return (
    <div className="relative w-full bg-white mt-15">
      <div className="flex flex-col md:flex-row items-start justify-between px-4 md:px-24">
        {/* Text */}
        <div className="md:w-1/2">
          <h2
            style={{ color: "#214E99" }}
            className="text-4xl md:text-4xl font-bold text-center md:text-left"
          >
            Khám Phá Thư Viện
          </h2>
          <p className="text-xl text-center md:text-left mt-4 font-normal text-[#214E99]">
            Đăng ký tài khoản miễn phí để có thể mượn và sử dụng hết chức năng
            của thư viện số.
          </p>
        </div>

        <div className="flex flex-row mt-10 ml-5 md:mt-5  md:mb-20 mb-10 gap-10 justify-center md:justify-start">
          <button className="bg-[#0057E8] text-white border font-semibold px-6 py-3 rounded-lg shadow-md cursor-pointer transition duration-300 transform hover:-translate-y-1">
            Đăng nhập ngay
          </button>

          <button className="bg-white font-semibold px-6 py-3 rounded-lg duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default LoginRequire;
