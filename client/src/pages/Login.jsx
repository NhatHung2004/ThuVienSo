import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, Apis } from "../configs/Apis";
import cookie from "react-cookies";
import { MyUserDispatchContext } from "../configs/MyContext";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const dispatch = useContext(MyUserDispatchContext);

  const login = async (e) => {
    e.preventDefault();

    if (!username.trim() || !pw.trim()) {
      alert("Vui lòng điền đầy đủ thông tin!!!");
      return;
    }

    const data = {
      username: username,
      password: pw,
    };

    try {
      let res = await Apis.post("/auth/login", data);
      console.log(res.data.access_token);
      cookie.save("token", res.data.access_token);
      let user = await authApis().get(`/users/${res.data.user_id}`);
      dispatch({ type: "login", payload: user.data });
      if (user.data.role === "UserRole.LIBRARIAN") {
        navigate("/librarian-home");
      } else if (user.data.role === "UserRole.ADMIN") {
        alert("Bạn không có quyền truy cập !!!");
      } else {
        navigate("/");
      }
    } catch {
      console.log("Có lỗi xảy ra!!!");
    }
  };
  return (
    <div class="flex flex-col justify-center sm:h-screen p-4">
      <div class="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
        <div class="text-center mb-12">
          <a href="javascript:void(0)">
            <img
              src="https://ou.edu.vn/wp-content/uploads/2018/08/LOGO-TRUONGV21-12-2018-01-300x300.png"
              alt="logo"
              class="w-35 inline-block"
            />
          </a>
        </div>

        <form>
          <div class="space-y-6">
            <div>
              <label class="text-slate-900 text-sm font-medium mb-2 block">
                Username
              </label>
              <input
                name="email"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                class="text-slate-900 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Nhập username"
              />
            </div>
            <div>
              <label class="text-slate-900 text-sm font-medium mb-2 block">
                Mật khẩu
              </label>
              <input
                name="password"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                class="text-slate-900 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <div class="mt-12">
            <button
              type="button"
              onClick={login}
              class="w-full py-3 px-4 text-sm tracking-wider font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
            >
              Đăng nhập
            </button>
          </div>
          <p class="text-slate-600 text-sm mt-6 text-center">
            Chưa có tài khoản?{" "}
            <a
              href="#"
              onClick={() => navigate("/register")}
              className="text-blue-600 font-medium hover:underline ml-1"
            >
              Đăng ký ngay
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
