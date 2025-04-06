'use client';

import { useEffect,useState } from 'react';
import { fetchWeatherData } from '@/slices/weatherSlice'; // ✅ Adjust path if needed
import { fetchCryptoData } from '@/slices/cryptoSlice'; // ✅ Adjust path if needed
import { useDispatch, useSelector } from 'react-redux';
import { setWeatherData } from '@/slices/weatherSlice';
import { setCryptoData } from '@/slices/cryptoSlice';
import { toggleFavoriteCity, toggleFavoriteCrypto } from '@/slices/userSlice';
import Link from 'next/link';
import "../../styles/globals.css";


const cities = ['New York', 'London', 'Tokyo'];


export default function Dashboard() {
  const [news, setNews] = useState([]);
  const dispatch = useDispatch();
  const weatherData = useSelector(state => state.weather.data);
  const cryptoData = useSelector(state => state.crypto.data);
  const favoriteCities = useSelector(state => state.user.favorites.cities);
  const favoriteCryptos = useSelector(state => state.user.favorites.cryptos);

  useEffect(() => {
    async function fetchWeatherData() {
      if (Object.keys(weatherData).length) return;
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const results = {};

      for (const city of cities) {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();
        results[city] = data;
      }

      dispatch(setWeatherData(results));
    }

    async function fetchCryptoData() {
      if (Object.keys(cryptoData).length) return;
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana'
      );
      const data = await res.json();
      const formatted = {};
      data.forEach(coin => {
        formatted[coin.name] = {
          id: coin.id,
          name: coin.name,
          image: coin.image,
          price: coin.current_price,
          change: coin.price_change_percentage_24h,
          marketCap: coin.market_cap
        };
      });
      dispatch(setCryptoData(formatted));
    }

    async function fetchNews() {
      try {
        const res = await fetch(
          `https://newsdata.io/api/1/news?apikey=pub_78466d8ece0dee79be0976378d92d1cce3424&category=business&language=en&q=cryptocurrency`
        );
        const data = await res.json();
        setNews(data.results.slice(0, 5)); // top 5
      } catch (err) {
        console.error("News fetch error:", err);
      }
    }
  
    fetchNews();
    fetchWeatherData();
    fetchCryptoData();
  }, [dispatch, weatherData, cryptoData]);

  return (
    <main className="p-6 bg-[#f0f4f8] min-h-screen">


  <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-800">CryptoWeather Nexus</h1>


    {/* Favorites Section */}
{(favoriteCities.length > 0 || favoriteCryptos.length > 0) && (
  <section className="mb-10">
    <h2 className="text-2xl font-semibold mb-4">⭐ Favorites</h2>

    {/* Favorite Cities */}
    {favoriteCities.length > 0 && (
      <>
        <h3 className="text-lg font-semibold mb-2">🌆 Cities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {favoriteCities.map((cityName) => {
            const city = weatherData[cityName];
            return (
              <div key={cityName} className="bg-yellow-100 p-4 rounded shadow">
                <h4 className="font-bold">{city?.name || cityName}</h4>
                {city?.main && city?.weather ? (
                  <>
                    <p>Temp: {city.main.temp}°C</p>
                    <p>Humidity: {city.main.humidity}%</p>
                    <p>Condition: {city.weather[0].description}</p>
                  </>
                ) : (
                  <p className="text-red-500 text-sm">No data available</p>
                )}
                <Link
                  href={`/city/${cityName}`}
                  className="text-blue-600 underline mt-2 inline-block"
                >
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      </>
    )}

    {/* Favorite Cryptos */}
    {favoriteCryptos.length > 0 && (
      <>
        <h3 className="text-lg font-semibold mb-2">🪙 Cryptocurrencies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favoriteCryptos.map((cryptoName) => {
            const coin = cryptoData[cryptoName];
            return (
              <div key={cryptoName} className="bg-yellow-100 p-4 rounded shadow">
                <div className="flex items-center space-x-2 mb-2">
                  <img src={coin?.image} alt={coin?.name} className="w-6 h-6" />
                  <h4 className="font-bold">{coin?.name || cryptoName}</h4>
                </div>
                {coin ? (
                  <>
                    <p>💰 ${coin.price.toLocaleString()}</p>
                    <p>📉 24h: {coin.change.toFixed(2)}%</p>
                    <p>🏦 Market Cap: ${coin.marketCap.toLocaleString()}</p>
                    <Link
                      href={`/crypto/${coin.id}`}
                      className="text-blue-500 underline mt-2 inline-block"
                    >
                      View Details
                    </Link>
                  </>
                ) : (
                  <p className="text-red-500 text-sm">No data available</p>
                )}
              </div>
            );
          })}
        </div>
      </>
    )}
  </section>
)}

      {/* Weather Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">🌤 Weather</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cities.map((cityName) => {
            const city = weatherData[cityName] || {};
            const isFav = favoriteCities.includes(cityName);

            return (
              <div key={cityName} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold">{city.name || cityName}</h3>
                {city.main && city.weather ? (
                  <>
                    <p>Temperature: {city.main.temp}°C</p>
                    <p>Humidity: {city.main.humidity}%</p>
                    <p>Condition: {city.weather[0].description}</p>
                  </>
                ) : (
                  <p className="text-red-500">Weather data not available</p>
                )}
                <Link
                  href={`/city/${cityName}`}
                  className="text-blue-600 underline mt-2 inline-block"
                >
                  View Details
                </Link>
                <button
                  onClick={() => dispatch(toggleFavoriteCity(cityName))}
                  className={`mt-2 px-3 py-1 rounded text-sm ${
                    isFav ? 'bg-red-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {isFav ? '★ Remove Favorite' : '☆ Add Favorite'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Crypto Section */}
      <section className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-2">💸 Crypto Prices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.values(cryptoData).map((coin) => {
            const isFav = favoriteCryptos.includes(coin.name);
            return (
              <div key={coin.id} className="p-4 border rounded shadow">
                <div className="flex items-center space-x-2 mb-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <h3 className="font-semibold">{coin.name}</h3>
                </div>
                <p>💰 ${coin.price.toLocaleString()}</p>
                <p>📉 24h: {coin.change.toFixed(2)}%</p>
                <p>🏦 Market Cap: ${coin.marketCap.toLocaleString()}</p>
                <Link
                  href={`/crypto/${coin.id}`}
                  className="text-blue-500 underline mt-2 inline-block"
                >
                  View Details
                </Link>
                <button
                  onClick={() => dispatch(toggleFavoriteCrypto(coin.name))}
                  className={`mt-2 px-3 py-1 rounded text-sm ${
                    isFav ? 'bg-yellow-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  {isFav ? '★ Remove Favorite' : '☆ Add Favorite'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* News Section */}
      <section>
      <div className="mt-6 bg-white p-4 rounded-lg shadow max-h-96 overflow-y-auto">
    <h2 className="text-xl font-bold mb-4">📰 Top Crypto Headlines</h2>
    <ul className="list-disc pl-5 space-y-3">
      {news.map((item, index) => (
        <li key={index}>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  </div>
      </section>

      <footer className="mt-12 text-center text-gray-600 text-sm border-t pt-6">
  <p>Built with ❤️ by <span className="font-semibold text-gray-800">Paavani</span></p>
  <div className="mt-2 space-x-4">
    <a
      href="https://github.com/Paavani29"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      GitHub
    </a>
    <a
      href="https://www.linkedin.com/in/paavani-ramesh-883639224"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      LinkedIn
    </a>
  </div>
</footer>

    </main>
  );
}
