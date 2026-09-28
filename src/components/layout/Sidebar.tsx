"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  PackageCheck,
  CalendarDays,
  Truck,
  Building2,
  Megaphone,
  AlertTriangle,
  Settings,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const menuItems = [
  {
    title: "Panel Principal",
    icon: LayoutDashboard,
    href: "/admin",
    badge: null,
  },
  {
    title: "Visitantes y Parqueadero",
    icon: Car,
    href: "/admin/visitantes",
    badge: null,
  },
  {
    title: "Paquetería",
    icon: PackageCheck,
    href: "/admin/paqueteria",
    badge: null,
  },
  {
    title: "Zonas Comunes",
    icon: CalendarDays,
    href: "/admin/zonas-comunes",
    badge: null,
  },
  {
    title: "Autorización Trasteos",
    icon: Truck,
    href: "/admin/trasteos",
    badge: null,
  },
  {
    title: "Gestión Infracciones",
    icon: AlertTriangle,
    href: "/admin/infracciones",
    badge: "Sanciones",
  },
  {
    title: "Unidades y Residentes",
    icon: Building2,
    href: "/admin/residentes",
    badge: null,
  },
  {
    title: "Anuncios y Avisos",
    icon: Megaphone,
    href: "/admin/anuncios",
    badge: null,
  },
  {
    title: "Configuración",
    icon: Settings,
    href: "/admin/configuracion",
    badge: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex relative flex-col border-r border-slate-800 bg-slate-950 text-slate-100 transition-all duration-300 min-h-screen shrink-0 z-20",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base leading-tight tracking-tight text-white">
                ParkControl
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Admin Conjunto
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
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group relative",
                isActive
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
                      : "bg-blue-950 text-blue-300 border border-blue-800"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 hidden rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-md group-hover:block z-50 whitespace-nowrap">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}

        {/* Link to Super Admin Platform Owner */}
        <div className="pt-4 border-t border-slate-800 mt-4">
          <Link
            href="/super-admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-indigo-400 hover:bg-indigo-950/40 border border-indigo-800/60 transition-all"
          >
            <ShieldAlert className="h-5 w-5 shrink-0 text-indigo-400" />
            {!collapsed && <span className="truncate font-semibold">Panel Súper Admin</span>}
          </Link>
        </div>
      </nav>

      {/* User profile footer & Logout */}
      <div className="border-t border-slate-800 p-3 space-y-2">
        <div className="flex items-center gap-3 rounded-lg p-2 bg-slate-900">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
            AD
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold truncate text-white">
                Administración
              </span>
              <span className="text-[11px] text-blue-400 font-medium truncate">
                Conjunto Residencial
              </span>
            </div>
          )}
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 transition",
              collapsed && "px-0"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
