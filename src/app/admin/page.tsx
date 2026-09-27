"use client";

import {
  Car,
  PackageCheck,
  CalendarDays,
  Truck,
  Users,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    {
      title: "Visitantes Activos",
      value: "5",
      subtitle: "3 vehiculares / 2 peatonales",
      icon: Car,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400",
      href: "/admin/visitantes",
    },
    {
      title: "Paquetes Pendientes",
      value: "8",
      subtitle: "Recibidos hoy en portería",
      icon: PackageCheck,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400",
      href: "/admin/paqueteria",
    },
    {
      title: "Trasteos por Revisar",
      value: "3",
      subtitle: "Pendientes de aprobación",
      icon: Truck,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400",
      href: "/admin/trasteos",
    },
    {
      title: "Reservas Zonas Comunes",
      value: "2",
      subtitle: "Salón social & BBQ este fin de semana",
      icon: CalendarDays,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400",
      href: "/admin/zonas-comunes",
    },
  ];

  const recentTrasteos = [
    {
      id: "MUD-01",
      resident: "Carlos Mendoza (Torre 2 - Apt 402)",
      type: "Entrada de Trasteo",
      date: "Mañana, 09:00 AM",
      status: "Pendiente",
    },
    {
      id: "MUD-02",
      resident: "Lucía Ramírez (Torre 1 - Apt 205)",
      type: "Salida de Trasteo",
      date: "Sábado, 02:00 PM",
      status: "Aprobado",
    },
    {
      id: "MUD-03",
      resident: "Andrés Gómez (Torre 3 - Apt 801)",
      type: "Entrada de Trasteo",
      date: "Domingo, 10:00 AM",
      status: "Pendiente",
    },
  ];

  const activeAnnouncements = [
    {
      id: "ANC-01",
      title: "Mantenimiento preventivo del ascensor Torre 2",
      expires: "Vence en 2 días",
      category: "Mantenimiento",
    },
    {
      id: "ANC-02",
      title: "Asamblea extraordinaria de propietarios - Salón Social",
      expires: "Vence en 5 días",
      category: "Reunión",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 md:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Conjunto Residencial Bosques del Sol</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              ¡Bienvenido, Administrador!
            </h1>
            <p className="mt-1 text-slate-300 text-sm max-w-xl">
              Aquí tienes un resumen actualizado del estado operativo del conjunto: parqueaderos, paquetes, trasteos y avisos comunitarios.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/trasteos"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md"
            >
              <Truck className="h-4 w-4" />
              Revisar Trasteos (3)
            </Link>
            <Link
              href="/admin/anuncios"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <Plus className="h-4 w-4" />
              Nuevo Anuncio
            </Link>
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas de Estado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              href={stat.href}
              className="group flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {stat.value}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {stat.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Secciones secundarias: Trasteos Pendientes y Anuncios Vigentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Trasteos Pendientes */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                Autorizaciones de Trasteo Recientes
              </h2>
              <p className="text-xs text-muted-foreground">
                Solicitudes enviadas por propietarios/inquilinos
              </p>
            </div>
            <Link
              href="/admin/trasteos"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              Ver todas <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTrasteos.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {item.resident}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {item.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      item.status === "Aprobado"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Avisos Activos con Control de Expiración */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  Publicaciones Vigentes
                </h2>
                <p className="text-xs text-muted-foreground">
                  Sincronizado con Supabase
                </p>
              </div>
              <Link
                href="/admin/anuncios"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                Gestionar <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {activeAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    <span>{ann.category}</span>
                    <span className="text-muted-foreground font-normal">
                      {ann.expires}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                    {ann.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Limpieza de anuncios exp. activa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
