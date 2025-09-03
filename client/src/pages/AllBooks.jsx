import React, { useEffect, useState } from "react";
import Book2 from "../components/layouts/Book2";
import { Apis } from "../configs/Apis";
import { useSearchParams } from "react-router-dom";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [cates, setCates] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [searchParams] = useSearchParams();

  // Hàm lấy danh sách sách liên quan
  const getRelatedBooks = (book) => {
    return books
      .filter(
        (b) =>
          b.id !== book.id &&
          (b.author_id === book.author_id || b.category_id === book.category_id)
      )
      .slice(0, 4); // Giới hạn lấy 4 cuốn sách liên quan
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await Apis.get("/categories/");
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
      const res = await Apis.get("/books/");
      setBooks(res.data);
    } catch {
      setLoading(false);
      console.log("Có lỗi khi tải danh sách sách");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthor = async () => {
    setLoading(true);
    try {
      const res = await Apis.get("/authors");
      setAuthors(res.data);
    } catch {
      setLoading(false);
      console.log("Có lỗi khi tải danh sách tác giả");
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = (query, category, author) => {
    let filtered = [...books];

    if (query.trim()) {
      const trimmedQuery = query.trim().toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title?.toLowerCase().includes(trimmedQuery) ||
          book.author?.toLowerCase().includes(trimmedQuery) ||
          book.description?.toLowerCase().includes(trimmedQuery)
      );
    }

    if (category && category !== "") {
      filtered = filtered.filter(
        (book) =>
          book.category?.id === category.id ||
          book.category?.name === category.name ||
          book.category_id === category.id
      );
    }

    if (author && author !== "") {
      filtered = filtered.filter(
        (book) =>
          book.author?.id === author.id ||
          book.author?.name === author.name ||
          book.author_id === author.id
      );
    }

    return filtered;
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const filtered = filterBooks(searchQuery, category, selectedAuthor);
    setFilteredBooks(filtered);
    setIsSearched(
      searchQuery.trim() !== "" || category !== "" || selectedAuthor !== ""
    );
    if (window.innerWidth < 768) {
      setShowMobileFilters(false);
    }
  };

  const handleAuthorSelect = (author) => {
    setSelectedAuthor(author);
    const filtered = filterBooks(searchQuery, selectedCategory, author);
    setFilteredBooks(filtered);
    setIsSearched(
      searchQuery.trim() !== "" || selectedCategory !== "" || author !== ""
    );
    if (window.innerWidth < 768) {
      setShowMobileFilters(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedAuthor("");
    setFilteredBooks([]);
    setIsSearched(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchBooks();
    fetchAuthor();
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
      const filtered = filterBooks(q, selectedCategory, selectedAuthor);
      setIsSearched(true);
      setFilteredBooks(filtered);
    }
  }, [books, searchParams, selectedCategory, selectedAuthor]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (
      trimmedQuery === "" &&
      selectedCategory === "" &&
      selectedAuthor === ""
    ) {
      resetFilters();
      return;
    }
    setIsSearched(true);
    const filtered = filterBooks(
      trimmedQuery,
      selectedCategory,
      selectedAuthor
    );
    setFilteredBooks(filtered);
  };

  const displayBooks = isSearched ? filteredBooks : books;

  const getDisplayCount = () => {
    if (isSearched) {
      return filteredBooks.length;
    }
    return books.length;
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
      {!loading && (
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

          {(searchQuery.trim() || selectedCategory || selectedAuthor) && (
            <div className="max-w-2xl mx-auto mt-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Đang lọc:</span>
                {searchQuery.trim() && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Từ khóa: "{searchQuery}"
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        const filtered = filterBooks(
                          "",
                          selectedCategory,
                          selectedAuthor
                        );
                        setFilteredBooks(filtered);
                        setIsSearched(
                          selectedCategory !== "" || selectedAuthor !== ""
                        );
                      }}
                      className="ml-2 text-blue-900 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Thể loại: {selectedCategory.name}
                    <button
                      onClick={() => {
                        setSelectedCategory("");
                        const filtered = filterBooks(
                          searchQuery,
                          "",
                          selectedAuthor
                        );
                        setFilteredBooks(filtered);
                        setIsSearched(
                          searchQuery.trim() !== "" || selectedAuthor !== ""
                        );
                      }}
                      className="ml-2 text-green-900 hover:text-green-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedAuthor && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Tác giả: {selectedAuthor.name}
                    <button
                      onClick={() => {
                        setSelectedAuthor("");
                        const filtered = filterBooks(
                          searchQuery,
                          selectedCategory,
                          ""
                        );
                        setFilteredBooks(filtered);
                        setIsSearched(
                          searchQuery.trim() !== "" || selectedCategory !== ""
                        );
                      }}
                      className="ml-2 text-purple-900 hover:text-purple-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-red-600 text-sm hover:text-red-800 underline"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          )}

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

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <div
              className={`${
                showMobileFilters ? "block" : "hidden"
              } md:block w-full md:w-1/6 md:ml-20 rounded-lg shadow p-4 h-fit`}
            >
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                Danh mục sách
              </h2>
              <ul className="text-sm space-y-2">
                <li>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-md transition-all ${
                      selectedCategory === ""
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => handleCategorySelect("")}
                  >
                    Tất cả sách
                  </button>
                </li>
                {cates.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-md transition-all ${
                        selectedCategory?.id === category.id
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category.name}
                      {category.books_count && (
                        <span className="text-gray-400 text-xs ml-2">
                          ({category.books_count})
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-700">
                  Tác giả
                </h2>
                <ul className="text-sm space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-md transition-all ${
                        selectedAuthor === ""
                          ? "bg-purple-100 text-purple-700 font-medium"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => handleAuthorSelect("")}
                    >
                      Tất cả tác giả
                    </button>
                  </li>
                  {authors.map((author) => (
                    <li key={author.id}>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-md transition-all ${
                          selectedAuthor?.id === author.id
                            ? "bg-purple-100 text-purple-700 font-medium"
                            : "hover:bg-gray-100 text-gray-600"
                        }`}
                        onClick={() => handleAuthorSelect(author)}
                      >
                        {author.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full md:w-3/4">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {selectedCategory ? selectedCategory.name : "Tất cả sách"}
                      <span className="text-gray-500 font-normal ml-2">
                        ({getDisplayCount()})
                      </span>
                    </h3>
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
                {displayBooks.length > 0 ? (
                  displayBooks.map((book) => (
                    <Book2
                      key={book.id}
                      book={book}
                      relatedBooks={getRelatedBooks(book)} // Truyền sách liên quan
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 text-lg py-10">
                    {isSearched ? (
                      <>
                        Không tìm thấy sách nào phù hợp với tiêu chí lọc
                        {searchQuery && (
                          <span className="block mt-2">
                            Từ khóa: "{searchQuery}"
                          </span>
                        )}
                        {selectedCategory && (
                          <span className="block mt-2">
                            Thể loại: {selectedCategory.name}
                          </span>
                        )}
                        {selectedAuthor && (
                          <span className="block mt-2">
                            Tác giả: {selectedAuthor.name}
                          </span>
                        )}
                      </>
                    ) : (
                      "Chưa có sách nào trong thư viện"
                    )}
                  </div>
                )}
              </div>
              {displayBooks.length > 0 && (
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
              )}
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
      <hr className="w-full h-[1px] md:mt-20 bg-gray-300 my-4 border-none" />
    </div>
  );
};

export default AllBooks;
