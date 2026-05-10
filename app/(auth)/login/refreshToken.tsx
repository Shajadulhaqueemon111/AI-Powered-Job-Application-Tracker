/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from "@/app/redux/store";
import { authApi } from "@/app/redux/features/auth/authApi";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export const refreshAccessToken = async (setUser: any): Promise<boolean> => {
  try {
    const res = await store.dispatch(
      authApi.endpoints.refreshToken.initiate(undefined)
    ).unwrap();

    if (res?.data?.accessToken) {
      const token = res.data.accessToken;

      localStorage.setItem("accessToken", token);

      const decoded: any = jwtDecode(token);

      setUser({
        email: decoded.email,
        role: decoded.role,
        profileImage: decoded.profileImage,
      });

      toast.success("Token refreshed successfully!");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Token refresh failed", error);
    toast.error("Session expired. Please login again.");
    return false;
  }
};