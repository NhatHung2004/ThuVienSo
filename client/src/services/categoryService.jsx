import Apis from "../configs/Apis";

export const getAllCategory = () => {
  return Apis.get("/categories");
};
