// AttendanceWidget.tsx
import { useState, useEffect } from "react";
import { Card, Row, Col, ProgressBar, Spinner } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

interface DailyAttendance {
  date: string;
  present: number;
  absent: number;
}

interface AttendanceWidgetProps {
  onViewDetails: () => void;
}

export default function AttendanceWidget({ onViewDetails }: AttendanceWidgetProps) {
  const [attendanceData, setAttendanceData] = useState<DailyAttendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPresent, setTotalPresent] = useState<number>(0);
  const [totalAbsent, setTotalAbsent] = useState<number>(0);

  useEffect(() => {
    // Simulate fetching attendance data from an API or database
    setTimeout(() => {
      const mockData: DailyAttendance[] = [
        { date: "2025-02-01", present: 40, absent: 5 },
        { date: "2025-02-02", present: 42, absent: 3 },
        { date: "2025-02-03", present: 39, absent: 6 },
        { date: "2025-02-04", present: 45, absent: 0 },
        { date: "2025-02-05", present: 38, absent: 7 },
      ];
      setAttendanceData(mockData);
      setLoading(false);

      // Calculate totals
      const present = mockData.reduce((acc, cur) => acc + cur.present, 0);
      const absent = mockData.reduce((acc, cur) => acc + cur.absent, 0);
      setTotalPresent(present);
      setTotalAbsent(absent);
    }, 1500);
  }, []);

  const presentPercentage = (totalPresent / (totalPresent + totalAbsent)) * 100;

  // Chart configuration
  const chartData = {
    labels: attendanceData.map((d) => d.date),
    datasets: [
      {
        label: "Present Students",
        data: attendanceData.map((d) => d.present),
        borderColor: "#10B981",
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Absent Students",
        data: attendanceData.map((d) => d.absent),
        borderColor: "#EF4444",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Attendance Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Students',
        },
      },
    },
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Card.Title>Attendance Overview</Card.Title>
          <button 
            onClick={onViewDetails}
            className="btn btn-link text-primary"
          >
            View Details →
          </button>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center flex-grow-1 align-items-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <div className="p-3 bg-success bg-opacity-10 rounded">
                  <h5 className="text-success">Present: {totalPresent}</h5>
                  <ProgressBar
                    now={presentPercentage}
                    label={`${presentPercentage.toFixed(1)}%`}
                    variant="success"
                    className="rounded-pill"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="p-3 bg-danger bg-opacity-10 rounded">
                  <h5 className="text-danger">Absent: {totalAbsent}</h5>
                  <ProgressBar
                    now={100 - presentPercentage}
                    label={`${(100 - presentPercentage).toFixed(1)}%`}
                    variant="danger"
                    className="rounded-pill"
                  />
                </div>
              </Col>
            </Row>

            <div className="flex-grow-1">
              <Line data={chartData} options={chartOptions} />
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
}