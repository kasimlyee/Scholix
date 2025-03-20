// TimeWeatherEventWidget.tsx
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TimeWeatherEventWidget.css";

// Weather API setup (replace with your API key)
const WEATHER_API_KEY = "2b3f1d4210a05bfda7ba7d879affcef65";
const WEATHER_API_URL =
  "https://api.openweathermap.org/data/2.5/weather?q=Uganda&appid=b3f1d4210a05bfda7ba7d879affcef65&units=metric";

// Define interfaces for weather data
interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
}

const TimeWeatherEventWidget: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [events, setEvents] = useState<string[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch weather data
    const fetchWeather = async () => {
      try {
        const response = await axios.get(WEATHER_API_URL);
        const data = response.data;
        setWeather({
          temperature: data.main.temp,
          description: data.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        });
        setLoading(false);
      } catch (err) {
        console.log("Failed fetching weather data:", err);
        setError("Failed to fetch weather data");
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    // Fetch or show events for the selected date (for demo, we'll use a static list)
    setEvents([
      "Meeting with Teachers at 10:00 AM",
      "Sports Day Registration Deadline",
      "Parent-Teacher Meeting at 2:00 PM",
    ]);
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Current Time, Weather & Events</Card.Title>

        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            {/* Time Section */}
            <Row className="mb-3">
              <Col>
                <h4>{currentTime}</h4>
                <p>Current Time</p>
              </Col>
            </Row>

            {/* Weather Section */}
            <Row className="mb-3">
              <Col>
                <div className="text-center">
                  <img src={weather?.icon} alt="weather-icon" />
                  <h5>{weather?.temperature}°C</h5>
                  <p>{weather?.description}</p>
                </div>
              </Col>
            </Row>

            {/* Calendar Section */}
            <Row className="mb-3">
              <Col>
                <ReactCalendar
                  //onChange={handleDateChange}
                  value={date}
                  tileClassName="calendar-tile"
                />
              </Col>
            </Row>

            {/* Event Section */}
            <Row className="mt-3">
              <Col>
                <h5>Events for {date.toLocaleDateString()}</h5>
                <ul>
                  {events.map((event, index) => (
                    <li key={index}>{event}</li>
                  ))}
                </ul>
              </Col>
            </Row>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default TimeWeatherEventWidget;
