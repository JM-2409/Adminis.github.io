"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function NotificacionesPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Actualización");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTitle("");
      setMessage("");
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Notificaciones de Sistema</h1>
        <p className="text-slate-400 text-sm">
          Envíe comunicados globales e informativos a todos los administradores de conjuntos
        </p>
      </div>

      {sent && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Notificación global emitida con éxito a todos los administradores.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1">Título del Anuncio</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Mantenimiento programado de plataforma"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
          >
            <option value="Actualización">Actualización del Sistema</option>
            <option value="Mantenimiento">Mantenimiento de Servidores</option>
            <option value="Urgente">Urgente / Importante</option>
            <option value="Informativo">Boletín Informativo</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1">Mensaje o Detalle</label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describa los detalles para los administradores..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {sending ? "Enviando..." : "Emitir Notificación"}
        </button>
      </form>
    </div>
  );
}
