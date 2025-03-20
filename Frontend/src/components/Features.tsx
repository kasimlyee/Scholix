function Features() {
  return (
    <div>
      <section className="features py-5" style={{ backgroundColor: "#003366" }}>
        <div className="container">
          <h2
            className="text-center mb-5"
            style={{
              color: "#ffffff", // White color for the heading
              fontWeight: "bold",
              fontSize: "3rem",
              letterSpacing: "2px",
            }}
          >
            Our Features
          </h2>
          <div className="row">
            {/* Student Management Feature */}
            <div className="col-md-4 mb-4">
              <div
                className="card shadow-lg rounded"
                style={{
                  border: "none",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  className="card-body text-center"
                  style={{
                    borderRadius: "10px",
                    padding: "30px",
                  }}
                >
                  <i
                    className="bi bi-person-badge-fill"
                    style={{
                      color: "#ffcc00", // Yellow color for icons
                      fontSize: "3rem",
                    }}
                  ></i>
                  <h5
                    className="card-title mt-4"
                    style={{
                      color: "#003366", // Dark blue for title text
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                    }}
                  >
                    Student Management
                  </h5>
                  <p
                    className="card-text"
                    style={{
                      color: "#666666", // Light grey for description text
                      fontSize: "1rem",
                      marginTop: "10px",
                    }}
                  >
                    Easily manage student profiles and records with ease.
                  </p>
                </div>
              </div>
            </div>

            {/* Attendance Tracking Feature */}
            <div className="col-md-4 mb-4">
              <div
                className="card shadow-lg rounded"
                style={{
                  border: "none",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  className="card-body text-center"
                  style={{
                    borderRadius: "10px",
                    padding: "30px",
                  }}
                >
                  <i
                    className="bi bi-clipboard-data"
                    style={{
                      color: "#ffcc00", // Yellow color for icons
                      fontSize: "3rem",
                    }}
                  ></i>
                  <h5
                    className="card-title mt-4"
                    style={{
                      color: "#003366", // Dark blue for title text
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                    }}
                  >
                    Attendance Tracking
                  </h5>
                  <p
                    className="card-text"
                    style={{
                      color: "#666666", // Light grey for description text
                      fontSize: "1rem",
                      marginTop: "10px",
                    }}
                  >
                    Keep accurate attendance records with ease.
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Management Feature */}
            <div className="col-md-4 mb-4">
              <div
                className="card shadow-lg rounded"
                style={{
                  border: "none",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  className="card-body text-center"
                  style={{
                    borderRadius: "10px",
                    padding: "30px",
                  }}
                >
                  <i
                    className="bi bi-person-lines-fill"
                    style={{
                      color: "#ffcc00", // Yellow color for icons
                      fontSize: "3rem",
                    }}
                  ></i>
                  <h5
                    className="card-title mt-4"
                    style={{
                      color: "#003366", // Dark blue for title text
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                    }}
                  >
                    Teacher Management
                  </h5>
                  <p
                    className="card-text"
                    style={{
                      color: "#666666", // Light grey for description text
                      fontSize: "1rem",
                      marginTop: "10px",
                    }}
                  >
                    Organize teacher information efficiently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;
