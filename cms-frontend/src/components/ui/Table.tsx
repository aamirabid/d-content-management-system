import React from "react";

type Column<T> = { key: string; header: string; render?: (item: T) => React.ReactNode };

export function Table<T>({ columns, data }: { columns: Column<T>[]; data: T[] }) {
  return (
    <table className="min-w-full bg-white border text-gray-900">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} className="text-left p-2 border-b">
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            {columns.map((c) => (
              <td key={c.key} className="p-2 align-top border-b">
                {c.render ? c.render(row) : row[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
