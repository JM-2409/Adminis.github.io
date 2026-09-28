"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Power,
} from "lucide-react";

interface Complex {
  id: string;
  name: string;
  nip: string;
  address: string;
  email: string;
  phone: string;
  subscription_status: "Al día" | "Pendiente" | "Suspendido";
  subscription_due_date: string;
  created_at: string;
}

const initialComplexes: Complex[] = [
  {
    id: "1",
    name: "Conjunto Residencial Bosques del Sol",
    nip: "900.123.456-1",
    address: "Calle 145 # 12 - 34, Bogotá",
    email: "administracion@bosquesdelsol.com",
    phone: "3101234567",
    subscription_status: "Al día",
    subscription_due_date: "2025-11-15",
    created_at: "2024-01-15",
  },
  {
    id: "2",
    name: "Torres de San Juan",
    nip: "901.888.234-9",
    address: "Carrera 43A # 18 Sur - 20, Medellín",
    email: "contacto@torresdesanjuan.co",
    phone: "3009876543",
    subscription_status: "Al día",
    subscription_due_date: "2025-11-20",
    created_at: "2024-02-10",
  },
  {
    id: "3",
    name: "Altos del Portal I",
    nip: "800.555.789-3",
    address: "Avenida Pasoancho # 80 - 15, Cali",
    email: "admin@altosdelportal.org",
    phone: "3154443322",
    subscription_status: "Pendiente",
    subscription_due_date: "2025-11-02",
    created_at: "2024-03-01",
  },
  {
    id: "4",
    name: "Quintas de la Alborada",
    nip: "900.999.111-0",
    address: "Calle 36 # 22 - 08, Bucaramanga",
    email: "administracion@alborada.com",
    phone: "3187776655",
    subscription_status: "Suspendido",
    subscription_due_date: "2025-10-25",
    created_at: "2024-04-12",
  },
];

