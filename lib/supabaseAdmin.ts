import { createClient } from "@supabase/supabase-js";

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SRV  = process.env.SUPABASE_SERVICE_ROLE || ""; // server-only

if (!URL || !SRV) {
  // Optional: warn at build/runtime for missing env
  console.warn("Supabase env missing: URL or SERVICE_ROLE");
}

export const supabaseAdmin = createClient(URL, SRV, {
  auth: { persistSession: false },
});
