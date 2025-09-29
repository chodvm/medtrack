"use client";
import * as React from "react";

type SpendRow = { category: string | null; spend: number };
type LowRow = { item_name: string; on_hand: number; reorder_level: number };

export default function ReportsPage() {
  const [spend, setSpend] = React.useState<SpendRow[]>([]);
  const [low, setLow] = React.useState<LowRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const a = await fetch("/api/reports/spend", { cache: "no-store" }).then(r => r.json());
      const b = await fetch("/api/reports/low-stock", { cache: "no-store" }).then(r => r.json());
      setSpend(a.rows ?? []);
      setLow(b.rows ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-xl font-semibold">Reports</div>
      {loading ? <div>Loading…</div> : (
        <>
          <section>
            <div className="font-medium mb-2">Spend by Category (MTD)</div>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr><th className="px-3 py-2 text-left">Category</th><th className="px-3 py-2 text-left">Spend</th></tr>
                </thead>
                <tbody>
                  {spend.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{r.category ?? "Uncategorized"}</td>
                      <td className="px-3 py-2">${r.spend.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <div className="font-medium mb-2">Low Stock (at/below reorder)</div>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr><th className="px-3 py-2 text-left">Item</th><th className="px-3 py-2 text-left">On Hand</th><th className="px-3 py-2 text-left">Reorder Level</th></tr>
                </thead>
                <tbody>
                  {low.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{r.item_name}</td>
                      <td className="px-3 py-2">{r.on_hand}</td>
                      <td className="px-3 py-2">{r.reorder_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
