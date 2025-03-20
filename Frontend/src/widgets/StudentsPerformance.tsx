import { MDBCard, MDBCardBody, MDBCardTitle } from "mdb-react-ui-kit";
import { Doughnut, Bar } from "react-chartjs-2";
import "./StudentsPerformance.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StudentPerformance = () => {
  // Sample data for Average GPA and Students at Risk
  const averageGPA = 3.5;
  const studentsAtRisk = ["John Doe", "Emily Brown", "Mark Stevens"];
  const topStudents = [
    "Alice Johnson",
    "David Smith",
    "Maria Gonzalez",
    "Lucy Wang",
  ];

  // Data for the Doughnut Chart (Top Performing Students)
  const doughnutData = {
    labels: topStudents,
    datasets: [
      {
        label: "Top Performing Students",
        data: [30, 25, 20, 25], // Example scores or performance metrics
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // Data for the Bar Chart (Students at Risk and Average GPA)
  const barData = {
    labels: ["Average GPA", "Students at Risk"],
    datasets: [
      {
        label: "Scores",
        data: [averageGPA, studentsAtRisk.length],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <MDBCard className="widget-card">
      <MDBCardBody>
        <MDBCardTitle>Student Performance</MDBCardTitle>

        <div className="chart-section">
          <h6>Top Performing Students</h6>
          <Doughnut data={doughnutData} />
        </div>

        <div className="chart-section">
          <h6>Average GPA & Students at Risk</h6>
          <Bar
            data={barData}
            options={{ plugins: { legend: { display: false } } }}
          />
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default StudentPerformance;
