import { MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import "./Overview.css";

const Overview = () => {
  return (
    <div className="overview-container">
      <MDBCard className="overview-card">
        <MDBCardBody className="overview-content">
          <h5 className="overview-title">Total Students Enrolled</h5>
          <h3 className="overview-stat">
            <i className="fa-solid fa-user-graduate overview-icon"></i> 1,234
          </h3>
        </MDBCardBody>
      </MDBCard>
      <MDBCard className="overview-card">
        <MDBCardBody className="overview-content">
          <h5 className="overview-title">Total Teachers</h5>
          <h3 className="overview-stat">
            <i className="fa-solid fa-person-chalkboard overview-icon"></i> 56
          </h3>
        </MDBCardBody>
      </MDBCard>
      <MDBCard className="overview-card">
        <MDBCardBody className="overview-content">
          <h5 className="overview-title">Upcoming Events</h5>
          <h3 className="overview-stat">
            <i className="fa-solid fa-calendar-days overview-icon"></i> 3
          </h3>
        </MDBCardBody>
      </MDBCard>
      <MDBCard className="overview-card">
        <MDBCardBody className="overview-content">
          <h5 className="overview-title">Recent News</h5>
          <h3 className="overview-stat">
            <i className="fa-solid fa-newspaper overview-icon"></i> 5
          </h3>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default Overview;
