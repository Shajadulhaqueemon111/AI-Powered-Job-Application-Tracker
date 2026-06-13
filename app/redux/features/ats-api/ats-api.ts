/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const atsApi = createApi({
  reducerPath: "atsApi",
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
  tagTypes: ["ATS"],
  endpoints: (builder) => ({
    // 🔥 ANALYZE APPLICATION
    analyzeApplication: builder.mutation({
      query: ({ applicationId, jobDescription }) => ({
        url: `/ai-checker/match`,
        method: "POST",
        body: {
          applicationId,
          jobDescription,
        },
      }),
      invalidatesTags: ["ATS"],
    }),
  }),
});

export const { useAnalyzeApplicationMutation } = atsApi;
