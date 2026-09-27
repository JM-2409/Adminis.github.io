"use client";

import { Bell, Search, Sun, Moon, Menu, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDarkMode(true);
    }
  }, []);

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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-3 w-full max-w-xl">
        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden rounded-lg p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar apto, visitante, paquete..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-2 pl-9 pr-4 text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
          />
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2">
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
          <span>Administrador</span>
        </div>
      </div>
    </header>
  );
}
