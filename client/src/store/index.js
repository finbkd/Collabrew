import { configureStore } from "@reduxjs/toolkit";
import room from "./roomSlice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    room,
  },
});
