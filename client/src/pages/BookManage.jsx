import React, { useEffect, useState } from "react";
import Sidebar, { SidebarItem } from "../components/layouts/Sidebar";
import { Apis, authApis } from "../configs/Apis";
import {
  Receipt,
  Package,
  ClipboardList,
  FileBadge,
  BarChart2,
  BanknoteArrowUp,
  Clipboard,
  Search,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const BookManage = () => {
  const [loading, setLoading] = useState(false);
  const [cates, setCates] = useState([]);
  const [authors, setAuthors] = useState([]); // Thêm danh sách tác giả
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // States cho tác giả và thể loại
  const [authorMode, setAuthorMode] = useState("select"); // "select" hoặc "new"
  const [categoryMode, setCategoryMode] = useState("select"); // "select" hoặc "new"
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // States cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("all");

  const navigate = useNavigate();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await Apis.get("/books/");
      setBooks(res.data);
      setFilteredBooks(res.data);

      console.log(res.data);
    } catch {
      setLoading(false);
      console.log("Có lỗi khi tải danh sách sách");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await Apis.get("/categories/");
      setCates(res.data);
      if (res.data.length > 0) setSelectedCategory(res.data[0].name);
      console.log(res.data);
    } catch {
      setLoading(false);
      console.log("Có lỗi khi tải danh sách sách phân loại");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthor = async () => {
    setLoading(true);
    try {
      const res = await Apis.get("/authors/");
      setAuthors(res.data);
      console.log(res.data);
    } catch {
      setLoading(false);
      console.log("Có lỗi khi tải danh sách sách phân loại");
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm và lọc
  const filterBooks = () => {
    let filtered = [...books];

    // Tìm kiếm theo tên sách hoặc tác giả
    if (searchTerm.trim()) {
      filtered = filtered.filter((book) => {
        const title = book.title || "";
        const author = book.author || "";
        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Lọc theo thể loại
    if (filterCategory && filterCategory !== "all") {
      filtered = filtered.filter(
        (book) =>
          book.category_id === parseInt(filterCategory) ||
          book.category === parseInt(filterCategory)
      );
    }

    // Lọc theo trạng thái
    if (filterStatus === "available") {
      filtered = filtered.filter((book) => (book.quantity || 0) > 0);
    } else if (filterStatus === "unavailable") {
      filtered = filtered.filter((book) => (book.quantity || 0) === 0);
    }

    // Sắp xếp
    if (sortBy === "name-asc") {
      filtered = filtered.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    } else if (sortBy === "name-desc") {
      filtered = filtered.sort((a, b) =>
        (b.title || "").localeCompare(a.title || "")
      );
    } else if (sortBy === "newest") {
      filtered = filtered.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
      });
    }

    setFilteredBooks(filtered);
  };

  // Gọi filterBooks khi có thay đổi trong tìm kiếm/lọc
  useEffect(() => {
    filterBooks();
    fetchAuthor();
  }, [searchTerm, filterCategory, filterStatus, sortBy, books]);

  const addBook = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", name);
      formData.append("description", description);
      formData.append("image", image); // File object
      formData.append("quantity", parseInt(quantity));

      // Xử lý tác giả
      const finalAuthor = authorMode === "new" ? newAuthor : author;
      formData.append("author", finalAuthor);

      console.log("Thể loại sác:", selectedCategory);

      // Xử lý thể loại
      const finalCategory =
        categoryMode === "new" ? newCategory : selectedCategory;
      formData.append("category", finalCategory);

      const res = await authApis().post("/books/", formData);
      alert("Thêm sách thành công:", res.data);

      // Đóng dialog và reset form
      setOpenDialog(false);
      resetForm();

      // Cập nhật danh sách sách
      fetchBooks();
    } catch (error) {
      console.error("Có lỗi khi thêm sách:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCate = async () => {
    if (!newCategory.trim()) {
      alert("Vui lòng nhập tên thể loại mới!");
      return;
    }
    try {
      setLoading(true);
      const res = await authApis().post("/categories/", { name: newCategory });
      alert("Thêm thể loại thành công");
      // Cập nhật danh sách categories
      setCates([...cates, res.data]);
      // Chuyển về mode select và chọn category mới
      setCategoryMode("select");
      setSelectedCategory(res.data.name);
      // Reset input newCategory
      setNewCategory("");
    } catch (err) {
      console.log(err);
      alert("Có lỗi khi thêm thể loại!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setImage("");
    setPreviewUrl(null);
    setQuantity("");
    setAuthor("");
    setNewAuthor("");
    setNewCategory("");
    setAuthorMode("select");
    setCategoryMode("select");
    if (cates.length > 0) setSelectedCategory(cates[0].name);
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setImage(file);
    }
  };

  // Kiểm tra validation
  const isFormValid = () => {
    const hasName = name.trim();
    const hasQuantity = quantity.trim();
    const hasAuthor = authorMode === "new" ? newAuthor.trim() : author.trim();
    const hasCategory =
      categoryMode === "new" ? newCategory.trim() : selectedCategory;

    return hasName && hasQuantity && hasAuthor && hasCategory;
  };

  return (
    <div className="flex h-screen">
      {/* Dialog thêm sách */}
      {openDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-200 px-8 py-6 bg-gray-50">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  📚 Thêm sách mới
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Điền thông tin chi tiết để thêm sách vào thư viện
                </p>
              </div>
              <button
                onClick={() => setOpenDialog(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg p-2 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 max-h-[75vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Section 1: Thông tin cơ bản */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-bold text-sm">1</span>
                    </div>
                    Thông tin cơ bản
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên sách <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors"
                        placeholder="Nhập tên sách"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors"
                        placeholder="Nhập số lượng"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Tác giả */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-bold text-sm">2</span>
                    </div>
                    Thông tin tác giả
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tác giả <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setAuthorMode("select")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          authorMode === "select"
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        📋 Chọn có sẵn
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthorMode("new")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          authorMode === "new"
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        ➕ Thêm mới
                      </button>
                    </div>
                    {authorMode === "select" ? (
                      <select
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors bg-white"
                      >
                        <option value="">-- Chọn tác giả --</option>
                        {authors.map((authorItem, index) => (
                          <option key={index} value={authorItem.name}>
                            {authorItem.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors"
                        placeholder="Nhập tên tác giả mới"
                      />
                    )}
                  </div>
                </div>

                {/* Section 3: Thể loại */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-bold text-sm">3</span>
                    </div>
                    Phân loại sách
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Thể loại <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setCategoryMode("select")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          categoryMode === "select"
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        📚 Chọn có sẵn
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryMode("new")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          categoryMode === "new"
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        🆕 Tạo mới
                      </button>
                    </div>
                    {categoryMode === "select" ? (
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors bg-white"
                      >
                        <option value="">-- Chọn thể loại --</option>
                        {cates.map((cate) => (
                          <option key={cate.id} value={cate.name}>
                            {cate.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors"
                          placeholder="Nhập tên thể loại mới"
                        />
                        <button
                          onClick={addCate}
                          disabled={loading || !newCategory.trim()}
                          className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                            loading || !newCategory.trim()
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700 shadow-lg"
                          }`}
                        >
                          {loading ? "Đang thêm..." : "Thêm thể loại mới"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 4: Mô tả & Hình ảnh */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-bold text-sm">4</span>
                    </div>
                    Mô tả & Hình ảnh
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả sách
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors resize-none"
                        placeholder="Nhập mô tả chi tiết về cuốn sách..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hình ảnh bìa sách
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleImageChange}
                          className="w-full px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                          accept="image/*"
                        />
                      </div>
                      {previewUrl && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">
                            Xem trước:
                          </p>
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-48 rounded-lg border border-gray-200 shadow-sm mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t bg-gray-50 px-8 py-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="text-red-500">*</span> Các trường bắt buộc
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setOpenDialog(false)}
                  className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={addBook}
                  disabled={loading || !isFormValid()}
                  className={`px-8 py-2.5 rounded-lg font-medium transition-all ${
                    loading || !isFormValid()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {loading ? "Đang thêm..." : "Thêm sách"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Sidebar>
        <SidebarItem icon={<Receipt />} text="Quản lý sách" to="/book-manage" />
        <SidebarItem
          icon={<BanknoteArrowUp />}
          text="Duyệt mượn"
          to="/book-request"
        />
        <SidebarItem icon={<BarChart2 />} text="Thống kê" to="/stat" />
      </Sidebar>

      {/* Nội dung chính */}
      <div className="flex-1 p-4 overflow-auto">
        <h1 className="text-xl font-bold mb-6">Trang quản lý thư viện</h1>

        {/* Phần tìm kiếm và bộ lọc */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập tên sách, tác giả,..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
              </div>
            </div>

            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thể loại
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                {cates.map((cate) => (
                  <option key={cate.id} value={cate.id}>
                    {cate.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="available">Còn sách</option>
                <option value="unavailable">Đã hết</option>
              </select>
            </div>

            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sắp xếp
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Mặc định</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>

            <button
              onClick={() => setOpenDialog(true)}
              className="bg-[#2563eb] text-white px-4 py-2 rounded hover:bg-[#1d4ed8] transition h-[42px] font-medium"
            >
              Thêm sách
            </button>
          </div>
        </div>

        {/* Ngăn cách */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Bảng danh sách sách */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Danh sách sách</h2>
          <p className="text-gray-600 mb-4">
            Quản lý toàn bộ sách trong thư viện. Tìm thấy {filteredBooks.length}{" "}
            cuốn sách
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Sách
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy sách nào phù hợp
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <strong className="font-semibold">
                            {book.title}
                          </strong>
                          <div className="text-gray-600">{book.author}</div>
                          <div className="text-sm text-gray-500">
                            ISBN: {book.isbn || "Chưa cập nhật"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            book.quantity > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.quantity > 0
                            ? `Còn ${book.quantity} cuốn`
                            : "Đã hết"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-yellow-500">
                          <span>★</span>
                          <span className="ml-1 text-gray-700">
                            {book.average_rating || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            title="Sửa"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => navigate(`/book-detail/${book.id}`)}
                            className="text-green-600 hover:text-green-800"
                            title="Xem chi tiết"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 3C5 3 1.73 7.11 1.05 10c.68 2.89 3.95 7 8.95 7s8.27-4.11 8.95-7c-.68-2.89-3.95-7-8.95-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                            </svg>
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            title="Xóa"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookManage;
