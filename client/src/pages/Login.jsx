import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Apis } from "../configs/Apis";
import cookie from "react-cookies";
import { MyUserDispatchContext } from "../configs/MyContext";
import { Eye, EyeOff } from "lucide-react"; // icon con mắt
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [pw, setPw] = useState("");
	const [showPw, setShowPw] = useState(false); // 👈 state bật/tắt hiển thị mật khẩu
	const dispatch = useContext(MyUserDispatchContext);

	const handleGoogleLogin = async (credentialResponse) => {
		const id_token = credentialResponse.credential;

		try {
			// Gửi token lên Flask để xác thực
			const res = await Apis.post("/auth/google", {
				id_token,
			});

			// Lưu JWT của hệ thống (do backend sinh ra)
			cookie.save("token", res.data.access_token);
			let user = await Apis.get(`/users/${res.data.user_id}`);
			dispatch({ type: "login", payload: user.data });
			navigate("/");
		} catch (err) {
			console.error("Login thất bại", err);
		}
	};

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
			let user = await Apis.get(`/users/${res.data.user_id}`);
			dispatch({ type: "login", payload: user.data });
			if (user.data.role === "UserRole.LIBRARIAN") {
				navigate("/librarian-home");
			} else if (user.data.role === "UserRole.ADMIN") {
				alert("Bạn không có quyền truy cập !!!");
			} else {
				navigate("/");
			}
		} catch {
			alert("Sai thông tin đăng nhập !!!");
			console.log("Có lỗi xảy ra!!!");
		}
	};

	return (
		<div className='flex flex-col justify-center sm:h-screen p-4'>
			<div className='max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8'>
				<div className='text-center mb-12'>
					<a href='javascript:void(0)'>
						<img
							src='https://ou.edu.vn/wp-content/uploads/2018/08/LOGO-TRUONGV21-12-2018-01-300x300.png'
							alt='logo'
							className='w-35 inline-block'
						/>
					</a>
				</div>

				<form>
					<div className='space-y-6'>
						<div>
							<label className='text-slate-900 text-sm font-medium mb-2 block'>
								Username
							</label>
							<input
								type='text'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='text-slate-900 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500'
								placeholder='Nhập username'
							/>
						</div>

						{/* Ô mật khẩu có icon 👁 */}
						<div>
							<label className='text-slate-900 text-sm font-medium mb-2 block'>
								Mật khẩu
							</label>
							<div className='relative'>
								<input
									type={showPw ? "text" : "password"}
									value={pw}
									onChange={(e) => setPw(e.target.value)}
									className='text-slate-900 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500 pr-10'
									placeholder='Nhập mật khẩu'
								/>
								<span
									className='absolute right-3 top-3 cursor-pointer text-gray-500'
									onClick={() => setShowPw(!showPw)}
								>
									{showPw ? <EyeOff size={20} /> : <Eye size={20} />}
								</span>
							</div>
						</div>
					</div>

					<div className='mt-12'>
						<button
							type='button'
							onClick={login}
							className='w-full py-3 px-4 text-sm tracking-wider font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer'
						>
							Đăng nhập
						</button>
					</div>
					<div className='mt-4'>
						<GoogleLogin
							onSuccess={handleGoogleLogin}
							onError={() => {
								console.log("Login Failed");
							}}
						/>
					</div>
					<p className='text-slate-600 text-sm mt-6 text-center'>
						Chưa có tài khoản?{" "}
						<a
							href='#'
							onClick={() => navigate("/register")}
							className='text-blue-600 font-medium hover:underline ml-1'
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
