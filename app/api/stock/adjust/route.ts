import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { itemId, itemName, qtyDelta, reason, note } = await req.json();

  let targetItemId = itemId;
  if (!targetItemId && itemName) {
    const { data: found, error: findErr } = await supabaseAdmin
      .from("items")
      .select("id")
      .ilike("name", itemName)
      .limit(1)
      .single();

    if (findErr || !found) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    targetItemId = found.id;
  }

  if (!targetItemId || !qtyDelta || !reason) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("stock_adjustments").insert({
    item_id: targetItemId,
    qty_delta: qtyDelta,
    reason,
    notes: note ?? null,
  });

  if (error) {
    console.error("POST /api/stock/adjust error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

