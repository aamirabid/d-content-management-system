"use client";
import React, { useState } from "react";
import { useRoles } from "../../lib/hooks/useRoles";
import { Table } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Modal } from "../ui/Modal";
import { RoleForm } from "./RoleForm";
import { deleteRole } from "../../lib/api/role.api";

export function RoleList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, loading } = useRoles(page, 10, search);
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({ open: false });
  const [editModal, setEditModal] = useState<{ open: boolean; role?: any }>({ open: false });

  const onDelete = async (id: string) => {
    try {
      await deleteRole(id);
      window.location.reload();
    } catch (err) {
      alert("Failed to delete role");
    }
  };

  if (loading) return <div className="p-4 text-gray-600">Loading roles...</div>;

  const columns = [
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
    { 
      key: "permissions", 
      header: "Permissions", 
      render: (r: any) => (
        <span className="text-sm">
          {(r.permissions?.length || 0)} permissions
        </span>
      ) 
    },
    { 
      key: "actions", 
      header: "Actions", 
      render: (r: any) => (
        <div className="flex gap-2">
          <Button onClick={() => setEditModal({ open: true, role: r })} size="sm">Edit</Button>
          <Button variant="danger" onClick={() => setConfirm({ open: true, id: r.id })} size="sm">Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search roles..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setEditModal({ open: true })}>Create Role</Button>
      </div>
      
      <Table columns={columns as any} data={data.items || []} />
      
      <div className="mt-4 flex justify-between items-center">
        <Pagination page={data.meta?.page || 1} totalPages={data.meta?.totalPages || 1} onChange={(p) => setPage(p)} />
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Delete role"
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => { if (confirm.id) onDelete(confirm.id); }}
      />
      
      <Modal open={editModal.open} title={editModal.role ? "Edit Role" : "Create Role"} onClose={() => setEditModal({ open: false })}>
        <RoleForm
          initialValues={editModal.role ? { id: editModal.role.id, name: editModal.role.name, description: editModal.role.description, permissions: (editModal.role.permissions || []).map((p: any) => p.permission?.id || p.permissionId) } : {}}
          onSaved={() => {
            setEditModal({ open: false });
            window.location.reload();
          }}
        />
      </Modal>
    </div>
  );
}
