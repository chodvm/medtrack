"use client";
import * as React from "react";

type Line = { itemId: string; qty: number; targetUnitPrice: number };

export default function PONewPage() {
  const [poNumber, setPoNumber] = React.useState("");
  const [expectedDate, setExpectedDate] = React.useState<string>("");
  const [lines, setLines] = React.useState<Line[]>([{ itemId: "", qty: 1, targetUnitPrice: 0 }]);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  function updateLine(i: number, patch: Partial<Line>) {
    setLines(prev => prev.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  }

  function addLine() {
    setLines(prev => [...prev, { itemId: "", qty: 1, targetUnitPrice: 0 }]);
  }

  async function submit() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/po", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poNumber, expectedDate: expectedDate || null, lines }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed to create PO");
      window.location.href = "/po";
    } catch (e: any) {
      setMsg(e.message || "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="text-xl font-semibold">New Purchase Order</div>

      <div className="grid gap-3">
        <label className="text-sm">PO Number</label>
        <input className="border rounded-md h-9 px-3" value={poNumber} onChange={e => setPoNumber(e.target.value)} />

        <label className="text-sm">Expected Date</label>
        <input type="date" className="border rounded-md h-9 px-3" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} />
      </div>

      <div className="space-y-2">
        <div className="font-medium">Lines</div>
        {lines.map((l, i) => (
          <div key={i} className="grid md:grid-cols-[2fr,1fr,1fr] gap-2 items-center">
            <input className="border rounded-md h-9 px-3" placeholder="Item ID (paste uuid)" value={l.itemId} onChange={e => updateLine(i, { itemId: e.target.value })} />
            <input type="number" min={1} className="border rounded-md h-9 px-3" value={l.qty} onChange={e => updateLine(i, { qty: parseInt(e.target.value || "1", 10) })} />
            <input type="number" min={0} step="0.01" className="border rounded-md h-9 px-3" value={l.targetUnitPrice} onChange={e => updateLine(i, { targetUnitPrice: parseFloat(e.target.value || "0") })} />
          </div>
        ))}
        <button onClick={addLine} className="px-3 py-2 border rounded-md">Add line</button>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={submit} disabled={saving || !poNumber || lines.some(l => !l.itemId || l.qty <= 0)} className="h-9 px-4 rounded-md bg-black text-white disabled:opacity-50">
          {saving ? "Saving..." : "Create PO"}
        </button>
        {msg && <div className="text-sm text-red-600">{msg}</div>}
      </div>
    </div>
  );
}
