import React, { useEffect, useState } from "react";
import Book2 from "../components/layouts/Book2";
import LoginRequire from "../components/layouts/LoginRequire";
import { Apis, authApis } from "../configs/Apis";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [cates, setCates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await authApis().get("/categories/");
      setCates(res.data);
    } catch {
      setLoading(false);
      console.log("Có lỗi khi tải danh sách sách phân loại");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await authApis().get("/books/");
      setBooks(res.data);
    } catch {
      setLoading(false);
      console.log("Có lỗi khi tải danh sách sách");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedQuery = searchQuery.trim().toLowerCase();

    if (trimmedQuery === "") {
      // Nếu ô tìm kiếm rỗng thì reset lại search
      setIsSearched(false);
      setFilteredBooks([]);
      return;
    }

    setIsSearched(true); // Có thực hiện tìm kiếm

    const filtered = books.filter((book) =>
      book.title?.toLowerCase().includes(trimmedQuery)
    );

    setFilteredBooks(filtered);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <div className="w-full h-fit">
        <img
          src="https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg"
          className="w-full h-[200px] object-cover"
          alt="Library"
        />
      </div>

      <div className="relative w-full p-6 md:mt-10">
        <h1
          style={{ color: "#214E99" }}
          className="md:text-4xl font-bold text-blue-600 text-center text-2xl"
        >
          Tri thức mở
          <br />
          Kết nối không giới hạn
        </h1>
        <p className="md:text-lg text-sm text-gray-400 text-center mt-7 font-semibold">
          Tất cả những đầu sách có trong thư viện, tìm kiếm sách bạn cần.
        </p>

        {/* Thanh tìm kiếm */}
        <div className="max-w-2xl mx-auto mt-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sách, tác giả, thể loại..."
              className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Nút hiển thị bộ lọc trên mobile */}
        <div className="md:hidden mt-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            {showMobileFilters ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
          </button>
        </div>

        <div className=" flex flex-col md:flex-row gap-6 mt-6">
          {/* Bộ lọc danh mục - Sidebar bên trái */}
          <div
            className={`${
              showMobileFilters ? "block" : "hidden"
            } md:block w-full  md:w-1/6 md:ml-20 rounded-lg shadow p-4 h-fit`}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Danh mục sách
            </h2>
            <ul className="text-sm space-y-2">
              {cates.map((category) => (
                <li key={category}>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-md transition-all ${
                      selectedCategory === category
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => {
                      setSelectedCategory(category);
                      if (window.innerWidth < 768) setShowMobileFilters(false);
                    }}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
            {/* Bộ lọc tác giả
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">Tác giả</h3>
              <div className="max-h-60 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
                {authors
                  .slice(0, showMoreAuthors ? authors.length : 7)
                  .map((author) => (
                    <div key={author} className="flex items-center">
                      <input
                        type="checkbox"
                        id={author}
                        checked={selectedAuthors.includes(author)}
                        onChange={() => toggleAuthor(author)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={author}
                        className="ml-2 text-gray-700 cursor-pointer truncate"
                      >
                        {author}
                      </label>
                    </div>
                  ))}
                {authors.length > 7 && !showMoreAuthors && (
                  <button
                    className="text-blue-600 text-sm mt-2 flex items-center"
                    onClick={() => setShowMoreAuthors(true)}
                  >
                    Xem thêm
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div> */}
            {/* Bộ lọc khoảng giá
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">Khoảng giá</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <div key={range.value} className="flex items-center">
                    <input
                      type="radio"
                      id={range.value}
                      name="price-range"
                      checked={selectedPriceRange === range.value}
                      onChange={() => handlePriceRangeChange(range.value)}
                      className="h-4 w-4 text-blue-600 rounded-full focus:ring-blue-500"
                    />
                    <label
                      htmlFor={range.value}
                      className="ml-2 text-gray-700 cursor-pointer"
                    >
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div> */}
            {/* Bộ lọc bổ sung */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">Lọc theo</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="new-books"
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="new-books"
                    className="ml-2 text-gray-700 cursor-pointer"
                  >
                    Sách mới nhất
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="high-rated"
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="high-rated"
                    className="ml-2 text-gray-700 cursor-pointer"
                  >
                    Được đánh giá cao
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="available"
                    className="ml-2 text-gray-700 cursor-pointer"
                  >
                    Có sẵn để mượn
                  </label>
                </div>
              </div>
            </div>
            {/* Nút xóa bộ lọc
            {(selectedAuthors.length > 0 || selectedPriceRange) && (
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSelectedAuthors([]);
                    setSelectedPriceRange("");
                  }}
                  className="w-full py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )} */}
          </div>

          {/* Danh sách sách - Nội dung chính bên phải */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedCategory === "All Books"
                      ? "Tất cả sách"
                      : selectedCategory}
                    <span className="text-gray-500 font-normal ml-2">
                      ({books.length})
                    </span>
                  </h3>

                  {/* Hiển thị các bộ lọc đã chọn
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedAuthors.map((author) => (
                      <span
                        key={author}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {author}
                        <button
                          onClick={() => toggleAuthor(author)}
                          className="ml-2 text-blue-900 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {selectedPriceRange && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                        {
                          priceRanges.find(
                            (r) => r.value === selectedPriceRange
                          )?.label
                        }
                        <button
                          onClick={() => setSelectedPriceRange("")}
                          className="ml-2 text-green-900 hover:text-green-700"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div> */}
                </div>

                <div className="mt-3 md:mt-0">
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2 text-sm md:text-base">
                      Sắp xếp:
                    </span>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Mới nhất</option>
                      <option>Được đánh giá cao</option>
                      <option>A-Z</option>
                      <option>Z-A</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isSearched ? (
                filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <Book2 key={book.id} book={book} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 text-lg py-10">
                    Không tìm thấy sách nào phù hợp với "{searchQuery}"
                  </div>
                )
              ) : (
                books.map((book) => <Book2 key={book.id} book={book} />)
              )}
            </div>

            {/* Phân trang */}
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <button className="px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Trước
                </button>
                <button className="px-4 py-2 border border-r-0 border-gray-300 bg-blue-600 text-white text-sm font-medium">
                  1
                </button>
                <button className="px-4 py-2 border border-r-0 border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border border-r-0 border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-r-md">
                  Sau
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <hr className="w-full h-[1px] md:mt-20 bg-gray-300 my-4 border-none" />
    </div>
  );
};

export default AllBooks;
