import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("purchase_orders")
    .select("id, po_number, status, vendor_id, ordered_at, expected_date, notes, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rows: data ?? [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { poNumber, vendorId, expectedDate, notes, lines } = body as {
    poNumber: string;
    vendorId?: string | null;
    expectedDate?: string | null; // yyyy-mm-dd
    notes?: string | null;
    lines: Array<{ itemId: string; qty: number; targetUnitPrice: number }>;
  };

  if (!poNumber || !Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Missing poNumber or lines" }, { status: 400 });
  }

  const { data: po, error: e1 } = await supabaseAdmin
    .from("purchase_orders")
    .insert({
      po_number: poNumber,
      vendor_id: vendorId ?? null,
      expected_date: expectedDate ?? null,
      status: "draft",
      notes: notes ?? null,
    })
    .select("id")
    .single();
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });

  const linesPayload = lines.map(l => ({
    po_id: po!.id,
    item_id: l.itemId,
    qty_ordered: l.qty,
    target_unit_price: l.targetUnitPrice,
  }));
  const { error: e2 } = await supabaseAdmin.from("purchase_order_lines").insert(linesPayload);
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: po!.id });
}
