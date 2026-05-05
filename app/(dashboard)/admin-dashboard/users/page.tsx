import { Metadata } from "next";
import { columns, UserData } from "./columns";
import { DataTable } from "./data-table";
export const metadata: Metadata = {
  title: "Users Page",
  description: "Manage and view all users data in table format",
};
const data: UserData[] = [
  {
    id: 1,
    header: "Dashboard Section",
    type: "Table of Contents",
    status: "Done",
    target: "100",
    limit: "200",
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    header: "Analytics",
    type: "Technical Approach",
    status: "In Progress",
    target: "80",
    limit: "150",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 3,
    header: "User Panel",
    type: "Executive Summary",
    status: "Not Started",
    target: "60",
    limit: "120",
    reviewer: "Assign reviewer",
  },
];

export default function usersPage() {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
