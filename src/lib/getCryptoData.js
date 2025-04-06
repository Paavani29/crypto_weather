export async function getCryptoData() {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana'
    );
  
    if (!response.ok) throw new Error("Failed to fetch crypto data");
  
    const data = await response.json();
  
    return data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      price: coin.current_price,
      change: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      image: coin.image,
    }));
  }
  