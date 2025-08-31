import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { useContext, createContext, useState, useRef, useEffect } from "react";
import { MyUserContext, MyUserDispatchContext } from "../../configs/MyContext";
import { useNavigate } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null); // NEW
  const iconRef = useRef(null); // NEW
  const user = useContext(MyUserContext);
  const navigate = useNavigate();
  const dispatch = useContext(MyUserDispatchContext);

  // 👇 Auto close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="relative h-screen">
      <nav className="h-full flex flex-col bg-white shadow-sm">
        {/* HEADER */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://ou.edu.vn/wp-content/uploads/2018/08/LOGO-TRUONGV21-12-2018-01-300x300.png"
            className={`overflow-hidden transition-all ${
              expanded ? "w-20" : "w-0"
            }`}
            alt="Logo"
          />
          <button
            onClick={() => {
              setExpanded((curr) => {
                if (!curr) setMenuOpen(false); // đóng menu nếu thu gọn
                return !curr;
              });
            }}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* MENU */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-2">{children}</ul>
        </SidebarContext.Provider>

        {/* FOOTER */}
        <div className="relative border-t flex p-3 items-center">
          <img src={user.avatar} alt="" className="w-10 h-10 rounded-md" />
          <div
            className={`flex justify-between items-center transition-all duration-300 ${
              expanded ? "w-52 ml-3" : "w-0"
            } overflow-hidden`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">
                {user.firstname} {user.lastname}
              </h4>
              <span className="text-xs text-gray-600">{user.email}</span>
            </div>
          </div>

          {expanded && (
            <MoreVertical
              size={20}
              className="ml-auto cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
              ref={iconRef}
            />
          )}

          {/* DROPDOWN MENU */}
          {menuOpen && (
            <div
              ref={dropdownRef}
              className={`absolute ${
                expanded ? "left-[250px]" : "left-[80px]"
              } bottom-4 w-64 bg-gray-900 text-white rounded-lg shadow-lg p-4 z-50`}
            >
              <div className="flex gap-3 items-center border-b border-gray-700 pb-3">
                <img
                  src={user.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-semibold">
                    {user.firstname} {user.lastname}
                  </div>
                  <div className="text-sm text-gray-300">{user.email}</div>
                </div>
              </div>
              <ul className="pt-3">
                <li
                  className="py-2 px-3 hover:bg-gray-800 rounded cursor-pointer"
                  onClick={() => {
                    // logout logic here
                    navigate("/", { replace: true });
                    dispatch({ type: "logout" });
                  }}
                >
                  Log out
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, to }) {
  const { expanded } = useContext(SidebarContext);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <li
      className={`
        relative flex items-center py-7 px-3 my-8
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
      onClick={handleClick}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
