// src/store/serialNumberSlice.js
import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  currentSerial: localStorage.getItem('currentSerial') || '1'
};

const serialNumberSlice = createSlice({
  name: 'serialNumber',
  initialState,
  reducers: {
    incrementSerial: (state) => {
      const nextSerial = String(Number(state.currentSerial) + 1);
      state.currentSerial = nextSerial;
      localStorage.setItem('currentSerial', nextSerial);
    },
    setSerial: (state, action) => {
      state.currentSerial = action.payload;
      localStorage.setItem('currentSerial', action.payload);
    }
  }
});

export const { incrementSerial, setSerial } = serialNumberSlice.actions;
export default serialNumberSlice.reducer;