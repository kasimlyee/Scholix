import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import SideNav from "../components/SideNav";
import Header from "../components/core/Header";
import Breadcrumbs from "../components/dashboard/Breadcrambs";
import OverviewSummary from "../components/dashboard/OverViewSummary";
import RecentActivity from "../components/dashboard/RecentActivity";
import NotificationsWidget from "../components/dashboard/Notification";
import QuickLinks from "../components/dashboard/QuickLinks";
import EnrollmentGraph from "../components/dashboard/EnrollmentGraph";
import FeeCollectionGraph from "../components/dashboard/FeeCollectionGraph";
import CalendarEventsWidget from "../components/dashboard/CalendarWidget";
import WeatherClockWidget from "../components/dashboard/WeatherClockWidget";
import ToDoListWidget from "../components/dashboard/ToDoListWidget";
import SystemHealthWidget from "../components/dashboard/SystemHealthWidget";
import '../theme1.css'

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("Dashboard");

  if (!user.token) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SideNav activeView={activeView} setActiveView={setActiveView} />
      <main
        style={{ flex: 1, background: "var(--bg-primary)", minHeight: "100vh" }}
      >
        <Header />
        <Breadcrumbs />
        <div className="grid-container">
          <OverviewSummary />
          <RecentActivity />
          <NotificationsWidget />
          <QuickLinks />
          <EnrollmentGraph />
          <FeeCollectionGraph />
          <ToDoListWidget />
          <CalendarEventsWidget />
          <WeatherClockWidget />
          <SystemHealthWidget />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
