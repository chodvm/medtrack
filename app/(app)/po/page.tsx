"use client";
import { DataTable } from "@/components/ui/data-table";
import { useRBAC } from "@/components/rbac";
type PORow = { id: string; number: string; vendor: string; status: string; ordered: string; expected?: string; lines: number; total?: string | null };
export default function POPage(){
  const { caps } = useRBAC();
  const columns: any[] = [
    { header: "PO #", accessorKey: "number" },
    { header: "Vendor", accessorKey: "vendor" },
    { header: "Status", accessorKey: "status" },
    { header: "Ordered", accessorKey: "ordered" },
    { header: "Expected", accessorKey: "expected" },
    { header: "Lines", accessorKey: "lines" },
    ...(caps.canViewCosts ? [{ header: "Total ($)", accessorKey: "total" }] : []),
  ];
  const data: PORow[] = [ { id: "p1", number: "PO-2025-091", vendor: "MedSupplyCo", status: "placed", ordered: "2025-09-17", expected: "2025-09-24", lines: 5, total: caps.canViewCosts?"$532.10":null } ];
  return <DataTable columns={columns} data={data} />;
}
