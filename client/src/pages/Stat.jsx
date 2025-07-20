import React, { useState, useEffect } from "react";
import {
  Receipt,
  Package,
  ClipboardList,
  FileBadge,
  BarChart2,
  ArrowUpRight,
  Clipboard,
  Search,
  X,
  Check,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Users,
  BookOpen,
  Calendar,
  Eye,
  Download,
  Filter,
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
  AreaChart,
  Area,
} from "recharts";
import Sidebar, { SidebarItem } from "../components/layouts/Sidebar";

const mockData = {
  totalBooks: 12450,
  totalMembers: 3280,
  activeLoans: 847,
  overdueBooks: 23,
  monthlyLoans: [
    { month: "T1", loans: 245, returns: 230 },
    { month: "T2", loans: 289, returns: 267 },
    { month: "T3", loans: 312, returns: 298 },
    { month: "T4", loans: 278, returns: 295 },
    { month: "T5", loans: 356, returns: 341 },
    { month: "T6", loans: 423, returns: 398 },
    { month: "T7", loans: 467, returns: 456 },
    { month: "T8", loans: 398, returns: 412 },
    { month: "T9", loans: 445, returns: 423 },
    { month: "T10", loans: 389, returns: 401 },
    { month: "T11", loans: 356, returns: 378 },
    { month: "T12", loans: 234, returns: 245 },
  ],
  categoryStats: [
    { name: "Văn học", value: 35, books: 4358, color: "#8B5CF6" },
    { name: "Khoa học", value: 22, books: 2739, color: "#06B6D4" },
    { name: "Lịch sử", value: 18, books: 2241, color: "#10B981" },
    { name: "Giáo khoa", value: 15, books: 1868, color: "#F59E0B" },
    { name: "Nghệ thuật", value: 10, books: 1245, color: "#EF4444" },
  ],
  popularBooks: [
    { title: "Dế Mèn Phiêu Lưu Ký", author: "Tô Hoài", loans: 156 },
    { title: "Tắt Đèn", author: "Ngô Tất Tố", loans: 142 },
    { title: "Chí Phèo", author: "Nam Cao", loans: 138 },
    { title: "Số Đỏ", author: "Vũ Trọng Phụng", loans: 124 },
    { title: "Lão Hạc", author: "Nam Cao", loans: 118 },
  ],
  dailyVisitors: [
    { day: "T2", visitors: 245 },
    { day: "T3", visitors: 312 },
    { day: "T4", visitors: 278 },
    { day: "T5", visitors: 356 },
    { day: "T6", visitors: 423 },
    { day: "T7", visitors: 234 },
    { day: "CN", visitors: 189 },
  ],
};

// Statistics Cards Component
const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = "blue",
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
          <p className="text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
          {trend && (
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
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar>
        <SidebarItem
          icon={<Package className="h-5 w-5" />}
          text="Quản lý sách"
          to="/book-manage"
        />
        <SidebarItem
          icon={<Receipt className="h-5 w-5" />}
          text="Duyệt mượn"
          to="/managements/invoice-manage"
        />
        <SidebarItem
          icon={<ClipboardList className="h-5 w-5" />}
          text="Lịch sử mượn"
          to="/history-librarian"
        />
        <SidebarItem
          icon={<BarChart2 className="h-5 w-5" />}
          text="Thống kê"
          to="/managements/survey-statistics"
          active={true}
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng số sách"
            value={mockData.totalBooks}
            icon={<BookOpen className="h-6 w-6 text-white" />}
            trend="up"
            trendValue={8.2}
            color="blue"
          />
          <StatCard
            title="Thành viên"
            value={mockData.totalMembers}
            icon={<Users className="h-6 w-6 text-white" />}
            trend="up"
            trendValue={12.5}
            color="green"
          />
          <StatCard
            title="Đang mượn"
            value={mockData.activeLoans}
            icon={<ClipboardList className="h-6 w-6 text-white" />}
            trend="down"
            trendValue={3.1}
            color="purple"
          />
          <StatCard
            title="Quá hạn"
            value={mockData.overdueBooks}
            icon={<Calendar className="h-6 w-6 text-white" />}
            trend="down"
            trendValue={15.3}
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.monthlyLoans}>
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
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Phân bố theo thể loại
              </h3>
              <Eye className="h-5 w-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.categoryStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {mockData.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Books */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sách được mượn nhiều nhất
            </h3>
            <div className="space-y-3">
              {mockData.popularBooks.map((book, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {book.title}
                    </p>
                    <p className="text-gray-600 text-xs">{book.author}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {book.loans} lượt
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Visitors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Lượt truy cập trong tuần
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockData.dailyVisitors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hoạt động gần đây
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-2 border-l-4 border-green-400 bg-green-50">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <div className="text-sm">
                  <p className="font-medium">Phê duyệt mượn sách</p>
                  <p className="text-gray-600">2 phút trước</p>
                </div>
              </div>
              <div className="flex items-center p-2 border-l-4 border-blue-400 bg-blue-50">
                <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                <div className="text-sm">
                  <p className="font-medium">Thêm sách mới</p>
                  <p className="text-gray-600">15 phút trước</p>
                </div>
              </div>
              <div className="flex items-center p-2 border-l-4 border-orange-400 bg-orange-50">
                <Calendar className="h-4 w-4 text-orange-600 mr-2" />
                <div className="text-sm">
                  <p className="font-medium">Nhắc nhở quá hạn</p>
                  <p className="text-gray-600">1 giờ trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stat;
