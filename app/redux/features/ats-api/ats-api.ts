/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AtsResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}
export interface IAtsRequest {
  resumeText: string;
  jobDescription: string;
}

export interface IAtsResult {
  score: number;

  matchedSkills: string[];

  missingSkills: string[];

  aiSuggestions: string[];

  atsCompatibility: {
    formatting: boolean;
    sectionHeadings: boolean;
    keywordOptimized: boolean;
    readabilityScore: boolean;
  };

  recruiterImpression: string;

  metrics: {
    skillMatch: number;
    atsScore: number;
    experienceMatch: number;
  };
}

export interface IAtsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IAtsResult;
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

    analyzeResume: builder.mutation<IAtsResponse, IAtsRequest>({
      query: (data) => ({
        url: "/ai/match",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useAnalyzeApplicationMutation, useAnalyzeResumeMutation } =
  atsApi;
