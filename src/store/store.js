import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice/authSlice.js'
import adminEventSlice from './admin/EventSlice/EventSlice.js'
import eventReducer from "./user-view/UserEventSlice.js";
import userEventRegistrationSlice from './user-view/RegisterEventSlice.js'
import jobsReducer from "./user-view/UserJobSlice.js"
import adminJobsReducer from "./admin/AdminJobSlice.js"
import alumniReducer from "./user-view/AlumniDirSlice.js"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminEvent: adminEventSlice,
    events: eventReducer,
    register : userEventRegistrationSlice,
    userJobsReducer :jobsReducer,
    adminJobs : adminJobsReducer,
    alumni: alumniReducer,

  },
});

export default store 