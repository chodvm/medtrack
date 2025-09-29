"use client";
import { gateCosts } from "@/lib/capabilities";
import { useRBAC } from "@/components/rbac";

export function KPICards(){
  const { caps } = useRBAC();
  const spend = gateCosts(caps, "$12,340");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <Card title="Total SKUs" value="128" />
      <Card title="Low stock" value="9" />
      <Card title="Expiring soon" value="3" />
      <Card title="Open POs" value="5" />
      <Card title="In-transit packages" value="4" />
      {spend && <Card title="MTD spend" value={spend} />}
    </div>
  );
}
function Card({ title, value }:{ title:string; value:string }){
  return (
    <div className="rounded-xl border p-4 bg-card">
      <div className="text-xs opacity-70">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
