import React, { useState, useContext, useEffect } from "react";
import { authApis, Apis } from "../configs/Apis";
import { MyUserContext } from "../configs/MyContext";

const Cart = () => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const user = useContext(MyUserContext);
  const [selectAll, setSelectAll] = useState(false);
  const [cart, setCart] = useState([]);
  const [books, setbooks] = useState([]);

  const fetchBookByBookId = async (bookId) => {
    try {
      const res = await authApis().get(`/books/${bookId}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAuthorByAuthorId = async (author_id) => {
    try {
      let res = await Apis.get(`/authors/${author_id}`);
      return res.data;
    } catch {
      console.log("Có lỗi khi lấy dữ liệu tác giả");
    }
  };

  const fetchCart = async () => {
    try {
      const res = await authApis().get(`/users/${user.id}/cart`);
      setCart(res.data);
      const booksData = await Promise.all(
        res.data.items.map(async (item) => {
          const book = await fetchBookByBookId(item.book_id);
          const author = await fetchAuthorByAuthorId(book.author_id);
          return {
            id: book.id,
            title: book.title,
            author: author.name || "Không rõ",
            date: new Date().toLocaleDateString(),
            category: book.category_id || "Chưa phân loại",
            image: book.image,
            quantity: item.quantity,
          };
        })
      );
      console.log(booksData);
      setbooks(booksData);
    } catch (err) {
      console.log(err);
    }
  };

  const sendRequest = async () => {
    try {
      const selectedBooksData = books
        .filter((item) => selectedItems.has(item.id))
        .map((item) => ({
          book_id: item.id,
          quantity: item.quantity,
        }));
      if (selectedBooksData.length === 0) {
        alert("Bạn chưa chọn cuốn nào cả!");
        return;
      }

      const payload = {
        user_id: user.id,
        books: selectedBooksData,
      };

      // Gửi request mượn sách
      const res = await authApis().post("/requests/", payload);
      console.log("Request thành công: ", res.data);

      // (Tuỳ chọn) Xoá sách khỏi giỏ hàng sau khi mượn
      for (const book of selectedBooksData) {
        await authApis().patch(`/carts/`, {
          cart_id: cart.cart_id,
          book_id: book.book_id,
          quantity: book.quantity,
        });
      }
      alert("Mượn sách thành công!");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = (id, change) => {
    setbooks(
      books.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // const handleRemoveItem = (id) => {
  //   setItems(items.filter((item) => item.id !== id));
  //   setSelectedItems((prev) => {
  //     const newSet = new Set(prev);
  //     newSet.delete(id);
  //     return newSet;
  //   });
  // };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(books.map((item) => item.id)));
    }
    setSelectAll(!selectAll);
  };

  const totalBooks = books.reduce((sum, item) => sum + item.quantity, 0);
  const selectedBooks = books
    .filter((item) => selectedItems.has(item.id))
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Banner */}
      <div className="w-full h-32 md:h-40 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg"
          className="w-full h-full object-cover"
          alt="Library"
        />
      </div>

      {/* Title Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-center">
          <svg
            className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8l1.1 5.9A2 2 0 008 21h8a2 2 0 001.9-1.1L19 13.9M7 13v4a2 2 0 002 2h2a2 2 0 002-2v-4M13 9V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2"
            />
          </svg>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-gray-800">
            Giỏ hàng
          </h1>
          <p className="text-base md:text-lg mt-1 text-gray-600">
            Quản lý sách bạn muốn mượn
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items Section */}
          <div className="flex-1 space-y-6">
            {/* Select All */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      selectAll
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300 group-hover:border-blue-400"
                    }`}
                  >
                    {selectAll && (
                      <svg
                        className="w-3 h-3 text-white mx-auto mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-3 font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  Chọn tất cả sách ({books.length})
                </span>
              </label>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {books.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <div className="flex items-start pt-2">
                        <label className="cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => handleSelectItem(item.id)}
                              className="sr-only"
                            />
                            <div
                              className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                                selectedItems.has(item.id)
                                  ? "bg-blue-600 border-blue-600"
                                  : "border-gray-300 group-hover:border-blue-400"
                              }`}
                            >
                              {selectedItems.has(item.id) && (
                                <svg
                                  className="w-3 h-3 text-white mx-auto mt-0.5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>

                      {/* Book Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-32 h-44 md:w-36 md:h-48 object-cover rounded-xl shadow-lg"
                        />
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 space-y-3 min-w-0">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
                          {item.title}
                        </h3>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span className="font-medium">Tác giả:</span>
                            <span className="truncate">{item.author}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                              />
                            </svg>
                            <span className="font-medium">Ngày thêm:</span>
                            <span>{item.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                            <span className="font-medium">Thể loại:</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs whitespace-nowrap">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="p-2 hover:bg-gray-200 transition-colors duration-200"
                              disabled={item.quantity <= 1}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="px-3 py-2 font-semibold min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="p-2 hover:bg-gray-200 transition-colors duration-200"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {books.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Giỏ hàng trống
                </h3>
                <p className="text-gray-500">
                  Bạn chưa có sách nào trong giỏ hàng
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <h2 className="text-xl font-bold text-center">
                  TÓM TẮT ĐƠN HÀNG
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">
                    Tổng số sách:
                  </span>
                  <span className="font-bold text-lg text-blue-600">
                    {totalBooks} cuốn
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Đã chọn:</span>
                  <span className="font-bold text-lg text-green-600">
                    {selectedBooks} cuốn
                  </span>
                </div>

                <div className="pt-4">
                  <button
                    onClick={sendRequest}
                    disabled={selectedBooks === 0}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                      selectedBooks > 0
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {selectedBooks > 0
                      ? `Mượn ${selectedBooks} sách đã chọn`
                      : "Chọn sách để mượn"}
                  </button>
                </div>

                {selectedBooks > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-700">
                      <span className="font-semibold">Lưu ý:</span> Bạn có thể
                      mượn tối đa 5 cuốn sách cùng lúc.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
