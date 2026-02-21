"use client";
import React from "react";

export function ConfirmDialog({ open, title, onConfirm, onCancel }: { open: boolean; title?: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded shadow p-4 text-gray-900">
        <h3 className="font-semibold mb-2 text-gray-900">{title || "Are you sure?"}</h3>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-3 py-1 border rounded text-gray-700 hover:text-gray-900 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Confirm</button>
        </div>
      </div>
    </div>
  );
}
