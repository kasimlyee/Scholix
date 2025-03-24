import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/images/bg.jpg"; // Replace with the actual path to your image

function Hero() {
  const navigate = useNavigate();

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Prevents the page from reloading
    navigate("/create"); // Navigate programmatically
  };

  return (
    <div
      className="hero text-white"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <header
        className="py-5 text-center"
        style={{ backgroundColor: "rgba(0, 0, 139, 0.6)" }}
      >
        {" "}
        {/* Semi-transparent blue overlay */}
        <div className="container">
          <h1 className="display-4 text-warning">
            {" "}
            {/* Yellow text */}
            Naalya Secondary School Lugazi
          </h1>
          <p className="lead text-light">
            {" "}
            {/* Light blue text */}
            Manage students, teachers, attendance, and more in one place.
          </p>
          <a
            href="/signup"
            onClick={handleLinkClick}
            className="btn btn-warning btn-lg mt-3" // Yellow button
          >
            Get Started
          </a>
        </div>
      </header>
    </div>
  );
}

export default Hero;
