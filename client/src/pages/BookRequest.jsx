import React, { useState } from "react";
import Sidebar, { SidebarItem } from "../components/layouts/Sidebar";
import { Apis } from "../configs/Apis";
import {
  Receipt,
  Package,
  ClipboardList,
  FileBadge,
  BarChart2,
  BanknoteArrowUp,
  Clipboard,
  Search,
  X,
  Check,
  TrendingUp,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const BookRequestCard = ({ request, onApprove, onReject }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">C</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{request.userName}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                Sinh viên
              </span>
              <span>{request.date}</span>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <span>{isExpanded ? "Thu gọn" : "Mở rộng"}</span>
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
            {isExpanded && (
              <>
                <p className="text-sm text-gray-600 mt-1">
                  {request.studentId} - {request.description}
                </p>
                <p className="text-sm text-gray-500">
                  Địa chỉ: {request.address}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onApprove(request.id)}
            className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => onReject(request.id)}
            className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-16 bg-gray-300 rounded flex items-center justify-center">
            <Package size={20} className="text-gray-500" />
          </div>
          <div>
            <h4 className="font-medium text-gray-800">Tên sách</h4>
            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex space-x-4">
                <span>Ngày mượn: {request.borrowDate}</span>
                <span>Ngày trả: {request.returnDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookRequest = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      userName: "Nguyễn Văn C",
      date: "20/11/2020",
      time: "Thu gọn",
      studentId: "SĐT: 0123456678",
      description: "Phương thức nhận hỗ trợ tại nhà",
      address: "123/23/2 Lê Văn Lương",
      borrowDate: "20/11/2020",
      returnDate: "27/11/2020",
    },
    {
      id: 2,
      userName: "Nguyễn Văn C",
      date: "20/11/2020",
      time: "Thu gọn",
      studentId: "SĐT: 0123456678",
      description: "Phương thức nhận hỗ trợ tại nhà",
      address: "123/23/2 Lê Văn Lương",
      borrowDate: "20/11/2020",
      returnDate: "27/11/2020",
    },
    {
      id: 3,
      userName: "Nguyễn Văn C",
      date: "20/11/2020",
      time: "Thu gọn",
      studentId: "SĐT: 0123456678",
      description: "Phương thức nhận hỗ trợ tại nhà",
      address: "123/23/2 Lê Văn Lương",
      borrowDate: "20/11/2020",
      returnDate: "27/11/2020",
    },
    {
      id: 4,
      userName: "Nguyễn Văn C",
      date: "20/11/2020",
      time: "Thu gọn",
      studentId: "SĐT: 0123456678",
      description: "Phương thức nhận hỗ trợ tại nhà",
      address: "123/23/2 Lê Văn Lương",
      borrowDate: "20/11/2020",
      returnDate: "27/11/2020",
    },
    {
      id: 5,
      userName: "Nguyễn Văn C",
      date: "20/11/2020",
      time: "Thu gọn",
      studentId: "SĐT: 0123456678",
      description: "Phương thức nhận hỗ trợ tại nhà",
      address: "123/23/2 Lê Văn Lương",
      borrowDate: "20/11/2020",
      returnDate: "27/11/2020",
    },
    {
      id: 6,
      userName: "Nguyễn Văn C",
      date: "20/11/2020",
      time: "Thu gọn",
      studentId: "SĐT: 0123456678",
      description: "Phương thức nhận hỗ trợ tại nhà",
      address: "123/23/2 Lê Văn Lương",
      borrowDate: "20/11/2020",
      returnDate: "27/11/2020",
    },
  ]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar>
        <SidebarItem icon={<Receipt />} text="Quản lý sách" to="/book-manage" />
        <SidebarItem
          icon={<TrendingUp />}
          text="Duyệt mượn"
          to="/managements/invoice-manage"
          active={true}
        />
        <SidebarItem
          icon={<ClipboardList />}
          text="Lịch sử mượn"
          to="/history-librarian"
        />
        <SidebarItem icon={<BarChart2 />} text="Thống kê" to="/stat" />
      </Sidebar>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col p-4">
          <div className="max-w-8xl mx-auto w-full">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Yêu cầu mượn sách
              </h1>
              <p className="text-gray-600">
                Quản lý và duyệt các yêu cầu mượn sách từ sinh viên
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1">
              <div className="bg-blue-100 p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-blue-800">
                  Yêu cầu chờ xử lý
                </h2>
              </div>

              <div className="p-8 max-h-[calc(100vh-280px)] overflow-y-auto">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                  {requests.map((request) => (
                    <BookRequestCard key={request.id} request={request} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRequest;
