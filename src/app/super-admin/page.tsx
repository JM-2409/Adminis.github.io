"use client";

import {
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BellRing,
  Plus,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  DollarSign,
  UserCheck,
  UserX,
} from "lucide-react";
import Link from "next/link";

export default function SuperAdminDashboard() {
  // Mock data for initial platform overview
  const metrics = [
    {
      title: "Total Conjuntos Residenciales",
      value: "14",
      subtext: "12 activos • 2 en mora/suspendidos",
      icon: Building2,
      color: "from-blue-600 to-cyan-600",
      textColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Usuarios Administradores",
      value: "16",
      subtext: "14 asignados • 2 sin asignar",
      icon: Users,
      color: "from-indigo-600 to-purple-600",
      textColor: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
    {
      title: "Suscripciones Al Día",
      value: "85.7%",
      subtext: "12 de 14 pagos completados",
      icon: CheckCircle2,
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Comunicados Emitidos",
      value: "8",
      subtext: "Notificaciones a administradores",
      icon: BellRing,
      color: "from-amber-600 to-orange-600",
      textColor: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
  ];

  const recentComplexes = [
    {
      id: "1",
      name: "Conjunto Residencial Bosques del Sol",
      nip: "900.123.456-1",
      city: "Bogotá",
      admin: "Carlos Eduardo Mendoza",
      status: "Al día",
      dueDate: "15 de Nov, 2025",
    },
    {
      id: "2",
      name: "Torres de San Juan",
      nip: "901.888.234-9",
      city: "Medellín",
      admin: "Mariana Restrepo",
      status: "Al día",
      dueDate: "20 de Nov, 2025",
    },
    {
      id: "3",
      name: "Altos del Portal I",
      nip: "800.555.789-3",
      city: "Cali",
      admin: "Sin asignar",
      status: "Pendiente",
      dueDate: "02 de Nov, 2025",
    },
    {
      id: "4",
      name: "Quintas de la Alborada",
      nip: "900.999.111-0",
      city: "Bucaramanga",
      admin: "Roberto Gómez",
      status: "Suspendido",
      dueDate: "25 de Oct, 2025",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Súper Administración Global
              </span>
              <span className="text-xs text-slate-400">Plataforma Adminis</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Bienvenido, Dueño de la Plataforma
            </h1>
            <p className="mt-1 text-sm md:text-base text-slate-300 max-w-2xl">
              Controla y gestiona todos los conjuntos residenciales registrados, asigna usuarios administradores y envía notificaciones de actualización del sistema.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/super-admin/conjuntos"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus className="h-4 w-4" />
              Nuevo Conjunto
            </Link>
            <Link
              href="/super-admin/administradores"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold text-sm transition-all"
            >
              <UserCheck className="h-4 w-4 text-emerald-400" />
              Crear Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-950 border border-slate-800 p-5 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{m.title}</span>
                <div className={`p-2.5 rounded-xl ${m.bgColor} ${m.textColor} ${m.borderColor} border`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black text-white">{m.value}</div>
                <div className="mt-1 text-xs text-slate-400">{m.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid: Recent Conjuntos & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Conjuntos & Status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-md">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-400" />
                  Conjuntos Recientes y Estado de Suscripción
                </h2>
                <p className="text-xs text-slate-400">
                  Resumen de los últimos conjuntos y estado de sus mensualidades
                </p>
              </div>
              <Link
                href="/super-admin/conjuntos"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Ver todos <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Conjunto Residencial</th>
                    <th className="py-3 px-3">Administrador</th>
                    <th className="py-3 px-3">Estado Suscripción</th>
                    <th className="py-3 px-3">Vencimiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentComplexes.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-[11px] text-slate-500">NIT: {item.nip}</div>
                      </td>
                      <td className="py-3 px-3 font-medium">
                        {item.admin === "Sin asignar" ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded">
                            <UserX className="h-3 w-3" /> Sin asignar
                          </span>
                        ) : (
                          <span className="text-slate-200">{item.admin}</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {item.status === "Al día" && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Al día
                          </span>
                        )}
                        {item.status === "Pendiente" && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Pendiente
                          </span>
                        )}
                        {item.status === "Suspendido" && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Suspendido
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                        {item.dueDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Management & System Announcement */}
        <div className="space-y-6">
          {/* Quick Access Card */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-md">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
              Módulos Principales
            </h3>

            <div className="space-y-3">
              <Link
                href="/super-admin/conjuntos"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      Gestión de Conjuntos
                    </div>
                    <div className="text-xs text-slate-400">
                      Crear, editar, suspender y eliminar conjuntos
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </Link>

              <Link
                href="/super-admin/administradores"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      Usuarios Administradores
                    </div>
                    <div className="text-xs text-slate-400">
                      Crear, asignar a conjuntos y cambiar estados
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </Link>

              <Link
                href="/super-admin/notificaciones"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <BellRing className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      Notificaciones de Plataforma
                    </div>
                    <div className="text-xs text-slate-400">
                      Enviar comunicados por actualización de página
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Alert Notice */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-800/40 p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Notificaciones a Administradores</h4>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Recuerda avisar con anticipación a los administradores de los conjuntos cuando se realicen mantenimientos o actualizaciones de la plataforma Adminis.
                </p>
                <Link
                  href="/super-admin/notificaciones"
                  className="mt-3 inline-block text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
                >
                  Redactar nueva notificación &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
