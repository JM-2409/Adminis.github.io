"use client";

import { Bell, Search, Sun, Moon, ShieldAlert, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function SuperAdminHeader() {
  const [isDarkMode, setIsDarkMode] = useState(true);

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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 md:px-6 shadow-md">
      {/* Search Bar */}
      <div className="flex items-center gap-2 w-48 sm:w-72 md:w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar conjunto, NIT, usuario o admin..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Action Icons & Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick link back to admin */}
        <Link
          href="/admin"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900 border border-indigo-800/80 text-xs font-semibold transition-colors"
        >
          <ArrowLeftRight className="h-3.5 w-3.5 text-indigo-400" />
          <span>Portal Conjunto</span>
        </Link>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition-colors"
          title={isDarkMode ? "Modo Claro" : "Modo Oscuro"}
        >
          {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-400" />}
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
        </button>

        {/* Role badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          <span className="hidden sm:inline">Dueño de Plataforma</span>
          <span className="sm:hidden">Súper Admin</span>
        </div>
      </div>
    </header>
  );
}
