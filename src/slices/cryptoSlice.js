import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setCryptoData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setCryptoData } = cryptoSlice.actions;
export default cryptoSlice.reducer;
