import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: {
    cities: [],
    cryptos: [],
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleFavoriteCity: (state, action) => {
      const city = action.payload;
      if (state.favorites.cities.includes(city)) {
        state.favorites.cities = state.favorites.cities.filter(c => c !== city);
      } else {
        state.favorites.cities.push(city);
      }
    },
    toggleFavoriteCrypto: (state, action) => {
      const crypto = action.payload;
      if (state.favorites.cryptos.includes(crypto)) {
        state.favorites.cryptos = state.favorites.cryptos.filter(c => c !== crypto);
      } else {
        state.favorites.cryptos.push(crypto);
      }
    },
  },
});

export const { toggleFavoriteCity, toggleFavoriteCrypto } = userSlice.actions;
export default userSlice.reducer;
