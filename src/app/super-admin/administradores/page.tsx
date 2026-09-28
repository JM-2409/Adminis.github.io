"use client";

import { useState, useEffect } from "react";
import { Users, Plus, CheckCircle, AlertCircle, Building2 } from "lucide-react";

interface Complex {
  id: string;
  name: string;
}

interface AdminUser {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  complexes?: { name: string } | null;
}

export default function AdministradoresPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    phone: "",
    complex_id: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAdmins, resComplexes] = await Promise.all([
        fetch("/api/super-admin/admins"),
        fetch("/api/super-admin/complexes"),
      ]);

      const dataAdmins = await resAdmins.json();
      const dataComplexes = await resComplexes.json();

      if (resAdmins.ok) setAdmins(dataAdmins.admins || []);
      if (resComplexes.ok) setComplexes(dataComplexes.complexes || []);
    } catch {
      setMessage({ type: "error", text: "Error al cargar administradores" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/super-admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear usuario administrador");

      setMessage({ type: "success", text: "Administrador creado y asignado con éxito" });
      setShowModal(false);
      setFormData({ username: "", password: "", full_name: "", email: "", phone: "", complex_id: "" });
      fetchData();
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
          <h1 className="text-2xl font-bold text-white">Usuarios Administradores</h1>
          <p className="text-slate-400 text-sm">
            Asigne administradores a los conjuntos residenciales
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition"
        >
          <Plus className="w-4 h-4" /> Crear Administrador
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

      {loading ? (
        <p className="text-slate-400 text-sm">Cargando usuarios...</p>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Nombre Completo</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Conjunto Asignado</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3 rounded-r-lg">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {admins.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-900/50">
                    <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                      {a.full_name}
                    </td>
                    <td className="px-4 py-3 text-slate-400">@{a.username}</td>
                    <td className="px-4 py-3 text-indigo-300 flex items-center gap-1.5 font-medium">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      {a.complexes?.name || "Sin Conjunto"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      <div>{a.email}</div>
                      <div>{a.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-white">Crear Usuario Administrador</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Ej: Carlos Gómez"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Nombre de Usuario (Login)</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Ej: admin_mirador"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Conjunto Residencial</label>
                <select
                  required
                  value={formData.complex_id}
                  onChange={(e) => setFormData({ ...formData, complex_id: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="">Seleccione un conjunto...</option>
                  {complexes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="carlos@email.com"
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
                  placeholder="+57 300 1234567"
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {submitting ? "Creando..." : "Crear Administrador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
