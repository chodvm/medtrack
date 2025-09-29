"use client";
import { DataTable } from "@/components/ui/data-table";
import { useRBAC } from "@/components/rbac";
type VendorRow = { id: string; name: string; contact?: string; onTimePct?: number; returnRate?: number; avgUnitPrice?: string | null; activeSkus: number; lastOrder?: string };
export default function VendorsPage(){
  const { caps } = useRBAC();
  const columns: any[] = [
    { header: "Vendor", accessorKey: "name" },
    { header: "On‑time %", accessorKey: "onTimePct" },
    { header: "Return rate", accessorKey: "returnRate" },
    ...(caps.canViewCosts ? [{ header: "Avg Unit Price", accessorKey: "avgUnitPrice" }] : []),
    { header: "Active SKUs", accessorKey: "activeSkus" },
    { header: "Last Order", accessorKey: "lastOrder" },
  ];
  const data: VendorRow[] = [ { id: "v1", name: "MedSupplyCo", onTimePct: 97, returnRate: 0.5, avgUnitPrice: caps.canViewCosts?"$2.14":null, activeSkus: 34, lastOrder: "2025-09-18" } ];
  return <DataTable columns={columns} data={data} />;
}
