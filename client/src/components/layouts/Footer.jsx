import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-300 px-4">
      <img
        src="https://ou.edu.vn/wp-content/uploads/2018/08/LOGO-TRUONGV21-12-2018-01-300x300.png"
        alt="logo"
        class="w-35 flex justify-start md:ml-18"
      />
      <div className="max-w-10xl md:ml-20 ">
        {/* Address section */}
        <div className="mt-0">
          <h3 className="text-xl font-bold text-[#214E99] mb-2">Địa chỉ</h3>
          <p className="text-gray-400">Huyện Nhà Bè, Thành phố Hồ Chí Minh</p>
        </div>

        {/* Contact section */}
        <div className="mb-6 mt-5">
          <h3 className="text-xl font-bold text-[#214E99] mb-2">Liên hệ</h3>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex items-center mb-2 md:mb-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>123456@gmail.com</span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>0123456789</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-6  md:mr-16" />

        {/* Social media */}
        <div className="flex flex-col md:flex-row items-center justify-between  mb-6 text-sm text-gray-400 space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-center mb-6">
            <p>© 2025 Thư viện số. Tất cả đã được bảo lưu</p>
          </div>
          <div className="flex flex-rol">
            <h3 className="text-xl font-bold md:mr-10 mr-10 text-[#214E99] mb-4 flex justify-end text-right">
              Social
            </h3>
            <div className="flex mt-1 space-x-6 md:mr-16">
              {["Facebook", "Instagram", "LinkedIn", "Thread", "Youtube"].map(
                (platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {platform}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
