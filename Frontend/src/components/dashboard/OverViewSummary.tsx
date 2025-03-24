import { useState, useEffect } from "react";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaUserTie,
  FaChartLine,
} from "react-icons/fa";
import axios from "axios";
import ProgressBar from "react-bootstrap/ProgressBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Stats {
  students: number;
  teachers: number;
  staff: number;
  students_change: number;
  teachers_change: number;
  staff_change: number;
  last_updated: string;
  weekly_target: number;
}

const OverviewSummary: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/stats`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch statistics");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatChange = (change: number) =>
    `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;

  const getTrendColor = (change: number) =>
    change > 0 ? "success" : change < 0 ? "danger" : "warning";

  const StatCard = ({
    icon,
    title,
    value,
    change,
    target,
  }: {
    icon: JSX.Element;
    title: string;
    value: number;
    change: number;
    target: number;
  }) => (
    <div className="card shadow-lg h-100 border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="bg-dark-blue rounded-circle p-3">{icon}</div>
          <span className={`badge bg-${getTrendColor(change)}`}>
            <FaChartLine className="me-1" />
            {formatChange(change)}
          </span>
        </div>
        <h3 className="h5 mb-3">{title}</h3>
        <div className="d-flex justify-content-between align-items-end">
          <div>
            <h2 className="mb-0">{value.toLocaleString()}</h2>
            <small className="text-muted">Current count</small>
          </div>
          <div className="text-end">
            <ProgressBar
              now={(value / target) * 100}
              variant={getTrendColor(change)}
              className="mb-2"
              style={{ height: "4px" }}
            />
            <small className="text-muted">
              {((value / target) * 100).toFixed(0)}% of target
            </small>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card shadow border-0 mb-4">
      <div className="card-header bg-dark-blue text-white border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Institution Overview</h3>
          {stats && (
            <small className="opacity-75">
              Updated: {new Date(stats.last_updated).toLocaleTimeString()}
            </small>
          )}
        </div>
      </div>

      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row g-4">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div className="col-md-4" key={i}>
                  <div className="card h-100">
                    <div className="card-body">
                      <Skeleton height={30} width={100} className="mb-3" />
                      <Skeleton height={30} width={150} />
                      <Skeleton height={20} width={200} />
                    </div>
                  </div>
                </div>
              ))
          ) : stats ? (
            <>
              <div className="col-md-4">
                <StatCard
                  icon={<FaUsers size={24} className="text-yellow" />}
                  title="Students"
                  value={stats.students}
                  change={stats.students_change}
                  target={stats.weekly_target}
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  icon={
                    <FaChalkboardTeacher size={24} className="text-yellow" />
                  }
                  title="Teachers"
                  value={stats.teachers}
                  change={stats.teachers_change}
                  target={stats.weekly_target}
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  icon={<FaUserTie size={24} className="text-yellow" />}
                  title="Staff"
                  value={stats.staff}
                  change={stats.staff_change}
                  target={stats.weekly_target}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OverviewSummary;
