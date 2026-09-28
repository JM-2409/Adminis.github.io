"use client";

import { useState, useEffect } from "react";
import { Package, CheckCircle2, Clock } from "lucide-react";

interface Parcel {
  id: string;
  recipient_name: string;
  courier_company: string;
  description: string;
  received_by: string;
  delivered_by?: string;
  delivered_to?: string;
  status: string;
  received_at: string;
  delivered_at?: string;
}

export default function ResidentePaquetesPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/residente/parcels")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setParcels(data.parcels || []);
      })
      .catch(() => console.error("Error al obtener paquetes"))
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
          <Package className="w-5 h-5 text-emerald-400" /> Mis Paquetes & Correspondencia
        </h2>
        <p className="text-xs text-slate-400 mt-1">Consulte los paquetes recibidos y entregados por vigilantes</p>
      </div>

      {loading ? (
        <p className="text-xs text-slate-500">Cargando paquetes...</p>
      ) : parcels.length > 0 ? (
        <div className="space-y-3 text-xs">
          {parcels.map((p) => (
            <div
              key={p.id}
              className={`p-4 rounded-xl border space-y-2 ${
                p.status === "Pendiente"
                  ? "bg-slate-900 border-amber-500/30"
                  : "bg-slate-900/60 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{p.courier_company}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    p.status === "Pendiente"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  {p.status === "Pendiente" ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                  {p.status}
                </span>
              </div>

              <p className="text-slate-300 font-medium">{p.description || "Sin descripción adicional"}</p>

              <div className="text-[11px] text-slate-400 space-y-1 border-t border-slate-800/80 pt-2">
                <p>
                  <strong className="text-slate-300">Recibido en portería por:</strong> {p.received_by || "Vigilante"}{" "}
                  ({new Date(p.received_at).toLocaleDateString("es-CO")})
                </p>
                {p.status === "Entregado" && (
                  <p>
                    <strong className="text-emerald-400">Entregado a:</strong> {p.delivered_to} por {p.delivered_by || "Vigilancia"}{" "}
                    ({p.delivered_at ? new Date(p.delivered_at).toLocaleDateString("es-CO") : ""})
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 text-center py-6">No registra recibos de paquetes en portería.</p>
      )}
    </div>
  );
}
