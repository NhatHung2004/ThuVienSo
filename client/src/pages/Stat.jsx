import React, { useState, useEffect } from "react";
import {
  Receipt,
  ClipboardList,
  ChevronUp,
  ChevronDown,
  Users,
  BookOpen,
  Calendar,
  Eye,
  Download,
  BanknoteArrowUp,
  TrendingUp,
  Check,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Sidebar, { SidebarItem } from "../components/layouts/Sidebar";
import { Apis } from "../configs/Apis";

// Statistics Cards Component
const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = "blue",
  isLoading,
}) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>

          {/* Show loading placeholder when isLoading */}
          {isLoading ? (
            <p className="text-2xl font-bold text-gray-400">Đang tải...</p>
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {typeof value === "number"
                ? value.toLocaleString()
                : value ?? "-"}
            </p>
          )}

          {trend && !isLoading && (
            <div className="flex items-center mt-2">
              {trend === "up" ? (
                <ChevronUp className="h-4 w-4 text-green-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trendValue}% so với tháng trước
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
};

// Main Statistics Component
const Stat = () => {
  const [timeRange, setTimeRange] = useState("12months");
  const [isLoading, setIsLoading] = useState(true);

  // All data states start empty (no mock data)
  const [categoryStats, setCategoryStats] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [monthlyLoans, setMonthlyLoans] = useState([]); // will be [{month:'T1', loans:..., returns:...}, ...]
  const [acceptRejectStats, setAcceptRejectStats] = useState([]); // will be [{month:'T1', accepted:..., rejected:...}, ...]

  const [displayStats, setDisplayStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalRatings: 0,
    activeLoans: 0,
  });

  // Màu sắc cho các thể loại
  const colors = [
    "#8B5CF6",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#F97316",
    "#EC4899",
    "#6366F1",
  ];

  // Fetch category stats
  const fetchCategoryStat = async () => {
    try {
      const res = await Apis.get("/stats/category_stats");
      const totalBooks = Array.isArray(res.data)
        ? res.data.reduce((sum, item) => sum + (item.total_of_books ?? 0), 0)
        : 0;

      const formattedData = Array.isArray(res.data)
        ? res.data.map((item, index) => ({
            name: item.cate_name,
            value:
              totalBooks > 0
                ? Math.round(((item.total_of_books ?? 0) / totalBooks) * 100)
                : 0,
            books: item.total_of_books ?? 0,
            color: colors[index % colors.length],
            cate_id: item.cate_id,
          }))
        : [];

      setCategoryStats(formattedData);
    } catch (err) {
      console.error("Error fetching category stats:", err);
      setCategoryStats([]);
    }
  };

  // Fetch popular books
  const fetchBookBorrowStat = async () => {
    try {
      const res = await Apis.get("/stats/book_frequency");
      console.log(res.data);
      const sortedBooks = Array.isArray(res.data)
        ? res.data
            .sort(
              (a, b) =>
                (b.total_borrow_quantity ?? 0) - (a.total_borrow_quantity ?? 0)
            )
            .slice(0, 5)
            .map((book) => ({
              title: book.book_title,
              loans: book.number_of_book_borrows ?? 0,
              book_id: book.book_id,
            }))
        : [];
      setPopularBooks(sortedBooks);
    } catch (err) {
      console.error("Error fetching book borrow stats:", err);
      setPopularBooks([]);
    }
  };

  // Fetch borrowing stats for 12 months
  const fetchBorrowingStat = async () => {
    try {
      const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12

      const promises = months.map((m) =>
        Apis.get("/stats/book_borrowing_stats", { params: { month: m } })
          .then((res) => {
            const data = Array.isArray(res.data)
              ? res.data[0] ?? {}
              : res.data ?? {};
            return {
              month: m,
              total_of_borrowing_books: Number(
                data.total_of_borrowing_books ?? 0
              ),
              total_of_returned_books: Number(
                data.total_of_returned_books ?? 0
              ),
              total_of_accepted: Number(data.total_of_accepted ?? 0),
              total_of_rejected: Number(data.total_of_rejected ?? 0),
            };
          })
          .catch((err) => {
            console.warn(`Error fetching month ${m}`, err);
            return {
              month: m,
              total_of_borrowing_books: 0,
              total_of_returned_books: 0,
              total_of_accepted: 0,
              total_of_rejected: 0,
            };
          })
      );

      const results = await Promise.all(promises);

      const monthly = results.map((r) => ({
        month: `T${r.month}`,
        loans: r.total_of_borrowing_books,
        returns: r.total_of_returned_books,
      }));

      const acceptReject = results.map((r) => ({
        month: `T${r.month}`,
        accepted: r.total_of_accepted,
        rejected: r.total_of_rejected,
      }));

      setMonthlyLoans(monthly);
      setAcceptRejectStats(acceptReject);
    } catch (err) {
      console.error("Error fetching borrowing stats:", err);
      setMonthlyLoans([]);
      setAcceptRejectStats([]);
    }
  };

  const fetchStat = async () => {
    try {
      const res = await Apis.get("/stats/general_stats");
      console.log(res.data);
      const data = {
        totalBooks: res.data.total_of_books,
        totalUsers: res.data.number_of_users,
        totalRatings: res.data.average_rating,
        activeLoans: res.data.number_of_borrows,
      };
      setDisplayStats(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Aggregate fetch: set loading state while all requests run
  const fetchAll = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchCategoryStat(),
        fetchBookBorrowStat(),
        fetchBorrowingStat(),
        fetchStat(),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar>
        <SidebarItem icon={<Receipt />} text="Quản lý sách" to="/book-manage" />
        <SidebarItem
          icon={<BanknoteArrowUp />}
          text="Duyệt mượn"
          to="/book-request"
        />
      </Sidebar>

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Thống kê thư viện
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý và xem thống kê của thư viện
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="12months">12 tháng qua</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards (show loading placeholders if data not ready) */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng số sách"
            value={displayStats.totalBooks}
            icon={<BookOpen className="h-6 w-6 text-white" />}
            trend={null}
            isLoading={isLoading}
            color="blue"
          />
          <StatCard
            title="Thành viên"
            value={displayStats.totalUsers}
            icon={<Users className="h-6 w-6 text-white" />}
            trend={null}
            isLoading={isLoading}
            color="green"
          />
          <StatCard
            title="Đang mượn"
            value={null}
            icon={<ClipboardList className="h-6 w-6 text-white" />}
            trend={null}
            isLoading={isLoading}
            color="purple"
          />
          <StatCard
            title="Quá hạn"
            value={null}
            icon={<Calendar className="h-6 w-6 text-white" />}
            trend={null}
            isLoading={isLoading}
            color="red"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Loans Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Thống kê mượn/trả theo tháng
              </h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>

            {/* If still loading OR monthlyLoans empty, show loading block */}
            {isLoading || monthlyLoans.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Đang tải dữ liệu...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyLoans}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="loans"
                    fill="#3B82F6"
                    name="Mượn"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="returns"
                    fill="#10B981"
                    name="Trả"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Phân bố theo thể loại
              </h3>
              <Eye className="h-5 w-5 text-gray-400" />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Đang tải dữ liệu...
              </div>
            ) : categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value}% (${props.payload.books} sách)`,
                      props.payload.name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>

        {/* Additional Statistics: 2 columns on large screens (Popular Books + Accepted/Rejected) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Books */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sách được mượn nhiều nhất
            </h3>

            {isLoading ? (
              <div className="text-center text-gray-500 py-6">
                Đang tải dữ liệu...
              </div>
            ) : popularBooks.length > 0 ? (
              <div className="space-y-3">
                {popularBooks.map((book) => (
                  <div
                    key={book.book_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {book.title}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {book.loans} lượt
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6">
                Không có dữ liệu
              </div>
            )}
          </div>

          {/* Accepted vs Rejected Line Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Duyệt / Từ chối theo tháng
            </h3>

            {isLoading || acceptRejectStats.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Đang tải dữ liệu...
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={acceptRejectStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="accepted"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rejected"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stat;
