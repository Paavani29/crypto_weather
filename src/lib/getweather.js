export async function getWeather(city) {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather fetch failed');
  
    const data = await res.json();
    return {
      city: data.name,
      temp: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
    };
  }
  