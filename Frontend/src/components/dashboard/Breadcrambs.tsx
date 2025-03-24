import { useLocation } from "react-router-dom";

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div
      style={{
        padding: "1rem 2rem",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <span>
        {pathnames.length === 0
          ? "Dashboard"
          : pathnames.map((value, index) => (
              <span key={index}>
                {index > 0 && " > "}
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            ))}
      </span>
    </div>
  );
};

export default Breadcrumbs;
