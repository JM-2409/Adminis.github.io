"use client";

import { useState } from "react";
import {
  Building,
  ParkingSquare,
  Clock,
  Save,
  CheckCircle2,
  Layers,
  Home,
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
    // Estructura de inmuebles
    singleLevelNomenclature: false, // false = 2 niveles (Ej: Torre + Apto), true = 1 nivel (Ej: Solo Casa/Lote)
    level1Name: "Torre / Bloque / Manzana",
    level2Name: "Apartamento / Casa",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl overflow-x-hidden text-slate-100">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          Configuración del Conjunto
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Ajuste de parámetros operativos, cupos de parqueadero, tarifas y nomenclatura de inmuebles.
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

        {/* Nomenclatura y Estructura de Inmuebles */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-md space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-400" /> Estructura y Nomenclatura de Inmuebles
          </h2>
          <p className="text-xs text-slate-400">
            Defina cómo se organizan los inmuebles en su conjunto (ej. por Torres y Aptos, por Manzanas y Casas, o solo por Número de Casa/Lote).
          </p>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.singleLevelNomenclature}
                onChange={(e) =>
                  setConfig({ ...config, singleLevelNomenclature: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-200">
                  Usar nomenclatura de Nivel Único (Solo Número de Casa o Lote)
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Marque esta casilla si el conjunto solo consta de Casas o Lotes numerados sin divisiones de Torres, Bloques ni Manzanas.
                </span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {!config.singleLevelNomenclature ? (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Nombre del Sector / Agrupación (Nivel 1)
                  </label>
                  <input
                    type="text"
                    value={config.level1Name}
                    onChange={(e) => setConfig({ ...config, level1Name: e.target.value })}
                    placeholder="Ej: Torre, Bloque, Manzana"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Ejemplos: "Torre A", "Bloque 3", "Manzana C"
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Nombre del Número de Inmueble (Nivel 2)
                  </label>
                  <input
                    type="text"
                    value={config.level2Name}
                    onChange={(e) => setConfig({ ...config, level2Name: e.target.value })}
                    placeholder="Ej: Apartamento, Casa, Interior"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Ejemplos: "Apto 301", "Casa 12"
                  </span>
                </div>
              </>
            ) : (
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Etiqueta Única de Inmueble
                </label>
                <input
                  type="text"
                  value={config.level2Name}
                  onChange={(e) => setConfig({ ...config, level2Name: e.target.value })}
                  placeholder="Ej: Casa, Lote"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  En los formularios de residentes solo se solicitará un campo (Ej: "Casa 45").
                </span>
              </div>
            )}
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
