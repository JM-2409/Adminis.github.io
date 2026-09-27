"use client";

import { useState } from "react";
import {
  Truck,
  Check,
  X,
  Clock,
  AlertCircle,
  FileText,
  Building,
  User,
  Calendar,
  MessageSquare,
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
    if (selectedReq?.id === id) {
      setSelectedReq((prev) => (prev ? { ...prev, status: "Aprobado" } : null));
    }
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

    if (selectedReq?.id === rejectReasonModal) {
      setSelectedReq((prev) =>
        prev ? { ...prev, status: "Rechazado", rejectionReason: reasonInput } : null
      );
    }

    setRejectReasonModal(null);
    setReasonInput("");
  };

  const pendingCount = requests.filter((r) => r.status === "Pendiente").length;
  const approvedCount = requests.filter((r) => r.status === "Aprobado").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Autorizaciones de Trasteos y Mudanzas
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Aprobación o rechazo de solicitudes de entrada y salida de mudanzas.
          </p>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium uppercase">Solicitudes por Revisar</span>
            <p className="text-2xl font-bold">{pendingCount} pendientes</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Check className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium uppercase">Trasteos Aprobados</span>
            <p className="text-2xl font-bold">{approvedCount} autorizados</p>
          </div>
        </div>
      </div>

      {/* Tabla de Trasteos */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b font-bold text-base">
          Listado de Solicitudes de Mudanza
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="p-4">Código / Tipo</th>
                <th className="p-4">Residente / Unidad</th>
                <th className="p-4">Empresa / Vehículo</th>
                <th className="p-4">Fecha Programada</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones de Administración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                    <div className="text-xs text-muted-foreground font-mono">{r.id}</div>
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">{r.type}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{r.resident}</div>
                    <div className="text-xs text-muted-foreground">{r.apartment}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{r.movingCompany}</div>
                    <div className="text-muted-foreground font-mono">Placa: {r.vehiclePlate}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-bold">{r.scheduledDate}</div>
                    <div className="text-muted-foreground">{r.scheduledTime}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        r.status === "Aprobado"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : r.status === "Rechazado"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {r.status}
                    </span>
                    {r.rejectionReason && (
                      <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 italic">
                        Motivo: {r.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {r.status === "Pendiente" && (
                        <>
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500 shadow-sm"
                          >
                            <Check className="h-3.5 w-3.5" /> Aprobar
                          </button>
                          <button
                            onClick={() => setRejectReasonModal(r.id)}
                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-500 shadow-sm"
                          >
                            <X className="h-3.5 w-3.5" /> Rechazar
                          </button>
                        </>
                      )}
                      {r.status !== "Pendiente" && (
                        <span className="text-xs text-muted-foreground font-medium">Gestionado</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl border">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-rose-600">Rechazar Autorización de Trasteo</h3>
              <button
                onClick={() => setRejectReasonModal(null)}
                className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Indique el motivo por el cual la administración no aprueba esta solicitud de mudanza. Este mensaje se notificará al residente.
              </p>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Motivo de Rechazo
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ej: Faltante de depósito de garantía o paz y salvo de administración."
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full rounded-xl border bg-card p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setRejectReasonModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500"
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
