import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { itemId, qty, unitCost, expiryDate, vendorId } = await req.json();

  if (!itemId || !qty || qty <= 0 || unitCost == null || unitCost < 0) {
    return NextResponse.json({ error: "Invalid receipt payload" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("receipts").insert({
    item_id: itemId,
    qty,
    unit_cost: unitCost,
    expiry_date: expiryDate ?? null,
    vendor_id: vendorId ?? null,
  });

  if (error) {
    console.error("POST /api/receipts error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
