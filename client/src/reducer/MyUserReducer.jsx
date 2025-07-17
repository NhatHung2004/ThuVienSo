import cookie from "react-cookies";

const myUserReducer = (current, action) => {
  switch (action.type) {
    case "login":
      // Lưu dữ liệu người dùng vào localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;
    case "logout":
      cookie.remove("token");
      localStorage.removeItem("user");
      return null;
    default:
      // Nếu action.type không khớp với “login” hoặc “logout” thì giữ nguyên state hiện tại
      return current;
  }
};

export default myUserReducer;
