import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice/authSlice.js'
import adminEventSlice from './admin/EventSlice/EventSlice.js'

export const store = configureStore({
    reducer:{
    auth :authReducer,
    adminEvent :adminEventSlice,
    
    }
})

export default store 