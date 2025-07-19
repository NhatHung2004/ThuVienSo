"use client";

import { useContext, useState } from "react";
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
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { MyUserContext, MyUserDispatchContext } from "../../configs/MyContext";

const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyUserDispatchContext);

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
            </div>
          </form>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {!user ? (
            <Link to="/login" className="text-sm/6 font-semibold text-gray-900">
              Đăng nhập <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <button
              onClick={() => {
                dispatch({ type: "logout" });
              }}
              className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
            >
              Đăng xuất <span aria-hidden="true"></span>
            </button>
          )}
        </div>
      </nav>
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
                {!user && (
                  <Link
                    to="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Đăng nhập <span aria-hidden="true">&rarr;</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
