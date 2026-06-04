import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type UserData = {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  loginAttempts: number;
  createdAt: string;
};

export const getColumns = (
  onEdit: (user: UserData) => void,
  onDelete: (user: UserData) => void,
): ColumnDef<UserData>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          row.original.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "loginAttempts",
    header: "Login Attempts",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(user)}>
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(user)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
