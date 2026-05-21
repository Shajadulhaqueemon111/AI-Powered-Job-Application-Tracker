import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/auth/authApi";
import { jobApi } from "../(dashboard)/hr-dashboard/create-job/api/create-job-api";
import authReducer from "./features/auth/authSlice"; // ✅ যোগ করো

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, jobApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
