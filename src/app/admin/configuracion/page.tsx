"use client";

import { useState } from "react";
import {
  Building,
  ParkingSquare,
  Clock,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function ConfiguracionPage() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    propertyName: "Conjunto Residencial Bosques del Sol",
    address: "Calle 100 # 15-20, Bogotá",
    visitorParkingSpots: 20,
    movingHours: "Lunes a Sábado: 08:00 AM - 05:00 PM",
    socialRoomFee: 150000,
    bbqFee: 80000,
    autoPurgeAnnouncements: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl overflow-x-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          Configuración del Conjunto
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Ajuste de parámetros operativos, cupos de parqueadero y tarifas de zonas comunes.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          Cambios de configuración guardados correctamente.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Datos Básicos */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-md space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-400" /> Datos Principales de la Propiedad
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Nombre del Conjunto / Copropiedad
              </label>
              <input
                type="text"
                value={config.propertyName}
                onChange={(e) => setConfig({ ...config, propertyName: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Políticas de Operación */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-md space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ParkingSquare className="h-5 w-5 text-emerald-400" /> Parqueaderos y Trasteos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Cupos de Parqueadero Visitante
              </label>
              <input
                type="number"
                value={config.visitorParkingSpots}
                onChange={(e) => setConfig({ ...config, visitorParkingSpots: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Horarios Permitiendo Trasteos
              </label>
              <input
                type="text"
                value={config.movingHours}
                onChange={(e) => setConfig({ ...config, movingHours: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Tarifas de Zonas Comunes */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-md space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" /> Tarifas Alquiler Zonas Comunes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Tarifa Salón Social ($ COP)
              </label>
              <input
                type="number"
                value={config.socialRoomFee}
                onChange={(e) => setConfig({ ...config, socialRoomFee: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Tarifa Terrazas BBQ ($ COP)
              </label>
              <input
                type="number"
                value={config.bbqFee}
                onChange={(e) => setConfig({ ...config, bbqFee: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs sm:text-sm font-bold hover:bg-emerald-400 transition-colors shadow-md"
          >
            <Save className="h-4 w-4" /> Guardar Configuración
          </button>
        </div>
      </form>
    </div>
  );
}
