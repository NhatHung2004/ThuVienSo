import cookie from "react-cookies";

const myUserReducer = (current, action) => {
  switch (action.type) {
    case "login":
      console.log("current user in logout: ", action.payload?.role);
      if (action.payload?.role === "UserRole.READER") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else if (action.payload?.role === "UserRole.LIBRARIAN") {
        sessionStorage.setItem("user", JSON.stringify(action.payload));
      }
      return action.payload;

    case "logout":
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      cookie.remove("token");
      return null;

    default:
      return current;
  }
};

export default myUserReducer;
