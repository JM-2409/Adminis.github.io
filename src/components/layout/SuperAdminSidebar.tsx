"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  BellRing,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const superAdminMenuItems = [
  {
    title: "Panel Principal",
    icon: LayoutDashboard,
    href: "/super-admin",
    badge: "Métricas",
  },
  {
    title: "Conjuntos Residenciales",
    icon: Building2,
    href: "/super-admin/conjuntos",
    badge: null,
  },
  {
    title: "Usuarios Administradores",
    icon: Users,
    href: "/super-admin/administradores",
    badge: null,
  },
  {
    title: "Notificaciones de Sistema",
    icon: BellRing,
    href: "/super-admin/notificaciones",
    badge: "Avisos",
  },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-800 bg-slate-950 text-slate-100 transition-all duration-300 min-h-screen z-20",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base leading-tight tracking-tight text-white flex items-center gap-1.5">
                Adminis <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold uppercase">PRO</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Panel del Dueño / Súper Admin
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
          {!collapsed ? "Control Global" : "•••"}
        </div>
        {superAdminMenuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/super-admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group relative",
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />
              {!collapsed && <span className="truncate">{item.title}</span>}

              {!collapsed && item.badge && (
                <span
                  className={cn(
                    "ml-auto text-xs px-2 py-0.5 rounded-full font-semibold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-indigo-950 text-indigo-300 border border-indigo-800"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 hidden rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white shadow-md group-hover:block z-50 whitespace-nowrap">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}

        {/* Separator and Switcher back to Conjunto Admin */}
        <div className="pt-4 border-t border-slate-800 mt-4">
          {!collapsed && (
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
              Vista Demo
            </div>
          )}
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all text-amber-400 hover:bg-amber-950/30 hover:text-amber-300 border border-amber-500/20"
            )}
          >
            <ArrowLeftRight className="h-5 w-5 shrink-0 text-amber-400" />
            {!collapsed && <span className="truncate font-semibold">Ir a Admin Conjunto</span>}
          </Link>
        </div>
      </nav>

      {/* Owner User profile footer */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 bg-slate-900/80 border border-slate-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 text-white font-bold text-xs shadow">
            SA
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold truncate text-white flex items-center gap-1">
                Propietario / Dueño <Sparkles className="h-3 w-3 text-amber-400 fill-amber-400" />
              </span>
              <span className="text-[11px] text-indigo-400 font-medium truncate">
                Controlador del Sistema
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
