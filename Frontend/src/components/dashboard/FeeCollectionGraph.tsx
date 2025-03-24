import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FeeCollectionGraph: React.FC = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Fee Collection (USD)",
        data: [50000, 52000, 48000, 55000, 53000],
        backgroundColor: "var(--primary-color)",
      },
    ],
  };

  return (
    <div className="card">
      <h2>Monthly Fee Collection</h2>
      <Bar data={data} />
    </div>
  );
};

export default FeeCollectionGraph;
