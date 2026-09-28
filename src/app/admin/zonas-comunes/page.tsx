"use client";

import { useState } from "react";
import {
  Flame,
  PartyPopper,
  Plus,
  Check,
  X,
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
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Gestión de Zonas Comunes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Alquiler y control de agenda para Salón Social y Terrazas BBQ.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-bold hover:bg-emerald-400 transition-colors shadow-md w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nueva Reserva
        </button>
      </div>

      {/* Tarjetas de Áreas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-400">
              <PartyPopper className="h-6 w-6" />
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-white">
              $150,000 COP
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Salón Social Principal</h3>
            <p className="text-xs text-slate-400 mt-0.5">Capacidad: 80 personas • Incluye cocina y aire</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-400">
              <Flame className="h-6 w-6" />
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-white">
              $80,000 COP
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Terraza BBQ #1</h3>
            <p className="text-xs text-slate-400 mt-0.5">Capacidad: 25 personas • Asador a gas incluido</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-400">
              <Flame className="h-6 w-6" />
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-white">
              $80,000 COP
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Terraza BBQ #2</h3>
            <p className="text-xs text-slate-400 mt-0.5">Capacidad: 25 personas • Vista panorámica</p>
          </div>
        </div>
      </div>

      {/* Lista de Reservas */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] shadow-md overflow-hidden max-w-full">
        <div className="p-4 border-b border-slate-800 font-extrabold text-base text-white">
          Solicitudes y Agenda de Reservas
        </div>
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
            <thead className="bg-slate-900 border-b border-slate-800 text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-3 sm:p-4">Zona Común</th>
                <th className="p-3 sm:p-4">Residente</th>
                <th className="p-3 sm:p-4">Fecha & Horario</th>
                <th className="p-3 sm:p-4">Tarifa</th>
                <th className="p-3 sm:p-4">Estado</th>
                <th className="p-3 sm:p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/50">
                  <td className="p-3 sm:p-4 font-bold text-white whitespace-nowrap">
                    {r.facility}
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="font-bold text-white">{r.resident}</div>
                    <div className="text-xs text-slate-400">{r.apartment}</div>
                  </td>
                  <td className="p-3 sm:p-4 text-xs whitespace-nowrap">
                    <div className="font-bold text-slate-200">{r.date}</div>
                    <div className="text-slate-400">{r.timeSlot}</div>
                  </td>
                  <td className="p-3 sm:p-4 font-bold text-white whitespace-nowrap">
                    ${r.fee.toLocaleString("es-CO")} COP
                  </td>
                  <td className="p-3 sm:p-4 whitespace-nowrap">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                        r.status === "Aprobada"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : r.status === "Rechazada"
                          ? "bg-rose-950 text-rose-300 border-rose-800"
                          : "bg-amber-950 text-amber-300 border-amber-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-right whitespace-nowrap">
                    {r.status === "Pendiente" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updateStatus(r.id, "Aprobada")}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-sm"
                        >
                          <Check className="h-3.5 w-3.5" /> Aprobar
                        </button>
                        <button
                          onClick={() => updateStatus(r.id, "Rechazada")}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-500 shadow-sm"
                        >
                          <X className="h-3.5 w-3.5" /> Rechazar
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Procesado</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#111827] p-5 sm:p-6 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-extrabold text-white">Crear Reserva de Zona Común</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Zona Común
                </label>
                <select
                  value={formData.facility}
                  onChange={(e) =>
                    setFormData({ ...formData, facility: e.target.value as any })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Salón Social">Salón Social ($150,000 COP)</option>
                  <option value="Terraza BBQ 1">Terraza BBQ #1 ($80,000 COP)</option>
                  <option value="Terraza BBQ 2">Terraza BBQ #2 ($80,000 COP)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Nombre del Residente
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Andrés Parra"
                  value={formData.resident}
                  onChange={(e) => setFormData({ ...formData, resident: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Apartamento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Torre 2 - Apt 301"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Fecha del Evento
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
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
