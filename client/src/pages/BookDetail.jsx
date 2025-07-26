import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Book2 from "../components/layouts/Book2";
import { useParams } from "react-router-dom";
import { Apis, authApis } from "../configs/Apis";

const BookDetail = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState(null);

  const fetchBookFromBookId = async () => {
    try {
      let res = await authApis().get(`/books/${bookId}`);
      setBook(res.data); // <-- set state
    } catch (error) {
      console.log("Có lỗi ", error);
    }
  };

  const fetchUserByUserId = async (userId) => {
    try {
      let res = await authApis().get(`/users/${userId}`);
      return res.data;
    } catch {
      console.log("Có lỗi khi lấy dữ liệu tác giả");
      return { name: "Ẩn danh" };
    }
  };

  const fetchAuthorByAuthorId = async () => {
    try {
      console.log(book.author_id);
      let res = await authApis().get(`/authors/${book.author_id}`);
      console.log(res.data);
      setAuthor(res.data);
    } catch {
      console.log("Có lỗi khi lấy dữ liệu tác giả");
    }
  };

  const fetchComment = async () => {
    try {
      let res = await authApis().get(`/books/${bookId}/comments`);
      const commentData = res.data;

      const commentsWithUser = await Promise.all(
        commentData.map(async (cmt) => {
          const user = await fetchUserByUserId(cmt.user_id);
          return { ...cmt, firstname: user.firstname, lastname: user.lastname };
        })
      );
      setComments(commentsWithUser);
    } catch {
      console.log("Có lỗi khi lấy dữ liệu bình luận");
      setComments([]);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetchBookFromBookId();
      await fetchComment();
    };
    fetchData();
  }, [bookId]);

  useEffect(() => {
    if (book?.author_id) {
      fetchAuthorByAuthorId(book.author_id);
    }
  }, [book]);

  //Nếu chưa có book thì hiện như trên tránh lần render đầu tiên book là null vì khai báo book là null
  if (!book) {
    return <div>Đang tải dữ liệu sách...</div>;
  }

  if (!author) {
    return <div>Đang tải dữ liệu tác giả...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header quay lại */}
      <Link
        to="/books"
        className="flex flex-row items-center w-full h-16 border-b bg-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 ml-5 md:ml-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#214E99"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <h2 className="text-[#214E99] ml-3 font-semibold text-lg md:text-xl">
          Quay lại
        </h2>
      </Link>
      <div className="w-full flex-col md:flex-row min-h-screen bg-white flex justify-start mb-20">
        {/* Nội dung chính */}
        <div className="max-w-5xl border rounded-2xl border-gray-200 shadow-2xl md:mt-10 w-full md:mr-10 md:ml-50 px-4 py-6">
          {/* Thông tin sách */}
          <div className="bg-white p-6 rounded-xl">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Ảnh sách */}
              <div className="w-full h-80 md:w-64 md:h-96 flex-shrink-0 flex justify-center items-center">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Thông tin chi tiết */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      {book.title}
                    </h1>
                    <p className="text-gray-600 mt-1">Bởi {author.name}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < 4 ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-700 font-medium">
                        {book.average_rating}
                      </span>
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="flex flex-col items-center gap-3">
                    <button className="bg-[#214E99] text-white px-5 py-2 rounded-lg hover:bg-[#1a3f7c] text-sm font-medium">
                      Thêm vào giỏ
                    </button>
                    <button className="flex items-center text-gray-600 text-sm">
                      <svg
                        className="w-5 h-5 text-gray-600 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      Yêu thích
                    </button>
                  </div>
                </div>

                {/* Mô tả ngắn */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Thông tin xuất bản */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Ngôn ngữ:</span> Tiếng
                    Việt
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">ISBN:</span>{" "}
                    978-604-2-12345-6
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Ngày xuất bản:</span>{" "}
                    12/07/2002
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Đánh giá */}
          <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Đánh giá (4)</h3>
              <button className="bg-[#214E99] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a3f7c]">
                Thêm đánh giá
              </button>
            </div>

            {comments.length > 0 ? (
              comments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="py-4 border-t border-gray-200 first:border-t-0"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">
                      {cmt.firstname && cmt.lastname
                        ? `${cmt.firstname} ${cmt.lastname}`
                        : `Người dùng #${cmt.user_id}`}
                    </p>
                    <span className="text-sm text-gray-500">
                      {new Date(cmt.created_date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, starIdx) => (
                      <svg
                        key={starIdx}
                        className={`w-4 h-4 ${
                          starIdx < cmt.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{cmt.content}</p>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic text-sm mt-2">
                Chưa có ai bình luận cả 🥲
              </div>
            )}
          </div>
        </div>
        <div className="w-[90%] md:w-[20%] mx-auto md:mx-0 border rounded-2xl mt-10 border-gray-200 bg-white p-4 h-fit md:ml-10 md:mr-50 md:mt-20">
          <h3 className="text-lg font-semibold mb-4">Sách liên quan</h3>
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((_, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-12 h-16 bg-gray-300 rounded-md" />
                <div className="flex flex-col justify-between">
                  <h4 className="text-sm font-semibold text-gray-800">
                    Tiếng Việt 1
                  </h4>
                  <p className="text-xs text-gray-500">Nguyễn Văn A</p>
                  <div className="flex items-center text-xs text-yellow-500">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    4.6
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className="w-full h-[1px] bg-gray-300 my-4 border-none mt-15" />
    </div>
  );
};

export default BookDetail;
