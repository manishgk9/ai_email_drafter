import { createSlice } from "@reduxjs/toolkit";
import { generateEmail } from "./services/api";
const slice = createSlice({
  name: "email",
  initialState: {
    prompt: "",
    recipients: "",
    subject: "",
    body: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setPrompt(state, action) {
      state.prompt = action.payload;
    },
    setRecipients(state, action) {
      state.recipients = action.payload;
    },
    setSubject(state, action) {
      state.subject = action.payload;
    },
    setBody(state, action) {
      state.body = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(generateEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subject = action.payload.subject;
        state.body = action.payload.body;
      })
      .addCase(generateEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setPrompt, setRecipients, setSubject, setBody } = slice.actions;
export default slice.reducer;
