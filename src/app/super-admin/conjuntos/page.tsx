"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, CheckCircle, AlertCircle } from "lucide-react";

interface Complex {
  id: string;
  name: string;
  nip: string;
  address: string;
  email: string;
  phone: string;
  subscription_status: string;
}

export default function ConjuntosPage() {
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    address: "",
    email: "",
    phone: "",
    subscription_status: "Al día",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchComplexes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/super-admin/complexes");
      const data = await res.json();
      if (res.ok) {
        setComplexes(data.complexes || []);
      }
    } catch {
      setMessage({ type: "error", text: "Error al cargar los conjuntos" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplexes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/super-admin/complexes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al crear conjunto");

      setMessage({ type: "success", text: "Conjunto residencial registrado con éxito" });
      setShowModal(false);
      setFormData({ name: "", nip: "", address: "", email: "", phone: "", subscription_status: "Al día" });
      fetchComplexes();
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Error al procesar" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Conjuntos Residenciales</h1>
          <p className="text-slate-400 text-sm">
            Administre los conjuntos registrados en la plataforma
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition"
        >
          <Plus className="w-4 h-4" /> Registrar Nuevo Conjunto
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid of Complexes */}
      {loading ? (
        <p className="text-slate-400 text-sm">Cargando conjuntos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complexes.map((c) => (
            <div key={c.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                  <Building2 className="w-6 h-6" />
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    c.subscription_status === "Al día"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {c.subscription_status}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{c.name}</h3>
                <p className="text-xs text-slate-400 font-medium">NIP/NIT: {c.nip}</p>
              </div>
              <div className="text-xs text-slate-300 space-y-1 border-t border-slate-900 pt-3">
                <p><span className="text-slate-500">Dirección:</span> {c.address}</p>
                <p><span className="text-slate-500">Email:</span> {c.email}</p>
                <p><span className="text-slate-500">Teléfono:</span> {c.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-white">Registrar Nuevo Conjunto</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-slate-300 mb-1">Nombre del Conjunto</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Conjunto Residencial Torres del Sol"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">NIP / NIT</label>
                <input
                  type="text"
                  required
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  placeholder="Ej: 900123456-7"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Dirección</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ej: Calle 123 # 45-67"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email de Contacto</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@conjunto.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Teléfono</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+57 300 0000000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {submitting ? "Guardando..." : "Guardar Conjunto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
