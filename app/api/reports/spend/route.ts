import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Spend by category for current month
export async function GET() {
  // join receipts -> items to get category
  const { data, error } = await supabaseAdmin
    .rpc("spend_by_category_mtd"); // try a function if you prefer; otherwise inline below

  if (error) {
    // Inline SQL fallback (remove if you create the RPC)
    const { data: rows, error: err2 } = await supabaseAdmin
      .from("receipts")
      .select("qty, unit_cost, items(category)")
      .gte("received_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()); // month start
    if (err2) return NextResponse.json({ error: err2.message }, { status: 500 });

    const map = new Map<string, number>();
    for (const r of (rows as any[])) {
      const cat = r.items?.category ?? "Uncategorized";
      const add = Number(r.qty) * Number(r.unit_cost);
      map.set(cat, (map.get(cat) ?? 0) + add);
    }
    return NextResponse.json({ rows: Array.from(map, ([category, spend]) => ({ category, spend })) });
  }

  return NextResponse.json({ rows: data ?? [] });
}
