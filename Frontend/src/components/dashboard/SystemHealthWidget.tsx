import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faServer, faSync, faHdd } from "@fortawesome/free-solid-svg-icons";

const SystemHealthWidget: React.FC = () => {
  // Mock data (replace with real API)
  const health = {
    serverStatus: "Online",
    syncStatus: "Synced",
    storageUsage: "75%",
  };

  return (
    <div className="card">
      <h2>
        <FontAwesomeIcon icon={faServer} /> System Health
      </h2>
      <p>
        <FontAwesomeIcon icon={faServer} /> Server:{" "}
        <span
          style={{
            color: health.serverStatus === "Online" ? "#38b2ac" : "#e53e3e",
          }}
        >
          {health.serverStatus}
        </span>
      </p>
      <p>
        <FontAwesomeIcon icon={faSync} /> Sync: {health.syncStatus}
      </p>
      <p>
        <FontAwesomeIcon icon={faHdd} /> Storage: {health.storageUsage}
      </p>
    </div>
  );
};

export default SystemHealthWidget;
