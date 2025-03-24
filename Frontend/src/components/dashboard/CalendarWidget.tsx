import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const CalendarWidget: React.FC = () => {
  const { t } = useTranslation();
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([
    { date: "2025-03-25", type: "event", title: "Parent-Teacher Meeting" },
    { date: "2025-03-28", type: "holiday", title: "Easter Break" },
    { date: "2025-03-30", type: "deadline", title: "Fee Submission Deadline" },
  ]);
  const [newEvent, setNewEvent] = useState({ date: "", type: "", title: "" });

  const addEvent = () => {
    if (newEvent.date && newEvent.type && newEvent.title) {
      setEvents([...events, newEvent]);
      setNewEvent({ date: "", type: "", title: "" });
    }
  };

  const tileContent = ({ date }: { date: Date }) => {
    const event = events.find(
      (e) => new Date(e.date).toDateString() === date.toDateString()
    );
    return event ? (
      <p style={{ color: event.type === "holiday" ? "#e53e3e" : "#38b2ac" }}>
        {event.title}
      </p>
    ) : null;
  };

  return (
    <div className="card">
      <h2>
        <FontAwesomeIcon icon={faCalendarAlt} /> {t("calendar")}
      </h2>
      <Calendar onChange={() => setDate} value={date} tileContent={tileContent} />
      <div style={{ marginTop: "1rem" }}>
        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          style={{ marginRight: "0.5rem", padding: "0.5rem" }}
        />
        <select
          value={newEvent.type}
          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
          style={{ marginRight: "0.5rem", padding: "0.5rem" }}
        >
          <option value="">Type</option>
          <option value="event">Event</option>
          <option value="holiday">Holiday</option>
          <option value="deadline">Deadline</option>
        </select>
        <input
          type="text"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          placeholder="Event Title"
          style={{ padding: "0.5rem" }}
        />
        <button onClick={addEvent} style={{ marginLeft: "0.5rem" }}>
          Add
        </button>
      </div>
    </div>
  );
};

export default CalendarWidget;
