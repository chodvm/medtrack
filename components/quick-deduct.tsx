"use client";

import * as React from "react";

export default function QuickDeduct() {
  const [item, setItem] = React.useState("");
  const [qty, setQty] = React.useState(1);
  const [note, setNote] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  async function submit() {
    if (!item) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/stock/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName: item,          // or pass itemId instead if you have it
          qtyDelta: -Math.abs(qty),// negative to deduct
          reason: "consume",       // enum: consume/receive/waste/correction/transfer
          note,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to save");
      }
      setItem("");
      setQty(1);
      setNote("");
      setMsg("Saved ✓");
    } catch (e: any) {
      setMsg(e.message || "Error");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 2000);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") submit();
  }

  return (
    <div className="rounded-xl border p-4 bg-card">
      <div className="font-semibold mb-2">Quick Deduct</div>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          className="border rounded-md px-3 h-9 flex-1"
          placeholder="Search item (e.g., laceration repair pack)"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <input
          className="border rounded-md px-3 h-9 w-24"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value || "1", 10))}
          onKeyDown={onKeyDown}
        />
        <input
          className="border rounded-md px-3 h-9 flex-1"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          onClick={submit}
          disabled={loading || !item}
          className="h-9 px-4 rounded-md bg-black text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Deduct"}
        </button>
      </div>
      <div className="text-xs mt-2 opacity-70">
        Tip: press <kbd>Enter</kbd> to save.
        {msg ? <span className="ml-2">{msg}</span> : null}
      </div>
    </div>
  );
}
