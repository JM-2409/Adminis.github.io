"use client";

import { useState } from "react";
import {
  Car,
  UserCheck,
  Plus,
  Search,
  Clock,
  LogOut,
  ParkingSquare,
  X,
} from "lucide-react";

interface Visitor {
  id: string;
  type: "Vehicular" | "Peatonal";
  name: string;
  document: string;
  apartment: string;
  licensePlate?: string;
  parkingSpot?: string;
  entryTime: string;
  status: "En sitio" | "Finalizado";
}

export default function VisitantesPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([
    {
      id: "VIS-101",
      type: "Vehicular",
      name: "Juan Sebastián Perez",
      document: "10203040",
      apartment: "Torre 1 - Apt 304",
      licensePlate: "ABC-123",
      parkingSpot: "V-04",
      entryTime: "Hoy, 10:15 AM",
      status: "En sitio",
    },
    {
      id: "VIS-102",
      type: "Peatonal",
      name: "María Fernanda Lopez",
      document: "52988112",
      apartment: "Torre 2 - Apt 501",
      entryTime: "Hoy, 11:30 AM",
      status: "En sitio",
    },
    {
      id: "VIS-103",
      type: "Vehicular",
      name: "Pedro Pablo Alarcón",
      document: "79123456",
      apartment: "Torre 3 - Apt 102",
      licensePlate: "XYZ-987",
      parkingSpot: "V-12",
      entryTime: "Hoy, 08:00 AM",
      status: "En sitio",
    },
    {
      id: "VIS-104",
      type: "Peatonal",
      name: "Camila Ruiz",
      document: "10182239",
      apartment: "Torre 1 - Apt 101",
      entryTime: "Ayer, 04:20 PM",
      status: "Finalizado",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"Todos" | "En sitio" | "Vehicular" | "Peatonal">("Todos");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    type: "Vehicular" as "Vehicular" | "Peatonal",
    name: "",
    document: "",
    apartment: "",
    licensePlate: "",
    parkingSpot: "",
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.apartment) return;

    const newVisitor: Visitor = {
      id: `VIS-${Math.floor(100 + Math.random() * 900)}`,
      type: formData.type,
      name: formData.name,
      document: formData.document || "S/D",
      apartment: formData.apartment,
      licensePlate: formData.type === "Vehicular" ? formData.licensePlate || "N/A" : undefined,
      parkingSpot: formData.type === "Vehicular" ? formData.parkingSpot || "S/A" : undefined,
      entryTime: "Hace un momento",
      status: "En sitio",
    };

    setVisitors([newVisitor, ...visitors]);
    setShowModal(false);
    setFormData({
      type: "Vehicular",
      name: "",
      document: "",
      apartment: "",
      licensePlate: "",
      parkingSpot: "",
    });
  };

  const markExit = (id: string) => {
    setVisitors(
      visitors.map((v) => (v.id === id ? { ...v, status: "Finalizado" } : v))
    );
  };

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.apartment.toLowerCase().includes(search.toLowerCase()) ||
      (v.licensePlate && v.licensePlate.toLowerCase().includes(search.toLowerCase()));

    if (filterType === "En sitio") return matchesSearch && v.status === "En sitio";
    if (filterType === "Vehicular") return matchesSearch && v.type === "Vehicular";
    if (filterType === "Peatonal") return matchesSearch && v.type === "Peatonal";
    return matchesSearch;
  });

  const activeVehicles = visitors.filter((v) => v.status === "En sitio" && v.type === "Vehicular").length;
  const activePedestrians = visitors.filter((v) => v.status === "En sitio" && v.type === "Peatonal").length;
  const totalParkingSlots = 20;

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight break-words">
            Control de Visitantes y Parqueaderos
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Registro de ingresos/salidas peatonales y vehiculares.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Registrar Ingreso
        </button>
      </div>

      {/* Resumen de Capacidad */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 shrink-0">
            <Car className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground font-medium uppercase truncate block">Vehículos Activos</span>
            <p className="text-2xl font-bold">{activeVehicles} / {totalParkingSlots}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 shrink-0">
            <UserCheck className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground font-medium uppercase truncate block">Peatones Activos</span>
            <p className="text-2xl font-bold">{activePedestrians}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 shrink-0">
            <ParkingSquare className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground font-medium uppercase truncate block">Celdas Libres</span>
            <p className="text-2xl font-bold">{totalParkingSlots - activeVehicles}</p>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, placa o apto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-card py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(["Todos", "En sitio", "Vehicular", "Peatonal"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === type
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-card border text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla Adaptada a Móvil */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden max-w-full">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="p-3 sm:p-4">Visitante</th>
                <th className="p-3 sm:p-4">Tipo</th>
                <th className="p-3 sm:p-4">Destino</th>
                <th className="p-3 sm:p-4">Placa / Parqueadero</th>
                <th className="p-3 sm:p-4">Hora</th>
                <th className="p-3 sm:p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVisitors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-3 sm:p-4 font-semibold text-slate-900 dark:text-slate-100 max-w-[150px] truncate">
                    <div className="truncate">{v.name}</div>
                    <div className="text-[11px] font-normal text-muted-foreground">C.C. {v.document}</div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${
                        v.type === "Vehicular"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {v.type === "Vehicular" ? <Car className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                      {v.type}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                    {v.apartment}
                  </td>
                  <td className="p-3 sm:p-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {v.type === "Vehicular" ? (
                      <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-[11px] sm:text-xs">
                        {v.licensePlate} ({v.parkingSpot})
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">N/A</span>
                    )}
                  </td>
                  <td className="p-3 sm:p-4 text-[11px] sm:text-xs text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {v.entryTime}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-right whitespace-nowrap">
                    {v.status === "En sitio" ? (
                      <button
                        onClick={() => markExit(v.id)}
                        className="inline-flex items-center gap-1 text-[11px] sm:text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        <LogOut className="h-3 w-3" /> Salida
                      </button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Finalizado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Registrar Nuevo Ingreso */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-card p-5 sm:p-6 shadow-xl border my-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-bold">Registrar Ingreso de Visitante</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Tipo de Acceso
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "Vehicular" })}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      formData.type === "Vehicular"
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    Vehicular
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "Peatonal" })}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      formData.type === "Peatonal"
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    Peatonal
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Castro"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border bg-card p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Documento de Identidad
                </label>
                <input
                  type="text"
                  placeholder="C.C. o C.E."
                  value={formData.document}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                  className="w-full rounded-xl border bg-card p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Unidad / Apartamento Destino
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Torre 2 - Apt 401"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  className="w-full rounded-xl border bg-card p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {formData.type === "Vehicular" && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Placa Vehículo
                    </label>
                    <input
                      type="text"
                      placeholder="ABC-123"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                      className="w-full rounded-xl border bg-card p-2.5 text-xs sm:text-sm uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Celda Parqueadero
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: V-05"
                      value={formData.parkingSpot}
                      onChange={(e) => setFormData({ ...formData, parkingSpot: e.target.value })}
                      className="w-full rounded-xl border bg-card p-2.5 text-xs sm:text-sm uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90"
                >
                  Guardar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
