import { headers } from "next/headers";
import AdminNotFound from "./admin-dashboard/not-found";
import UserNotFound from "./user-dashboard/not-found";
import GlobalNotFound from "../not-found";

export default async function DashboardNotFound() {
  const headersList = await headers();
  const pathname =
    headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";

  if (pathname.startsWith("/admin-dashboard")) {
    return <AdminNotFound />;
  }

  if (pathname.startsWith("/user-dashboard")) {
    return <UserNotFound />;
  }

  return <GlobalNotFound />; // default fallback
}
