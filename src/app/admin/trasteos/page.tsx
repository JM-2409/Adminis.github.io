"use client";

import { useState } from "react";
import {
  Truck,
  Check,
  X,
  Clock,
} from "lucide-react";

interface MovingRequest {
  id: string;
  type: "Entrada (Ingreso)" | "Salida (Retiro)";
  resident: string;
  document: string;
  apartment: string;
  movingCompany?: string;
  vehiclePlate?: string;
  scheduledDate: string;
  scheduledTime: string;
  depositPaid: boolean;
  notes?: string;
  status: "Pendiente" | "Aprobado" | "Rechazado";
  rejectionReason?: string;
}

export default function TrasteosPage() {
  const [requests, setRequests] = useState<MovingRequest[]>([
    {
      id: "MUD-101",
      type: "Entrada (Ingreso)",
      resident: "Carlos Mendoza",
      document: "10324001",
      apartment: "Torre 2 - Apt 402",
      movingCompany: "Mudanzas Colombia SAS",
      vehiclePlate: "KLS-890",
      scheduledDate: "2025-04-10",
      scheduledTime: "09:00 AM - 12:00 PM",
      depositPaid: true,
      notes: "Requiere protección de ascensores.",
      status: "Pendiente",
    },
    {
      id: "MUD-102",
      type: "Salida (Retiro)",
      resident: "Lucía Ramírez",
      document: "52881900",
      apartment: "Torre 1 - Apt 205",
      movingCompany: "Transportes Rápidos",
      vehiclePlate: "WXZ-112",
      scheduledDate: "2025-04-12",
      scheduledTime: "02:00 PM - 05:00 PM",
      depositPaid: true,
      notes: "Paz y salvo de administración verificado.",
      status: "Aprobado",
    },
    {
      id: "MUD-103",
      type: "Entrada (Ingreso)",
      resident: "Andrés Gómez",
      document: "79812300",
      apartment: "Torre 3 - Apt 801",
      movingCompany: "Particulares",
      vehiclePlate: "JHY-456",
      scheduledDate: "2025-04-15",
      scheduledTime: "10:00 AM - 01:00 PM",
      depositPaid: false,
      notes: "Pendiente entrega de paz y salvo.",
      status: "Pendiente",
    },
  ]);

  const [selectedReq, setSelectedReq] = useState<MovingRequest | null>(null);
  const [rejectReasonModal, setRejectReasonModal] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState("");

  const handleApprove = (id: string) => {
    setRequests(
      requests.map((r) =>
        r.id === id ? { ...r, status: "Aprobado", rejectionReason: undefined } : r
      )
    );
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReasonModal || !reasonInput) return;

    setRequests(
      requests.map((r) =>
        r.id === rejectReasonModal
          ? { ...r, status: "Rechazado", rejectionReason: reasonInput }
          : r
      )
    );

    setRejectReasonModal(null);
    setReasonInput("");
  };

  const pendingCount = requests.filter((r) => r.status === "Pendiente").length;
  const approvedCount = requests.filter((r) => r.status === "Aprobado").length;

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Autorizaciones de Trasteos y Mudanzas
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Aprobación o rechazo de solicitudes de entrada y salida de mudanzas.
          </p>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-slate-800 bg-[#111827] shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-400 shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Solicitudes por Revisar</span>
            <p className="text-2xl font-extrabold text-white">{pendingCount} pendientes</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-[#111827] shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 shrink-0">
            <Check className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Trasteos Aprobados</span>
            <p className="text-2xl font-extrabold text-white">{approvedCount} autorizados</p>
          </div>
        </div>
      </div>

      {/* Tabla de Trasteos */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] shadow-md overflow-hidden max-w-full">
        <div className="p-4 border-b border-slate-800 font-extrabold text-base text-white">
          Listado de Solicitudes de Mudanza
        </div>
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
            <thead className="bg-slate-900 border-b border-slate-800 text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-3 sm:p-4">Código / Tipo</th>
                <th className="p-3 sm:p-4">Residente / Unidad</th>
                <th className="p-3 sm:p-4">Empresa / Vehículo</th>
                <th className="p-3 sm:p-4">Fecha Programada</th>
                <th className="p-3 sm:p-4">Estado</th>
                <th className="p-3 sm:p-4 text-right">Acciones de Administración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/50">
                  <td className="p-3 sm:p-4 font-bold text-white whitespace-nowrap">
                    <div className="text-[11px] text-slate-400 font-mono">{r.id}</div>
                    <div className="text-xs font-bold text-blue-400">{r.type}</div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="font-bold text-white">{r.resident}</div>
                    <div className="text-xs text-slate-400">{r.apartment}</div>
                  </td>
                  <td className="p-3 sm:p-4 text-xs whitespace-nowrap">
                    <div className="font-semibold text-slate-200">{r.movingCompany}</div>
                    <div className="text-slate-400 font-mono">Placa: {r.vehiclePlate}</div>
                  </td>
                  <td className="p-3 sm:p-4 text-xs whitespace-nowrap">
                    <div className="font-bold text-slate-200">{r.scheduledDate}</div>
                    <div className="text-slate-400">{r.scheduledTime}</div>
                  </td>
                  <td className="p-3 sm:p-4 whitespace-nowrap">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                        r.status === "Aprobado"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : r.status === "Rechazado"
                          ? "bg-rose-950 text-rose-300 border-rose-800"
                          : "bg-amber-950 text-amber-300 border-amber-800"
                      }`}
                    >
                      {r.status}
                    </span>
                    {r.rejectionReason && (
                      <div className="text-[11px] text-rose-400 mt-1 italic max-w-[150px] truncate">
                        Motivo: {r.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td className="p-3 sm:p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {r.status === "Pendiente" && (
                        <>
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-sm"
                          >
                            <Check className="h-3.5 w-3.5" /> Aprobar
                          </button>
                          <button
                            onClick={() => setRejectReasonModal(r.id)}
                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-500 shadow-sm"
                          >
                            <X className="h-3.5 w-3.5" /> Rechazar
                          </button>
                        </>
                      )}
                      {r.status !== "Pendiente" && (
                        <span className="text-xs text-slate-400 font-medium">Gestionado</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Motivo Rechazo */}
      {rejectReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#111827] p-5 sm:p-6 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-extrabold text-rose-400">Rechazar Autorización de Trasteo</h3>
              <button
                onClick={() => setRejectReasonModal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <p className="text-xs text-slate-400">
                Indique el motivo por el cual la administración no aprueba esta solicitud de mudanza. Este mensaje se notificará al residente.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Motivo de Rechazo
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ej: Faltante de depósito de garantía o paz y salvo de administración."
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRejectReasonModal(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-500"
                >
                  Confirmar Rechazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
