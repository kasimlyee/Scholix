import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import md5 from "md5";

import "./TopBar.css";

interface TopBarProps {
  onNotificationClick: () => void;
  onQuickActionsClick: () => void;
}

export default function TopBar({ onNotificationClick, onQuickActionsClick }: TopBarProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", name: "", profilePic: "" });

  // Fetch user info from localStorage or API
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (storedUser.email) {
      const emailHash = md5(storedUser.email.trim().toLowerCase());
      const profilePic = `https://www.gravatar.com/avatar/${emailHash}?s=100&d=identicon`;
      setUser({
        email: storedUser.email,
        name: storedUser.name || storedUser.email.split("@")[0], // Default to part before "@"
        profilePic,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <nav className="top-bar">
      <div className="top-bar-left">
        <h2>School Management System</h2>
      </div>
      <div className="top-bar">
      <button onClick={onNotificationClick}>Notifications</button>
      <button onClick={onQuickActionsClick}>Quick Actions</button>
    </div>
      <div className="top-bar-center">
        <input type="text" placeholder="Search..." className="search-input" />
        <button className="search-btn">
          <i className="fas fa-search"></i>
        </button>
      </div>

      <div className="top-bar-right">
        {/* Notifications */}
        <div className="icon-container">
          <i className="fas fa-bell"></i>
          <span className="badge">3</span>
        </div>

        {/* Messages */}
        <div className="icon-container">
          <i className="fas fa-envelope"></i>
          <span className="badge">5</span>
        </div>

        {/* User Profile */}
        <div className="profile-container">
          <img
            src={user.profilePic}
            alt="User Avatar"
            className="profile-pic"
          />
          <span className="username">{user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}

