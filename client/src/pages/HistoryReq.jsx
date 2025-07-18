import React, { useState } from "react";
import { FaBookOpen, FaUser, FaCalendarAlt, FaClock } from "react-icons/fa";

const orderHistory = [
  {
    id: 1,
    title: "Dế Mèn Phiêu Lưu Ký",
    image:
      "https://thanhnien.mediacdn.vn/Uploaded/minhnguyet/2022_05_08/bia-sach2-9886.jpg",
    date: "2025-07-12",
    due: "2025-07-20",
    status: "Đã duyệt",
  },
  {
    id: 2,
    title: "Totto-chan bên cửa sổ",
    image:
      "https://salt.tikicdn.com/cache/w1200/ts/product/6e/6b/c8/4e68fd042167a34903c84a5245cb961d.jpg",
    date: "2025-07-08",
    due: "2025-07-15",
    status: "Đang xử lý",
  },
  {
    id: 3,
    title: "Tuổi trẻ đáng giá bao nhiêu",
    image:
      "https://cdn0.fahasa.com/media/catalog/product/t/u/tuoi-tre-dang-gia-bao-nhieu.jpg",
    date: "2025-07-01",
    due: "2025-07-10",
    status: "Đã trả",
  },
];

const statusStyles = {
  "Đang xử lý": "bg-yellow-100 text-yellow-700",
  "Đã duyệt": "bg-green-100 text-green-700",
  "Đã trả": "bg-blue-100 text-blue-700",
};

const HistoryReq = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const filteredOrders = orderHistory.filter((order) => {
    const matchesSearch = order.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "Tất cả" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          Lịch sử đặt hàng
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
              placeholder="🔍 Tìm theo tên sách..."
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
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Đã trả">Đã trả</option>
            </select>
          </div>
        </div>

        {/* Danh sách */}
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b bg-blue-50 rounded-t-xl">
            <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2">
              📚 Danh sách mượn sách
            </h2>
            <span className="text-sm text-gray-600">
              Tổng cộng {filteredOrders.length} đơn
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <table className="w-full text-sm text-gray-700">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-6 py-3">Ảnh</th>
                    <th className="px-6 py-3 min-w-[150px]">Tên sách</th>
                    <th className="px-6 py-3 whitespace-nowrap">Ngày mượn</th>
                    <th className="px-6 py-3 whitespace-nowrap">Hạn trả</th>
                    <th className="px-6 py-3 whitespace-nowrap">Trạng thái</th>
                    <th className="px-6 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-6 text-center text-gray-500"
                      >
                        Không tìm thấy đơn nào.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        {/* Ảnh */}
                        <td className="px-6 py-4">
                          <img
                            src={order.image}
                            alt={order.title}
                            className="w-10 h-14 object-cover rounded-md border"
                          />
                        </td>

                        {/* Tên sách */}
                        <td className="px-6 py-4">
                          <span className="font-medium line-clamp-2">
                            {order.title}
                          </span>
                        </td>

                        {/* Ngày mượn */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.date}
                        </td>

                        {/* Hạn trả */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.due}
                        </td>

                        {/* Trạng thái */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              statusStyles[order.status]
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        {/* Hành động */}
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:underline text-sm">
                            Chi tiết
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
      </div>
    </div>
  );
};

export default HistoryReq;
