function Footer() {
  return (
    <div>
      <footer
        className="py-5"
        style={{
          backgroundColor: "#000000", // Black background
          color: "#ffffff", // White text
          fontSize: "1rem",
        }}
      >
        <div className="container text-center">
          {/* Logo or Branding */}
          <div className="mb-4">
            <h3
              style={{
                fontWeight: "bold",
                letterSpacing: "2px",
                color: "#ffcc00", // Yellow text for branding
              }}
            >
              SoftLight International
            </h3>
          </div>

          {/* Social Media Links */}
          <div className="mb-4">
            <a
              href="#"
              className="mx-2"
              style={{
                color: "#ffffff",
                fontSize: "1.5rem",
                textDecoration: "none",
              }}
            >
              <i className="bi bi-facebook"></i>
            </a>
            <a
              href="#"
              className="mx-2"
              style={{
                color: "#ffffff",
                fontSize: "1.5rem",
                textDecoration: "none",
              }}
            >
              <i className="bi bi-twitter"></i>
            </a>
            <a
              href="#"
              className="mx-2"
              style={{
                color: "#ffffff",
                fontSize: "1.5rem",
                textDecoration: "none",
              }}
            >
              <i className="bi bi-instagram"></i>
            </a>
            <a
              href="#"
              className="mx-2"
              style={{
                color: "#ffffff",
                fontSize: "1.5rem",
                textDecoration: "none",
              }}
            >
              <i className="bi bi-linkedin"></i>
            </a>
          </div>

          {/* Quick Links */}
          <div className="mb-4">
            <a
              href="#about"
              className="mx-3"
              style={{
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              About Us
            </a>
            <a
              href="#services"
              className="mx-3"
              style={{
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              Services
            </a>
            <a
              href="#contact"
              className="mx-3"
              style={{
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              Contact
            </a>
          </div>

          {/* Copyright */}
          <p
            className="mb-0"
            style={{
              color: "#aaaaaa", // Light grey for subtle text
              fontSize: "0.9rem",
            }}
          >
            &copy; {new Date().getFullYear()} SoftLight International. All
            Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
