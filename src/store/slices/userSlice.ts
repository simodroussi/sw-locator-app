import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  lat: number | null;
  long: number | null;
}

const initialState: UserState = {
  lat: null,
  long: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLocation(state, action: PayloadAction<{ latitude: number | null; longitude: number | null }>) {
      state.lat = action.payload.latitude;
      state.long = action.payload.longitude;
    },
  },
});

export const { setUserLocation } = userSlice.actions;

export default userSlice.reducer;
