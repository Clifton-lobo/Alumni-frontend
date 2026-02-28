import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice/authSlice.js'
import adminEventSlice from './admin/EventSlice/EventSlice.js'
import eventReducer from "./user-view/UserEventSlice.js";
import userEventRegistrationSlice from './user-view/RegisterEventSlice.js'
import jobsReducer from "./user-view/UserJobSlice.js"
import adminJobsReducer from "./admin/AdminJobSlice.js"
import alumniReducer from "./user-view/AlumniDirectorySlice.js"
import userInfoReducer from "./user-view/UserInfoSlice.js"
import ConnectionReducer from "./user-view/ConnectionSlice.js"
import messageReducer from "./user-view/MessageSlice.js"
import ApplicationReducer from "./user-view/ApplicationSlice.js"
import NewsReducer from "./user-view/UserNewsSlice.js"
import GalleryReducer from "./user-view/GallerySlice.js"
import AdminGalleryReducer from "./admin/AdminGallerySlice.js"
import AdminNewsReducer from "./admin/AdminNewsSlice.js"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminEvent: adminEventSlice,
    events: eventReducer,
    register: userEventRegistrationSlice,
    userJobsReducer: jobsReducer,
    adminJobs: adminJobsReducer,
    alumni: alumniReducer,
    userProfile: userInfoReducer,
    connections :ConnectionReducer,
    messages :  messageReducer,
    applications: ApplicationReducer,
    news : NewsReducer,
    gallery:GalleryReducer,
    Admingallery: AdminGalleryReducer,
    Adminnews : AdminNewsReducer
    
  },
});

export default store 