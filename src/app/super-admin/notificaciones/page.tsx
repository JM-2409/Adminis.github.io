"use client";

import { useState } from "react";
import {
  BellRing,
  Send,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Info,
  Layers,
  History,
  ShieldAlert,
} from "lucide-react";

interface SystemNotification {
  id: string;
  title: string;
  category: "Actualización" | "Mantenimiento" | "Urgente" | "Informativo";
  message: string;
  sent_at: string;
  recipientsCount: number;
}

const initialNotifications: SystemNotification[] = [
  {
    id: "1",
    title: "Lanzamiento de Nueva Interfaz v2.4",
    category: "Actualización",
    message:
      "Estimados administradores: Hemos optimizado la velocidad de carga del panel de paquetería y parqueaderos. Además se ha habilitado el nuevo rol de Dueño de Plataforma.",
    sent_at: "2025-10-30 09:30 AM",
    recipientsCount: 16,
  },
  {
    id: "2",
    title: "Mantenimiento Programado de Servidores",
    category: "Mantenimiento",
    message:
      "Se realizará una ventana de mantenimiento el próximo domingo entre las 2:00 AM y 4:00 AM. El servicio del portal de residentes y administración no estará disponible durante este lapso.",
    sent_at: "2025-10-25 04:15 PM",
    recipientsCount: 16,
  },
  {
    id: "3",
    title: "Recordatorio: Actualización de Contraseñas de Administradores",
    category: "Urgente",
    message:
      "Por políticas de seguridad global, recomendamos renovar las credenciales de acceso de sus usuarios administrativos cada 90 días.",
    sent_at: "2025-10-10 11:00 AM",
    recipientsCount: 16,
  },
];

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Actualización" as "Actualización" | "Mantenimiento" | "Urgente" | "Informativo",
    message: "",
  });

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) return;

    const newNotif: SystemNotification = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      message: formData.message,
      sent_at: new Date().toLocaleString("es-CO", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      recipientsCount: 16,
    };

    setNotifications([newNotif, ...notifications]);
    setFormData({ title: "", category: "Actualización", message: "" });
    setIsSuccessAlert(true);
    setTimeout(() => setIsSuccessAlert(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Súper Admin
            </span>
            <span className="text-xs text-slate-400">Canal Directo</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BellRing className="h-7 w-7 text-amber-400" />
            Notificaciones y Comunicados del Sistema
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Envía avisos de actualizaciones, mantenimientos o novedades directamente a todos los administradores de conjuntos.
          </p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Destinatarios: 16 Administradores Activos</span>
        </div>
      </div>

      {/* Grid: Compose Form & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Compose Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-md">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Send className="h-5 w-5 text-indigo-400" />
              Redactar Notificación
            </h2>

            {isSuccessAlert && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>¡Notificación enviada con éxito a los administradores!</span>
              </div>
            )}

            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Título del Comunicado *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Actualización del Portal v2.5"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Categoría / Tipo de Aviso
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as
                        | "Actualización"
                        | "Mantenimiento"
                        | "Urgente"
                        | "Informativo",
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Actualización">✨ Actualización de Plataforma</option>
                  <option value="Mantenimiento">🔧 Mantenimiento Programado</option>
                  <option value="Urgente">🚨 Aviso Urgente / Seguridad</option>
                  <option value="Informativo">📢 Informativo General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Mensaje Detallado *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe los cambios, fechas de mantenimiento o información relevante para los administradores de cada conjunto..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Enviar Notificación Ahora
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Notification History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-md">
            <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <History className="h-5 w-5 text-amber-400" />
                  Historial de Notificaciones Emitidas
                </h2>
                <p className="text-xs text-slate-400">
                  Registro de todos los comunicados enviados desde este portal
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                {notifications.length} enviadas
              </span>
            </div>

            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {notif.category === "Actualización" && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" /> Actualización
                        </span>
                      )}
                      {notif.category === "Mantenimiento" && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> Mantenimiento
                        </span>
                      )}
                      {notif.category === "Urgente" && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                          <ShieldAlert className="h-3.5 w-3.5" /> Urgente
                        </span>
                      )}
                      {notif.category === "Informativo" && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                          <Info className="h-3.5 w-3.5" /> Informativo
                        </span>
                      )}

                      <span className="text-[11px] text-slate-500 font-mono">
                        {notif.sent_at}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                      Enviado a {notif.recipientsCount} administradores
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{notif.title}</h3>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                    {notif.message}
                  </p>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="py-12 text-center text-slate-500">
                  <BellRing className="h-10 w-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm font-semibold text-slate-400">No hay notificaciones enviadas aún</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
