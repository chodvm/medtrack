"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/items", label: "Items" },
  { href: "/vendors", label: "Vendors" },
  { href: "/po", label: "Purchase Orders" },
  { href: "/packages", label: "Packages" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];
export default function Sidebar(){
  const pathname = usePathname();
  return (
    <aside className="w-60 border-r bg-card/30">
      <div className="p-4 font-semibold">MedTrack</div>
      <nav className="flex flex-col gap-1 p-2">
        {links.map(l => (
          <Link key={l.href} href={l.href} className={`px-3 py-2 rounded-md hover:bg-accent ${pathname.startsWith(l.href)?"bg-accent text-accent-foreground":""}`}>{l.label}</Link>
        ))}
      </nav>
    </aside>
  );
}
