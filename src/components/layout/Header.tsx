"use client";

import { Bell, Search, Sun, Moon, UserCheck, LogOut, Menu, X, ShieldAlert } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "./Sidebar";

export function Header() {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shadow-sm">
        {/* Left Side: Mobile Hamburger Button & Search Bar */}
        <div className="flex items-center gap-3 w-full max-w-md">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Abrir Menú Móvil"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por apto, paquete o placa..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-2 pl-9 pr-4 text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
            />
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? "Modo Claro" : "Modo Oscuro"}
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </button>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </button>

          {/* Role badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
            <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Administrador Principal</span>
          </div>

          {/* Botón Salir / Logout */}
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-semibold transition"
              title="Cerrar Sesión"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </form>
        </div>
      </header>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-2 z-40 animate-in slide-in-from-top duration-200">
          <div className="text-xs font-semibold text-slate-500 uppercase px-2 mb-1">Menú Navegación</div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? "bg-blue-600 text-white font-semibold" : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}

          <div className="border-t border-slate-800 pt-2 mt-2">
            <Link
              href="/super-admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-indigo-400 hover:bg-indigo-950/40 border border-indigo-800/60"
            >
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Ir a Portal Súper Admin</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
