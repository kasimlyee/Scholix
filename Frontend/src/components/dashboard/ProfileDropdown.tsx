import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faSignOutAlt,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

interface ProfileDropdownProps {
  profilePic: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ profilePic }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ position: "relative" }}>
      <img
        src={profilePic}
        alt="Profile"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          cursor: "pointer",
          border: "2px solid #fff",
        }}
      />
      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            background: "var(--card-bg)",
            borderRadius: "8px",
            boxShadow: "var(--card-shadow)",
            width: "200px",
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => navigate("/profile")}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "0.5rem 1rem",
            }}
          >
            <FontAwesomeIcon icon={faUser} /> {t("edit_profile")}
          </button>
          <button
            onClick={() => navigate("/change-password")}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "0.5rem 1rem",
            }}
          >
            <FontAwesomeIcon icon={faLock} /> {t("change_password")}
          </button>
          <button
            onClick={toggleTheme}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "0.5rem 1rem",
            }}
          >
            <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />{" "}
            {theme === "light" ? "Dark" : "Light"} Mode
          </button>
          <button
            onClick={handleLogout}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "0.5rem 1rem",
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
