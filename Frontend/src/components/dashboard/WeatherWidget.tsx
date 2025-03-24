import { useState, useEffect } from "react";
import axios from "axios";

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<string>("Loading...");

  useEffect(() => {
    // Mock API call (replace with real OpenWeatherMap API key)
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY"
      )
      .then((res) =>
        setWeather(
          `${res.data.main.temp}°C, ${res.data.weather[0].description}`
        )
      )
      .catch(() => setWeather("Weather unavailable"));
  }, []);

  return (
    <div className="card">
      <h2>Weather</h2>
      <p>{weather}</p>
    </div>
  );
};

export default WeatherWidget;
