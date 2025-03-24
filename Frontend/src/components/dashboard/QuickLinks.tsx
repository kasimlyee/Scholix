import { Link } from "react-router-dom";

const QuickLinks: React.FC = () => {
  const links = [
    { label: "Students", path: "/students" },
    { label: "Fees", path: "/fees" },
    { label: "Teachers", path: "/teachers" },
    { label: "Library", path: "/library" },
  ];

  return (
    <div className="card">
      <h2>Quick Links</h2>
      <div className="grid-container">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{ color: "var(--primary-color)" }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
