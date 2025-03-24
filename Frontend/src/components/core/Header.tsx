import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSearch,
  faQuestionCircle,
  faCog,
  faSignOutAlt,
  faUser,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import ProfileDropdown from "../dashboard/ProfileDropdown";

// Types
interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: Date;
}

interface SearchSuggestion {
  id: number;
  text: string;
  category: string;
  type: string;
}

// Styled Components
const HeaderContainer = styled.header`
  background: linear-gradient(135deg, var(--dark-blue) 0%, var(--blue) 100%);
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1000;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 400px;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: 200px;
  }
`;

const SearchInput = styled.input`
  padding: 0.75rem 2.5rem 0.75rem 1.5rem;
  border-radius: 30px;
  border: none;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--yellow);
    background: rgba(255, 255, 255, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--dark-blue);
  border-radius: 8px;
  margin-top: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1001;
`;

const SuggestionItem = styled.li<{ $category?: string }>`
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background: var(--blue);
  }

  &::before {
    content: "${({ $category }) => $category}";
    display: block;
    width: 80px;
    padding: 0.25rem;
    margin-right: 1rem;
    border-radius: 4px;
    background: var(--yellow);
    color: var(--dark-blue);
    font-size: 0.75rem;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--yellow);
  color: var(--dark-blue);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
`;

const NotificationPanel = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: var(--dark-blue);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: 350px;
  max-height: 500px;
  overflow-y: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1001;
`;

const NotificationItem = styled.div<{ $unread: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  opacity: ${({ $unread }) => ($unread ? 1 : 0.6)};
  background: ${({ $unread }) =>
    $unread ? "rgba(255, 255, 255, 0.05)" : "transparent"};
`;

const ProfileDropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  padding: 0.5rem;
  border-radius: 50px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ProfileMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: var(--dark-blue);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 0.5rem;
  min-width: 200px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
`;

const ProfileMenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #fff;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background 0.2s ease;

  &:hover {
    background: var(--blue);
  }
`;

// Mock API
const mockFetchNotifications = async (): Promise<Notification[]> => {
  return [
    {
      id: 1,
      message: "Fee Deadline Soon",
      read: false,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      message: "Exam Schedule Updated",
      read: false,
      timestamp: new Date(),
    },
  ];
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const suggestions: SearchSuggestion[] = [
    { id: 1, text: "John Doe", category: "student", type: "user" },
    { id: 2, text: "Jane Smith", category: "teacher", type: "user" },
    { id: 3, text: "Class 1A", category: "class", type: "group" },
    { id: 4, text: "Library Books", category: "resource", type: "resource" },
  ];

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await mockFetchNotifications();
      setNotifications(data);
    };
    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearch("");
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e: KeyboardEvent) => {
    if (filteredSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        Math.min(prev + 1, filteredSuggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearch("");
    navigate(`/${suggestion.type}/${suggestion.id}`);
  };

  const markNotificationRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "sw" : "en");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredSuggestions = suggestions.filter((s) =>
    s.text.toLowerCase().includes(search.toLowerCase())
  );

  const profilePic = `https://www.gravatar.com/avatar/${encodeURIComponent(
    user?.email ?? ""
  )}?s=40&d=identicon`;

  return (
    <HeaderContainer>
      <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
        {t("dashboard")}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <SearchContainer ref={searchRef}>
          <SearchInput
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={t("search_placeholder")}
            aria-label="Search"
          />
          <FontAwesomeIcon
            icon={faSearch}
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--yellow)",
            }}
          />
          {search && (
            <SuggestionsList>
              {filteredSuggestions.map((suggestion, index) => (
                <SuggestionItem
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  $category={suggestion.category}
                  style={{
                    background:
                      index === activeSuggestionIndex
                        ? "rgba(255, 255, 255, 0.1)"
                        : "transparent",
                  }}
                >
                  {suggestion.text}
                </SuggestionItem>
              ))}
            </SuggestionsList>
          )}
        </SearchContainer>

        <div style={{ position: "relative" }}>
          <FontAwesomeIcon
            icon={faBell}
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ cursor: "pointer", fontSize: "1.2rem" }}
            aria-label="Notifications"
          />
          {unreadCount > 0 && (
            <NotificationBadge>{unreadCount}</NotificationBadge>
          )}
          {showNotifications && (
            <NotificationPanel>
              <div
                style={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>{t("notifications")}</h3>
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: "var(--yellow)",
                    color: "var(--dark-blue)",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                  }}
                >
                  {t("mark_all_read")}
                </button>
              </div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  $unread={!notification.read}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span>{notification.message}</span>
                    {!notification.read && (
                      <button
                        onClick={() => markNotificationRead(notification.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--yellow)",
                          cursor: "pointer",
                        }}
                      >
                        {t("mark_read")}
                      </button>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </NotificationItem>
              ))}
            </NotificationPanel>
          )}
        </div>

        <FontAwesomeIcon
          icon={faQuestionCircle}
          style={{ cursor: "pointer", fontSize: "1.2rem" }}
          onClick={() => navigate("/help")}
          aria-label="Help"
        />

        <button
          onClick={toggleLanguage}
          style={{
            background: "none",
            color: "#fff",
            border: "1px solid var(--yellow)",
            borderRadius: "4px",
            padding: "0.25rem 0.5rem",
          }}
        >
          {i18n.language === "en" ? "SW" : "EN"}
        </button>

        <ProfileDropdown profilePic={profilePic} />
      </div>
    </HeaderContainer>
  );
};

export default Header;
