import React, { useEffect, useState } from "react";
import "./styles.css";

function App() {
  const [coords, setCoords] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => setError("Location access denied.")
    );
  }, []);

  useEffect(() => {
    if (coords) fetchWeatherByCoords();
  }, [coords]);

  const fetchWeatherByCoords = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://weather-api-lssx.onrender.com/api/weather?lat=${coords.latitude}&lon=${coords.longitude}`
      );
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();
      const primary = data[0];
      setWeatherData(primary);
      setForecast(primary.weather.forecast);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByDistrict = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://weather-api-lssx.onrender.com/api/weather?district=${searchQuery}`
      );
      if (!res.ok) throw new Error("District not found");
      const data = await res.json();
      const primary = data[0];
      setWeatherData(primary);
      setForecast(primary.weather.forecast);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🌤️ Weather App</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter district name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={fetchWeatherByDistrict}>Search</button>
      </div>

      {loading && <p>Loading weather data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weatherData && (
        <>
          <h2>
            {weatherData.district}, {weatherData.state}
          </h2>
          <div className="current-weather">
            <p>
              <strong>Temp:</strong> {weatherData.weather.temperature}
            </p>
            <p>
              <strong>Condition:</strong> {weatherData.weather.condition}
            </p>
            <p>
              <strong>Humidity:</strong> {weatherData.weather.humidity}
            </p>
            <p>
              <strong>Wind:</strong> {weatherData.weather.wind_speed}
            </p>
          </div>

          <h3>5-Day Forecast</h3>
          <div className="forecast">
            {forecast.length > 0 ? (
              forecast.map((day) => (
                <div key={day._id} className="forecast-day">
                  <p>
                    <strong>{day.day}</strong>
                  </p>
                  <p>{day.condition}</p>
                  <p>High: {day.high}</p>
                  <p>Low: {day.low}</p>
                </div>
              ))
            ) : (
              <p>No forecast data available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
