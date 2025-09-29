"use client";
import * as React from "react";
import { DataTable } from "@/components/ui/data-table";
import { useItemColumns, type ItemRow } from "./columns";

export default function ItemsPage(){
  const columns = useItemColumns();
  const [rows, setRows] = React.useState<ItemRow[]>([]);
  const [adjustItemId, setAdjustItemId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setRows([
      { id: "1", sku: "LAC-PACK-01", name: "Laceration Repair Pack", category: "Procedural", onHand: 18, reorderLevel: 10, lastRestock: "2025-09-20", expirySoon: null, vendorsCount: 3, cheapestVendor: "MedSupplyCo" },
      { id: "2", sku: "SPLINT-STD", name: "Ready Splint", category: "Ortho", onHand: 9, reorderLevel: 12, lastRestock: "2025-09-14", expirySoon: null, vendorsCount: 2, cheapestVendor: "OrthoPro" },
    ]);
  }, []);

  React.useEffect(() => {
    function onOpen(e: any){ setAdjustItemId(e.detail.itemId); }
    window.addEventListener("open-adjust", onOpen as any);
    return () => window.removeEventListener("open-adjust", onOpen as any);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Items</div>
        <div className="flex gap-2">
          <a href="/items/new" className="px-3 py-2 rounded-md bg-primary text-primary-foreground">New Item</a>
          <button className="px-3 py-2 rounded-md border">Import CSV</button>
        </div>
      </div>
      <DataTable columns={columns} data={rows} />
      <AdjustDrawer itemId={adjustItemId} onClose={() => setAdjustItemId(null)} />
    </div>
  );
}

function AdjustDrawer({ itemId, onClose }:{ itemId: string | null; onClose: ()=>void }){
  const [qty, setQty] = React.useState(1);
  const [reason, setReason] = React.useState("consume");
  const [note, setNote] = React.useState("");
  const open = !!itemId;

  async function submit(){
    if(!itemId) return;
    await fetch("/api/stock/adjust", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId, qtyDelta: reason === "receive" ? qty : -Math.abs(qty), reason, note }) });
    onClose();
  }

  if(!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex">
      <div className="ml-auto h-full w-full max-w-md bg-white border-l p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Adjust Stock</div>
          <button onClick={onClose} className="border rounded-md px-2 py-1">Close</button>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Quantity</label>
          <input type="number" min={1} value={qty} onChange={(e)=>setQty(parseInt(e.target.value||"1"))} className="border rounded-md h-9 px-3" />
          <label className="text-sm">Reason</label>
          <select value={reason} onChange={(e)=>setReason(e.target.value)} className="border rounded-md h-9 px-3">
            <option value="consume">Consume</option>
            <option value="receive">Receive</option>
            <option value="waste">Waste</option>
            <option value="correction">Correction</option>
            <option value="transfer">Transfer</option>
          </select>
          <label className="text-sm">Note</label>
          <textarea value={note} onChange={(e)=>setNote(e.target.value)} className="border rounded-md px-3 py-2" rows={3} />
          <button onClick={submit} className="mt-2 h-9 px-4 rounded-md bg-black text-white">Save</button>
        </div>
      </div>
    </div>
  );
}
