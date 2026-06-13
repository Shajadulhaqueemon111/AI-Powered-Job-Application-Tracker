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

  // =========================
  // 👉 EDIT (BLOCK ADMIN)
  // =========================
  const handleEdit = (user: any) => {
    if (user.role === "admin") {
      toast.error("Admin cannot be edited 🚫");
      return;
    }

    setSelectedUser(user);
    setFormData({
      name: user.name,
      role: user.role,
      status: user.status,
    });
    setEditOpen(true);
  };

  // =========================
  // 👉 DELETE (BLOCK ADMIN)
  // =========================
  const handleDelete = (user: any) => {
    if (user.role === "admin") {
      toast.error("Admin cannot be deleted 🚫");
      return;
    }

    setSelectedUser(user);
    setDeleteOpen(true);
  };

  // =========================
  // 👉 UPDATE
  // =========================
  const handleUpdate = async () => {
    if (!selectedUser?._id) {
      toast.error("No user selected");
      return;
    }

    if (selectedUser.role === "admin") {
      toast.error("Admin cannot be modified 🚫");
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
      toast.error("Failed to update user ❌");
    }
  };

  // =========================
  // 👉 DELETE CONFIRM
  // =========================
  const handleConfirmDelete = async () => {
    if (!selectedUser?._id) {
      toast.error("No user selected");
      return;
    }

    if (selectedUser.role === "admin") {
      toast.error("Admin cannot be deleted 🚫");
      return;
    }

    try {
      await deleteUser(selectedUser._id).unwrap();

      toast.success("User deleted successfully 🗑️");
      setDeleteOpen(false);
    } catch (error) {
      toast.error("Failed to delete user ❌");
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
