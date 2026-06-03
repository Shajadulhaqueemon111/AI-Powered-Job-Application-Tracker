import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const applicationApi = createApi({
  reducerPath: "ApplicationApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_API}`,
    credentials: "include",
  }),

  tagTypes: ["Application"],

  endpoints: (builder) => ({
    createApplication: builder.mutation({
      query: (applicationData) => ({
        url: "/applications/create-application",
        method: "POST",
        body: applicationData,
      }),
      invalidatesTags: ["Application"],
    }),
    getApplications: builder.query({
      query: () => ({
        url: "/applications",
        method: "GET",
      }),
      providesTags: ["Application"],
    }),
    updateApplication: builder.mutation({
      query: (id) => ({
        url: `/applications/${id}`,
        method: "patch",
      }),
      invalidatesTags: ["Application"],
    }),
    deleteApplication: builder.mutation({
      query: (id) => ({
        url: `/applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Application"],
    }),
    getMyApplications: builder.query({
      query: (email) => ({
        url: `/applications/my-applications?email=${email}`,
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
} = applicationApi;