export default function ConjuntosPage() {
  const [complexes, setComplexes] = useState<Complex[]>(initialComplexes);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComplex, setEditingComplex] = useState<Complex | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    address: "",
    email: "",
    phone: "",
    subscription_status: "Al día" as "Al día" | "Pendiente" | "Suspendido",
    subscription_due_date: new Date().toISOString().split("T")[0],
  });

  // Delete modal state
  const [deletingComplex, setDeletingComplex] = useState<Complex | null>(null);

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingComplex(null);
    setFormData({
      name: "",
      nip: "",
      address: "",
      email: "",
      phone: "",
      subscription_status: "Al día",
      subscription_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (complex: Complex) => {
    setEditingComplex(complex);
    setFormData({
      name: complex.name,
      nip: complex.nip,
      address: complex.address,
      email: complex.email,
      phone: complex.phone,
      subscription_status: complex.subscription_status,
      subscription_due_date: complex.subscription_due_date,
    });
    setIsModalOpen(true);
  };

  const handleSaveComplex = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingComplex) {
      // Update existing
      setComplexes((prev) =>
        prev.map((c) =>
          c.id === editingComplex.id
            ? {
                ...c,
                name: formData.name,
                nip: formData.nip,
                address: formData.address,
                email: formData.email,
                phone: formData.phone,
                subscription_status: formData.subscription_status,
                subscription_due_date: formData.subscription_due_date,
              }
            : c
        )
      );
    } else {
      // Create new
      const newComplex: Complex = {
        id: Date.now().toString(),
        name: formData.name,
        nip: formData.nip,
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
        subscription_status: formData.subscription_status,
        subscription_due_date: formData.subscription_due_date,
        created_at: new Date().toISOString().split("T")[0],
      };
      setComplexes((prev) => [newComplex, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteComplex = () => {
    if (!deletingComplex) return;
    setComplexes((prev) => prev.filter((c) => c.id !== deletingComplex.id));
    setDeletingComplex(null);
  };

  const toggleStatus = (complex: Complex) => {
    const nextStatusMap: Record<string, "Al día" | "Suspendido"> = {
      "Al día": "Suspendido",
      Pendiente: "Al día",
      Suspendido: "Al día",
    };
    const newStatus = nextStatusMap[complex.subscription_status] || "Al día";

    setComplexes((prev) =>
      prev.map((c) => (c.id === complex.id ? { ...c, subscription_status: newStatus } : c))
    );
  };

  // Filter complexes
  const filteredComplexes = complexes.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "todos" || c.subscription_status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Súper Admin
            </span>
            <span className="text-xs text-slate-400">Plataforma Global</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="h-7 w-7 text-indigo-400" />
            Gestión de Conjuntos Residenciales
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Crea, modifica, suspende o elimina conjuntos registrados en la plataforma.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <Plus className="h-5 w-5" />
          Registrar Nuevo Conjunto
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, NIT, dirección o correo..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Filtrar por estado:</span>
          {["todos", "Al día", "Pendiente", "Suspendido"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-white border border-slate-800"
              }`}
            >
              {st === "todos" ? "Todos los conjuntos" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Complexes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredComplexes.map((complex) => (
          <div
            key={complex.id}
            className="rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all p-5 shadow-md flex flex-col justify-between space-y-4"
          >
            {/* Top header of card */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {complex.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-indigo-300">
                      NIT: {complex.nip}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {complex.subscription_status === "Al día" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Al día
                  </span>
                )}
                {complex.subscription_status === "Pendiente" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock className="h-3.5 w-3.5" /> Pendiente
                  </span>
                )}
                {complex.subscription_status === "Suspendido" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <XCircle className="h-3.5 w-3.5" /> Suspendido
                  </span>
                )}
              </div>
            </div>

            {/* Details list */}
            <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{complex.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate font-mono text-slate-300">{complex.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="font-mono text-slate-300">{complex.phone}</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Vencimiento suscripción: <strong className="text-slate-200">{complex.subscription_due_date}</strong></span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => toggleStatus(complex)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  complex.subscription_status === "Suspendido"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900"
                    : "bg-amber-950/60 text-amber-300 border border-amber-800/60 hover:bg-amber-900/60"
                }`}
              >
                <Power className="h-3.5 w-3.5" />
                {complex.subscription_status === "Suspendido" ? "Reactivar Servicio" : "Suspender Servicio"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(complex)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  title="Editar conjunto"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeletingComplex(complex)}
                  className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition-colors"
                  title="Eliminar conjunto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredComplexes.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400">
            <Building2 className="h-12 w-12 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No se encontraron conjuntos</p>
            <p className="text-xs text-slate-500 mt-1">Prueba cambiando el término de búsqueda o registra un nuevo conjunto.</p>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-400" />
                {editingComplex ? "Editar Conjunto Residencial" : "Registrar Nuevo Conjunto"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveComplex} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Nombre del Conjunto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Conjunto Residencial Bosques del Sol"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    NIT / NIP *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="Ej: 900.123.456-1"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Celular / Teléfono *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ej: 3101234567"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ej: administracion@bosquesdelsol.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Dirección Completa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ej: Calle 145 # 12 - 34, Bogotá"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Estado de Suscripción
                  </label>
                  <select
                    value={formData.subscription_status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subscription_status: e.target.value as "Al día" | "Pendiente" | "Suspendido",
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Al día">Al día</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Suspendido">Suspendido</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Fecha Vencimiento Suscripción
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.subscription_due_date}
                    onChange={(e) =>
                      setFormData({ ...formData, subscription_due_date: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
                >
                  {editingComplex ? "Guardar Cambios" : "Crear Conjunto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingComplex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">¿Eliminar Conjunto Residencial?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ¿Estás seguro de que deseas eliminar permanentemente el conjunto{" "}
              <strong className="text-white">{deletingComplex.name}</strong> (NIT: {deletingComplex.nip})? Esta acción removerá el acceso de la plataforma.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingComplex(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteComplex}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md transition-colors"
              >
                Sí, Eliminar Conjunto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
