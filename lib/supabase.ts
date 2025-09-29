import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function supabaseBrowser() {
  return createBrowserClient(URL, ANON);
}

export function supabaseServer() {
  const cookieStore = cookies();
  const hdrs = headers();
  return createServerClient(URL, ANON, {
    cookies: { get: (name: string) => cookieStore.get(name)?.value },
    headers: () => hdrs,
  });
}
