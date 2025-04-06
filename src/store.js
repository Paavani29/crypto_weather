// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import weatherReducer from './slices/weatherSlice';
import cryptoReducer from './slices/cryptoSlice';
import userReducer from './slices/userSlice'; // optional if separate

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    weather: weatherReducer,
    crypto: cryptoReducer,
    user: userReducer,
  },
});
