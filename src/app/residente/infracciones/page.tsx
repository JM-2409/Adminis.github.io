"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

interface Infraction {
  id: string;
  infraction_type: string;
  description: string;
  status: string;
  sanction_amount: number;
  admin_notes?: string;
  created_at: string;
}

export default function ResidenteInfraccionesPage() {
  const [infractions, setInfractions] = useState<Infraction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/residente/infractions")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setInfractions(data.infractions || []);
      })
      .catch(() => console.error("Error al obtener infracciones"))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" /> Historial de Novedades y Multas
        </h2>
        <p className="text-xs text-slate-400 mt-1">Notificaciones e infracciones registradas para su unidad</p>
      </div>

      {loading ? (
        <p className="text-xs text-slate-500">Cargando datos...</p>
      ) : infractions.length > 0 ? (
        <div className="space-y-3 text-xs">
          {infractions.map((inf) => (
            <div key={inf.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 text-sm">{inf.infraction_type}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    inf.status === "Multado"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : inf.status === "Llamado de atención"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {inf.status}
                </span>
              </div>

              <p className="text-slate-300">{inf.description}</p>

              {inf.status === "Multado" && (
                <div className="text-red-400 font-bold text-sm bg-red-500/10 p-2 rounded border border-red-500/20">
                  Valor Multa: ${inf.sanction_amount?.toLocaleString()} COP
                </div>
              )}

              {inf.admin_notes && (
                <div className="text-xs text-slate-400 border-t border-slate-800 pt-2">
                  <strong className="text-slate-200">Mensaje de Administración:</strong> {inf.admin_notes}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center space-y-2">
          <div className="flex justify-center">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="font-bold text-white text-sm">¡Sin Infracciones Registradas!</h3>
          <p className="text-xs text-slate-400">Su unidad se encuentra al día sin llamados de atención ni sanciones.</p>
        </div>
      )}
    </div>
  );
}
