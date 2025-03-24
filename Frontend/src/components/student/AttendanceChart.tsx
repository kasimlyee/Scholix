import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { AttendanceRecord } from "../../types/Student";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AttendanceChartProps {
  attendance: AttendanceRecord[];
  period: "daily" | "weekly" | "monthly";
}

const AttendanceChart = ({ attendance, period }: AttendanceChartProps) => {
  const data = useMemo(() => {
    const labels = attendance.map((record) =>
      new Date(record.date).toLocaleDateString()
    );
    const presentData = attendance.map((record) =>
      record.status === "present" ? 1 : 0
    );

    return {
      labels,
      datasets: [
        {
          label: "Attendance Rate",
          data: presentData,
          borderColor: "#2e5cb8",
          backgroundColor: "rgba(46, 92, 184, 0.2)",
        },
      ],
    };
  }, [attendance]);

  return (
    <div className="card-custom p-3 mb-4">
      <h5>{period.charAt(0).toUpperCase() + period.slice(1)} Attendance</h5>
      <Line data={data} />
    </div>
  );
};

export default AttendanceChart;
