import { useNavigate } from "react-router-dom";
import "./sidenav.css";
import logo from "../assets/images/logo1.png";

interface NavLink {
  label: string;
  path: string;
  icon: string;
}

export function SideNav() {
  const navigate = useNavigate();

  const navLinks: NavLink[] = [
    { label: "Dashboard", path: "/dashboard", icon: "fas fa-tachometer-alt" },

    // 📌 STUDENT MANAGEMENT
    { label: "Students", path: "/students", icon: "fa-solid fa-user-graduate" },
    { label: "Admissions", path: "/admissions", icon: "fa-solid fa-user-plus" },
    {
      label: "Classes & Sections",
      path: "/classes",
      icon: "fa-solid fa-school",
    },

    // 📌 TEACHER MANAGEMENT
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

    // 📌 ATTENDANCE & EXAMS
    { label: "Attendance", path: "/attendance", icon: "fas fa-check-circle" },
    { label: "Exams", path: "/exams", icon: "fa-solid fa-pen-ruler" },
    {
      label: "Results & Grades",
      path: "/grades",
      icon: "fa-solid fa-graduation-cap",
    },

    // 📌 FEES & FINANCIAL MANAGEMENT
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

    // 📌 LIBRARY MANAGEMENT
    { label: "Library", path: "/library", icon: "fa-solid fa-book" },
    { label: "E-Resources", path: "/resources", icon: "fa-solid fa-laptop" },

    // 📌 HOSTEL & TRANSPORT
    { label: "Hostel Management", path: "/hostel", icon: "fa-solid fa-bed" },
    { label: "Transport", path: "/transport", icon: "fa-solid fa-bus" },

    // 📌 COMMUNICATION
    { label: "Notices", path: "/notices", icon: "fa-solid fa-bell" },
    { label: "Messages", path: "/messages", icon: "fa-solid fa-envelope" },
    { label: "Parents", path: "/parents", icon: "fa-solid fa-user-friends" },

    // 📌 SETTINGS & LOGOUT
    { label: "Settings", path: "/settings", icon: "fa-solid fa-cogs" },
    {
      label: "Logout",
      path: "/logout",
      icon: "fa-solid fa-right-from-bracket",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="sidenav-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Naalya SS Lugazi</h2>
      </div>
      <nav className="sidenav">
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => handleNavigation(link.path)}
            className="sidenav-link"
          >
            <i className={`${link.icon} sidenav-icon`}></i>
            <span className="sidenav-label">{link.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
