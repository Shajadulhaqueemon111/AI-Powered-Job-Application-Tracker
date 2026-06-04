/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API,
    credentials: "include",

    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as any).auth?.token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null);
      console.log("Token in userApi:", token);
      if (token) {
        headers.set("authorization", `${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["User"],

  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (userData) => ({
        url: "users/create-user",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query({
      query: () => ({
        url: "user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `user/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
