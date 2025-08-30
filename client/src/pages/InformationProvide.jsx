import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Apis, authApis } from "../configs/Apis"; // Giả sử bạn có authApis ở đây
import { MyUserContext } from "../configs/MyContext";

const InformationProvide = () => {
  const user = useContext(MyUserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedBooks = [], selectedCartId } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Bước 1: Thông tin cá nhân
    fullName: "",
    email: "",
    phone: "",
    cccd: "",
    birthDate: "",
    profession: "",

    // Bước 2: Địa chỉ liên hệ
    address: "",
    ward: "",
    district: "",
    city: "",
    postalCode: "",

    // Bước 3: Chi tiết mượn sách
    borrowDays: "7",
    returnDate: "22/8/2025",
    purpose: "",
    receiveMethod: "DIRECT",
    emergencyContactName: "",
    emergencyContactPhone: "",
    relationship: "",

    // Bước 4: Xác nhận
    agreeTerms1: false,
    agreeTerms2: false,
    agreeNotifications: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Xử lý gửi request khi ở bước 4
      if (!formData.agreeTerms1 || !formData.agreeTerms2) {
        alert("Bạn cần đồng ý với các điều khoản bắt buộc!");
        return;
      }

      const payload = {
        user_id: user.id,
        books: selectedBooks.map((item) => ({
          book_id: item.id,
          quantity: item.quantity,
        })),
        borrowing_method:
          formData.receiveMethod === "Nhận tại thư viện"
            ? "DIRECT"
            : "DELIVERY",
        purpose: formData.purpose,
        name: formData.fullName,
        phone: formData.phone,
        cccd: formData.cccd,
        job: formData.profession,
        address: formData.address,
        ward: formData.ward,
        province: formData.city, // đúng theo backend
        city: formData.city,
        number_of_requests_day: 1, // backend dường như expect 1
      };

      console.log("Dữ liệu trước khi gửi đi", payload);

      try {
        const res = await authApis().post("/requests", payload);
        console.log("Request thành công: ", res.data);
        for (const book of selectedBooks) {
          await authApis().patch(`/carts`, {
            cart_id: selectedCartId,
            book_id: book.id,
            quantity: book.quantity,
          });
          const bookRes = await Apis.get(`/books/${book.id}`);

          const formData = new FormData();
          formData.append("quantity", bookRes.data.quantity - book.quantity);

          await authApis().patch(`/books/${book.id}`, formData);
        }
        alert("Mượn sách thành công!");
        // Tùy chọn: Xóa sách khỏi giỏ hàng hoặc navigate về trang khác
        navigate("/cart"); // Ví dụ quay về cart
      } catch (err) {
        console.log(err);
        alert("Có lỗi xảy ra khi gửi yêu cầu!");
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepIndicator = ({ step, subtitle, isActive, isCompleted }) => (
    <div className="flex items-center space-x-3">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isCompleted
            ? "bg-green-500 text-white"
            : isActive
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        {isCompleted ? "✓" : step}
      </div>
      <div className="flex-1">
        <div
          className={`font-medium ${
            isActive
              ? "text-blue-600"
              : isCompleted
              ? "text-green-600"
              : "text-gray-500"
          }`}
        >
          Bước {step}
        </div>
        <div className="text-sm text-gray-600">{subtitle}</div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-blue-600 mb-6">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm">👤</span>
        </div>
        <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Nhập họ và tên đầy đủ"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="example@email.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="0123456789"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            CCCD/CMND <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.cccd}
            onChange={(e) => handleInputChange("cccd", e.target.value)}
            placeholder="Số căn cước công dân"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Ngày sinh <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange("birthDate", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nghề nghiệp</label>
          <input
            type="text"
            value={formData.profession}
            onChange={(e) => handleInputChange("profession", e.target.value)}
            placeholder="Sinh viên, Giáo viên, Kỹ sư..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-blue-600 mb-6">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm">📍</span>
        </div>
        <h2 className="text-xl font-semibold">Địa chỉ liên hệ</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Địa chỉ cụ thể <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Số nhà, tên đường..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ward}
              onChange={(e) => handleInputChange("ward", e.target.value)}
              placeholder="Phường/Xã"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => handleInputChange("district", e.target.value)}
              placeholder="Quận/Huyện"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Tỉnh/Thành phố"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mã bưu điện</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            placeholder="Mã bưu điện (không bắt buộc)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-blue-600 mb-6">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm">📚</span>
        </div>
        <h2 className="text-xl font-semibold">Chi tiết mượn sách</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Số ngày mượn <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.borrowDays}
            onChange={(e) => handleInputChange("borrowDays", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">7 ngày</option>
            <option value="14">14 ngày</option>
            <option value="30">30 ngày</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Ngày trả dự kiến: 22/8/2025
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Phương thức nhận sách
          </label>
          <select
            value={formData.receiveMethod}
            onChange={(e) => handleInputChange("receiveMethod", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Nhận tại thư viện">Nhận tại thư viện</option>
            <option value="Giao tận nơi">Giao tận nơi</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Mục đích mượn sách <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.purpose}
          onChange={(e) => handleInputChange("purpose", e.target.value)}
          placeholder="Nghiên cứu, học tập, tham khảo..."
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center space-x-2 text-gray-700 mb-4">
          <span className="text-sm">👥</span>
          <h3 className="font-semibold">Thông tin liên hệ khẩn cấp</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Họ tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) =>
                handleInputChange("emergencyContactName", e.target.value)
              }
              placeholder="Tên người liên hệ"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) =>
                handleInputChange("emergencyContactPhone", e.target.value)
              }
              placeholder="0123456789"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mối quan hệ
            </label>
            <select
              value={formData.relationship}
              onChange={(e) =>
                handleInputChange("relationship", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn mối quan hệ</option>
              <option value="Cha mẹ">Cha mẹ</option>
              <option value="Anh chị em">Anh chị em</option>
              <option value="Bạn bè">Bạn bè</option>
              <option value="Đồng nghiệp">Đồng nghiệp</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-blue-600 mb-6">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm">✓</span>
        </div>
        <h2 className="text-xl font-semibold">Xác nhận thông tin</h2>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-600 mb-4">
          <span className="text-sm">📋</span>
          <h3 className="font-semibold">Xác nhận thông tin</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <div>
              <strong>Họ tên:</strong> {formData.fullName || "adad"}
            </div>
            <div>
              <strong>Email:</strong> {formData.email || "ada"}
            </div>
            <div>
              <strong>Điện thoại:</strong> {formData.phone || "adad"}
            </div>
            <div>
              <strong>CCCD:</strong> {formData.cccd || "adad"}
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <strong>Địa chỉ:</strong> {formData.address || "adad"}
            </div>
            <div>
              <strong>Phường/XÃ:</strong> {formData.ward || "ada"}
            </div>
            <div>
              <strong>Quận/Huyện:</strong> {formData.district || "dadad"}
            </div>
            <div>
              <strong>Tỉnh/TP:</strong> {formData.city || "adad"}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200 space-y-2 text-sm">
          <div>
            <strong>Số ngày mượn:</strong> 7 ngày
          </div>
          <div>
            <strong>Ngày trả dự kiến:</strong> 22/8/2025
          </div>
          <div>
            <strong>Phương thức nhận:</strong> Nhận tại thư viện
          </div>
          <div>
            <strong>Liên hệ khẩn cấp:</strong>{" "}
            {formData.emergencyContactName || "adad"} -{" "}
            {formData.emergencyContactPhone || "adad"}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.agreeTerms1}
            onChange={(e) => handleInputChange("agreeTerms1", e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Tôi đồng ý với{" "}
            <span className="text-blue-600 underline">điều khoản sử dụng</span>{" "}
            và cam kết trả sách đúng hạn, bồi thường nếu làm hỏng hoặc mất sách.{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>

        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.agreeTerms2}
            onChange={(e) => handleInputChange("agreeTerms2", e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Tôi đồng ý với{" "}
            <span className="text-blue-600 underline">chính sách bảo mật</span>{" "}
            và việc thư viện sử dụng thông tin cá nhân để quản lý việc mượn
            sách. <span className="text-red-500">*</span>
          </span>
        </label>

        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.agreeNotifications}
            onChange={(e) =>
              handleInputChange("agreeNotifications", e.target.checked)
            }
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Tôi muốn nhận thông báo về sách mới, gia hạn và các hoạt động của
            thư viện qua email/SMS.
          </span>
        </label>
      </div>
    </div>
  );

  const [showAllBooks, setShowAllBooks] = useState(false);

  const displayedBooks = showAllBooks
    ? selectedBooks
    : selectedBooks.slice(0, 2);

  const renderSummary = () => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center space-x-2 text-blue-600 mb-4">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm">📚</span>
        </div>
        <h3 className="font-semibold">Sách cần mượn</h3>
      </div>

      {/* Books List with Border */}
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-white mb-4">
        <div className="space-y-3">
          {displayedBooks.map((book) => (
            <div
              key={book.id}
              className="flex space-x-3 p-3 bg-gray-50 rounded-lg border"
            >
              {/* Book Image */}
              <div className="flex-shrink-0">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded border shadow-sm"
                />
              </div>

              {/* Book Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {book.title}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  bởi {book.author}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {book.category}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Số lượng: {book.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {selectedBooks.length > 2 && (
          <div className="mt-3 text-center">
            <button
              onClick={() => setShowAllBooks(!showAllBooks)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center space-x-1 mx-auto"
            >
              <span>{showAllBooks ? "Thu gọn" : "Xem thêm"}</span>
              <span className="text-xs">
                {showAllBooks ? "↑" : `(+${selectedBooks.length - 2} sách)`}
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Tổng số sách:</span>
          <span className="font-medium">{selectedBooks.length} cuốn</span>
        </div>
        <div className="flex justify-between">
          <span>Thời gian mượn:</span>
          <span className="font-medium">{formData.borrowDays} ngày</span>
        </div>
        <div className="flex justify-between">
          <span>Ngày trả dự kiến:</span>
          <span className="font-medium text-blue-600">
            {formData.returnDate}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Phí mượn:</span>
          <span className="font-medium text-green-600">Miễn phí</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xs text-green-600">✓</span>
            </div>
            <span>Thông tin thư viện</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xs text-green-600">✓</span>
            </div>
            <span>Mượn sách hoàn toàn miễn phí</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xs text-green-600">✓</span>
            </div>
            <span>Có thể gia hạn 1 lần</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Steps */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StepIndicator
            step={1}
            title="Bước 1"
            subtitle="Thông tin cá nhân"
            isActive={currentStep === 1}
            isCompleted={currentStep > 1}
          />
          <StepIndicator
            step={2}
            title="Bước 2"
            subtitle="Địa chỉ"
            isActive={currentStep === 2}
            isCompleted={currentStep > 2}
          />
          <StepIndicator
            step={3}
            title="Bước 3"
            subtitle="Chi tiết mượn sách"
            isActive={currentStep === 3}
            isCompleted={currentStep > 3}
          />
          <StepIndicator
            step={4}
            title="Bước 4"
            subtitle="Xác nhận"
            isActive={currentStep === 4}
            isCompleted={false}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <span>←</span>
                <span>Quay lại</span>
              </button>

              <button
                onClick={nextStep}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
                  currentStep === 4
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                <span>{currentStep === 4 ? "Hoàn thành" : "Tiếp tục"}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">{renderSummary()}</div>
      </div>
    </div>
  );
};

export default InformationProvide;
