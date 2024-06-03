import { configureStore } from "@reduxjs/toolkit";
import groundSlice from "./redux/groundSlice";


const store = configureStore({
  reducer: {
    ground: groundSlice
  },
  devTools: true,
});

export default store;
