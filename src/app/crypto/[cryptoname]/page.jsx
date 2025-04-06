'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function CryptoDetails() {
  const { cryptoname } = useParams();
  const [crypto, setCrypto] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Details
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoname}`);
        const data = await res.json();
        if (data.error) throw new Error('Crypto not found');
        setCrypto(data);

        // Market Chart
        const chartRes = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoname}/market_chart?vs_currency=usd&days=7`);
        const chartJson = await chartRes.json();
        const formatted = chartJson.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price.toFixed(2),
        }));
        setChartData(formatted);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (cryptoname) fetchData();
  }, [cryptoname]);

  if (loading) return <p className="p-6 text-lg">Loading data for {cryptoname}...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading data for {cryptoname}</p>;

  return (
    <main className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 space-y-6">
        <div className="flex items-center space-x-4">
          <img src={crypto.image.large} alt={crypto.name} className="w-16 h-16" />
          <div>
            <h1 className="text-3xl font-bold">{crypto.name}</h1>
            <p className="text-gray-500 dark:text-gray-300 capitalize">Symbol: {crypto.symbol}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
          <p><span className="font-semibold">Current Price:</span> ${crypto.market_data.current_price.usd.toLocaleString()}</p>
          <p><span className="font-semibold">Market Cap:</span> ${crypto.market_data.market_cap.usd.toLocaleString()}</p>
          <p><span className="font-semibold">24h Change:</span> {crypto.market_data.price_change_percentage_24h.toFixed(2)}%</p>
          <p><span className="font-semibold">Total Volume:</span> ${crypto.market_data.total_volume.usd.toLocaleString()}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">7-Day Price Chart (USD)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={crypto.name === 'bitcoin' ? "#ff9900" : "#ccc"} />
              <XAxis dataKey="date" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p
            className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: crypto.description.en.split('. ')[0] + '.' }}
          />
        </div>
      </div>
    </main>
  );
}
