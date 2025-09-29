import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { env } from "@/env.mjs";

export function supabaseBrowser(){
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function supabaseServer(){
  const cookieStore = cookies();
  const hdrs = headers();
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get: (name:string)=>cookieStore.get(name)?.value }, headers: () => hdrs }
  );
}
