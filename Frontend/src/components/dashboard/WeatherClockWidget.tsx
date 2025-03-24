import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCloudSun } from "@fortawesome/free-solid-svg-icons";

const WeatherClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [weather, setWeather] = useState("Loading...");

  useEffect(() => {
    const interval = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000
    );
    axios
      .get(`import.meta.env.VITE_WEATHER_API_URL`)
      .then((res) =>
        setWeather(
          `${res.data.main.temp}°C, ${res.data.weather[0].description}`
        )
      )
      .catch(() => setWeather("N/A"));
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <h2>
        <FontAwesomeIcon icon={faClock} /> Time & Weather
      </h2>
      <p>
        <FontAwesomeIcon icon={faClock} /> {time}
      </p>
      <p>
        <FontAwesomeIcon icon={faCloudSun} /> {weather}
      </p>
    </div>
  );
};

export default WeatherClockWidget;
