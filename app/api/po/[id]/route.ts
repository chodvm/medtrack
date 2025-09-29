import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type ReceivePayload = {
  lines: Array<{ lineId: string; qty: number; unitCost: number; expiryDate?: string | null }>;
};

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const { data: po, error: e1 } = await supabaseAdmin
    .from("purchase_orders")
    .select("id, po_number, status, vendor_id, ordered_at, expected_date, notes, created_at")
    .eq("id", id)
    .single();
  if (e1) return NextResponse.json({ error: e1.message }, { status: 404 });

  const { data: lines, error: e2 } = await supabaseAdmin
    .from("purchase_order_lines")
    .select("id, item_id, qty_ordered, qty_received, target_unit_price")
    .eq("po_id", id);
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  return NextResponse.json({ po, lines });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await req.json();

  if (body.status) {
    const { error } = await supabaseAdmin
      .from("purchase_orders")
      .update({ status: body.status, ordered_at: body.status === "placed" ? new Date().toISOString() : null })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.receive) {
    const payload = body.receive as ReceivePayload;
    for (const l of payload.lines) {
      // 1) Lookup the line
      const { data: line, error: le } = await supabaseAdmin
        .from("purchase_order_lines")
        .select("id, item_id, qty_ordered, qty_received, target_unit_price")
        .eq("id", l.lineId)
        .single();
      if (le || !line) return NextResponse.json({ error: le?.message || "Line not found" }, { status: 404 });

      const newReceived = Number(line.qty_received) + Number(l.qty);

      // 2) Insert a receipt row (so on-hand updates via your views)
      const { error: re } = await supabaseAdmin.from("receipts").insert({
        item_id: line.item_id,
        qty: l.qty,
        unit_cost: l.unitCost,
        expiry_date: l.expiryDate ?? null,
        vendor_id: null,
      });
      if (re) return NextResponse.json({ error: re.message }, { status: 500 });

      // 3) Update line qty_received
      const { error: ue } = await supabaseAdmin
        .from("purchase_order_lines")
        .update({ qty_received: newReceived })
        .eq("id", l.lineId);
      if (ue) return NextResponse.json({ error: ue.message }, { status: 500 });
    }
  }

  // (Optional) auto-close if all received
  // You can add logic here to check sums and flip status to 'closed'

  return NextResponse.json({ ok: true });
}
