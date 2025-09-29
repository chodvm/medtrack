"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
};

export function DataTable<TData, TValue>({ columns, data, pageSize = 20 }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });
  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b bg-muted/40">
                {hg.headers.map(header => (
                  <th key={header.id} className="text-left px-3 py-2 font-medium">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b hover:bg-muted/10">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs opacity-70">Rows: {data.length}</div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 border rounded-md" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</button>
          <span className="text-xs">Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}</span>
          <button className="px-2 py-1 border rounded-md" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
        </div>
      </div>
    </div>
  );
}
