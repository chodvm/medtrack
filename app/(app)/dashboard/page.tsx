"use client";
import * as React from "react";
import QuickDeduct from "@/components/quick-deduct";

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl border p-4 bg-card">
      <div className="text-xs opacity-70">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [kpi, setKpi] = React.useState<any>(null);

  React.useEffect(() => {
    (async () => {
      const res = await fetch("/api/kpis", { cache: "no-store" });
      if (res.ok) setKpi(await res.json());
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card title="Total SKUs" value={kpi?.totalSkus ?? "—"} />
        <Card title="Low stock" value={kpi?.lowStock ?? "—"} />
        <Card title="Expiring soon" value={kpi?.expiringSoon ?? "—"} />
        <Card title="Open POs" value={kpi?.openPOs ?? 0} />
        <Card title="In-transit packages" value={kpi?.inTransit ?? 0} />
        <Card title="MTD spend" value={kpi ? `$${(kpi.mtdSpend).toFixed(2)}` : "—"} />
      </div>
      <QuickDeduct />
    </div>
  );
}
