import React, { useState } from "react";
import {
  Receipt,
  Package,
  ClipboardList,
  FileBadge,
  BarChart2,
  Clipboard,
  Search,
  X,
  Check,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Bell,
  Eye,
  Filter,
  Calendar,
  ArrowLeft,
  User,
  Book,
  CreditCard,
} from "lucide-react";
import Sidebar, { SidebarItem } from "../components/layouts/Sidebar";
import { Apis } from "../configs/Apis";
const HistoryAcpt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    borrowDate: "",
    returnDate: "",
    bookCategory: "",
    receiveMethod: "",
  });

  // Mock data cho bảng
  const borrowHistory = [
    {
      id: 1,
      borrowerName: "Nguyễn Văn A",
      bookTitle: "Lập trình React từ cơ bản đến nâng cao",
      borrowDate: "20/11/2024",
      returnDate: "27/11/2024",
      status: "Đã duyệt",
      statusType: "approved",
      action: "Tại thư viện",
      // Thông tin chi tiết
      borrowerInfo: {
        fullName: "Nguyễn Văn A",
        studentId: "SV001234",
        phone: "0123456789",
        email: "nguyenvana@email.com",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        faculty: "Công nghệ thông tin",
      },
      bookInfo: {
        title: "Lập trình React từ cơ bản đến nâng cao",
        author: "John Doe",
        isbn: "978-0123456789",
        category: "Công nghệ",
        publisher: "NXB Thông tin và Truyền thông",
        year: "2023",
        pages: "450 trang",
      },
      borrowInfo: {
        borrowDate: "20/11/2024",
        returnDate: "27/11/2024",
        actualReturnDate: "25/11/2024",
        receiveMethod: "Tại thư viện",
        notes: "Sách trong tình trạng tốt",
      },
    },
    {
      id: 2,
      borrowerName: "Trần Thị B",
      bookTitle: "JavaScript ES6+ và Node.js",
      borrowDate: "15/11/2024",
      returnDate: "22/11/2024",
      status: "Đã duyệt",
      statusType: "approved",
      action: "Giao tận nơi",
      borrowerInfo: {
        fullName: "Trần Thị B",
        studentId: "SV001235",
        phone: "0987654321",
        email: "tranthib@email.com",
        address: "456 Đường XYZ, Quận 3, TP.HCM",
        faculty: "Khoa học máy tính",
      },
      bookInfo: {
        title: "JavaScript ES6+ và Node.js",
        author: "Jane Smith",
        isbn: "978-0987654321",
        category: "Lập trình",
        publisher: "NXB Giáo dục",
        year: "2023",
        pages: "380 trang",
      },
      borrowInfo: {
        borrowDate: "15/11/2024",
        returnDate: "22/11/2024",
        actualReturnDate: "",
        receiveMethod: "Giao tận nơi",
        notes: "Giao hàng thành công",
      },
    },
    {
      id: 3,
      borrowerName: "Lê Văn C",
      bookTitle: "Database Design và SQL",
      borrowDate: "10/11/2024",
      returnDate: "17/11/2024",
      status: "Từ chối",
      statusType: "rejected",
      action: "Tại thư viện",
      borrowerInfo: {
        fullName: "Lê Văn C",
        studentId: "SV001236",
        phone: "0369852147",
        email: "levanc@email.com",
        address: "789 Đường DEF, Quận 5, TP.HCM",
        faculty: "Hệ thống thông tin",
      },
      bookInfo: {
        title: "Database Design và SQL",
        author: "Mike Johnson",
        isbn: "978-0147258369",
        category: "Cơ sở dữ liệu",
        publisher: "NXB Khoa học và Kỹ thuật",
        year: "2022",
        pages: "520 trang",
      },
      borrowInfo: {
        borrowDate: "10/11/2024",
        returnDate: "17/11/2024",
        actualReturnDate: "",
        receiveMethod: "Tại thư viện",
        notes: "Từ chối do sách đã được mượn",
      },
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      borrowDate: "",
      returnDate: "",
      bookCategory: "",
      receiveMethod: "",
    });
  };

  const getStatusBadge = (status, statusType) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    if (statusType === "approved") {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-700`}>
          {status}
        </span>
      );
    } else if (statusType === "rejected") {
      return (
        <span className={`${baseClasses} bg-red-100 text-red-700`}>
          {status}
        </span>
      );
    }
    return (
      <span className={`${baseClasses} bg-gray-100 text-gray-700`}>
        {status}
      </span>
    );
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedRecord(null);
  };

  // Chi tiết view
  if (showDetail && selectedRecord) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar>
          <SidebarItem
            icon={<Receipt />}
            text="Quản lý sách"
            to="/book-manage"
          />
          <SidebarItem
            icon={<TrendingUp />}
            text="Duyệt mượn"
            to="/managements/invoice-manage"
          />
          <SidebarItem
            icon={<ClipboardList />}
            text="Lịch sử mượn"
            to="/managements/create-survey"
            active={true}
          />
          <SidebarItem icon={<BarChart2 />} text="Thống kê" to="/stat" />
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToList}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Chi tiết mượn sách
                </button>
              </div>
              <Bell className="w-6 h-6 text-gray-500" />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Thông tin khách hàng */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500 rounded-full text-white shadow-lg">
                      <User className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Thông tin khách hàng
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">
                        Họ và tên:
                      </span>
                      <span className="font-bold text-gray-800">
                        {selectedRecord.borrowerInfo.fullName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">
                        Mã sinh viên:
                      </span>
                      <span className="font-bold text-blue-600">
                        {selectedRecord.borrowerInfo.studentId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">Khoa:</span>
                      <span className="font-bold text-gray-800">
                        {selectedRecord.borrowerInfo.faculty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">
                        Số điện thoại:
                      </span>
                      <span className="font-bold text-gray-800">
                        {selectedRecord.borrowerInfo.phone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">Email:</span>
                      <span className="font-bold text-gray-800 text-sm">
                        {selectedRecord.borrowerInfo.email}
                      </span>
                    </div>
                    <div className="p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium block mb-2">
                        Địa chỉ:
                      </span>
                      <span className="font-bold text-gray-800">
                        {selectedRecord.borrowerInfo.address}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thông tin mượn */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl p-8 shadow-lg border border-emerald-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-500 rounded-full text-white shadow-lg">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Thông tin mượn
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">
                        Ngày mượn:
                      </span>
                      <span className="font-bold text-gray-800">
                        {selectedRecord.borrowInfo.borrowDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">
                        Ngày trả dự kiến:
                      </span>
                      <span className="font-bold text-gray-800">
                        {selectedRecord.borrowInfo.returnDate}
                      </span>
                    </div>
                    {selectedRecord.borrowInfo.actualReturnDate && (
                      <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                        <span className="text-gray-600 font-medium">
                          Ngày trả thực tế:
                        </span>
                        <span className="font-bold text-green-600">
                          {selectedRecord.borrowInfo.actualReturnDate}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">
                        Hình thức nhận:
                      </span>
                      <span className="font-bold text-gray-800">
                        {selectedRecord.borrowInfo.receiveMethod}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">
                        Trạng thái:
                      </span>
                      {getStatusBadge(
                        selectedRecord.status,
                        selectedRecord.statusType
                      )}
                    </div>
                    <div className="p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium block mb-2">
                        Ghi chú:
                      </span>
                      <span className="font-bold text-gray-800">
                        {selectedRecord.borrowInfo.notes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin sách */}
              <div className="mt-8 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-8 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-500 rounded-full text-white shadow-lg">
                    <Book className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Thông tin sách
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium block mb-2">
                        Tên sách:
                      </span>
                      <span className="font-bold text-gray-800 text-lg leading-tight">
                        {selectedRecord.bookInfo.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">
                        Tác giả:
                      </span>
                      <span className="font-bold text-gray-800">
                        {selectedRecord.bookInfo.author}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">ISBN:</span>
                      <span className="font-bold text-purple-600">
                        {selectedRecord.bookInfo.isbn}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">
                        Thể loại:
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                        {selectedRecord.bookInfo.category}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium block mb-2">
                        Nhà xuất bản:
                      </span>
                      <span className="font-bold text-gray-800">
                        {selectedRecord.bookInfo.publisher}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">
                        Năm xuất bản:
                      </span>
                      <span className="font-bold text-gray-800">
                        {selectedRecord.bookInfo.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg backdrop-blur-sm">
                      <span className="text-gray-600 font-medium">
                        Số trang:
                      </span>
                      <span className="font-bold text-gray-800">
                        {selectedRecord.bookInfo.pages}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Main list view
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar>
        <SidebarItem icon={<Receipt />} text="Quản lý sách" to="/book-manage" />
        <SidebarItem
          icon={<TrendingUp />}
          text="Duyệt mượn"
          to="/managements/invoice-manage"
        />
        <SidebarItem
          icon={<ClipboardList />}
          text="Lịch sử mượn"
          to="/managements/create-survey"
          active={true}
        />
        <SidebarItem icon={<BarChart2 />} text="Thống kê" to="/stat" />
      </Sidebar>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              Quản lý thư viện
            </h1>
            <Bell className="w-6 h-6 text-gray-500" />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Filter Section */}
          <div className="mb-6 bg-white rounded-lg shadow-sm border p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên người mượn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Bộ lọc nâng cao
                    <ChevronDown
                      className={`w-4 h-4 transform transition-transform ${
                        showAdvancedFilter ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Advanced Filters Dropdown */}
                  {showAdvancedFilter && (
                    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border z-50">
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Bộ lọc nâng cao
                        </h3>

                        <div className="space-y-4">
                          {/* Status Filter */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Trạng thái
                            </label>
                            <select
                              value={filters.status}
                              onChange={(e) =>
                                handleFilterChange("status", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Tất cả trạng thái</option>
                              <option value="approved">Đã duyệt</option>
                              <option value="rejected">Từ chối</option>
                              <option value="returned">Đã trả</option>
                            </select>
                          </div>

                          {/* Date Range */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Từ ngày
                              </label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="date"
                                  value={filters.borrowDate}
                                  onChange={(e) =>
                                    handleFilterChange(
                                      "borrowDate",
                                      e.target.value
                                    )
                                  }
                                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đến ngày
                              </label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="date"
                                  value={filters.returnDate}
                                  onChange={(e) =>
                                    handleFilterChange(
                                      "returnDate",
                                      e.target.value
                                    )
                                  }
                                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Receive Method Filter */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hình thức nhận
                            </label>
                            <select
                              value={filters.receiveMethod}
                              onChange={(e) =>
                                handleFilterChange(
                                  "receiveMethod",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Tất cả hình thức</option>
                              <option value="library">Tại thư viện</option>
                              <option value="home">Giao tận nơi</option>
                            </select>
                          </div>

                          {/* Filter Actions */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <button
                              onClick={clearFilters}
                              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Xóa bộ lọc
                            </button>
                            <div className="text-sm text-gray-500">
                              {borrowHistory.length} kết quả
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Click outside to close */}
            {showAdvancedFilter && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowAdvancedFilter(false)}
              />
            )}
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Table Header */}
            <div className="bg-blue-100 px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-blue-800">
                    Lịch sử mượn
                  </h2>
                  <p className="text-sm text-blue-600 mt-1">
                    Xem được những yêu cầu mượn đã duyệt / từ chối
                  </p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên người mượn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sách
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày mượn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày trả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hình thức nhận
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {borrowHistory.map((record, index) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.borrowerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.bookTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.borrowDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.returnDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(record.status, record.statusType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleViewDetail(record)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HistoryAcpt;
