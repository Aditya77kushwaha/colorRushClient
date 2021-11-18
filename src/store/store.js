import { configureStore } from "@reduxjs/toolkit";
import colorReducer from "./features/colorSlice";

export const store = configureStore({
  reducer: {
    colors: colorReducer,
  },
});
