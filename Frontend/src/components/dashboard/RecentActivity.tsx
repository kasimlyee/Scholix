const RecentActivity: React.FC = () => {
  // Mock data
  const activities = [
    { id: 1, action: "Student John Doe enrolled", time: "2025-03-23 09:00" },
    {
      id: 2,
      action: "Fee payment received from Jane Smith",
      time: "2025-03-23 10:15",
    },
  ];

  return (
    <div className="card">
      <h2>Recent Activity</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            {activity.action} - <small>{activity.time}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
