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
  const [loading, setLoading] = React.useState(true);

  // 🔄 Fetch KPI data from Supabase view
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/kpis", { cache: "no-store" });
        if (res.ok) {
          setKpi(await res.json());
        } else {
          console.error("Failed to load KPIs");
        }
      } catch (e) {
        console.error("Error fetching KPIs:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      {/* ✅ KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card title="Total SKUs" value={loading ? "—" : kpi?.totalSkus ?? "—"} />
        <Card title="Low stock" value={loading ? "—" : kpi?.lowStock ?? "—"} />
        <Card title="Expiring soon" value={loading ? "—" : kpi?.expiringSoon ?? "—"} />
        <Card title="Open POs" value={loading ? "—" : kpi?.openPOs ?? 0} />
        <Card title="In-transit packages" value={loading ? "—" : kpi?.inTransit ?? 0} />
        <Card
          title="MTD spend"
          value={loading ? "—" : kpi ? `$${(kpi.mtdSpend).toFixed(2)}` : "—"}
        />
      </div>

      {/* ✅ Quick deduct stays exactly where it is */}
      <QuickDeduct />
    </div>
  );
}
