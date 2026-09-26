'use client';

import { useState, useEffect } from 'react';
import { Building2, DollarSign, Car, ShieldAlert, LogOut, FileText, CheckCircle2 } from 'lucide-react';

export default function PresidenteDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">ParkControl Total</h1>
            <p className="text-xs text-indigo-400 font-semibold uppercase">Dashboard Presidente de Consejo (Lectura e Informes)</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-800 text-slate-300 hover:bg-red-600/20 hover:text-red-400 px-3 py-2 rounded-xl text-sm font-medium border border-slate-700"
        >
          <LogOut className="w-4 h-4" />
          <span>Salir</span>
        </button>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Informe Financiero y Operativo</h2>
            <p className="text-sm text-slate-400">Vista consolidada en tiempo real filtrada por conjunto_id (RLS)</p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
            Auditoría Activa
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400 uppercase font-bold flex justify-between">
              <span>Ingresos Hoy</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">
              ${(stats?.dailyIncome || 0).toLocaleString('es-CO')}
            </div>
            <div className="text-xs text-slate-500">Recaudo automático parqueaderos</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400 uppercase font-bold flex justify-between">
              <span>Visitantes Libres</span>
              <Car className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">
              {stats?.visitorFree || 20} / {stats?.visitorTotal || 20}
            </div>
            <div className="text-xs text-slate-500">Capacidad disponible</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400 uppercase font-bold flex justify-between">
              <span>Multas Por Cobrar</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-extrabold text-red-400">
              ${(stats?.totalPendingFines || 0).toLocaleString('es-CO')}
            </div>
            <div className="text-xs text-slate-500">{stats?.pendingFinesCount || 0} infracciones pendientes</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400 uppercase font-bold flex justify-between">
              <span>Correspondencia</span>
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400">
              {stats?.pendingPackagesCount || 0}
            </div>
            <div className="text-xs text-slate-500">Paquetes en recepción</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-lg text-white">Resumen Ejecutivo de Gestión</h3>
          <p className="text-sm text-slate-300">
            El sistema multi-conjunto opera en tiempo real. Todas las acciones realizadas por administradores, vigilantes y residentes quedan registradas con firma digital y marca de tiempo en la tabla audit_logs de Supabase.
          </p>
        </div>
      </main>
    </div>
  );
}
