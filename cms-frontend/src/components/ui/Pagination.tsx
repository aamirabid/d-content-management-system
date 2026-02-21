"use client";
import React from "react";

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center gap-2 text-gray-900">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="px-2 py-1 border rounded text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
        Prev
      </button>
      <span className="text-gray-900">
        Page {page} / {totalPages}
      </span>
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="px-2 py-1 border rounded text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
        Next
      </button>
    </div>
  );
}
