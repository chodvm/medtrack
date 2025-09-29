import "./globals.css";
import { Inter } from "next/font/google";
import { RBACProvider } from "@/components/rbac";
import Sidebar from "@/components/nav/sidebar";
import Topbar from "@/components/nav/topbar";

const inter = Inter({ subsets: ["latin"] });

// Optional: basic SEO; expand later if you want
export const metadata = {
  title: "MedTrack",
  description: "Internal inventory manager for urgent care",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Stub role until auth is wired (e.g., Supabase Auth -> fetch role/caps)
  const role = "admin" as const;
  const caps = { canViewCosts: true };

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full bg-white text-black`}>
        <RBACProvider role={role} caps={caps}>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar />
              <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
          </div>
        </RBACProvider>
      </body>
    </html>
  );
}
