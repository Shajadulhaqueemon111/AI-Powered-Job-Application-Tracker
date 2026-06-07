import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/auth/authApi";
import { jobApi } from "./features/jobs/jobs-api";
import authReducer from "./features/auth/authSlice"; //
import { applicationApi } from "./features/application/application-api";
import { userApi } from "./features/users/users-api";
import { notificationApi } from "./features/notification/notification";
import { chatMessageApi } from "./features/chat-message/message";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [chatMessageApi.reducerPath]: chatMessageApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      jobApi.middleware,
      applicationApi.middleware,
      notificationApi.middleware,
      chatMessageApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
