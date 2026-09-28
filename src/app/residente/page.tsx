import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { UserCheck, Package, Truck, Calendar, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function ResidenteDashboardPage() {
  const session = await getSession();
  const unitNumber = session?.unit_number || "Torre 1 - Apto 201";
  const complexId = session?.complex_id;

  let visitors: Array<{ id: string; name: string; type: string; entry_time: string; status: string }> = [];
  let pendingParcelsCount = 0;
  let movingAllowed = false;
  let movingStatusText = "Sin solicitudes de trasteo";

  if (complexId) {
    const [{ data: visitorsData }, { count: parcelsCount }, { data: movingsData }] = await Promise.all([
      supabaseAdmin
        .from("visitors")
        .select("*")
        .eq("complex_id", complexId)
        .order("entry_time", { ascending: false })
        .limit(5),
      supabaseAdmin
        .from("parcels")
        .select("*", { count: "exact", head: true })
        .eq("complex_id", complexId)
        .eq("status", "Pendiente"),
      supabaseAdmin
        .from("moving_requests")
        .select("*")
        .eq("complex_id", complexId)
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    visitors = visitorsData || [];
    pendingParcelsCount = parcelsCount || 0;

    if (movingsData && movingsData.length > 0) {
      const lastMoving = movingsData[0];
      if (lastMoving.status === "Aprobado") {
        movingAllowed = true;
        movingStatusText = `Autorizado para el ${lastMoving.scheduled_date} (${lastMoving.scheduled_time})`;
      } else if (lastMoving.status === "Pendiente") {
        movingStatusText = `Solicitud pendiente para ${lastMoving.scheduled_date}`;
      } else {
        movingStatusText = "Última solicitud rechazada";
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900/60 to-slate-900 border border-blue-500/20 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Residente Activo
          </span>
          <ShieldCheck className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-white">¡Bienvenido, {session?.full_name || "Residente"}!</h2>
        <p className="text-xs text-slate-300">Asociado a la unidad: <strong className="text-white">{unitNumber}</strong></p>
      </div>

      {/* Resumen Rápido */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <Link
          href="/residente/paquetes"
          className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-slate-700 transition"
        >
          <div className="flex items-center justify-between">
            <Package className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-base text-white">{pendingParcelsCount}</span>
          </div>
          <div>
            <div className="font-semibold text-white">Paquetes en Portería</div>
            <div className="text-[11px] text-slate-400">
              {pendingParcelsCount > 0 ? "¡Tienes paquetes por retirar!" : "Sin entregas pendientes"}
            </div>
          </div>
        </Link>

        <Link
          href="/residente/trasteos"
          className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-slate-700 transition"
        >
          <div className="flex items-center justify-between">
            <Truck className="w-5 h-5 text-indigo-400" />
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                movingAllowed ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"
              }`}
            >
              {movingAllowed ? "Permitido" : "No activo"}
            </span>
          </div>
          <div>
            <div className="font-semibold text-white">Estado Trasteos</div>
            <div className="text-[11px] text-slate-400 truncate">{movingStatusText}</div>
          </div>
        </Link>
      </div>

      {/* Visitas Recientes */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-400" /> Historial de Visitantes
          </h3>
        </div>

        {visitors.length > 0 ? (
          <div className="space-y-2 text-xs">
            {visitors.map((v) => (
              <div key={v.id} className="p-2.5 bg-slate-800/60 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{v.name}</div>
                  <div className="text-[11px] text-slate-400">
                    Tipo: <span className="text-slate-300 font-medium">{v.type}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    v.status === "En sitio"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-3">No hay visitantes registrados recientemente.</p>
        )}
      </div>
    </div>
  );
}
