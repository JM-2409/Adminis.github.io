"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface Infraction {
  id: string;
  apartment_unit: string;
  resident_name: string;
  reported_by: string;
  infraction_type: string;
  description: string;
  status: string;
  sanction_amount: number;
  admin_notes: string;
  created_at: string;
}

export default function AdminInfraccionesPage() {
  const [infractions, setInfractions] = useState<Infraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Infraction | null>(null);
  const [actionStatus, setActionStatus] = useState<string>("Multado");
  const [sanctionAmount, setSanctionAmount] = useState<number>(50000);
  const [adminNotes, setAdminNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchInfractions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/infractions");
      const data = await res.json();
      if (res.ok) setInfractions(data.infractions || []);
    } catch {
      console.error("Error al obtener infracciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfractions();
  }, []);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/infractions/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: actionStatus,
          sanction_amount: actionStatus === "Multado" ? sanctionAmount : 0,
          admin_notes: adminNotes,
        }),
      });

      if (res.ok) {
        setSelected(null);
        setAdminNotes("");
        fetchInfractions();
      }
    } catch {
      console.error("Error al resolver infracción");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestión de Infracciones y Sanciones</h1>
        <p className="text-slate-400 text-sm">
          Revise los reportes emitidos por los vigilantes y aplique multas o llamados de atención
        </p>
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm">Cargando reportes de infracción...</p>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800 text-slate-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Unidad / Residente</th>
                  <th className="px-4 py-3">Tipo de Infracción</th>
                  <th className="px-4 py-3">Reportado Por</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 rounded-r-lg">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {infractions.length > 0 ? (
                  infractions.map((inf) => (
                    <tr key={inf.id} className="hover:bg-slate-800/50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{inf.apartment_unit}</div>
                        <div className="text-xs text-slate-400">{inf.resident_name || "N/A"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-amber-400">{inf.infraction_type}</span>
                        <div className="text-xs text-slate-400 truncate max-w-xs">{inf.description}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{inf.reported_by}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {new Date(inf.created_at).toLocaleDateString("es-CO")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            inf.status === "Pendiente"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : inf.status === "Multado"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {inf.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {inf.status === "Pendiente" ? (
                          <button
                            onClick={() => setSelected(inf)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                          >
                            Evaluar Sanción
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500">
                            {inf.status === "Multado" ? `$${inf.sanction_amount?.toLocaleString()}` : "Evaluado"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-500">
                      No hay reportes de infracción registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Resolucion */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Resolución de Infracción
            </h2>
            <div className="text-xs bg-slate-800/80 p-3 rounded-lg text-slate-300 space-y-1">
              <p><strong className="text-white">Unidad:</strong> {selected.apartment_unit}</p>
              <p><strong className="text-white">Infracción:</strong> {selected.infraction_type}</p>
              <p><strong className="text-white">Detalle:</strong> {selected.description}</p>
              <p><strong className="text-white">Reportado por:</strong> {selected.reported_by}</p>
            </div>

            <form onSubmit={handleResolve} className="space-y-3 text-sm">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Decisión Administrativa</label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Multado">Imponer Multa Económica</option>
                  <option value="Llamado de atención">Llamado de Atención Escrito</option>
                  <option value="Desestimado">Desestimar / Archivar Reporte</option>
                </select>
              </div>

              {actionStatus === "Multado" && (
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Monto de la Multa (COP)</label>
                  <input
                    type="number"
                    required
                    value={sanctionAmount}
                    onChange={(e) => setSanctionAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Notas / Observaciones</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Justificación o mensaje para el residente..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {submitting ? "Guardando..." : "Confirmar Decision"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
