import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/auth/authApi";
import { jobApi } from "./features/jobs/jobs-api";
import authReducer from "./features/auth/authSlice"; //
import { applicationApi } from "./features/application/application-api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      jobApi.middleware,
      applicationApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
