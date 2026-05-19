import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobApi = createApi({
  reducerPath: "jobApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_API}`,
    credentials: "include",
  }),

  tagTypes: ["Job"],

  endpoints: (builder) => ({
    createJob: builder.mutation({
      query: (jobData) => ({
        url: "/jobs/create-job",
        method: "POST",
        body: jobData,
      }),
      invalidatesTags: ["Job"],
    }),
  }),
});

export const { useCreateJobMutation } = jobApi;
