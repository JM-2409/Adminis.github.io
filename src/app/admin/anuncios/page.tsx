"use client";

import { useState } from "react";
import {
  Plus,
  Clock,
  Trash2,
  Calendar,
  X,
  Database,
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "General" | "Mantenimiento" | "Asamblea" | "Urgente";
  createdAt: string;
  expiresAt: string;
  durationDays: number;
  isExpired: boolean;
}

type AnnouncementCategory = "General" | "Mantenimiento" | "Asamblea" | "Urgente";

export default function AnunciosPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "ANC-001",
      title: "Mantenimiento preventivo del ascensor Torre 2",
      content:
        "Se realizará mantenimiento técnico el día jueves de 08:00 AM a 12:00 PM. Por favor usar las escaleras de emergencia.",
      category: "Mantenimiento",
      createdAt: "2025-04-01",
      expiresAt: "2025-04-05",
      durationDays: 4,
      isExpired: false,
    },
    {
      id: "ANC-002",
      title: "Asamblea extraordinaria de propietarios",
      content:
        "Convocatoria oficial para la asamblea presencial en el Salón Social este sábado a las 05:00 PM.",
      category: "Asamblea",
      createdAt: "2025-04-02",
      expiresAt: "2025-04-09",
      durationDays: 7,
      isExpired: false,
    },
    {
      id: "ANC-003",
      title: "Corte programado de agua por lavado de tanques",
      content:
        "El servicio de agua estará suspendido el pasado lunes de 09:00 AM a 01:00 PM.",
      category: "Urgente",
      createdAt: "2025-03-20",
      expiresAt: "2025-03-21",
      durationDays: 1,
      isExpired: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General" as AnnouncementCategory,
    durationDays: 3,
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + formData.durationDays);

    const newAnn: Announcement = {
      id: `ANC-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      createdAt: now.toISOString().split("T")[0],
      expiresAt: expiry.toISOString().split("T")[0],
      durationDays: formData.durationDays,
      isExpired: false,
    };

    setAnnouncements([newAnn, ...announcements]);
    setShowModal(false);
    setFormData({
      title: "",
      content: "",
      category: "General",
      durationDays: 3,
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const purgeExpired = () => {
    setAnnouncements(announcements.filter((a) => !a.isExpired));
  };

  const expiredCount = announcements.filter((a) => a.isExpired).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Anuncios y Publicaciones con Expiración
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Crea comunicados temporales para residentes. Se eliminan o archivan según la vigencia seleccionada para optimizar almacenamiento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {expiredCount > 0 && (
            <button
              onClick={purgeExpired}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3.5 py-2.5 text-xs font-semibold transition-colors"
            >
              <Trash2 className="h-4 w-4 text-rose-500" />
              Depurar Expirados ({expiredCount})
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nueva Publicación
          </button>
        </div>
      </div>

      {/* Banner de Optimización de Supabase */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs">
        <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
        <div>
          <span className="font-bold">Optimizado para Supabase Free Tier:</span> Los avisos cuentan con fecha de caducidad automática para evitar saturar la base de datos de almacenamiento.
        </div>
      </div>

      {/* Grid de Comunicados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className={`rounded-2xl border bg-card p-5 shadow-sm flex flex-col justify-between space-y-4 relative ${
              a.isExpired ? "opacity-60 bg-slate-50 dark:bg-slate-900/50" : ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    a.category === "Urgente"
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                      : a.category === "Mantenimiento"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  }`}
                >
                  {a.category}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      a.isExpired
                        ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {a.isExpired ? "Expirado" : `Vigente ${a.durationDays} días`}
                  </span>

                  <button
                    onClick={() => deleteAnnouncement(a.id)}
                    className="p-1 rounded text-muted-foreground hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Eliminar publicación"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {a.title}
              </h3>

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {a.content}
              </p>
            </div>

            <div className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Publicado: {a.createdAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Vence: {a.expiresAt}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear Anuncio */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl border">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">Nueva Publicación para Residentes</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as AnnouncementCategory })
                  }
                  className="w-full rounded-xl border bg-card p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="General">General</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Asamblea">Asamblea</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Título de la Publicación
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mantenimiento de bombas de agua"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border bg-card p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Contenido del Mensaje
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escriba aquí los detalles del aviso..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full rounded-xl border bg-card p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Duración / Expiración (Días de publicación)
                </label>
                <select
                  value={formData.durationDays}
                  onChange={(e) =>
                    setFormData({ ...formData, durationDays: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border bg-card p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value={1}>1 Día (Aviso Express)</option>
                  <option value={3}>3 Días (Estándar)</option>
                  <option value={7}>7 Días (1 Semana)</option>
                  <option value={15}>15 Días (Quincenal)</option>
                  <option value={30}>30 Días (Mensual)</option>
                </select>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Al finalizar el periodo, la publicación se desactiva para mantener liviana la base de datos.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90"
                >
                  Publicar Anuncio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
