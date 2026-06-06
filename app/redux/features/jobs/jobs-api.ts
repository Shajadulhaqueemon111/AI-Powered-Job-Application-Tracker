/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobApi = createApi({
  reducerPath: "jobApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API,
    credentials: "include",

    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as any).auth?.token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null);
      console.log("Token in jobApi:", token);
      if (token) {
        headers.set("authorization", `${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Job"],

  endpoints: (builder) => ({
    createJob: builder.mutation({
      query: (jobData) => ({
        url: "jobs/create-job",
        method: "POST",
        body: jobData,
      }),
      invalidatesTags: ["Job"],
    }),
    // getJobs: builder.query({
    //   query: () => ({
    //     url: "jobs",
    //     method: "GET",
    //   }),
    //   providesTags: ["Job"],
    // }),
    getJobs: builder.query({
      query: (createdBy?: string) => ({
        url: createdBy ? `jobs?createdBy=${createdBy}` : "jobs",
        method: "GET",
      }),
      providesTags: ["Job"],
    }),
    updateJob: builder.mutation({
      query: (id) => ({
        url: `jobs/${id}`,
        method: "patch",
      }),
      invalidatesTags: ["Job"],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job"],
    }),
  }),
});

export const {
  useCreateJobMutation,
  useGetJobsQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApi;
