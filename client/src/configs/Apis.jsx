import axios from "axios";
import cookie from "react-cookies";

// const BASE_URL = "https://thuvienso-nj80.onrender.com/api/";
const BASE_URL = "http://127.0.0.1:5000/api/";

// eslint-disable-next-line react-refresh/only-export-components
export const authApis = () => {
	return axios.create({
		baseURL: BASE_URL,
		headers: {
			Authorization: `Bearer ${cookie.load("token")}`,
		},
	});
};

export const Apis = axios.create({
	baseURL: BASE_URL,
});
