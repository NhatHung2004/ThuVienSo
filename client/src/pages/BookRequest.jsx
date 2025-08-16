"use client";

import { useContext, useEffect, useState } from "react";
import {
  Receipt,
  ClipboardList,
  FileBadge,
  BarChart2,
  Search,
  X,
  TrendingUp,
  Clock,
  Calendar,
  Phone,
  User,
  BookOpen,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  BanknoteArrowUp,
} from "lucide-react";
import Sidebar, { SidebarItem } from "../components/layouts/Sidebar";
import { Apis, authApis } from "../configs/Apis";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../configs/MyContext";

const BookRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const user = useContext(MyUserContext);
  const navigate = useNavigate();

  const fetchBookFromBookId = async (bookId) => {
    try {
      let res = await Apis.get(`/books/${bookId}`);
      return res.data;
    } catch (error) {
      console.log("Có lỗi ", error);
    }
  };

  const fetchUserFromUserId = async (userId) => {
    try {
      let res = await Apis.get(`/users/${userId}`);
      return res.data;
    } catch (error) {
      console.log("Có lỗi ", error);
    }
  };

  const fetchAllRequestsWithBooks = async () => {
    try {
      setLoading(true);
      const res = await authApis().get("/requests/");
      const requests = res.data;

      console.log(requests);

      const enrichedRequests = await Promise.all(
        requests.map(async (req) => {
          const booksWithDetails = await Promise.all(
            req.books.map(async (b) => {
              const bookData = await fetchBookFromBookId(b.book_id);
              return {
                id: b.book_id,
                quantity: b.quantity,
                ...bookData, // title, author, isbn
              };
            })
          );

          const userData = await fetchUserFromUserId(req.user_id);
          const borrowerName =
            userData.firstname || userData.lastname
              ? `${userData.firstname || ""} ${userData.lastname || ""}`.trim()
              : "Ẩn danh";

          return {
            id: req.id,
            borrower: {
              name: borrowerName,
              studentId: `SV${String(req.user_id).padStart(3, "0")}`,
              email: userData.email || "Không có dữ liệu",
              phone: req.phone,
              class: "Chưa rõ",
            },
            books: booksWithDetails,
            requestDate: req.request_date,
            expectedReturnDate: req.return_date,
            address: req.address,
            method: req.borrowing_method,
            job: req.job,
            number_date: req.number_of_requests_day,
            status: req.status.toLowerCase(),
            note: req.purpose,
            ward: req.ward,
            province: req.province,
            city: req.city,
          };
        })
      );
      setRequests(enrichedRequests);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu yêu cầu mượn sách:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllRequestsWithBooks();
  }, []);

  const handleApprove = (requestId) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "approved" } : req
      )
    );
  };

  const handleReject = (requestId) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" } : req
      )
    );
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      default:
        return "Không xác định";
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.borrower.studentId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar>
        <SidebarItem icon={<Receipt />} text="Quản lý sách" to="/book-manage" />
        <SidebarItem
          icon={<BanknoteArrowUp />}
          text="Duyệt mượn"
          to="/book-request"
        />
        <SidebarItem icon={<BarChart2 />} text="Thống kê" to="/stat" />
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Duyệt yêu cầu mượn sách
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý và duyệt các yêu cầu mượn sách từ sinh viên
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-600 font-medium">
                  {
                    filteredRequests.filter((r) => r.status === "pending")
                      .length
                  }{" "}
                  yêu cầu chờ duyệt
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã sinh viên..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-12 py-6">
          {loading ? (
            <div className="text-center text-gray-500 py-10">
              Đang tải dữ liệu yêu cầu mượn sách...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-8xl mx-auto">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {request.borrower.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileBadge className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {request.borrower.studentId}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusText(request.status)}
                      </span>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="flex items-center space-x-1 px-3 py-1 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors text-sm whitespace-nowrap"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Chi tiết</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Ngày yêu cầu:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(request.requestDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">SĐT:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {request.borrower.phone}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Dự kiến trả:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(
                              request.expectedReturnDate
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Số sách:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {request.books.length} cuốn
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center text-sm">
                      <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                      Sách yêu cầu:
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="space-y-2">
                        {request.books.slice(0, 2).map((book, index) => (
                          <div
                            key={book.id}
                            className="text-sm text-gray-700 flex items-start"
                          >
                            <span className="text-gray-400 mr-2 mt-0.5">
                              {index + 1}.
                            </span>
                            <div className="flex-1">
                              <span className="font-medium">{book.title}</span>
                              <span className="text-blue-600 ml-2">
                                (SL: {book.quantity})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {request.books.length > 2 && (
                        <div className="text-sm text-blue-600 mt-2 text-center border-t border-gray-200 pt-2">
                          và {request.books.length - 2} cuốn khác...
                        </div>
                      )}
                    </div>
                  </div>

                  {request.note && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-yellow-800">
                            Ghi chú:{" "}
                          </span>
                          <span className="text-sm text-yellow-700">
                            {request.note}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-200/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Chi tiết yêu cầu mượn sách
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Borrower Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông tin người mượn
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Họ tên:</span>
                        <p className="font-medium text-gray-900">
                          {selectedRequest.borrower.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileBadge className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">
                          Mã sinh viên:
                        </span>
                        <p className="font-medium text-gray-900">
                          {selectedRequest.borrower.studentId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">
                          Số điện thoại:
                        </span>
                        <p className="font-medium text-gray-900">
                          {selectedRequest.borrower.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Lớp:</span>
                        <p className="font-medium text-gray-900">
                          {selectedRequest.borrower.class}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông tin yêu cầu
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">
                          Ngày yêu cầu:
                        </span>
                        <p className="font-medium text-gray-900">
                          {new Date(
                            selectedRequest.requestDate
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">
                          Dự kiến trả:
                        </span>
                        <p className="font-medium text-gray-900">
                          {new Date(
                            selectedRequest.expectedReturnDate
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">
                          Trạng thái:
                        </span>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            selectedRequest.status
                          )}`}
                        >
                          {getStatusText(selectedRequest.status)}
                        </span>
                      </div>
                    </div>
                    {selectedRequest.note && (
                      <div>
                        <span className="text-sm text-gray-600">Ghi chú:</span>
                        <p className="font-medium text-gray-900 mt-1">
                          {selectedRequest.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Books List */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Danh sách sách yêu cầu mượn
                </h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Tên sách
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Tác giả
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Số lượng
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedRequest.books.map((book) => (
                        <tr key={book.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {book.title}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {book.author}
                          </td>
                          <td className="px-7 py-3 text-sm text-gray-600">
                            {book.quantity}
                          </td>
                          <td className="px-7 py-3 text-sm text-gray-600">
                            <button
                              onClick={() =>
                                navigate(`/book-detail/${book.id}`)
                              }
                              className="text-green-600 hover:text-green-800"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10 3C5 3 1.73 7.11 1.05 10c.68 2.89 3.95 7 8.95 7s8.27-4.11 8.95-7c-.68-2.89-3.95-7-8.95-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedRequest.status === "pending" && (
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      declinedReq();
                      setShowModal(false);
                    }}
                    className="flex items-center space-x-2 px-6 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Từ chối</span>
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      acceptedReq();
                      setShowModal(false);
                    }}
                    className="flex items-center space-x-2 px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Duyệt yêu cầu</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRequest;
