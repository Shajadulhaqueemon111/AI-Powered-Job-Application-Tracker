/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ================= TYPES ================= */

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken?: string;
    refreshToken?: string;
    twoFactorEnabled?: boolean;
    email?: string;
    userId?: string;
    user?: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export interface TwoFactorToggleData {
  enable: boolean;
}

export interface TwoFactorToggleResponse {
  success: boolean;
  message: string;
  data: {
    twoFactorEnabled: boolean;
  };
}

/* ================= API ================= */

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API,
    credentials: "include",

    // 🔥 IMPORTANT FIX (production 401 solve)
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as any).auth?.token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null);

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    /* ================= REGISTER ================= */
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (userData) => ({
        url: "user/register",
        method: "POST",
        body: userData,
      }),
    }),

    /* ================= LOGIN ================= */
    login: builder.mutation<AuthResponse, LoginData>({
      query: (loginData) => ({
        url: "auth/login",
        method: "POST",
        body: loginData,
      }),
    }),

    /* ================= VERIFY OTP ================= */
    verifyOtp: builder.mutation<AuthResponse, VerifyOtpData>({
      query: (otpData) => ({
        url: "auth/verify-otp",
        method: "POST",
        body: otpData,
      }),
    }),

    /* ================= REFRESH TOKEN ================= */
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "auth/refresh-token",
        method: "POST",
      }),
    }),

    /* ================= LOGOUT ================= */
    logOut: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),

    /* ================= 2FA TOGGLE ================= */
    toggleTwoFactor: builder.mutation<
      TwoFactorToggleResponse,
      TwoFactorToggleData
    >({
      query: (data) => ({
        url: "auth/2fa/toggle",
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

/* ================= EXPORT HOOKS ================= */

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useRefreshTokenMutation,
  useLogOutMutation,
  useToggleTwoFactorMutation,
} = authApi;
