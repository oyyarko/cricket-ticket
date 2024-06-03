import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../services/api";

const initialState = () => ({
  blocks: null,
});

const groundSlice = createSlice({
  initialState: initialState(),
  name: "ground",
  extraReducers: (builder) => {
    builder.addCase(fetchBlocks.fulfilled, (state, { payload }) => ({
      ...state,
      blocks: payload.map((block, index) => ({ ...block, angle: 45 * index })),
    }));
  },
});

export const fetchBlocks = createAsyncThunk(
  "ground/blocks",
  async (data, cb = () => {}) => {
    try {
      const response = await axiosClient.get("/blocks", data);
      return response?.data;
    } catch (error) {
      return error;
    }
  }
);

// export const {} = groundSlice.actions;
export default groundSlice.reducer;
