import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { Car, Package, Calendar, Truck, AlertTriangle, Users } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboard() {
  const session = await getSession();
  const complexId = session?.complex_id;

  let visitorsCount = 0;
  let pendingParcelsCount = 0;
  let pendingReservationsCount = 0;
  let pendingMovingCount = 0;
  let pendingInfractionsCount = 0;
  let totalUnitsCount = 0;

  if (complexId) {
    const [resVisitors, resParcels, resReservations, resMovings, resInfractions, resUnits] = await Promise.all([
      supabaseAdmin.from("visitors").select("*", { count: "exact", head: true }).eq("complex_id", complexId).eq("status", "En sitio"),
      supabaseAdmin.from("parcels").select("*", { count: "exact", head: true }).eq("complex_id", complexId).eq("status", "Pendiente"),
      supabaseAdmin.from("reservations").select("*", { count: "exact", head: true }).eq("complex_id", complexId).eq("status", "Pendiente"),
      supabaseAdmin.from("moving_requests").select("*", { count: "exact", head: true }).eq("complex_id", complexId).eq("status", "Pendiente"),
      supabaseAdmin.from("infractions").select("*", { count: "exact", head: true }).eq("complex_id", complexId).eq("status", "Pendiente"),
      supabaseAdmin.from("units").select("*", { count: "exact", head: true }).eq("complex_id", complexId),
    ]);

    visitorsCount = (resVisitors as { count?: number | null })?.count || 0;
    pendingParcelsCount = (resParcels as { count?: number | null })?.count || 0;
    pendingReservationsCount = (resReservations as { count?: number | null })?.count || 0;
    pendingMovingCount = (resMovings as { count?: number | null })?.count || 0;
    pendingInfractionsCount = (resInfractions as { count?: number | null })?.count || 0;
    totalUnitsCount = (resUnits as { count?: number | null })?.count || 0;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Administrativo del Conjunto</h1>
        <p className="text-sm text-slate-400 mt-1">
          Resumen operativo en tiempo real e incidencias pendientes por resolver
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Visitantes En Sitio</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{visitorsCount}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Paquetes Pendientes</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{pendingParcelsCount}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Reservas por Aprobar</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{pendingReservationsCount}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Trasteos Pendientes</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{pendingMovingCount}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Infracciones por Resolver</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{pendingInfractionsCount}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Unidades</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{totalUnitsCount}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
