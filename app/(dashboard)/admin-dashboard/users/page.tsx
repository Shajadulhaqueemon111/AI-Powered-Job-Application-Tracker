/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/app/redux/features/users/users-api";

import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import { EditUserDialog } from "./edit-user";
import { DeleteUserDialog } from "./delete-user";
import toast from "react-hot-toast";
import { DataTableSkeleton } from "./skeliton";

export default function UsersPage() {
  const { data, isLoading, isError } = useGetUsersQuery(undefined);

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    status: "",
  });

  if (isLoading)
    return (
      <div>
        <DataTableSkeleton />
      </div>
    );
  if (isError) return <div>Failed to load users</div>;

  const users = data?.data || [];

  // 👉 Edit click
  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      role: user.role,
      status: user.status,
    });
    setEditOpen(true);
  };

  // 👉 Delete click
  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  // 👉 Update submit
  const handleUpdate = async () => {
    if (!selectedUser?._id) {
      toast.error("No user selected");
      return;
    }

    try {
      await updateUser({
        id: selectedUser._id,
        data: formData,
      }).unwrap();

      toast.success("User updated successfully ✅");
      setEditOpen(false);
    } catch (error) {
      toast.error("Failed to update user ");
    }
  };
  // 👉 Confirm delete
  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUser._id).unwrap();

      toast.success("User deleted successfully 🗑️");
      setDeleteOpen(false);
    } catch (error) {
      toast.error("Failed to delete user ");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={getColumns(handleEdit, handleDelete)} data={users} />

      {/* EDIT MODAL */}
      <EditUserDialog
        open={editOpen}
        setOpen={setEditOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdate}
      />

      {/* DELETE MODAL */}
      <DeleteUserDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
