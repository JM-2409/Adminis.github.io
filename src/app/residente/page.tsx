'use client';

import { useState, useEffect } from 'react';
import { Home, Package, Car, Calendar, DollarSign, LogOut, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ResidentePanel() {
  const [packages, setPackages] = useState<any[]>([]);
  const [fines, setFines] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user));

    fetch('/api/admin/packages')
      .then((res) => res.json())
      .then((data) => setPackages(data.packages || []));

    fetch('/api/admin/fines')
      .then((res) => res.json())
      .then((data) => setFines(data.fines || []));

    fetch('/api/admin/reservations')
      .then((res) => res.json())
      .then((data) => setReservations(data.reservations || []));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">ParkControl Total</h1>
            <p className="text-xs text-blue-400 font-semibold uppercase">Portal del Residente - Mi Unidad</p>
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
            <h2 className="text-xl font-bold text-white">¡Bienvenido, {user?.full_name || 'Residente'}!</h2>
            <p className="text-sm text-slate-400">Usuario: @{user?.username} | Rol: Residente</p>
          </div>
          <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400 font-bold text-sm">
            Unidad Asignada: Torre A 101
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Parqueadero Asignado */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Car className="w-5 h-5" />
              <span>Mi Parqueadero Privado</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="text-lg font-extrabold text-white">Código: P1-01</div>
              <div className="text-xs text-slate-400">Ubicación: Sótano 1 - Torre A</div>
              <div className="text-xs text-emerald-400 font-semibold">Placa Registrada: ABC123</div>
            </div>
          </div>

          {/* Paquetes Pendientes */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Package className="w-5 h-5" />
              <span>Paquetes en Portería</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-2xl font-extrabold text-amber-400">
                {packages.filter((p) => p.estado === 'pendiente').length} Pendientes
              </div>
              <p className="text-xs text-slate-400">
                Puedes reclamarlos en portería presentando tu documento.
              </p>
            </div>
          </div>

          {/* Multas / Estado de Cuenta */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <DollarSign className="w-5 h-5" />
              <span>Multas y Estado de Cuenta</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-2xl font-extrabold text-emerald-400"> Al Día</div>
              <p className="text-xs text-slate-400">No tienes sanciones vigentes.</p>
            </div>
          </div>
        </div>

        {/* Reservas de Zonas Comunes */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span>Mis Reservas de Zonas Comunes</span>
          </h3>

          <div className="divide-y divide-slate-800">
            {reservations.length === 0 ? (
              <p className="text-sm text-slate-500 py-2">No tienes reservas activas.</p>
            ) : (
              reservations.map((res) => (
                <div key={res.id} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <div className="font-semibold text-white">{res.common_areas?.nombre || 'Salón Social'}</div>
                    <div className="text-xs text-slate-400">Fecha: {res.fecha_reserva}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold capitalize">
                    {res.estado}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
