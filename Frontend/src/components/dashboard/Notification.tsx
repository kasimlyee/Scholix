import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faExclamationTriangle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const Notification: React.FC = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([
    { id: 1, type: "deadline", message: "Fee Deadline: March 30", read: false },
    {
      id: 2,
      type: "exam",
      message: "Mid-Term Exams Start: April 5",
      read: false,
    },
    {
      id: 3,
      type: "emergency",
      message: "School Closure: Weather Alert",
      read: false,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => setNotifications([]);

  return (
    <div className="card">
      <h2>
        <FontAwesomeIcon icon={faBell} /> {t("notifications")}
      </h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.map((n) => (
          <li
            key={n.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 0",
              opacity: n.read ? 0.5 : 1,
            }}
          >
            <FontAwesomeIcon
              icon={n.type === "emergency" ? faExclamationTriangle : faBell}
              style={{
                color:
                  n.type === "emergency" ? "#e53e3e" : "var(--primary-color)",
                marginRight: "0.5rem",
              }}
            />
            <span>{n.message}</span>
            {!n.read && (
              <button
                onClick={() => markAsRead(n.id)}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  color: "var(--accent-color)",
                }}
              >
                Mark Read
              </button>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={clearAll}
        style={{ background: "none", color: "#e53e3e" }}
      >
        <FontAwesomeIcon icon={faTrash} /> Clear All
      </button>
    </div>
  );
};

export default Notification;
