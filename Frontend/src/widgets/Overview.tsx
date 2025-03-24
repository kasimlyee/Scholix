import { MDBCard, MDBCardBody, MDBProgress } from "mdb-react-ui-kit";
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaCalendarAlt,
  FaNewspaper,
  FaChartLine
} from "react-icons/fa";
import { Metrics } from "../types/Metrics";
import "./Overview.css";

interface OverviewProps {
  metrics: Metrics[];
}

const getIcon = (title: string) => {
  switch(title.toLowerCase()) {
    case 'students': return <FaUserGraduate className="metric-icon" />;
    case 'teachers': return <FaChalkboardTeacher className="metric-icon" />;
    case 'events': return <FaCalendarAlt className="metric-icon" />;
    case 'news': return <FaNewspaper className="metric-icon" />;
    default: return <FaChartLine className="metric-icon" />;
  }
};

const getProgressColor = (change: string) => {
  const value = parseFloat(change);
  if (value > 0) return 'success';
  if (value < 0) return 'danger';
  return 'info';
};

export default function Overview({ metrics }: OverviewProps) {
  return (
    <div className="overview-grid">
      {metrics.map((metric, index) => (
        <MDBCard 
          key={index}
          className="metric-card hover-shadow"
          data-aos="fade-up"
          data-aos-delay={index * 100}
        >
          <MDBCardBody className="metric-content">
            <div className="metric-header">
              <div className="metric-icon-container">
                {getIcon(metric.title)}
              </div>
              <span className="metric-title">{metric.title}</span>
            </div>
            
            <div className="metric-value-container">
              <h3 className="metric-value">{metric.value}</h3>
              <span className={`metric-change ${getProgressColor(metric.change)}`}>
                {metric.change}
              </span>
            </div>

            <MDBProgress
              height="4px"
              className="metric-progress"
              material
              color={getProgressColor(metric.change)}
              value={Math.abs(parseFloat(metric.change))}
            />
          </MDBCardBody>
        </MDBCard>
      ))}
    </div>
  );
}