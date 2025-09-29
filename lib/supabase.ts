import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function supabaseBrowser() {
  return createBrowserClient(URL, ANON);
}

export function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // Next.js server components can’t set cookies here, so stub these:
      set() { /* no-op for now */ },
      remove() { /* no-op for now */ },
    },
  });
}
