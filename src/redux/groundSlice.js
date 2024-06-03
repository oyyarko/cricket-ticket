import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../services/api";
import toast from "react-hot-toast";

const initialState = () => ({
  blocks: null,
  seats: null,
});

const groundSlice = createSlice({
  initialState: initialState(),
  name: "ground",
  extraReducers: (builder) => {
    builder.addCase(fetchBlocks.fulfilled, (state, { payload }) => ({
      ...state,
      blocks: payload.map((block, index) => ({ ...block, angle: 45 * index })),
    }));
    builder.addCase(fetchSeatsByBlock.fulfilled, (state, { payload }) => ({
      ...state,
      seats: payload.reduce((acc, seat) => {
        const { row, col } = seat;
        acc[row - 1] = acc[row - 1] || [];
        acc[row - 1][col - 1] = seat;
        return acc;
      }, []),
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

export const fetchSeatsByBlock = createAsyncThunk(
  "ground/blocks/seats",
  async (blockId, data, cb = () => {}) => {
    try {
      const response = await axiosClient.get(`/seats/${blockId}`, data);
      return response?.data;
    } catch (error) {
      return error;
    }
  }
);

export const selectSeats = createAsyncThunk(
  "ground/blocks/select-seats",
  async (data, cb = () => {}) => {
    try {
      const response = await axiosClient.post(
        `/select-seats/${data.blockId}`,
        data.seats
      );
      if(response.data){
        data.cb()
        toast.success("Seat selected!")
      }
      return response?.data;
    } catch (error) {
      return error;
    }
  }
);

// export const {} = groundSlice.actions;
export default groundSlice.reducer;
