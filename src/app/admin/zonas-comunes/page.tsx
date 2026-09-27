"use client";

import { useState } from "react";
import {
  CalendarDays,
  Flame,
  PartyPopper,
  Plus,
  Clock,
  Check,
  X,
  DollarSign,
  UserCheck,
} from "lucide-react";

interface Reservation {
  id: string;
  facility: "Salón Social" | "Terraza BBQ 1" | "Terraza BBQ 2";
  resident: string;
  apartment: string;
  date: string;
  timeSlot: string;
  fee: number;
  status: "Aprobada" | "Pendiente" | "Rechazada";
}

export default function ZonasComunesPage() {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "RES-101",
      facility: "Salón Social",
      resident: "Andrea Benítez",
      apartment: "Torre 2 - Apt 601",
      date: "2025-04-12",
      timeSlot: "02:00 PM - 10:00 PM",
      fee: 150000,
      status: "Aprobada",
    },
    {
      id: "RES-102",
      facility: "Terraza BBQ 1",
      resident: "Marcos Quintero",
      apartment: "Torre 1 - Apt 104",
      date: "2025-04-13",
      timeSlot: "11:00 AM - 05:00 PM",
      fee: 80000,
      status: "Pendiente",
    },
    {
      id: "RES-103",
      facility: "Terraza BBQ 2",
      resident: "Esteban Henao",
      apartment: "Torre 3 - Apt 302",
      date: "2025-04-18",
      timeSlot: "12:00 PM - 06:00 PM",
      fee: 80000,
      status: "Pendiente",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    facility: "Salón Social" as "Salón Social" | "Terraza BBQ 1" | "Terraza BBQ 2",
    resident: "",
    apartment: "",
    date: "",
    timeSlot: "02:00 PM - 10:00 PM",
  });

  const updateStatus = (id: string, status: "Aprobada" | "Rechazada") => {
    setReservations(
      reservations.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resident || !formData.apartment || !formData.date) return;

    const feeMap = {
      "Salón Social": 150000,
      "Terraza BBQ 1": 80000,
      "Terraza BBQ 2": 80000,
    };

    const newRes: Reservation = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      facility: formData.facility,
      resident: formData.resident,
      apartment: formData.apartment,
      date: formData.date,
      timeSlot: formData.timeSlot,
      fee: feeMap[formData.facility],
      status: "Aprobada",
    };

    setReservations([newRes, ...reservations]);
    setShowModal(false);
    setFormData({
      facility: "Salón Social",
      resident: "",
      apartment: "",
      date: "",
      timeSlot: "02:00 PM - 10:00 PM",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de Zonas Comunes
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Alquiler y control de agenda para Salón Social y Terrazas BBQ.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nueva Reserva
        </button>
      </div>

      {/* Tarjetas de Áreas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <PartyPopper className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              $150,000 COP
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base">Salón Social Principal</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Capacidad: 80 personas • Incluye cocina y aire</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Flame className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              $80,000 COP
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base">Terraza BBQ #1</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Capacidad: 25 personas • Asador a gas incluido</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <Flame className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              $80,000 COP
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base">Terraza BBQ #2</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Capacidad: 25 personas • Vista panorámica</p>
          </div>
        </div>
      </div>

      {/* Lista de Reservas */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b font-bold text-base">
          Solicitudes y Agenda de Reservas
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="p-4">Zona Comun</th>
                <th className="p-4">Residente</th>
                <th className="p-4">Fecha & Horario</th>
                <th className="p-4">Tarifa</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                    {r.facility}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{r.resident}</div>
                    <div className="text-xs text-muted-foreground">{r.apartment}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-bold">{r.date}</div>
                    <div className="text-muted-foreground">{r.timeSlot}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                    ${r.fee.toLocaleString("es-CO")} COP
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        r.status === "Aprobada"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : r.status === "Rechazada"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {r.status === "Pendiente" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updateStatus(r.id, "Aprobada")}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500"
                        >
                          <Check className="h-3.5 w-3.5" /> Aprobar
                        </button>
                        <button
                          onClick={() => updateStatus(r.id, "Rechazada")}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-500"
                        >
                          <X className="h-3.5 w-3.5" /> Rechazar
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground font-medium">Procesado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva Reserva */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl border">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">Crear Reserva de Zona Común</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Zona Común
                </label>
                <select
                  value={formData.facility}
                  onChange={(e) =>
                    setFormData({ ...formData, facility: e.target.value as any })
                  }
                  className="w-full rounded-xl border bg-card p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Salón Social">Salón Social ($150,000 COP)</option>
                  <option value="Terraza BBQ 1">Terraza BBQ #1 ($80,000 COP)</option>
                  <option value="Terraza BBQ 2">Terraza BBQ #2 ($80,000 COP)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Nombre del Residente
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Andrés Parra"
                  value={formData.resident}
                  onChange={(e) => setFormData({ ...formData, resident: e.target.value })}
                  className="w-full rounded-xl border bg-card p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Apartamento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Torre 2 - Apt 301"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  className="w-full rounded-xl border bg-card p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Fecha del Evento
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-xl border bg-card p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
