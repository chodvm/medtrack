import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Robust version (works across Supabase versions): 3 queries, merge in JS
export async function GET() {
  const [itemsRes, onhandRes, restocksRes] = await Promise.all([
    supabaseAdmin.from("items").select("id, sku, name, category, reorder_level"),
    supabaseAdmin.from("v_item_on_hand").select("item_id, on_hand"),
    supabaseAdmin.from("v_item_restocks").select("item_id, last_restock, nearest_expiry"),
  ]);

  if (itemsRes.error || onhandRes.error || restocksRes.error) {
    const err = itemsRes.error || onhandRes.error || restocksRes.error;
    console.error("GET /api/items error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  const onhandMap = new Map(onhandRes.data?.map(r => [r.item_id, r.on_hand]) || []);
  const restocksMap = new Map(restocksRes.data?.map(r => [r.item_id, { last: r.last_restock, exp: r.nearest_expiry }]) || []);

  const rows = (itemsRes.data ?? []).map((r: any) => ({
    id: r.id,
    sku: r.sku,
    name: r.name,
    category: r.category,
    onHand: onhandMap.get(r.id) ?? 0,
    reorderLevel: r.reorder_level ?? 0,
    lastRestock: restocksMap.get(r.id)?.last ?? null,
    expirySoon: restocksMap.get(r.id)?.exp ?? null,
    vendorsCount: 0,
    cheapestVendor: null,
  }));

  return NextResponse.json({ rows });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, sku, category, unit, reorderLevel, binLocation } = body;

  if (!name || !sku || !category || !unit) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from("items").insert({
    name, sku, category, unit,
    reorder_level: reorderLevel ?? 0,
    bin_location: binLocation ?? null,
  }).select("id").single();

  if (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}

