"use client";

import Loading from "@/app/loading";
import MyApplicationsTable from "./application-table";
import { useGetMyAllApplicationsQuery } from "@/app/redux/features/application/application-api";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";

export default function ApplicationClient() {
  const { data: getme, isLoading: userLoading } = useGetMeQuery();

  const userId = getme?.data?.user?._id;

  const { data, isLoading } = useGetMyAllApplicationsQuery(userId, {
    skip: !userId,
  });

  if (userLoading || isLoading) {
    return <Loading />;
  }

  return <MyApplicationsTable data={data?.data || []} />;
}
