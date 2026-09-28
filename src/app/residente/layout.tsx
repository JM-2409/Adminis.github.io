import Link from "next/link";
import { Home, Package, Truck, Calendar, AlertTriangle, LogOut } from "lucide-react";

export default function ResidenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar Superior */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white leading-tight">Mi Portal Residente</h1>
            <p className="text-[11px] text-blue-400 font-medium">Torre 1 - Apto 201</p>
          </div>
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </form>
      </header>

      {/* Area Principal */}
      <main className="flex-1 p-4 max-w-xl mx-auto w-full pb-20">{children}</main>

      {/* Navegación Inferior Móvil */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 py-2 px-3 flex justify-around items-center z-40">
        <Link
          href="/residente"
          className="flex flex-col items-center text-xs font-medium text-slate-400 hover:text-blue-400 focus:text-blue-400"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Inicio</span>
        </Link>

        <Link
          href="/residente/paquetes"
          className="flex flex-col items-center text-xs font-medium text-slate-400 hover:text-blue-400 focus:text-blue-400"
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span>Paquetes</span>
        </Link>

        <Link
          href="/residente/trasteos"
          className="flex flex-col items-center text-xs font-medium text-slate-400 hover:text-blue-400 focus:text-blue-400"
        >
          <Truck className="w-5 h-5 mb-0.5" />
          <span>Trasteos</span>
        </Link>

        <Link
          href="/residente/reservas"
          className="flex flex-col items-center text-xs font-medium text-slate-400 hover:text-blue-400 focus:text-blue-400"
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span>Zonas</span>
        </Link>

        <Link
          href="/residente/infracciones"
          className="flex flex-col items-center text-xs font-medium text-slate-400 hover:text-amber-400 focus:text-amber-400"
        >
          <AlertTriangle className="w-5 h-5 mb-0.5" />
          <span>Avisos</span>
        </Link>
      </nav>
    </div>
  );
}
