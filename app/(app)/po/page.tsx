"use client";
import * as React from "react";

type Row = {
  id: string; po_number: string; status: string;
  ordered_at: string | null; expected_date: string | null; created_at: string;
};

export default function POListPage() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const res = await fetch("/api/po", { cache: "no-store" });
      const j = await res.json();
      setRows(j.rows ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Purchase Orders</div>
        <a href="/po/new" className="px-3 py-2 border rounded-md">New PO</a>
      </div>

      {loading ? <div>Loading…</div> : (
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-3 py-2 text-left">PO #</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Ordered</th>
                <th className="px-3 py-2 text-left">Expected</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t hover:bg-muted/10">
                  <td className="px-3 py-2"><a className="underline" href={`/po/${r.id}`}>{r.po_number}</a></td>
                  <td className="px-3 py-2">{r.status}</td>
                  <td className="px-3 py-2">{r.ordered_at ?? "—"}</td>
                  <td className="px-3 py-2">{r.expected_date ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
