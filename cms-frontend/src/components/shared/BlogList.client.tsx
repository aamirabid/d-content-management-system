"use client";
import React, { useState } from "react";
import { useBlogs } from "../../lib/hooks/useBlogs";
import { Table } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import { PermissionGate } from "./PermissionGate";
import { Modal } from "../ui/Modal";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { BlogForm } from "./BlogForm";
import { setBlogPublished, deleteBlog } from "../../lib/api/blog";

const convertToDatetimeLocal = (isoString: string | null | undefined) => {
  if (!isoString) return undefined;
  try {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  } catch (e) {
    return isoString;
  }
};

export function BlogList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, loading, error } = useBlogs({ page, limit: 10, search });
  const [modal, setModal] = useState<{ open: boolean; blog?: any }>({ open: false });
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({ open: false });

  if (loading) return <div className="p-4 text-gray-600">Loading blogs...</div>;
  if (error) return <div className="p-4 text-red-600">Error loading blogs</div>;

  const onPublishToggle = async (b: any) => {
    try {
      await setBlogPublished(b.id, !b.published);
      window.location.reload();
    } catch (err) {
      alert("Failed to update publish status");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteBlog(id);
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert(`Failed to delete blog: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const columns = [
    { 
      key: "title", 
      header: "Title",
      render: (b: any) => b.translations?.[0]?.title || "Untitled"
    },
    { 
      key: "status", 
      header: "Status",
      render: (b: any) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${b.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {b.status || 'draft'}
        </span>
      )
    },
    { 
      key: "publishedAt", 
      header: "Published At",
      render: (b: any) => b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : "Not published"
    },
    { 
      key: "actions", 
      header: "Actions", 
      render: (b: any) => (
        <div className="flex gap-2">
          <PermissionGate permission="blog.update" hide={false}>
            <Button onClick={() => setModal({ open: true, blog: b })} size="sm">Edit</Button>
          </PermissionGate>
          <PermissionGate permission="blog.delete">
            <Button variant="danger" onClick={() => setConfirm({ open: true, id: b.id })} size="sm">Delete</Button>
          </PermissionGate>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <PermissionGate permission="blog.create">
          <Button onClick={() => setModal({ open: true })}>Create</Button>
        </PermissionGate>
      </div>
      
      <Table columns={columns as any} data={data.items || []} />
      
      <div className="mt-4 flex justify-between items-center">
        <Pagination page={data.meta?.page || 1} totalPages={data.meta?.totalPages || 1} onChange={(p) => setPage(p)} />
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Delete blog"
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => { if (confirm.id) onDelete(confirm.id); }}
      />

      <Modal open={modal.open} title={modal.blog ? "Edit Blog" : "Create Blog"} onClose={() => setModal({ open: false })}>
        <BlogForm
          initialValues={modal.blog ? { 
            id: modal.blog.id, 
            slug: modal.blog.slug, 
            status: modal.blog.status, 
            publishedAt: convertToDatetimeLocal(modal.blog.publishedAt),
            expiresAt: convertToDatetimeLocal(modal.blog.expiresAt),
            translations: modal.blog.translations || [] 
          } : undefined}
          onSaved={() => {
            setModal({ open: false });
            window.location.reload();
          }}
        />
      </Modal>
    </div>
  );
}
