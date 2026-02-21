"use client";
import React, { useState } from "react";
import { useUsers } from "../../lib/hooks/useUsers";
import { usePermission } from "../../context/PermissionContext";
import { Table } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Modal } from "../ui/Modal";
import { UserForm } from "./UserForm";
import { updateUserStatus } from "../../lib/api/user.api";

export function UserList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, loading } = useUsers(page, 10, search);
  const { can } = usePermission();
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({ open: false });
  const [editModal, setEditModal] = useState<{ open: boolean; user?: any }>({ open: false });

  const onToggle = async (id: string, enabled: boolean) => {
    try {
      await updateUserStatus(id, !enabled);
      window.location.reload();
    } catch (err) {
      alert("Failed to update user");
    }
  };

  if (loading) return <div className="p-4 text-gray-600">Loading users...</div>;
  if (!can("user.manage")) return <div className="p-4 text-red-600">You don't have permission to manage users</div>;

  const columns = [
    { key: "email", header: "Email" },
    { key: "firstName", header: "First Name" },
    { key: "lastName", header: "Last Name" },
    { 
      key: "isActive", 
      header: "Status",
      render: (u: any) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {u.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      key: "actions", 
      header: "Actions", 
      render: (u: any) => (
        <div className="flex gap-2">
          {can("user.update") && <Button onClick={() => setEditModal({ open: true, user: u })} size="sm">Edit</Button>}
          {can("user.update") && <Button variant="ghost" onClick={() => setConfirm({ open: true, id: u.id })} size="sm">
            {u.isActive ? "Disable" : "Enable"}
          </Button>}
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        {can("user.create") && <Button onClick={() => setEditModal({ open: true })}>Create User</Button>}
      </div>
      
      <Table columns={columns as any} data={data.items || []} />
      
      <div className="mt-4 flex justify-between items-center">
        <Pagination page={data.meta?.page || 1} totalPages={data.meta?.totalPages || 1} onChange={(p) => setPage(p)} />
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Toggle user status"
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => {
          if (confirm.id) {
            const u = (data.items || []).find((x: any) => x.id === confirm.id);
            onToggle(confirm.id, !!u?.isActive);
          }
        }}
      />
      
      <Modal open={editModal.open} title={editModal.user ? "Edit User" : "Create User"} onClose={() => setEditModal({ open: false })}>
        <UserForm
          initialValues={
            editModal.user 
              ? { id: editModal.user.id, firstName: editModal.user.firstName, lastName: editModal.user.lastName, email: editModal.user.email, roles: (editModal.user.roles || []).map((r: any) => r.role?.id || r.roleId), isActive: !!editModal.user.isActive }
              : {}
          }
          onSaved={() => {
            setEditModal({ open: false });
            window.location.reload();
          }}
        />
      </Modal>
    </div>
  );
}
