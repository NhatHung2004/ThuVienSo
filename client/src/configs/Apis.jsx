import axios from "axios";
import cookie from "react-cookies";

const BASE_URL = "https://thuvienso-production.up.railway.app/api/";

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
