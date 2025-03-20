import { SideNav } from "../components/SideNav";
import AttendanceWidget from "../widgets/AttendaceWidget";
import { Container, Row, Col } from "react-bootstrap";

import Overview from "../widgets/Overview";
import "./Dashboard.css";
import Footer from "../components/Footer";
import TimeWeatherEventWidget from "../widgets/TimeWeatherEventWidget";
import TopBar from "../components/TopBar";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="top-bar">
        <TopBar />
      </div>
      <div className="section">
        <div className="side-bar">
          <SideNav />
        </div>
        <div className="main">
          <div className="main-top">
            <Overview />
          </div>
          <div className="main-side">
            <Container fluid>
              <Row className="mt-4">
                <Col md={6}>
                  <AttendanceWidget />
                </Col>
                <Col md={6}>
                  <TimeWeatherEventWidget />
                </Col>
              </Row>
            </Container>
          </div>
          <div className="main-section"></div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
