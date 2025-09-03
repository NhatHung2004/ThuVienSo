import React, { useContext, useEffect, useState } from "react";
import "../layouts/Home.css";
import LoginRequire from "../components/layouts/LoginRequire";
import { useNavigate, Link } from "react-router-dom";
import { MyUserContext } from "../configs/MyContext";
import bookIcon1 from "../assets/book.svg";
import bookIcon2 from "../assets/book-2.svg";
import { Apis } from "../configs/Apis";

// Custom animations
const customStyles = `
  @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  @keyframes count-up { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
  .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
  .animate-count-up { animation: count-up 0.6s ease-out 0.3s both; }
  .shadow-3xl { box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25); }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

const Book = ({ id, title, description, image, author, rating }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/book-detail/${id}`)} // 👉 Khi click thì nav qua /books/:id
      className="flex-shrink-0 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer w-56 sm:w-60 md:w-64"
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-72 sm:h-80 md:h-84 object-cover"
        />
        {/* Orange badge */}
        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          -20%
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3
          className="text-sm sm:text-base font-medium text-gray-800 leading-tight mb-4 min-h-[2.5rem] overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: "1.25rem",
          }}
        >
          {title}
        </h3>

        <div className="flex items-center justify-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, number, label, description, gradient, delay }) => {
  return (
    <div
      className={`relative w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 bg-gradient-to-br ${gradient} rounded-2xl mb-4 sm:mb-5 p-4 sm:p-6 flex flex-col justify-center items-center shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer animate-fade-in-up overflow-hidden`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
      <div className="relative z-10 flex flex-col justify-center items-center">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 animate-bounce-slow drop-shadow-lg">
          {icon}
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-1 sm:mb-2 tracking-tight animate-count-up drop-shadow-lg text-shadow-strong">
          {number}
        </div>
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white text-center mb-1 sm:mb-2 uppercase tracking-wider drop-shadow-md">
          {label}
        </div>
        <div className="text-xs sm:text-xs md:text-sm text-white/90 text-center leading-tight drop-shadow-sm px-1">
          {description}
        </div>
      </div>
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 sm:w-8 h-6 sm:h-8 bg-white/30 rounded-full"></div>
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-4 sm:w-6 h-4 sm:h-6 bg-white/25 rounded-full"></div>
      <div className="absolute top-1/2 left-1 sm:left-2 w-0.5 sm:w-1 h-8 sm:h-12 bg-white/35 rounded-full transform -rotate-12"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const user = useContext(MyUserContext);
  const [books, setBooks] = useState([]);
  const [displayStats, setDisplayStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalRatings: 0,
    activeLoans: 0,
  });

  const fetchStat = async () => {
    try {
      const res = await Apis.get("/stats/general_stats");
      console.log(res.data);
      const data = {
        totalBooks: res.data.total_of_books,
        totalUsers: res.data.number_of_users,
        totalRatings: res.data.average_rating,
        activeLoans: res.data.number_of_borrows,
      };

      // Count-up animation
      const duration = 1000;
      const steps = 30;
      const interval = duration / steps;
      let step = 0;

      const counter = setInterval(() => {
        step++;
        setDisplayStats({
          totalBooks: Math.round((data.totalBooks / steps) * step),
          totalUsers: Math.round((data.totalUsers / steps) * step),
          totalRatings: +((data.totalRatings / steps) * step).toFixed(2),
          activeLoans: Math.round((data.activeLoans / steps) * step),
        });
        if (step >= steps) clearInterval(counter);
      }, interval);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await Apis.get("/books/");
      const sortedBooks = res.data
        .sort((a, b) => b.average_rating - a.average_rating)
        .slice(0, 10);
      setBooks(sortedBooks);
    } catch {
      console.log("Có lỗi khi tải danh sách sách");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchStat();
  }, []);

  const statsData = [
    {
      icon: "📚",
      number: displayStats.totalBooks.toLocaleString(),
      label: "Sách",
      description: "Tổng số đầu sách trong thư viện",
      gradient: "from-blue-600 via-blue-700 to-indigo-800",
      delay: 0,
    },
    {
      icon: "👥",
      number: displayStats.totalUsers.toLocaleString(),
      label: "Thành viên",
      description: "Cộng đồng độc giả tích cực",
      gradient: "from-emerald-500 via-teal-600 to-cyan-700",
      delay: 200,
    },
    {
      icon: "⭐",
      number: displayStats.totalRatings.toFixed(2),
      label: "Đánh giá",
      description: "Điểm đánh giá trung bình",
      gradient: "from-amber-500 via-orange-600 to-red-600",
      delay: 400,
    },
    {
      icon: "📖",
      number: displayStats.activeLoans.toLocaleString(),
      label: "Đang mượn",
      description: "Sách được mượn hiện tại",
      gradient: "from-purple-600 via-violet-700 to-purple-800",
      delay: 600,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Banner */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <h1
          style={{ color: "#214E99" }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 text-center leading-tight"
        >
          Tri thức mở
          <br />
          Kết nối không giới hạn
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 text-center mt-4 sm:mt-6 lg:mt-7 font-semibold px-4 leading-relaxed">
          Một trang sách là một hành trình mới. Bắt đầu chuyến đi của bạn hôm
          nay.
        </p>

        {/* Stats Grid - Responsive Layout */}
        <div className="w-full flex justify-center mt-8 sm:mt-12 lg:mt-16 xl:mt-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 max-w-7xl">
            {statsData.map((stat, i) => (
              <StatCard
                key={i}
                icon={stat.icon}
                number={stat.number}
                label={stat.label}
                description={stat.description}
                gradient={stat.gradient}
                delay={stat.delay}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Khám phá sách */}
      <div className="relative w-full bg-white mt-12 sm:mt-16 lg:mt-20 xl:mt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-start">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-8 xl:pr-12">
              <h2
                style={{ color: "#214E99" }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center lg:text-left leading-tight"
              >
                Khám Phá Thế Giới Sách
                <br className="hidden sm:block" />
                <span className="block sm:inline"> Phong Phú</span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-gray-400 text-center lg:text-left mt-6 sm:mt-8 lg:mt-10 font-semibold leading-relaxed">
                Chúng tôi cung cấp hàng ngàn đầu sách và tài liệu học tập. Truy
                cập và mượn dễ dàng và nhanh chóng để nâng cao kiến thức của
                bạn.
              </p>

              {/* Feature Icons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 sm:gap-8 md:gap-12 mt-8 sm:mt-12 lg:mt-16">
                <div className="flex flex-col items-center lg:items-start">
                  <div
                    style={{ background: "#214E99" }}
                    className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg shadow-lg"
                  >
                    <img
                      src={bookIcon2}
                      alt="Tài liệu học tập"
                      style={{ filter: "invert(100%) brightness(200%)" }}
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    />
                  </div>
                  <p className="text-base sm:text-lg font-bold mt-4 text-center lg:text-left">
                    Tài liệu học tập
                  </p>
                  <p className="text-sm text-gray-500 font-semibold text-center lg:text-left leading-relaxed mt-2">
                    Cung cấp tài liệu học tập phong phú cho học sinh và sinh
                    viên
                  </p>
                </div>

                <div className="flex flex-col items-center lg:items-start">
                  <div
                    style={{ background: "#214E99" }}
                    className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg shadow-lg"
                  >
                    <img
                      src={bookIcon1}
                      alt="Sách tham khảo"
                      style={{ filter: "invert(100%) brightness(200%)" }}
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    />
                  </div>
                  <p className="text-base sm:text-lg font-bold mt-4 text-center lg:text-left">
                    Sách tham khảo
                  </p>
                  <p className="text-sm text-gray-500 font-semibold text-center lg:text-left leading-relaxed mt-2">
                    Thư viện sách tham khảo đa dạng và chất lượng cao
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl aspect-[4/3] sm:aspect-[3/2]">
                <img
                  src="https://images.pexels.com/photos/1046125/pexels-photo-1046125.jpeg"
                  alt="Khám phá sách"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed alignment */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-8 sm:mt-12 lg:mt-16 mb-12 sm:mb-16 lg:mb-20">
            <button
              onClick={() => navigate("/books")}
              className="w-full sm:w-auto bg-white text-[#214E99] border-2 border-[#214E99] font-semibold px-8 py-3 sm:py-4 rounded-lg shadow-md cursor-pointer transition duration-300 transform hover:-translate-y-1 hover:bg-[#214E99] hover:text-white whitespace-nowrap"
            >
              Khám phá ngay
            </button>
          </div>
        </div>
      </div>

      {/* Sách nổi bật */}
      <div className="relative w-full bg-gray-50 mt-12 sm:mt-16 lg:mt-20 py-8 sm:py-12 lg:py-16 mb-12 sm:mb-16 lg:mb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500 uppercase tracking-wide">
              TOP SÁCH NỔI BẬT
            </h2>
          </div>

          {/* Books Container with Navigation */}
          <div className="relative">
            {/* Left Navigation Button */}
            <button
              onClick={() => {
                const container = document.getElementById("books-container");
                if (container) {
                  container.scrollBy({ left: -300, behavior: "smooth" });
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 border border-gray-200"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Right Navigation Button */}
            <button
              onClick={() => {
                const container = document.getElementById("books-container");
                if (container) {
                  container.scrollBy({ left: 300, behavior: "smooth" });
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 border border-gray-200"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Books Horizontal Scroll */}
            <div
              id="books-container"
              className="overflow-x-auto pb-4 scrollbar-hide px-8"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div
                className="flex gap-4 sm:gap-6"
                style={{ width: "max-content" }}
              >
                {books.map((book) => (
                  <Book
                    key={book.id} // React key
                    id={book.id} // 👈 Truyền id vào props để dùng trong navigate
                    title={book.title}
                    description={book.description}
                    image={book.image}
                    author={book.author_id}
                    rating={book.average_rating}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LoginRequire - OUTSIDE container để tràn full width */}
      {!user && (
        <>
          <hr className="w-full h-[1px] bg-gray-300 my-8 sm:my-12 border-none" />
          <LoginRequire />
          <hr className="w-full h-[1px] bg-gray-300 my-8 sm:my-12 border-none" />
        </>
      )}
    </div>
  );
};

export default Home;
