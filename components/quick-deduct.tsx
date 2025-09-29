"use client";
import * as React from "react";
import { useState } from "react";

export default function QuickDeduct(){
  const [item, setItem] = useState("");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(){
    if(!item) return;
    setLoading(true);
    try{
      const res = await fetch("/api/stock/adjust",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ itemName:item, qtyDelta: -Math.abs(qty), reason:"consume", note })
      });
      if(!res.ok) throw new Error("Failed");
      setItem(""); setQty(1); setNote("");
    } finally { setLoading(false); }
  }

  return (
    <div className="rounded-xl border p-4 bg-card">
      <div className="font-semibold mb-2">Quick Deduct</div>
      <div className="flex flex-col md:flex-row gap-2">
        <input className="border rounded-md px-3 h-9 flex-1" placeholder="Search item (e.g., laceration repair pack)" value={item} onChange={e=>setItem(e.target.value)} />
        <input className="border rounded-md px-3 h-9 w-24" type="number" min={1} value={qty} onChange={e=>setQty(parseInt(e.target.value||"1"))} />
        <input className="border rounded-md px-3 h-9 flex-1" placeholder="Optional note" value={note} onChange={e=>setNote(e.target.value)} />
        <button onClick={submit} disabled={loading || !item} className="h-9 px-4 rounded-md bg-primary text-primary-foreground disabled:opacity-50">{loading?"Saving...":"Deduct"}</button>
      </div>
      <div className="text-xs mt-2 opacity-70">Tip: press <kbd>/</kbd> to focus, <kbd>Enter</kbd> to save. Barcode input optional (future).</div>
    </div>
  );
}
