import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCurrentEmployee = createAsyncThunk(
  "auth/fetchCurrentEmployee",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data.employee;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        localStorage.removeItem("token");
        return rejectWithValue(
          err.response.data.error || "Authentication failed",
        );
      }
      return rejectWithValue("Token invalid");
    }
  },
);

const initialState = {
  token: localStorage.getItem("token"),
  employee: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.employee = action.payload.user;
      localStorage.setItem("token", action.payload.token);
    },
    signout: (state) => {
      state.token = null;
      state.employee = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(fetchCurrentEmployee.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.employee = null;
      });
  },
});

export const { setCredentials, signout } = authSlice.actions;
export default authSlice.reducer;
