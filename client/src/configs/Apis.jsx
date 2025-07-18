import axios from "axios";
import cookie from "react-cookies";

const BASE_URL = "http://127.0.0.1:5000/api/";

export const authApis = () => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${cookie.load("token")}`,
    },
    withCredentials: true, // 👈 Thêm dòng này
  });
};

export const Apis = axios.create({
  baseURL: BASE_URL,
});
