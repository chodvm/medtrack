"use client";
import React from "react";
import type { Role, Capabilities } from "@/types/roles";

export const RBACContext = React.createContext<{ role: Role; caps: Capabilities }>({
  role: "viewer",
  caps: { canViewCosts: false },
});

export function RBACProvider({ role, caps, children }:{ role: Role; caps: Capabilities; children: React.ReactNode }){
  return <RBACContext.Provider value={{ role, caps }}>{children}</RBACContext.Provider>;
}

export function useRBAC(){ return React.useContext(RBACContext); }
