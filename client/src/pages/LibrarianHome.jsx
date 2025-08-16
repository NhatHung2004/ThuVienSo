import React from "react";
import Sidebar, { SidebarItem } from "../components/layouts/Sidebar";
import {
  Receipt,
  Package,
  ClipboardList,
  FileBadge,
  BarChart2,
  BanknoteArrowUp,
  Clipboard,
} from "lucide-react";

const LibrarianHome = () => {
  return (
    <div className="flex h-screen">
      {" "}
      {/* <-- Thêm flex layout */}
      <Sidebar>
        <SidebarItem icon={<Receipt />} text="Quản lý sách" to="/book-manage" />
        <SidebarItem
          icon={<BanknoteArrowUp />}
          text="Duyệt mượn"
          to="/book-request"
        />
        <SidebarItem icon={<BarChart2 />} text="Thống kê" to="/stat" />
      </Sidebar>
      {/* Nội dung chính có thể đặt ở đây */}
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold">Trang quản lý thư viện</h1>
        {/* Các phần content chính sẽ nằm ở đây */}
      </div>
    </div>
  );
};

export default LibrarianHome;
