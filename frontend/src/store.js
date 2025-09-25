import { configureStore } from "@reduxjs/toolkit";
import emailReducer from "./redux/emailSlice";

const storeEmail = configureStore({
  reducer: { email: emailReducer },
});

export default storeEmail;
