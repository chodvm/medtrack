import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const [itemsRes, onhandRes, restocksRes] = await Promise.all([
    supabaseAdmin.from("items").select("id, sku, name, category, reorder_level"),
    supabaseAdmin.from("v_item_on_hand").select("item_id, on_hand"),
    supabaseAdmin.from("v_item_restocks").select("item_id, last_restock, nearest_expiry"),
  ]);

  if (itemsRes.error || onhandRes.error || restocksRes.error) {
    const e =
      itemsRes.error ?? onhandRes.error ?? restocksRes.error;
    const msg = e?.message ?? "Unknown error";
    console.error("GET /api/items error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const onhandMap = new Map<string, number>(
    (onhandRes.data ?? []).map((r: any) => [r.item_id as string, r.on_hand as number])
  );
  const restocksMap = new Map<string, { last: string | null; exp: string | null }>(
    (restocksRes.data ?? []).map((r: any) => [
      r.item_id as string,
      { last: r.last_restock ?? null, exp: r.nearest_expiry ?? null },
    ])
  );

  const rows = (itemsRes.data ?? []).map((r: any) => ({
    id: r.id as string,
    sku: r.sku as string,
    name: r.name as string,
    category: r.category as string,
    onHand: onhandMap.get(r.id) ?? 0,
    reorderLevel: (r.reorder_level ?? 0) as number,
    lastRestock: restocksMap.get(r.id)?.last ?? null,
    expirySoon: restocksMap.get(r.id)?.exp ?? null,
    vendorsCount: 0,
    cheapestVendor: null as string | null,
  }));

  return NextResponse.json({ rows });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, sku, category, unit, reorderLevel, binLocation } = body;

  if (!name || !sku || !category || !unit) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("items")
    .insert({
      name,
      sku,
      category,
      unit,
      reorder_level: reorderLevel ?? 0,
      bin_location: binLocation ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json({ error: error.message ?? "Insert failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}

