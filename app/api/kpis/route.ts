import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin.from("v_kpis").select("*").single();
  if (error) {
    console.error("GET /api/kpis", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    totalSkus: data.total_skus,
    lowStock: data.low_stock,
    expiringSoon: data.expiring_soon,
    openPOs: data.open_pos,
    inTransit: data.in_transit,
    mtdSpend: Number(data.mtd_spend || 0),
  });
}
