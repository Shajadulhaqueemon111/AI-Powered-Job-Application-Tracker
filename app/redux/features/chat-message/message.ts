/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatMessageApi = createApi({
  reducerPath: "ChatMessageApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API,
    credentials: "include",

    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as any).auth?.token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null);
      console.log("Token in chatMessageApi:", token);
      if (token) {
        headers.set("authorization", `${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["ChatMessage"],

  endpoints: (builder) => ({
    createChatMessage: builder.mutation({
      query: (chatMessageData) => ({
        url: "messages/send",
        method: "POST",
        body: chatMessageData,
      }),
      invalidatesTags: ["ChatMessage"],
    }),
    getChatMessages: builder.query({
      query: (applicationId) => ({
        url: `messages/conversation/${applicationId}`,
        method: "GET",
      }),
      // providesTags: ["ChatMessage"],
    }),

    updateChatMessage: builder.mutation({
      query: (id) => ({
        url: `messages/read/${id}`,
        method: "patch",
      }),
      invalidatesTags: ["ChatMessage"],
    }),
    unreadChatMessage: builder.query({
      query: (id) => ({
        url: `messages/unread/${id}`,
        method: "GET",
      }),
    }),
    deleteChatMessage: builder.mutation({
      query: (id) => ({
        url: `messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChatMessage"],
    }),
  }),
});

export const {
  useCreateChatMessageMutation,
  useGetChatMessagesQuery,
  useUpdateChatMessageMutation,
  useDeleteChatMessageMutation,
  useUnreadChatMessageQuery,
} = chatMessageApi;
