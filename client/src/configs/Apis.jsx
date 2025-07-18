import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000/api/";

// Create named Axios instance
const Apis = axios.create({
  baseURL: BASE_URL,
});

export default Apis;
