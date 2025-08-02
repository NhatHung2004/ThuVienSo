import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Book2 from "../components/layouts/Book2";
import { useParams } from "react-router-dom";
import { Apis, authApis } from "../configs/Apis";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../configs/MyContext";

const BookDetail = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState(null);
  const user = useContext(MyUserContext);
  const navigate = useNavigate();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");

  const fetchBookFromBookId = async () => {
    try {
      let res = await Apis.get(`/books/${bookId}`);
      setBook(res.data);
    } catch (error) {
      console.log("Có lỗi ", error);
    }
  };

  const fetchUserByUserId = async (userId) => {
    try {
      let res = await Apis.get(`/users/${userId}`);
      return res.data;
    } catch {
      console.log("Có lỗi khi lấy dữ liệu người dùng");
      return { name: "Ẩn danh" };
    }
  };

  const fetchAuthorByAuthorId = async () => {
    try {
      let res = await Apis.get(`/authors/${book.author_id}`);
      setAuthor(res.data);
    } catch {
      console.log("Có lỗi khi lấy dữ liệu tác giả");
    }
  };

  const fetchComment = async () => {
    try {
      console.log(bookId);
      let res = await Apis.get(`/books/${bookId}/comments`);
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

  const addComment = async () => {
    if (user === null) {
      alert("Bạn cần đăng nhập để có thể để lại bình luận!!!");
      return;
    }

    if (reviewRating === 0 || reviewContent.trim() === "") {
      alert("Vui lòng nhập đánh giá và nội dung trước khi gửi.");
      return;
    }
    try {
      const res = await authApis().post(`/books/${bookId}/comments`, {
        content: reviewContent,
        user_id: user.id,
        rating: reviewRating,
      });
      if (res != null) {
        alert("Thêm bình luận thành công !!!");
        await fetchComment();
        setShowReviewForm(false);
        setReviewRating(0);
        setReviewContent("");
      } else {
        console.log("Thêm bình luận thất bại !!!");
      }
    } catch (err) {
      console.log("Đã có lỗi xảy ra " + err);
      alert("Thêm bình luận thất bại !!!");
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

  if (!book || !author) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {!book ? "Đang tải dữ liệu sách..." : "Đang tải dữ liệu tác giả..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center w-full h-16 px-4 md:px-8 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <h2 className="ml-3 font-semibold text-lg text-blue-600 ">
            Quay lại
          </h2>
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
            {/* Book Info Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Book Image */}
                  <div className="lg:col-span-1">
                    <div className="relative group">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-80 md:h-96 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h1 className="text-3xl md:text-[33px] font-bold text-gray-900 mb-2 leading-tight">
                        {book.title}
                      </h1>
                      <p className="text-xl text-blue-600 font-medium mb-4">
                        Bởi {author.name}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-6">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-6 h-6 ${
                                i < Math.floor(book.average_rating || 0)
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
                        <span className="text-lg font-semibold text-gray-700">
                          {book.average_rating
                            ? book.average_rating.toFixed(1)
                            : "Chưa có đánh giá"}
                        </span>
                        <span className="text-gray-500">
                          ({comments.length} đánh giá)
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                          <svg
                            className="w-5 h-5 inline mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h12M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                            />
                          </svg>
                          Thêm vào giỏ
                        </button>
                        <button className="border-2 border-red-200 text-red-600 px-8 py-3 rounded-xl font-semibold hover:bg-red-50 hover:border-red-300 transition-all duration-200">
                          <svg
                            className="w-5 h-5 inline mr-2"
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

                    {/* Description */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-900">
                        Mô tả
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {book.description}
                      </p>
                    </div>

                    {/* Book Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-blue-600 font-semibold text-sm mb-1">
                          Ngôn ngữ
                        </div>
                        <div className="text-gray-900 font-medium">
                          Tiếng Việt
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-green-600 font-semibold text-sm mb-1">
                          ISBN
                        </div>
                        <div className="text-gray-900 font-medium">
                          978-604-2-12345-6
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <div className="text-purple-600 font-semibold text-sm mb-1">
                          Xuất bản
                        </div>
                        <div className="text-gray-900 font-medium">
                          12/07/2002
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                    Đánh giá & Nhận xét ({comments.length})
                  </h3>
                  {!showReviewForm ? (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      <svg
                        className="w-5 h-5 inline mr-2"
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
                      Viết đánh giá
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowReviewForm(false);
                        setReviewRating(0);
                        setReviewContent("");
                      }}
                      className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200"
                    >
                      Hủy bỏ
                    </button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <h4 className="text-xl font-bold mb-6 text-gray-900">
                      Chia sẻ đánh giá của bạn
                    </h4>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Đánh giá của bạn *
                      </label>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setReviewRating(idx + 1)}
                            className="focus:outline-none transform hover:scale-110 transition-transform duration-150"
                          >
                            <svg
                              className={`w-8 h-8 ${
                                idx < reviewRating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              } hover:text-yellow-400 transition-colors duration-150`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                        <span className="ml-2 text-lg font-semibold text-gray-700">
                          {reviewRating > 0
                            ? `${reviewRating}/5 sao`
                            : "Chọn số sao"}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Nội dung đánh giá *
                      </label>
                      <textarea
                        className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                        rows={4}
                        placeholder="Chia sẻ cảm nhận của bạn về cuốn sách này..."
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={addComment}
                      disabled={
                        reviewRating === 0 || reviewContent.trim() === ""
                      }
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      <svg
                        className="w-5 h-5 inline mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Gửi đánh giá
                    </button>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.length > 0 ? (
                    comments.map((cmt, index) => (
                      <div
                        key={cmt.id}
                        className={`p-6 rounded-2xl ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-blue-50"
                        } border border-gray-100 hover:shadow-md transition-shadow duration-200`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                          <div className="flex items-center gap-3 mb-2 sm:mb-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {cmt.firstname
                                ? cmt.firstname.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {cmt.firstname && cmt.lastname
                                  ? `${cmt.firstname} ${cmt.lastname}`
                                  : `Người dùng #${cmt.user_id}`}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
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
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                            {new Date(cmt.created_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed pl-0 sm:pl-13">
                          {cmt.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">
                        Chưa có đánh giá nào
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Hãy là người đầu tiên chia sẻ cảm nhận về cuốn sách này!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Books */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                Sách liên quan
              </h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                  >
                    <div className="w-16 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0 group-hover:shadow-md transition-shadow duration-200" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate group-hover:text-blue-600 transition-colors duration-200">
                        Tiếng Việt {idx + 1}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2 truncate">
                        Nguyễn Văn A
                      </p>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-yellow-400 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-gray-600 font-medium">
                          4.{6 + idx}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
