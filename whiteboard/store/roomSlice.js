import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomData: null,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action) => {
      const { roomData: roomDataa } = action.payload;
      if (roomDataa) {
        state.roomData = roomDataa;
      }
    },
  },
});

export const { setRoom } = roomSlice.actions;

export default roomSlice.reducer;
