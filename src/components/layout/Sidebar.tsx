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
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    badge: "5 en sitio",
  },
  {
    title: "Paquetería",
    icon: PackageCheck,
    href: "/admin/paqueteria",
    badge: "8 pend.",
  },
  {
    title: "Zonas Comunes",
    icon: CalendarDays,
    href: "/admin/zonas-comunes",
    badge: "2 reser.",
  },
  {
    title: "Autorización Trasteos",
    icon: Truck,
    href: "/admin/trasteos",
    badge: "3 pend.",
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
    badge: "Activos",
  },
  {
    title: "Configuración",
    icon: Settings,
    href: "/admin/configuracion",
    badge: null,
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  setCollapsed?: (val: boolean) => void;
}

export function Sidebar({
  mobileOpen = false,
  onMobileClose,
  collapsed = false,
  setCollapsed,
}: SidebarProps) {
  const pathname = usePathname();

  const content = (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-100 border-r border-slate-800">
      {/* Header Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold shadow-sm">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base leading-tight tracking-tight text-white">
                Adminis
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Portal de Administración
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setCollapsed?.(!collapsed)}
          className="hidden md:flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="md:hidden rounded-lg p-1.5 text-slate-300 hover:bg-slate-800"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-3 md:py-2.5 text-sm font-semibold transition-all group relative border",
                isActive
                  ? "bg-slate-800 text-white border-emerald-500/40 shadow-sm"
                  : "bg-transparent text-slate-300 border-transparent hover:bg-slate-800/60 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-400"
                )}
              />
              {(!collapsed || mobileOpen) && <span className="truncate">{item.title}</span>}

              {(!collapsed || mobileOpen) && item.badge && (
                <span
                  className={cn(
                    "ml-auto text-[11px] px-2 py-0.5 rounded-full font-bold",
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-blue-400 border border-slate-700"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-3 rounded-xl p-2.5 bg-slate-800/80 border border-slate-700/50">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs shadow-sm">
            AD
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold truncate text-white">
                Administración
              </span>
              <span className="text-[11px] text-emerald-400 font-medium truncate">
                Conjunto Bosques del Sol
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col transition-all duration-300 min-h-screen shrink-0",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-[#0f172a] z-10 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
