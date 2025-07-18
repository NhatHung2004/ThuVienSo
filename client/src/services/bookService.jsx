import Apis from "../configs/Apis";

export const getAllBooks = () => {
  return Apis.get("/books");
};
