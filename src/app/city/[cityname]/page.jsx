// app/city/[cityname]/page.jsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CityDetails() {
  const { cityname } = useParams();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();
        if (data.cod !== 200) {
          throw new Error('City not found');
        }
        setWeather(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (cityname) fetchWeather();
  }, [cityname]);

  if (loading) return <p className="p-6">Loading weather for {cityname}...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading weather for {cityname}</p>;

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Weather in {weather.name}</h1>
      <div className="bg-white rounded shadow p-6 max-w-md mx-auto">
        <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
        <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
        <p><strong>Condition:</strong> {weather.weather[0].description}</p>
        <p><strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
        <p><strong>Feels Like:</strong> {weather.main.feels_like}°C</p>
      </div>
    </main>
  );
}

