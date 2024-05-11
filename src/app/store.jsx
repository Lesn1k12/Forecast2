import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../context/auth/AuthSlice"


export const store = configureStore({
    reducer: {
        auth: authReducer
    },
})