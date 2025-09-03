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
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  // form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // File or null
  const [quantity, setQuantity] = useState("");
  const [author, setAuthor] = useState(""); // used when authorMode === 'select'
  const [selectedCategory, setSelectedCategory] = useState(""); // cate.name
  const [publishedDate, setPublishedDate] = useState(""); // New state for published_date
  const [openDialog, setOpenDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // author/category modes
  const [authorMode, setAuthorMode] = useState("select"); // "select" | "new"
  const [categoryMode, setCategoryMode] = useState("select"); // "select" | "new"
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // edit state
  const [editingBookId, setEditingBookId] = useState(null); // null = creating

  // search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // Default to newest

  const navigate = useNavigate();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await Apis.get("/books/");
      setBooks(res.data || []);
      setFilteredBooks(res.data || []);
    } catch (err) {
      console.error("Có lỗi khi tải danh sách sách", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await Apis.get("/categories/");
      setCates(res.data || []);
      if ((res.data || []).length > 0 && !selectedCategory)
        setSelectedCategory(res.data[0].name);
    } catch (err) {
      console.error("Có lỗi khi tải danh sách thể loại", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthor = async () => {
    setLoading(true);
    try {
      const res = await Apis.get("/authors/");
      setAuthors(res.data || []);
    } catch (err) {
      console.error("Có lỗi khi tải danh sách tác giả", err);
    } finally {
      setLoading(false);
    }
  };

  // filter and sort logic
  const filterBooks = () => {
    let filtered = [...books];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((book) => {
        const title = book.title || "";
        const authorName = book.author || "";
        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          authorName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Category filter
    if (filterCategory && filterCategory !== "all") {
      filtered = filtered.filter((book) => {
        return (
          book.category_id === parseInt(filterCategory) ||
          String(book.category) === String(filterCategory) ||
          String(book.category_id) === String(filterCategory)
        );
      });
    }

    // Status filter
    if (filterStatus === "available") {
      filtered = filtered.filter((book) => (book.quantity || 0) > 0);
    } else if (filterStatus === "unavailable") {
      filtered = filtered.filter((book) => (book.quantity || 0) === 0);
    }

    // Sort logic
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
        return dateB - dateA; // Newest first
      });
    }

    setFilteredBooks(filtered);
  };

  useEffect(() => {
    filterBooks();
  }, [searchTerm, filterCategory, filterStatus, sortBy, books]);

  // Initial data
  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchAuthor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setImage(file);
    }
  };

  // mở dialog để tạo mới
  const openCreateDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  // mở dialog để sửa
  const openEditDialog = (book) => {
    setEditingBookId(book.id);

    const bookAuthor = book.author || book.author_name || "";
    const foundAuthor = authors.find((a) => a.name === bookAuthor);
    if (foundAuthor) {
      setAuthorMode("select");
      setAuthor(foundAuthor.name);
      setNewAuthor("");
    } else {
      setAuthorMode("new");
      setNewAuthor(bookAuthor);
      setAuthor("");
    }

    let catName = "";
    if (book.category) catName = book.category;
    else if (book.category_name) catName = book.category_name;
    else if (book.category_id && cates.length > 0) {
      const found = cates.find(
        (c) => Number(c.id) === Number(book.category_id)
      );
      if (found) catName = found.name;
    }

    if (catName) {
      setCategoryMode("select");
      setSelectedCategory(catName);
      setNewCategory("");
    } else {
      setCategoryMode("new");
      setNewCategory("");
    }

    setName(book.title || "");
    setDescription(book.description || "");
    setQuantity(String(book.quantity || ""));
    setPublishedDate(book.published_date || "");

    if (book.image) {
      setPreviewUrl(book.image);
      setImage(book.image);
    } else {
      setPreviewUrl(null);
      setImage("");
    }

    setOpenDialog(true);
  };

  // reset form
  const resetForm = () => {
    setName("");
    setDescription("");
    setImage("");
    setPreviewUrl(null);
    setQuantity("");
    setAuthor("");
    setNewAuthor("");
    setNewCategory("");
    setPublishedDate("");
    setAuthorMode("select");
    setCategoryMode("select");
    setEditingBookId(null);
    if (cates.length > 0) setSelectedCategory(cates[0].name);
  };

  // kiểm tra validation
  const isFormValid = () => {
    const hasName = name.trim();
    const hasQuantity = String(quantity).trim() !== "";
    const hasAuthor = authorMode === "new" ? newAuthor.trim() : author.trim();
    const hasCategory =
      categoryMode === "new" ? newCategory.trim() : selectedCategory;
    return hasName && hasQuantity && hasAuthor && hasCategory;
  };

  // submit (tạo mới hoặc cập nhật)
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", name);
      formData.append("description", description);

      if (image && typeof image === "object") {
        formData.append("image", image);
      }

      formData.append("quantity", parseInt(quantity || 0, 10));
      formData.append("published_date", publishedDate);

      const finalAuthor = authorMode === "new" ? newAuthor : author;
      formData.append("author", finalAuthor);

      const finalCategory =
        categoryMode === "new" ? newCategory : selectedCategory;
      formData.append("category", finalCategory);

      if (editingBookId) {
        await authApis().patch(`/books/${editingBookId}`, formData);
        alert("Cập nhật sách thành công");
      } else {
        await authApis().post(`/books/`, formData);
        alert("Thêm sách thành công");
      }

      setOpenDialog(false);
      resetForm();
      fetchBooks();
    } catch (err) {
      console.error("Lỗi khi lưu sách", err);
      alert("Có lỗi khi lưu sách");
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa cuốn sách này không?"
    );
    if (!confirmDelete) return;
    try {
      setLoading(true);
      await authApis().delete(`/books/${id}`);
      alert("Đã xóa sách thành công");
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi xóa sách");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Dialog thêm/sửa sách */}
      {openDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-200 px-8 py-6 bg-gray-50">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingBookId ? "✏️ Cập nhật sách" : "📚 Thêm sách mới"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Điền thông tin chi tiết để lưu sách
                </p>
              </div>
              <button
                onClick={() => {
                  setOpenDialog(false);
                  setEditingBookId(null);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg p-2 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 max-h-[75vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Section 1 */}
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
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg"
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
                        min="0"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg"
                        placeholder="Nhập số lượng"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày xuất bản
                      </label>
                      <input
                        type="date"
                        value={publishedDate}
                        onChange={(e) => setPublishedDate(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg"
                        placeholder="Chọn ngày xuất bản"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: tác giả */}
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
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                          authorMode === "select"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 border"
                        }`}
                      >
                        📋 Chọn có sẵn
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthorMode("new")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                          authorMode === "new"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 border"
                        }`}
                      >
                        ➕ Thêm mới
                      </button>
                    </div>
                    {authorMode === "select" ? (
                      <select
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="">-- Chọn tác giả --</option>
                        {authors.map((a) => (
                          <option key={a.id || a.name} value={a.name}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg"
                        placeholder="Nhập tên tác giả mới"
                      />
                    )}
                  </div>
                </div>

                {/* Section 3: thể loại */}
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
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                          categoryMode === "select"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 border"
                        }`}
                      >
                        📚 Chọn có sẵn
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryMode("new")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                          categoryMode === "new"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 border"
                        }`}
                      >
                        🆕 Tạo mới
                      </button>
                    </div>
                    {categoryMode === "select" ? (
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white"
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
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg"
                          placeholder="Nhập tên thể loại mới"
                        />
                        <button
                          onClick={async () => {
                            if (!newCategory.trim()) {
                              alert("Vui lòng nhập tên thể loại mới!");
                              return;
                            }
                            try {
                              setLoading(true);
                              const res = await authApis().post(
                                "/categories/",
                                { name: newCategory }
                              );
                              setCates((prev) => [...prev, res.data]);
                              setCategoryMode("select");
                              setSelectedCategory(res.data.name);
                              setNewCategory("");
                              alert("Thêm thể loại thành công");
                            } catch (err) {
                              console.error(err);
                              alert("Có lỗi khi thêm thể loại");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          disabled={loading || !newCategory.trim()}
                          className={`w-full px-4 py-2 rounded-lg font-medium ${
                            loading || !newCategory.trim()
                              ? "bg-gray-300 text-gray-500"
                              : "bg-green-600 text-white"
                          }`}
                        >
                          {loading ? "Đang thêm..." : "Thêm thể loại mới"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 4: mô tả & ảnh */}
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
                        rows={4}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg resize-none"
                        placeholder="Nhập mô tả..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hình ảnh bìa sách
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                          className="w-full px-3 py-3 border-2 border-dashed rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100"
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
                            className="max-h-48 rounded-lg border"
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
                  onClick={() => {
                    setOpenDialog(false);
                    resetForm();
                  }}
                  className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !isFormValid()}
                  className={`px-8 py-2.5 rounded-lg font-medium ${
                    loading || !isFormValid()
                      ? "bg-gray-300 text-gray-500"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {loading
                    ? "Đang lưu..."
                    : editingBookId
                    ? "Cập nhật"
                    : "Thêm sách"}
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
      </Sidebar>

      <div className="flex-1 p-4 overflow-auto">
        <h1 className="text-xl font-bold mb-6">Trang quản lý thư viện</h1>

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
                  className="w-full p-2 border rounded pl-10"
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
                className="w-full p-2 border rounded"
              >
                <option value="all">Tất cả</option>
                {cates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
              >
                <option value="newest">Mới nhất</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
              </select>
            </div>

            <button
              onClick={openCreateDialog}
              className="bg-[#2563eb] text-white px-4 py-2 rounded"
            >
              Thêm sách
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Sách
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
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
                            onClick={() => openEditDialog(book)}
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
                            onClick={() => deleteBook(book.id)}
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
