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
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Header Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col">
              <span className="font-bold text-base leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                Adminis
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Portal de Administración
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setCollapsed?.(!collapsed)}
          className="hidden md:flex rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="md:hidden rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                "flex items-center gap-3 rounded-xl px-3 py-3 md:py-2.5 text-sm font-medium transition-all group relative",
                isActive
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive
                    ? "text-white dark:text-slate-900"
                    : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200"
                )}
              />
              {(!collapsed || mobileOpen) && <span className="truncate">{item.title}</span>}

              {(!collapsed || mobileOpen) && item.badge && (
                <span
                  className={cn(
                    "ml-auto text-xs px-2 py-0.5 rounded-full font-semibold",
                    isActive
                      ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
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
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
            AD
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
                Administración
              </span>
              <span className="text-[11px] text-emerald-600 font-medium dark:text-emerald-400 truncate">
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
          "hidden md:flex flex-col border-r bg-card transition-all duration-300 min-h-screen",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-card z-10 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
