"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useRBAC } from "@/components/rbac";

export type ItemRow = {
  id: string;
  sku: string;
  name: string;
  category: string;
  onHand: number;
  reorderLevel: number;
  lastRestock?: string | null;
  expirySoon?: string | null;
  vendorsCount: number;
  cheapestVendor?: string | null;
};

export function useItemColumns(): ColumnDef<ItemRow, any>[] {
  const { caps } = useRBAC();
  return [
    {
      header: "Item",
      accessorKey: "name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-xs opacity-70">SKU: {row.original.sku} · {row.original.category}</div>
        </div>
      ),
    },
    { header: "On hand", accessorKey: "onHand" },
    { header: "Reorder", accessorKey: "reorderLevel" },
    { header: "Last restock", accessorKey: "lastRestock" },
    { header: "Expiry", accessorKey: "expirySoon" },
    {
      header: "Vendors",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.vendorsCount}
          {caps.canViewCosts && row.original.cheapestVendor ? (
            <span className="ml-2 inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-white">cheapest: {row.original.cheapestVendor}</span>
          ) : null}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <a href={`/items/${row.original.id}`} className="px-2 py-1 border rounded-md">View</a>
          <button data-itemid={row.original.id} className="px-2 py-1 border rounded-md" onClick={() => dispatchAdjust(row.original.id)}>
            Adjust
          </button>
        </div>
      ),
    },
  ];
}

function dispatchAdjust(itemId: string){
  const ev = new CustomEvent("open-adjust", { detail: { itemId }});
  window.dispatchEvent(ev);
}
