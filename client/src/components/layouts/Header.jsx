"use client";

import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  MoonIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { MyUserContext, MyUserDispatchContext } from "../../configs/MyContext";
import { Apis, authApis } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";
import { ref, onValue, off, update } from "firebase/database";
import { db } from "../../firebase"; // import firebase config

const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyUserDispatchContext);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchBooks = async () => {
    try {
      const res = await authApis().get("/books/");
      setBooks(res.data);
      console.log(user);
    } catch {
      console.log("Có lỗi khi tải danh sách sách");
    }
  };

  // Fetch notifications from Firebase
  const fetchNotifications = () => {
    if (!user?.id) return;

    const notificationsRef = ref(db, `notifications/${user.id}`);

    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Sort by timestamp (newest first)
        notificationsList.sort((a, b) => b.timestamp - a.timestamp);

        setNotifications(notificationsList);

        // Count unread notifications
        const unreadCount = notificationsList.filter(
          (notif) => !notif.read
        ).length;
        setUnreadCount(unreadCount);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return unsubscribe;
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    if (!user?.id) return;

    try {
      const notificationRef = ref(
        db,
        `notifications/${user.id}/${notificationId}`
      );
      await update(notificationRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user?.id || notifications.length === 0) return;

    try {
      const updates = {};
      notifications.forEach((notif) => {
        if (!notif.read) {
          updates[`notifications/${user.id}/${notif.id}/read`] = true;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (user?.id) {
      unsubscribe = fetchNotifications();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.id]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBooks([]);
      setShowDropdown(false);
      return;
    }

    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredBooks(filtered);
    setShowDropdown(true);
  }, [searchTerm, books]);

  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="mx-auto max-w-7xl flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1/4">
          <Link to="/" className="p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="https://ou.edu.vn/wp-content/uploads/2018/08/LOGO-TRUONGV21-12-2018-01-300x300.png"
              className="h-15 w-auto"
              onClick={() => setActiveTab("/")}
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:w-1/3 lg:justify-start lg:gap-x-8 -ml-110 -mt-0">
          <Popover className="relative">
            <PopoverPanel
              transition
              className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon
                      aria-hidden="true"
                      className="size-5 flex-none text-gray-400"
                    />
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <Link
            to="/books"
            onClick={() => setActiveTab("/books")}
            className={`relative text-2sm font-semibold text-gray-900 pb-2 ${
              activeTab === "/books" ? "text-blue-600" : ""
            }`}
          >
            Tất cả sách
            {activeTab === "/books" && (
              <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 transition-all duration-300"></span>
            )}
          </Link>

          <Link
            to="/cart"
            onClick={() => setActiveTab("/cart")}
            className={`relative text-2sm font-semibold text-gray-900 pb-2 ${
              activeTab === "/cart" ? "text-blue-600" : ""
            }`}
          >
            Giỏ hàng
            {activeTab === "/cart" && (
              <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 transition-all duration-300"></span>
            )}
          </Link>

          <Link
            to="/history"
            onClick={() => setActiveTab("/history")}
            className={`relative text-2sm font-semibold text-gray-900 pb-2 ${
              activeTab === "/history" ? "text-blue-600" : ""
            }`}
          >
            Lịch sử yêu cầu
            {activeTab === "/history" && (
              <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 transition-all duration-300"></span>
            )}
          </Link>
        </PopoverGroup>

        <div className="hidden lg:flex lg:w-1/3 lg:justify-center ml-0.5 -mt-1.2">
          <form action="/search" method="GET" className="w-full max-w-5xl">
            <div className="relative">
              <input
                type="text"
                name="q"
                id="search"
                placeholder="Tìm kiếm sách"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    navigate(`/books?q=${encodeURIComponent(searchTerm)}`);
                    setSearchTerm("");
                  }
                }}
                className="w-[550px] rounded-xl border border-gray-300 px-4 py-2 pl-10 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow max-h-60 overflow-y-auto">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <Link
                        to={`/book-detail/${book.id}`}
                        key={book.id}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-800 gap-3"
                      >
                        <img
                          src={
                            book.image || "https://via.placeholder.com/40x60"
                          }
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded-md"
                        />
                        <span>{book.title}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Không có sách bạn muốn tìm
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
          {/* Notification Bell - only show when user is logged in */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Thông báo
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Đánh dấu tất cả đã đọc
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                          onClick={() =>
                            !notification.read && markAsRead(notification.id)
                          }
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p
                                className={`text-sm ${
                                  !notification.read
                                    ? "font-semibold text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <BellIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>Không có thông báo nào</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Menu */}
          {!user ? (
            <Link to="/login" className="text-sm/6 font-semibold text-gray-900">
              Đăng nhập <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <UserCircleIcon className="w-8 h-8 text-gray-700" />
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  {/* Thông tin user */}
                  <div className="flex items-center gap-3 px-6 py-4">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                      <div className="text-gray-900 font-bold text-lg">
                        {user.firstname + " " + user.lastname || "Tên chưa có"}
                      </div>
                      <div className="text-gray-500 text-sm">
                        Username: {" " + user.username || "Chưa có"}
                      </div>
                    </div>
                  </div>
                  <hr className="my-2 border-gray-200" />
                  {/* Các chức năng */}
                  <button className="flex items-center gap-3 px-6 py-3 w-full hover:bg-gray-100 text-gray-800 text-base">
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span>Cài đặt tài khoản</span>
                  </button>
                  <button className="flex items-center gap-3 px-6 py-3 w-full hover:bg-gray-100 text-gray-800 text-base">
                    <Squares2X2Icon className="w-5 h-5" />
                    <span>Tích hợp</span>
                  </button>
                  <div className="flex items-center gap-3 px-6 py-3 w-full hover:bg-gray-100 text-gray-800 text-base">
                    <MoonIcon className="w-5 h-5" />
                    <span>Chế độ tối</span>
                    <label className="ml-auto inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
                    </label>
                  </div>
                  <hr className="my-2 border-gray-200" />
                  {/* Đăng xuất */}
                  <button
                    onClick={() => {
                      dispatch({ type: "logout" });
                      setShowUserDropdown(false);
                    }}
                    className="flex items-center gap-3 px-6 py-3 w-full hover:bg-gray-100 text-red-600 text-base font-semibold"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://ou.edu.vn/wp-content/uploads/2018/08/LOGO-TRUONGV21-12-2018-01-300x300.png"
                className="h-16 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  to="/books"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Tất cả sách
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Giỏ hàng
                </Link>
                <Link
                  to="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Lịch sử yêu cầu
                </Link>
              </div>
              <div className="py-6">
                {!user ? (
                  <Link
                    to="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Đăng nhập <span aria-hidden="true">&rarr;</span>
                  </Link>
                ) : (
                  <div className="w-full">
                    <button
                      onClick={() => setShowMobileUserMenu((prev) => !prev)}
                      className="flex items-center gap-3 px-6 py-4 w-full focus:outline-none"
                    >
                      <UserCircleIcon className="w-12 h-12 text-blue-600" />
                      <div className="flex flex-col text-left">
                        <span className="text-gray-900 font-bold text-lg">
                          {user.firstname || "Tên chưa có"}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {user.username || "Chưa có"}
                        </span>
                      </div>
                      <span className="ml-auto text-gray-400">
                        {showMobileUserMenu ? "▲" : "▼"}
                      </span>
                    </button>
                    {showMobileUserMenu && (
                      <div className="bg-gray-50 rounded-xl shadow border border-gray-200 mx-3 mb-2">
                        <button className="flex items-center gap-3 px-6 py-3 w-full hover:bg-gray-100 text-gray-800 text-base">
                          <Cog6ToothIcon className="w-5 h-5" />
                          <span>Cài đặt tài khoản</span>
                        </button>
                        <button className="flex items-center gap-3 px-6 py-3 w-full hover:bg-gray-100 text-gray-800 text-base">
                          <Squares2X2Icon className="w-5 h-5" />
                          <span>Tích hợp</span>
                        </button>
                        <div className="flex items-center gap-3 px-6 py-3 w-full hover:bg-gray-100 text-gray-800 text-base">
                          <MoonIcon className="w-5 h-5" />
                          <span>Chế độ tối</span>
                          <label className="ml-auto inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
                          </label>
                        </div>
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={() => {
                            dispatch({ type: "logout" });
                            setShowMobileUserMenu(false);
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-6 py-3 w-full hover:bg-gray-100 text-red-600 text-base font-semibold"
                        >
                          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
