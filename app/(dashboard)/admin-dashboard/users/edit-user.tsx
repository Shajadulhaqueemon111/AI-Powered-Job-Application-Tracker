/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EditUserDialog({
  open,
  setOpen,
  formData,
  setFormData,
  onSubmit,
}: any) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          <select
            className="w-full border text-black dark:text-white dark:bg-black rounded-md p-2"
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value,
              })
            }
          >
            <option value="user">User</option>
            <option value="hr">HR</option>
            <option value="admin">Admin</option>
          </select>

          <select
            className="w-full border rounded-md p-2"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
          >
            <option className="dark:bg-black" value="active">
              Active
            </option>
            <option className="dark:bg-black bg-white" value="blocked">
              Blocked
            </option>
          </select>

          <Button className="w-full" onClick={onSubmit}>
            Update User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
