/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuditLog } from "@/app/(dashboard)/admin-dashboard/audit-logs/type";
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
export interface AuditLogResponse {
  data: AuditLog[];
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
      status: string;
      profileImage: string;
      phoneNumber?: string;
      address?: string;
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
  tagTypes: ["User"],
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
        headers.set("authorization", `${token}`);
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
    /* ================= GET ME ================= */
    getMe: builder.query<{ success: boolean; data: { user: any } }, void>({
      query: () => ({
        url: `auth/me?_t=${Date.now()}`,
        method: "GET",
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 0,
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
    getAuditLogs: builder.query<AuditLogResponse, void>({
      query: () => ({
        url: "auth/audit-logs",
        method: "GET",
      }),
    }),

    /* ================= LOGOUT ================= */
    logOut: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
    updateUser: builder.mutation<void, void>({
      query: () => ({
        url: "user",
        method: "POST",
      }),
    }),
    changePassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "auth/change-password", // <-- নিজের actual route বসাও
        method: "PATCH",
        body,
      }),
    }),

    uploadProfile: builder.mutation<
      any,
      {
        id: string;
        formData: FormData;
      }
    >({
      query: ({ id, formData }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
    uploadResume: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),

    updateNotificationSettings: builder.mutation<
      { message: string },
      { emailAlerts: boolean; jobAlerts: boolean; interviewReminders: boolean }
    >({
      query: (body) => ({
        url: "users/notifications",
        method: "PATCH",
        body,
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
      invalidatesTags: ["User"], // ✅ এটাই getMe refetch করবে
      // onQueryStarted দিয়ে optimistic update করবো
      async onQueryStarted({ enable }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          authApi.util.updateQueryData("getMe", undefined, (draft) => {
            if (draft?.data?.user) {
              draft.data.user.twoFactorEnabled = enable;
            }
          }),
        );

        try {
          await queryFulfilled;

          dispatch(authApi.util.invalidateTags(["User"]));
        } catch {
          patchResult.undo();
        }
      },
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
  useGetAuditLogsQuery,
  useToggleTwoFactorMutation,
  useGetMeQuery,
  useChangePasswordMutation,
  useUploadProfileMutation,
  useUploadResumeMutation,
  useUpdateNotificationSettingsMutation,
  useUpdateUserMutation,
} = authApi;
