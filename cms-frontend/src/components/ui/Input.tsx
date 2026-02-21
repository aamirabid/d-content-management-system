"use client";
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
};

export function Input({ label, error, className, ...rest }: Props) {
  return (
    <label className="flex flex-col gap-2">
      {label ? <span className="text-sm font-medium text-gray-700">{label}</span> : null}
      <input 
        className={`w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${className || ""} ${error ? "border-red-500 focus:ring-red-500" : ""}`}
        {...rest}
      />
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
