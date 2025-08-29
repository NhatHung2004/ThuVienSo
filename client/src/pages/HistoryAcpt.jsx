import React, { useEffect, useState } from "react";
import { ref, child, get, push, set } from "firebase/database";
import { db } from "../firebase"; // import firebase config

const HistoryAcpt = () => {
  const [users, setUsers] = useState({}); // lưu danh sách user

  // 🔹 Hàm lấy dữ liệu
  const fetchUsers = async () => {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, "user"));
      if (snapshot.exists()) {
        setUsers(snapshot.val()); // gán data vào state
      } else {
        setUsers({});
        console.log("No data available");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Hàm thêm user mới
  const sendNotificationToUser = async (userId, message) => {
    try {
      const notificationsRef = ref(db, `notifications/${4}`);
      const newNotificationRef = push(notificationsRef); // tạo key mới
      await set(newNotificationRef, {
        message,
        timestamp: Date.now(),
        read: false, // chưa đọc
      });
      console.log("Notification sent!");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // 🔹 Lấy dữ liệu lần đầu khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Danh sách User</h2>
      <ul>
        {Object.entries(users).map(([key, user]) => (
          <li key={key}>
            {user.id} - {user.name}
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          sendNotificationToUser("user123", "Yêu cầu mượn sách đã được duyệt!")
        }
      >
        Gửi thông báo
      </button>
    </div>
  );
};

export default HistoryAcpt;
