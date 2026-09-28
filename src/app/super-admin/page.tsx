import { supabaseAdmin } from "@/lib/supabase";
import { Building2, Users, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function SuperAdminDashboard() {
  const { data: complexes } = await supabaseAdmin.from("complexes").select("*");
  const { data: users } = await supabaseAdmin.from("users").select("*");

  const totalComplexes = complexes?.length || 0;
  const activeComplexes = complexes?.filter((c) => c.subscription_status === "Al día").length || 0;
  const totalAdmins = users?.filter((u) => u.role === "administrador").length || 0;
  const pendingComplexes = complexes?.filter((c) => c.subscription_status === "Pendiente" || c.subscription_status === "Suspendido").length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Panel de Control Súper Administrador
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Gestión centralizada de conjuntos residenciales y cuentas de administración
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Conjuntos</p>
              <h3 className="text-2xl font-bold text-white mt-1">{totalComplexes}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Conjuntos Al Día</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">{activeComplexes}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Administradores</p>
              <h3 className="text-2xl font-bold text-white mt-1">{totalAdmins}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pendientes / Suspendidos</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">{pendingComplexes}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Conjuntos List */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Conjuntos Residenciales Registrados</h2>
          <Link
            href="/super-admin/conjuntos"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
          >
            + Registrar Nuevo Conjunto
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Nombre del Conjunto</th>
                <th className="px-4 py-3">NIP / NIT</th>
                <th className="px-4 py-3">Dirección</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3 rounded-r-lg">Estado Suscripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {complexes && complexes.length > 0 ? (
                complexes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/50">
                    <td className="px-4 py-3 font-semibold text-white">{c.name}</td>
                    <td className="px-4 py-3">{c.nip}</td>
                    <td className="px-4 py-3">{c.address}</td>
                    <td className="px-4 py-3">{c.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.subscription_status === "Al día"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {c.subscription_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-500">
                    No hay conjuntos registrados en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
