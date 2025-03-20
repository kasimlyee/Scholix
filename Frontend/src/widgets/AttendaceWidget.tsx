// AttendanceWidget.tsx
import React, { useState, useEffect } from "react";
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

interface AttendanceData {
  date: string;
  present: number;
  absent: number;
}

const AttendanceWidget: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPresent, setTotalPresent] = useState<number>(0);
  const [totalAbsent, setTotalAbsent] = useState<number>(0);

  useEffect(() => {
    // Simulate fetching attendance data from an API or database
    setTimeout(() => {
      const data = [
        { date: "2025-02-01", present: 40, absent: 5 },
        { date: "2025-02-02", present: 42, absent: 3 },
        { date: "2025-02-03", present: 39, absent: 6 },
        { date: "2025-02-04", present: 45, absent: 0 },
        { date: "2025-02-05", present: 38, absent: 7 },
      ];
      setAttendanceData(data);
      setLoading(false);

      // Calculate total present/absent for the progress bars
      const totalPresentCount = data.reduce((acc, cur) => acc + cur.present, 0);
      const totalAbsentCount = data.reduce((acc, cur) => acc + cur.absent, 0);
      setTotalPresent(totalPresentCount);
      setTotalAbsent(totalAbsentCount);
    }, 1500); // Simulate loading delay
  }, []);

  const presentPercentage = (totalPresent / (totalPresent + totalAbsent)) * 100;

  // Graph Data
  const chartData = {
    labels: attendanceData.map((data) => data.date),
    datasets: [
      {
        label: "Present Students",
        data: attendanceData.map((data) => data.present),
        fill: false,
        borderColor: "green",
        tension: 0.1,
      },
      {
        label: "Absent Students",
        data: attendanceData.map((data) => data.absent),
        fill: false,
        borderColor: "red",
        tension: 0.1,
      },
    ],
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Attendance Overview</Card.Title>

        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <Row className="mb-3">
              <Col>
                <h5>Total Present: {totalPresent}</h5>
                <ProgressBar
                  now={presentPercentage}
                  label={`${presentPercentage.toFixed(1)}%`}
                  variant="success"
                />
              </Col>
              <Col>
                <h5>Total Absent: {totalAbsent}</h5>
                <ProgressBar
                  now={100 - presentPercentage}
                  label={`${(100 - presentPercentage).toFixed(1)}%`}
                  variant="danger"
                />
              </Col>
            </Row>

            <Line data={chartData} />

            <Row className="mt-4">
              <Col>
                <div className="text-center">
                  <h6>Attendance Over Time</h6>
                  <p>Track the attendance trends for the past days</p>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default AttendanceWidget;
