"use client";
import React, { useState } from "react";
import { useNews } from "../../lib/hooks/useNews";
import { Table } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Modal } from "../ui/Modal";
import { NewsForm } from "./NewsForm";
import { deleteNews } from "../../lib/api/news";

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

export function NewsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, loading } = useNews(page, 10, search);
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({ open: false });
  const [editModal, setEditModal] = useState<{ open: boolean; newsItem?: any }>({ open: false });

  const onDelete = async (id: string) => {
    try {
      await deleteNews(id);
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete news:", err);
      alert(`Failed to delete news: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) return <div className="p-4 text-gray-600">Loading news...</div>;

  const columns = [
    { 
      key: "title", 
      header: "Title",
      render: (n: any) => n.translations?.[0]?.title || "Untitled"
    },
    { 
      key: "status", 
      header: "Status",
      render: (n: any) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${n.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {n.status || 'draft'}
        </span>
      )
    },
    { 
      key: "expiresAt", 
      header: "Expires At",
      render: (n: any) => n.expiresAt ? new Date(n.expiresAt).toLocaleDateString() : "Never"
    },
    { 
      key: "actions", 
      header: "Actions", 
      render: (n: any) => (
        <div className="flex gap-2">
          <Button onClick={() => setEditModal({ open: true, newsItem: n })} size="sm">Edit</Button>
          <Button variant="danger" onClick={() => setConfirm({ open: true, id: n.id })} size="sm">Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setEditModal({ open: true })}>Create News</Button>
      </div>
      
      <Table columns={columns as any} data={data.items || []} />
      
      <div className="mt-4 flex justify-between items-center">
        <Pagination page={data.meta?.page || 1} totalPages={data.meta?.totalPages || 1} onChange={(p) => setPage(p)} />
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Delete news"
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => { if (confirm.id) onDelete(confirm.id); }}
      />
      
      <Modal open={editModal.open} title={editModal.newsItem ? "Edit News" : "Create News"} onClose={() => setEditModal({ open: false })}>
        <NewsForm
          initialValues={editModal.newsItem ? { 
            id: editModal.newsItem.id, 
            slug: editModal.newsItem.slug, 
            status: editModal.newsItem.status, 
            publishedAt: convertToDatetimeLocal(editModal.newsItem.publishedAt),
            expiresAt: convertToDatetimeLocal(editModal.newsItem.expiresAt),
            translations: editModal.newsItem.translations
          } : {}}
          onSaved={() => {
            setEditModal({ open: false });
            window.location.reload();
          }}
        />
      </Modal>
    </div>
  );
}
