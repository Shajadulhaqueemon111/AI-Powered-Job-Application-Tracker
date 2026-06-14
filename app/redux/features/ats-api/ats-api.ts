/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AtsResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export const atsApi = createApi({
  reducerPath: "atsApi",
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
        headers.set("authorization", token);
      }

      return headers;
    },
  }),
  tagTypes: ["ATS"],
  endpoints: (builder) => ({
    // Analyze Application
    analyzeApplication: builder.mutation<AtsResult, { applicationId: string }>({
      query: (body) => ({
        url: "/ai-checker/match",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAnalyzeApplicationMutation } = atsApi;
