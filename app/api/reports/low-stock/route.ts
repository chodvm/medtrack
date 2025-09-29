import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  // Use your v_item_on_hand + items.reorder_level
  const { data: items, error: e1 } = await supabaseAdmin
    .from("items")
    .select("id, name, reorder_level");
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });

  const { data: onhand, error: e2 } = await supabaseAdmin
    .from("v_item_on_hand")
    .select("item_id, on_hand");
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  const oh = new Map<string, number>((onhand ?? []).map((r: any) => [r.item_id, r.on_hand]));
  const rows = (items ?? [])
    .map((i: any) => ({ item_name: i.name as string, reorder_level: i.reorder_level as number, on_hand: oh.get(i.id) ?? 0 }))
    .filter((r) => r.on_hand <= r.reorder_level)
    .sort((a, b) => a.on_hand - b.on_hand);

  return NextResponse.json({ rows });
}
