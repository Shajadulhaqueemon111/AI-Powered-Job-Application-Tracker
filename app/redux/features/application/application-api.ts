/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const applicationApi = createApi({
  reducerPath: "ApplicationApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_API}`,
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

  tagTypes: ["Application"],

  endpoints: (builder) => ({
    createApplication: builder.mutation({
      query: (applicationData) => ({
        url: "applications/create-application",
        method: "POST",
        body: applicationData,
      }),
      invalidatesTags: ["Application"],
    }),
    getApplications: builder.query({
      query: () => ({
        url: "applications/my-applications",
        method: "GET",
      }),
      providesTags: ["Application"],
    }),
    updateApplication: builder.mutation({
      query: (id) => ({
        url: `applications/${id}`,
        method: "patch",
      }),
      invalidatesTags: ["Application"],
    }),
    deleteApplication: builder.mutation({
      query: (id) => ({
        url: `applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Application"],
    }),
    getMyApplications: builder.query({
      query: (userId) => ({
        url: `applications/my-applications?userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["Application"],
    }),
    getMyAllApplications: builder.query({
      query: (userId) => ({
        url: `applications/my-all-applications?userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["Application"],
    }),
  }),
});

export const {
  useCreateApplicationMutation,
  useGetApplicationsQuery,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
  useGetMyApplicationsQuery,
  useGetMyAllApplicationsQuery,
} = applicationApi;
