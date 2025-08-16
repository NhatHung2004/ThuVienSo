import React, { useContext, useEffect, useState } from "react";
import {
  FaBookOpen,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTimes,
} from "react-icons/fa";
import { Apis, authApis } from "../configs/Apis";
import { MyUserContext } from "../configs/MyContext";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  RETURNED: "bg-blue-100 text-blue-700",
  OVERDUE: "bg-red-100 text-red-700",
};

const statusLabels = {
  PENDING: "Đang xử lý",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
  RETURNED: "Đã trả",
  OVERDUE: "Quá hạn",
};

const HistoryReq = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestBooks, setRequestBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const user = useContext(MyUserContext);

  const fetchHistoryRequest = async () => {
    try {
      setLoading(true);
      console.log(user.id);
      const res = await authApis().get(`users/${user.id}/requests`);
      console.log("API Response:", res.data);

      // Kiểm tra xem res.data có phải là array không
      if (Array.isArray(res.data)) {
        setRequests(res.data);
      } else if (res.data && typeof res.data === "object") {
        // Nếu API trả về một object, có thể là object single request
        // Hoặc object chứa array requests
        if (res.data.requests && Array.isArray(res.data.requests)) {
          setRequests(res.data.requests);
        } else {
          // Nếu là một request object đơn lẻ, wrap nó trong array
          setRequests([res.data]);
        }
      } else {
        console.log("API response không đúng định dạng:", res.data);
        setRequests([]);
      }
    } catch (err) {
      console.log("Lỗi khi fetch requests:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookByBookId = async (bookId) => {
    try {
      const res = await authApis().get(`/books/${bookId}`);
      return res.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const handleViewDetails = async (request) => {
    setSelectedRequest(request);
    setShowModal(true);
    setLoadingBooks(true);
    setRequestBooks([]);

    try {
      // Lấy thông tin chi tiết từng cuốn sách
      const bookPromises = request.books.map(async (bookItem) => {
        const bookData = await fetchBookByBookId(bookItem.book_id);
        return {
          ...bookData,
          quantity: bookItem.quantity,
        };
      });

      const booksData = await Promise.all(bookPromises);
      const validBooks = booksData.filter((book) => book !== null);
      setRequestBooks(validBooks);
    } catch (err) {
      console.log("Lỗi khi lấy thông tin sách:", err);
    } finally {
      setLoadingBooks(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setRequestBooks([]);
  };

  useEffect(() => {
    if (user?.id) {
      fetchHistoryRequest();
    }
  }, [user]);

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      statusFilter === "Tất cả" || request.status === statusFilter;

    // Tìm kiếm theo request_id hoặc có thể mở rộng thêm
    const matchesSearch =
      request.request_id.toString().includes(search) ||
      request.status.toLowerCase().includes(search.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };
  return (
    <div className="w-full min-h-screen bg-gray-50 py-10">
      <div className="w-full h-fit">
        <img
          src="https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg"
          className="w-full h-[200px] object-cover"
          alt="Library"
        />
      </div>

      {/* Tiêu đề */}
      <div className="relative w-full p-6 md:mt-10">
        <h1
          style={{ color: "#214E99" }}
          className="md:text-4xl font-bold text-blue-600 text-center text-2xl"
        >
          Lịch sử yêu cầu mượn sách
        </h1>
      </div>

      <div className="w-full px-4 md:px-10 lg:px-20 xl:px-32 2xl:px-48">
        {/* Bộ lọc */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
            <FaBookOpen /> Bộ lọc và tìm kiếm
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="🔍 Tìm theo mã yêu cầu hoặc trạng thái..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-2/3 px-4 py-2 border rounded-md shadow-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-1/3 px-4 py-2 border rounded-md shadow-sm"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="PENDING">Đang xử lý</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Bị từ chối</option>
              <option value="RETURNED">Đã trả</option>
              <option value="OVERDUE">Quá hạn</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Danh sách */}
        {!loading && (
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-blue-50 rounded-t-xl">
              <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                📚 Danh sách yêu cầu mượn sách
              </h2>
              <span className="text-sm text-gray-600">
                Tổng cộng {filteredRequests.length} yêu cầu
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <table className="w-full text-sm text-gray-700">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-6 py-3">Mã yêu cầu</th>
                      <th className="px-6 py-3 whitespace-nowrap">
                        Ngày yêu cầu
                      </th>
                      <th className="px-6 py-3 whitespace-nowrap">Hạn trả</th>
                      <th className="px-6 py-3 whitespace-nowrap">
                        Số lượng sách
                      </th>
                      <th className="px-6 py-3 whitespace-nowrap">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-6 text-center text-gray-500"
                        >
                          Không tìm thấy yêu cầu nào.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((request) => (
                        <tr
                          key={request.request_id}
                          className="border-t hover:bg-gray-50 transition"
                        >
                          {/* Mã yêu cầu */}
                          <td className="px-6 py-4">
                            <span className="font-medium text-blue-600">
                              #{request.request_id}
                            </span>
                          </td>

                          {/* Ngày yêu cầu */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(request.request_date)}
                          </td>

                          {/* Hạn trả */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(request.return_date)}
                          </td>

                          {/* Số lượng sách */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-blue-100 ml-4 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                              {request.books.reduce(
                                (total, book) => total + book.quantity,
                                0
                              )}{" "}
                              cuốn
                            </span>
                          </td>

                          {/* Trạng thái */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                statusStyles[request.status] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {statusLabels[request.status] || request.status}
                            </span>
                          </td>

                          {/* Hành động */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="text-blue-600 hover:underline text-sm font-medium"
                            >
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal chi tiết */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-blue-50">
              <h3 className="text-xl font-bold text-blue-700">
                Chi tiết yêu cầu #{selectedRequest?.request_id}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Thông tin yêu cầu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <p>
                    <strong>Ngày yêu cầu:</strong>{" "}
                    {formatDate(selectedRequest?.request_date)}
                  </p>
                  <p>
                    <strong>Hạn trả:</strong>{" "}
                    {formatDate(selectedRequest?.return_date)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Trạng thái:</strong>
                    <span
                      className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[selectedRequest?.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[selectedRequest?.status] ||
                        selectedRequest?.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Danh sách sách */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Danh sách sách ({selectedRequest?.books.length} loại sách)
                </h4>

                {loadingBooks ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">
                      Đang tải thông tin sách...
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requestBooks.map((book, index) => (
                      <div
                        key={book.id || index}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <img
                          src={
                            book.image || "https://via.placeholder.com/80x120"
                          }
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded border flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800 mb-2">
                            {book.title}
                          </h5>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Tác giả:</strong>{" "}
                            {book.author || "Không có thông tin"}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Thể loại:</strong>{" "}
                            {book.category?.name || "Không có thông tin"}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>ISBN:</strong> {book.isbn || "Không có"}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                            SL: {book.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryReq;
