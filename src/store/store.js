import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice/authSlice.js'
import adminEventSlice from './admin/EventSlice/EventSlice.js'
import eventReducer from "./user-view/UserEventSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminEvent: adminEventSlice,
    events: eventReducer,
  },
});

export default store 