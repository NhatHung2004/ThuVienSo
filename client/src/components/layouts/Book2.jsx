import React from "react";
import { Link } from "react-router-dom";

const Book2 = ({ book, relatedBooks }) => {
  const { title, image, quantity = 0 } = book;

  return (
    <Link
      to={`/book-detail/${book.id}`}
      state={{ book, relatedBooks }} // Truyền cả book và relatedBooks
      className="mx-auto w-[190px] sm:w-[180px] md:w-[220px] lg:w-[240px]"
    >
      {/* Container bìa sách */}
      <div className="relative group shadow-md rounded-md overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-[240px] sm:h-[280px] md:h-[300px] lg:h-[360px] object-cover rounded-md"
        />
      </div>

      {/* Tên sách */}
      <p className="text-center font-medium mt-2 text-sm text-gray-800">
        {title}
      </p>

      {/* Trạng thái */}
      <p
        className={`text-center font-medium ${
          quantity > 0 ? "text-green-600" : "text-red-500"
        }`}
      >
        {quantity > 0 ? `Còn ${quantity} quyển` : "Hết sách"}
      </p>
    </Link>
  );
};

export default Book2;
