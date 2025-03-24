import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sidenav.css";
import logo from "../assets/images/logo1.png";

interface NavLink {
  label: string;
  path: string;
  icon: string;
}

interface SideNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function SideNav({ activeView, setActiveView }: SideNavProps) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinks: NavLink[] = [
    { label: "Dashboard", path: "/dashboard", icon: "fas fa-tachometer-alt" },
    { label: "Students", path: "/students", icon: "fa-solid fa-user-graduate" },
    { label: "Admissions", path: "/admissions", icon: "fa-solid fa-user-plus" },
    {
      label: "Classes & Sections",
      path: "/classes",
      icon: "fa-solid fa-school",
    },
    {
      label: "Teachers",
      path: "/teachers",
      icon: "fa-solid fa-person-chalkboard",
    },
    { label: "Subjects", path: "/subjects", icon: "fa-solid fa-book-open" },
    {
      label: "Timetable",
      path: "/timetable",
      icon: "fa-solid fa-calendar-alt",
    },
    { label: "Attendance", path: "/attendance", icon: "fas fa-check-circle" },
    { label: "Exams", path: "/exams", icon: "fa-solid fa-pen-ruler" },
    {
      label: "Results & Grades",
      path: "/grades",
      icon: "fa-solid fa-graduation-cap",
    },
    {
      label: "Fees Management",
      path: "/fees",
      icon: "fa-solid fa-money-check-alt",
    },
    {
      label: "Payroll",
      path: "/payroll",
      icon: "fa-solid fa-file-invoice-dollar",
    },
    { label: "Library", path: "/library", icon: "fa-solid fa-book" },
    { label: "E-Resources", path: "/resources", icon: "fa-solid fa-laptop" },
    { label: "Hostel Management", path: "/hostel", icon: "fa-solid fa-bed" },
    { label: "Transport", path: "/transport", icon: "fa-solid fa-bus" },
    { label: "Notices", path: "/notices", icon: "fa-solid fa-bell" },
    { label: "Messages", path: "/messages", icon: "fa-solid fa-envelope" },
    { label: "Parents", path: "/parents", icon: "fa-solid fa-user-friends" },
    { label: "Settings", path: "/settings", icon: "fa-solid fa-cogs" },
    {
      label: "Logout",
      path: "/logout",
      icon: "fa-solid fa-right-from-bracket",
    },
  ];

  const handleNavigation = (path: string, label: string) => {
    setActiveView(label);
    navigate(path);
  };

  return (
    <aside className={`sidenav-container ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        {!isCollapsed && <h2>Naalya SS Lugazi</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="toggle-btn"
        >
          {isCollapsed ? (
            <i className="fas fa-angle-right"></i>
          ) : (
            <i className="fas fa-angle-left"></i>
          )}
        </button>
      </div>
      <nav className="sidenav">
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => handleNavigation(link.path, link.label)}
            className={`sidenav-link ${
              activeView === link.label ? "active" : ""
            }`}
          >
            <i className={`${link.icon} sidenav-icon`}></i>
            {!isCollapsed && (
              <span className="sidenav-label">{link.label}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}
