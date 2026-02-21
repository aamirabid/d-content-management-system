"use client";
import React from "react";

export function Modal({ open, title, onClose, children }: { open: boolean; title?: string; onClose?: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-auto">
      <div className="bg-white rounded shadow max-w-4xl w-full p-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white/80 py-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 font-medium">Close</button>
        </div>
        <div className="text-gray-900">{children}</div>
      </div>
    </div>
  );
}
