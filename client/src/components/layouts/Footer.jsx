import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Address section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Dia chi</h3>
          <p className="text-gray-400">Huyện Nhà Bè, Thành phố Hồ Chí Minh</p>
        </div>

        {/* Contact section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Liên hệ</h3>
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
        <hr className="border-gray-700 my-6" />

        {/* Copyright */}
        <div className="text-center mb-6">
          <p>© 2025 Thư viện số. Tất cả đã được bảo lưu</p>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-6" />

        {/* Social media */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            Social
          </h3>
          <div className="flex justify-center space-x-6">
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

        {/* Code number */}
        <div className="text-center text-gray-500 text-sm mt-8">1920 - 562</div>
      </div>
    </footer>
  );
};

export default Footer;
