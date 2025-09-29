import type { Capabilities } from "@/types/roles";
export function gateCosts<T>(caps: Capabilities, value: T | null): T | null {
  return caps.canViewCosts ? value : null;
}
