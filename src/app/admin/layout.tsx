"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 bg-primary text-background p-2 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Backdrop */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          w-64 bg-surface border-r border-border fixed md:static h-full z-40 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6">
            <Link href="/admin" className="block mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-background font-bold text-xl">
                  G
                </div>
                <div>
                  <div className="text-primary font-bold text-lg">
                    {brandConfig.businessName}
                  </div>
                  <div className="text-text-muted text-xs">Admin Panel</div>
                </div>
              </div>
            </Link>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
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
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-primary transition"
              >
                <span>←</span>
                <span>Back to Site</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pt-16 md:pt-0">{children}</main>
      </div>
    </AdminGuard>
  );
}
