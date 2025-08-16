import React, { useContext, useEffect, useState } from "react";
import "../layouts/Home.css";
import LoginRequire from "../components/layouts/LoginRequire";
import { useNavigate, Link } from "react-router-dom";
import { MyUserContext } from "../configs/MyContext";
import bookIcon1 from "../assets/book.svg";
import bookIcon2 from "../assets/book-2.svg";
import { Apis } from "../configs/Apis";

// Add custom CSS for animations
const customStyles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes count-up {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
  }
  
  .animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
  }
  
  .animate-count-up {
    animation: count-up 0.6s ease-out 0.3s both;
  }
  
  .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

const Book = ({ title, description, image, author, rating }) => {
  return (
    <div className="min-w-[280px] h-fit md:mt-15 bg-gray-50 m-4 border rounded-lg p-4 shadow-lg duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer">
      <img
        src={image}
        alt={title}
        className="w-full h-60 object-cover rounded-lg"
      />

      <hr className="w-full h-[1px] bg-gray-300 my-4 border-none" />

      <h3 className="text-lg font-semibold mt-2 truncate">{title}</h3>
      <p className="text-2sm text-gray-600 mt-1">Tác giả: {author}</p>
      <p className="text-2sm text-gray-500 mt-1 truncate">{description}</p>

      <div className="w-full flex flex-row mt-4">
        {[...Array(5)].map((_, i) => (
          <img
            key={i}
            src={
              i < Math.round(rating)
                ? "../../../public/star.svg"
                : "../../../public/star (1).svg"
            }
            alt="rating star"
            style={{
              filter:
                i < Math.round(rating)
                  ? "brightness(0) saturate(100%) invert(79%) sepia(60%) saturate(530%) hue-rotate(1deg) brightness(102%) contrast(104%)"
                  : "none",
            }}
            className="w-4 h-4 object-contain rounded-lg m-1"
          />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ icon, number, label, description, gradient, delay }) => {
  return (
    <div
      className={`relative w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-gradient-to-br ${gradient} rounded-2xl mb-5 p-6 flex flex-col justify-center items-center shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer animate-fade-in-up overflow-hidden`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Glass overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center">
        <div className="text-4xl md:text-5xl mb-3 animate-bounce-slow drop-shadow-lg">
          {icon}
        </div>
        <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight animate-count-up drop-shadow-lg text-shadow-strong">
          {number}
        </div>
        <div className="text-sm md:text-lg font-bold text-white text-center mb-2 uppercase tracking-wider drop-shadow-md">
          {label}
        </div>
        <div className="text-xs md:text-sm text-white/90 text-center leading-tight drop-shadow-sm">
          {description}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-white/30 rounded-full"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/25 rounded-full"></div>
      <div className="absolute top-1/2 left-2 w-1 h-12 bg-white/35 rounded-full transform -rotate-12"></div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const user = useContext(MyUserContext);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalRatings: 0,
    activeLoans: 0,
  });

  const fetchBooks = async () => {
    try {
      const res = await Apis.get("/books/");
      const sortedBooks = res.data
        .sort((a, b) => b.average_rating - a.average_rating)
        .slice(0, 10); // Get top 10 books by rating
      setBooks(sortedBooks);

      // Update stats based on books data
      setStats((prev) => ({
        ...prev,
        totalBooks: res.data.length,
        totalRatings: res.data.reduce(
          (sum, book) => sum + (book.rating_count || 0),
          0
        ),
      }));

      console.log(sortedBooks);
    } catch {
      console.log("Có lỗi khi tải danh sách sách");
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch additional statistics if available from API
      // Example API calls (adjust based on your actual endpoints):
      // const usersRes = await Apis.get("/users/count/");
      // const loansRes = await Apis.get("/loans/active/count/");

      // For now, using mock data - replace with actual API calls
      setStats((prev) => ({
        ...prev,
        totalUsers: 1250, // Replace with actual API call
        activeLoans: 420, // Replace with actual API call
      }));
    } catch {
      console.log("Có lỗi khi tải thống kê");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, []);

  const statsData = [
    {
      icon: "📚",
      number: stats.totalBooks.toLocaleString(),
      label: "Sách",
      description: "Tổng số đầu sách trong thư viện",
      gradient: "from-blue-600 via-blue-700 to-indigo-800",
      delay: 0,
    },
    {
      icon: "👥",
      number: stats.totalUsers.toLocaleString(),
      label: "Thành viên",
      description: "Cộng đồng độc giả tích cực",
      gradient: "from-emerald-500 via-teal-600 to-cyan-700",
      delay: 200,
    },
    {
      icon: "⭐",
      number: stats.totalRatings.toLocaleString(),
      label: "Đánh giá",
      description: "Phản hồi từ người đọc",
      gradient: "from-amber-500 via-orange-600 to-red-600",
      delay: 400,
    },
    {
      icon: "📖",
      number: stats.activeLoans.toLocaleString(),
      label: "Đang mượn",
      description: "Sách được mượn hiện tại",
      gradient: "from-purple-600 via-violet-700 to-purple-800",
      delay: 600,
    },
  ];

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
        <div className="w-full flex justify-center gap-x-6 md:gap-x-12 mt-8 px-4 md:mt-28 flex-wrap">
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

      <div className="relative w-full bg-white mt-20 md:mt-40">
        <div className="flex flex-col md:flex-row relative">
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

            <div className="flex flex-row md:mt-20">
              <div className="flex flex-col justify-end items-start md:ml-29 ml-5">
                <div
                  style={{ background: "#214E99" }}
                  className="inline-block w-fit h-fit md:flex md:items-center md:justify-center rounded-lg md:ml-10 flex-col mt-10 md:mt-0 md:w-20 md:h-20"
                >
                  <img
                    src={bookIcon2}
                    alt="Khám phá sách"
                    style={{ filter: "invert(100%) brightness(200%)" }}
                    className="w-15 h-15 object-cover rounded-lg shadow-lg"
                  />
                </div>
                <p className="md:ml-10 md:text-start font-bold text-10sm mt-5 text-lg">
                  Tài liệu học tập
                </p>
                <p className="md:ml-10 break-words md:text-start text-10sm font-semibold opacity-50">
                  Cung cấp tài liệu học tập phong phú cho học sinh và sinh viên
                </p>
              </div>

              <div className="flex flex-col justify-end items-start md:ml-29 ml-40">
                <div
                  style={{ background: "#214E99" }}
                  className="inline-block w-fit h-fit md:flex md:items-center md:justify-center rounded-lg md:ml-20 flex-col mt-10 md:mt-0 md:w-20 md:h-20"
                >
                  <img
                    src={bookIcon1}
                    alt="Khám phá sách"
                    style={{ filter: "invert(100%) brightness(200%)" }}
                    className="w-15 h-15 object-cover rounded-lg shadow-lg"
                  />
                </div>
                <p className="md:ml-20 md:text-start font-bold text-10sm mt-5 text-lg">
                  Tài liệu học tập
                </p>
                <p className="md:ml-20 break-words md:text-start text-10sm font-semibold opacity-50">
                  Cung cấp tài liệu học tập phong phú cho học sinh và sinh viên
                </p>
              </div>
            </div>
          </div>

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

        <div className="flex flex-row overflow-x-auto whitespace-nowrap bg-white px-4">
          {books.map((book) => (
            <Book
              key={book.id}
              title={book.title}
              description={book.description}
              image={book.image}
              author={book.author_id} // Adjust based on actual author data
              rating={book.average_rating}
            />
          ))}
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
