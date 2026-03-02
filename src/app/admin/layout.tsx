"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import { brandConfig } from "@/config/brand";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/breaks", label: "Breaks", icon: "🎬" },
  { href: "/admin/checklists", label: "Checklists", icon: "📋" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/notifications", label: "Notifications", icon: "🔔" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-border">
          <div className="p-6">
            <div className="text-primary font-bold text-xl mb-8">
              {brandConfig.businessName}
              <span className="block text-text-muted text-sm font-normal mt-1">Admin Panel</span>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-primary-light text-primary"
                        : "text-text-secondary hover:bg-surface-hover hover:text-primary"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-primary transition"
              >
                <span>←</span>
                <span>Back to Site</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </AdminGuard>
  );
}
