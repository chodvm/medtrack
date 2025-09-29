import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("items")
    .select("id, sku, name, category, reorder_level, bin_location, created_at");

  if (error) {
    console.error("GET /api/items error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map to the shape your table expects in the UI
  const rows = (data ?? []).map((r) => ({
    id: r.id,
    sku: r.sku,
    name: r.name,
    category: r.category,
    onHand: 0,                 // until you add inventory lots logic
    reorderLevel: r.reorder_level,
    lastRestock: null,
    expirySoon: null,
    vendorsCount: 0,
    cheapestVendor: null,
  }));

  return NextResponse.json({ rows });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, sku, category, unit, reorderLevel, binLocation, notes } = body;

  if (!name || !sku || !category || !unit) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from("items").insert({
    name,
    sku,
    category,
    unit,
    reorder_level: reorderLevel ?? 0,
    bin_location: binLocation ?? null,
    // notes column isn’t in the starter schema — add it if you want to store notes
  }).select("id").single();

  if (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
