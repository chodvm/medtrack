import type { Role, Capabilities } from "@/types/roles";
export async function getUserRoleAndCaps(): Promise<{ role: Role; caps: Capabilities }>{ 
  // TODO: replace with DB lookup of users table
  return { role: "admin", caps: { canViewCosts: true } };
}
