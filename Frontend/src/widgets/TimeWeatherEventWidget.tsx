// TimeWeatherEventWidget.tsx
import  { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Alert, ListGroup } from "react-bootstrap";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiClock, FiCalendar, FiMapPin } from "react-icons/fi";
import "./TimeWeatherEventWidget.css";

// Define TypeScript interfaces
interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  location?: string;
}

interface TimeWeatherEventWidgetProps {
  onEventSelect: (event: CalendarEvent) => void;
}

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

export default function TimeWeatherEventWidget({ 
  onEventSelect 
}: TimeWeatherEventWidgetProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [date, setDate] = useState<CalendarValue>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { data } = await axios.get(
         import.meta.env.VITE_WEATHER_API_URL
        );
        
        setWeather({
          temp: data.main.temp,
          description: data.weather[0].main,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed
        });
      } catch (err) {
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const handleDateChange = (value: CalendarValue) => {
    setDate(value);
    // Simulated events fetch
    setEvents([
      {
        id: "1",
        title: "Staff Meeting",
        date: new Date(),
        location: "Conference Room A"
      },
      {
        id: "2",
        title: "Parent-Teacher Conference",
        date: new Date(),
        location: "Main Hall"
      }
    ]);
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-4 d-flex align-items-center gap-2">
          <FiCalendar className="text-primary" />
          Schedule & Weather
        </Card.Title>

        {loading ? (
          <div className="d-flex justify-content-center flex-grow-1 align-items-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            {/* Time and Weather Row */}
            <Row className="g-3 mb-4">
              <Col md={6}>
                <div className="d-flex align-items-center gap-2 p-3 bg-light rounded">
                  <FiClock size={24} className="text-primary" />
                  <div>
                    <h5 className="mb-0">{currentTime}</h5>
                    <small className="text-muted">Current Time</small>
                  </div>
                </div>
              </Col>
              
              <Col md={6}>
                {weather && (
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                    <img 
                      src={weather.icon} 
                      alt="Weather icon" 
                      style={{ width: 50, height: 50 }}
                    />
                    <div>
                      <h5 className="mb-0">{Math.round(weather.temp)}°C</h5>
                      <small className="text-muted">
                        {weather.description} | {weather.humidity}% humidity
                      </small>
                    </div>
                  </div>
                )}
              </Col>
            </Row>

            {/* Calendar */}
            <div className="mb-4 flex-grow-1">
              <Calendar
                onChange={handleDateChange}
                value={date}
                className="border-0"
                tileClassName="calendar-tile"
              />
            </div>

            {/* Events List */}
            <div className="mt-auto">
              <h6 className="d-flex align-items-center gap-2 mb-3">
                <FiMapPin className="text-primary" />
                Upcoming Events
              </h6>
              
              <ListGroup variant="flush">
                {events.map(event => (
                  <ListGroup.Item 
                    key={event.id}
                    action 
                    onClick={() => onEventSelect(event)}
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div>
                      <strong>{event.title}</strong>
                      <div className="text-muted small">
                        {event.date.toLocaleDateString()} | {event.location}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
}