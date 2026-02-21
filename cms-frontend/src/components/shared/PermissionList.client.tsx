"use client";
import React, { useState } from "react";
import { usePermissions } from "../../lib/hooks/usePermissions";
import { Table } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Modal } from "../ui/Modal";
import { PermissionForm } from "./PermissionForm";
import { deletePermission } from "../../lib/api/permission.api";

export function PermissionList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, loading } = usePermissions(page, 10, search);
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({ open: false });
  const [editModal, setEditModal] = useState<{ open: boolean; permission?: any }>({ open: false });

  const onDelete = async (id: string) => {
    try {
      await deletePermission(id);
      window.location.reload();
    } catch (err) {
      alert("Failed to delete permission");
    }
  };

  if (loading) return <div className="p-4 text-gray-600">Loading permissions...</div>;

  const columns = [
    { key: "key", header: "Key" },
    { key: "description", header: "Description" },
    { 
      key: "actions", 
      header: "Actions", 
      render: (p: any) => (
        <div className="flex gap-2">
          <Button onClick={() => setEditModal({ open: true, permission: p })} size="sm">Edit</Button>
          <Button variant="danger" onClick={() => setConfirm({ open: true, id: p.id })} size="sm">Delete</Button>
        </div>
      )
    }
  ];

  const items = Array.isArray(data) ? data : data?.items || [];
  const meta = data?.meta || { page: 1, totalPages: 1 };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search permissions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setEditModal({ open: true })}>Create Permission</Button>
      </div>
      
      <Table columns={columns as any} data={items} />
      
      <div className="mt-4 flex justify-between items-center">
        <Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onChange={(p) => setPage(p)} />
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Delete permission"
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => { if (confirm.id) onDelete(confirm.id); }}
      />
      
      <Modal open={editModal.open} title={editModal.permission ? "Edit Permission" : "Create Permission"} onClose={() => setEditModal({ open: false })}>
        <PermissionForm
          initialValues={editModal.permission ? { id: editModal.permission.id, key: editModal.permission.key, description: editModal.permission.description } : {}}
          onSaved={() => {
            setEditModal({ open: false });
            window.location.reload();
          }}
        />
      </Modal>
    </div>
  );
}
