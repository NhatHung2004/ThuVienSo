import React from "react";

const Book = () => {
  return (
    <div className="min-w-[280px] h-fit md:mt-15 bg-gray-50 m-4 border rounded-lg p-4 shadow-lg duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer">
      <img
        src="https://thanhnien.mediacdn.vn/Uploaded/minhnguyet/2022_05_08/bia-sach2-9886.jpg"
        alt="Khám phá sách"
        className="w-full h-60 object-contain rounded-lg"
      />

      <hr className="w-full h-[1px] bg-gray-300 my-4 border-none" />

      <h3 className="text-lg font-semibold mt-2 truncate">
        Dế Mèn phiêu lưu ký
      </h3>
      <p className="text-2sm text-gray-600 mt-1">Tác giả: Tô Hoài</p>
      <p className="text-2sm text-gray-500 mt-1 truncate">
        "Một tác phẩm kinh điển của văn học Việt Nam, kể về cuộc phiêu lưu của
        chú dế mèn....."
      </p>

      <div className="w-full flex flex-row mt-4">
        {[...Array(4)].map((_, i) => (
          <img
            key={i}
            src="../../../public/star.svg"
            alt="borrow icons"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(79%) sepia(60%) saturate(530%) hue-rotate(1deg) brightness(102%) contrast(104%)",
            }}
            className="w-4 h-4 object-contain rounded-lg m-1"
          />
        ))}
        <img
          src="../../../public/star (1).svg"
          alt="borrow icons"
          className="w-4 h-4 object-contain rounded-lg m-1"
        />
        <img
          src="../../../public/book-download.svg"
          title="borrow icons"
          alt="Khám phá sách"
          className="object-contain rounded-lg ml-16"
        />
        <p>1000</p>
      </div>
    </div>
  );
};

export default Book;
