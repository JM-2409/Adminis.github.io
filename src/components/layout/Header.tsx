"use client";

import { Bell, Search, Menu, UserCheck } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md px-3 sm:px-4 md:px-6 shadow-md max-w-full overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-3 w-full max-w-xl min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden shrink-0 rounded-xl p-2.5 bg-slate-800 text-slate-100 hover:bg-slate-700 active:scale-95 transition-all border border-slate-700"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-5 w-5 text-slate-100" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar apto, visitante, paquete..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 truncate"
          />
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {/* Notifications */}
        <button className="relative rounded-xl p-2 text-slate-300 hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        </button>

        {/* Role badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-xs font-semibold">
          <UserCheck className="h-4 w-4 text-emerald-400" />
          <span>Administrador</span>
        </div>
      </div>
    </header>
  );
}
