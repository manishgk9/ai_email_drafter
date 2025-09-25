import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// const base_url = "http://localhost:8000";
const base_url =
  import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000";

export const generateEmail = createAsyncThunk(
  "email/generate",
  async ({ prompt, recipients }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(`${base_url}/api/generate`, {
        prompt,
      });
      return resp.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(
          err.response.data?.detail ||
            err.response.data?.error?.message ||
            "Something went wrong."
        );
      }
      return rejectWithValue(err.message);
    }
  }
);
