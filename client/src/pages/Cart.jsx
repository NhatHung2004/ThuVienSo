import React from "react";

const cartItems = [
  {
    id: 1,
    title: "Dế Mèn phiêu lưu ký",
    author: "Nguyễn Văn A",
    date: "11/2/2025",
    category: "Thể loại",
    image:
      "https://thanhnien.mediacdn.vn/Uploaded/minhnguyet/2022_05_08/bia-sach2-9886.jpg",
  },
  {
    id: 2,
    title: "Dế Mèn phiêu lưu ký",
    author: "Nguyễn Văn A",
    date: "11/2/2025",
    category: "Thể loại",
    image:
      "https://thanhnien.mediacdn.vn/Uploaded/minhnguyet/2022_05_08/bia-sach2-9886.jpg",
  },
];

const Cart = () => {
  return (
    <div className="w-full min-h-screen mb-20 bg-white flex flex-col">
      {/* Banner */}
      <div className="w-full h-fit">
        <img
          src="https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg"
          className="w-full h-[200px] object-cover"
          alt="Library"
        />
      </div>

      {/* Tiêu đề */}
      <div className="relative w-full p-6 md:mt-10">
        <h1
          style={{ color: "#214E99" }}
          className="md:text-4xl font-bold text-blue-600 text-center text-2xl"
        >
          Giỏ hàng
        </h1>
      </div>

      <div className="w-full flex flex-col md:flex-row px-4 md:px-20 gap-8">
        {/* Danh sách đơn */}
        <div className="w-full md:w-2/3 flex flex-col">
          <div className="w-full md:w-[95%] h-12 flex items-center border border-gray-400 rounded-lg px-4 mb-4">
            <label className="font-semibold">
              <input type="checkbox" className="mr-2" />
              Chọn tất cả sách
            </label>
          </div>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="w-full md:w-[95%] flex bg-white flex-row border border-gray-200 rounded-lg shadow-sm mb-4"
            >
              <label className="md:ml-10 font-semibold mt-5">
                <input
                  type="checkbox"
                  className="mr-5 ml-5 md:ml-0 md:mt-2 scale-150 hidden md:block"
                />
              </label>
              <div className="w-full flex flex-col gap-4 mt-4 ml-4 md:ml-0">
                <h2 className="font-bold text-2xl ">{item.title}</h2>
                <div className="flex items-center gap-2">
                  <p className="text-8sm font-bold text-gray-800">Tác giả:</p>
                  <p className="text-5sm text-gray-600">{item.author}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-8sm font-bold text-gray-800">Ngày thêm:</p>
                  <p className="text-5sm text-gray-600">{item.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-8sm font-bold text-gray-800">Thể loại:</p>
                  <p className="text-5sm text-gray-600">{item.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex mt-1 items-center  overflow-hidden">
                    <button className="px-2 py-1 bg-white hover:bg-gray-200">
                      -
                    </button>
                    <span className="px-3">1</span>
                    <button className="px-2 py-1 bg-white hover:bg-gray-200">
                      +
                    </button>
                  </div>
                </div>
              </div>
              <img
                src={item.image}
                alt="Ảnh bìa"
                className="w-55 my-2 mr-2 h-55 object-cover rounded-lg shadow-lg"
              />
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-1/3 border border-black rounded-lg shadow-md h-fit">
          <div className="border-b border-black p-4">
            <h2 className="text-center font-bold text-xl uppercase">
              TÓM TẮT ĐƠN HÀNG
            </h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Tổng số sách:</span>
              <span>
                2 cuốn<noscript></noscript>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Đã chọn</span>
              <span>1 cuốn</span>
            </div>
          </div>
          <div className="border-t border-black p-4">
            <button className="mx-auto block text-black font-semibold">
              Mượn sách đã chọn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
