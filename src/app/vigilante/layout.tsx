import Link from "next/link";
import { Shield, User, Package, AlertTriangle, LogOut } from "lucide-react";

export default function VigilanteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-600 rounded-lg text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white leading-tight">Portería & Vigilancia</h1>
            <p className="text-[11px] text-emerald-400 font-medium">Control de Acceso Activo</p>
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

      {/* Main Content Area */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full pb-20">{children}</main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 py-2 px-4 flex justify-around items-center z-40">
        <Link
          href="/vigilante"
          className="flex flex-col items-center text-xs font-medium text-slate-400 hover:text-emerald-400 focus:text-emerald-400"
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Visitantes</span>
        </Link>

        <Link
          href="/vigilante/paquetes"
          className="flex flex-col items-center text-xs font-medium text-slate-400 hover:text-emerald-400 focus:text-emerald-400"
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span>Paquetería</span>
        </Link>

        <Link
          href="/vigilante/infracciones"
          className="flex flex-col items-center text-xs font-medium text-slate-400 hover:text-amber-400 focus:text-amber-400"
        >
          <AlertTriangle className="w-5 h-5 mb-0.5" />
          <span>Infracción</span>
        </Link>
      </nav>
    </div>
  );
}
