/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApi = createApi({
  reducerPath: "notificationApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API,
    credentials: "include",

    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as any).auth?.token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null);

      if (token) {
        headers.set("authorization", `${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Notification"],

  endpoints: (builder) => ({
    // GET all notifications
    getNotifications: builder.query({
      query: (userId) => ({
        url: `notifications?userId=${userId}`,
        method: "GET",
      }),
    }),

    // CREATE notification
    createNotification: builder.mutation({
      query: (data) => ({
        url: "notifications/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),

    // MARK AS READ
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useCreateNotificationMutation,
  useMarkAsReadMutation,
} = notificationApi;
