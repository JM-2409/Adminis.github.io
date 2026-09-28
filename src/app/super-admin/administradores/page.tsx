"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  Building2,
  UserCheck,
  UserX,
  ShieldCheck,
  Key,
  AlertCircle,
  Eye,
  EyeOff,
  Link2,
} from "lucide-react";

interface AdminUser {
  id: string;
  full_name: string;
  username: string;
  password_mask: string;
  email: string;
  phone: string;
  address: string;
  complex_id: string | null;
  complex_name: string | null;
  status: "Activo" | "Suspendido";
  created_at: string;
}

interface ComplexOption {
  id: string;
  name: string;
}

const mockComplexOptions: ComplexOption[] = [
  { id: "1", name: "Conjunto Residencial Bosques del Sol" },
  { id: "2", name: "Torres de San Juan" },
  { id: "3", name: "Altos del Portal I" },
  { id: "4", name: "Quintas de la Alborada" },
];

const initialAdmins: AdminUser[] = [
  {
    id: "101",
    full_name: "Carlos Eduardo Mendoza",
    username: "cmendoza_admin",
    password_mask: "••••••••",
    email: "carlos.mendoza@bosquesdelsol.com",
    phone: "3101234567",
    address: "Calle 100 # 15 - 20, Apto 402, Bogotá",
    complex_id: "1",
    complex_name: "Conjunto Residencial Bosques del Sol",
    status: "Activo",
    created_at: "2024-01-16",
  },
  {
    id: "102",
    full_name: "Mariana Restrepo Calle",
    username: "mrestrepo_admin",
    password_mask: "••••••••",
    email: "mariana.restrepo@torresdesanjuan.co",
    phone: "3009876543",
    address: "Carrera 30 # 10 - 05, Medellín",
    complex_id: "2",
    complex_name: "Torres de San Juan",
    status: "Activo",
    created_at: "2024-02-12",
  },
  {
    id: "103",
    full_name: "Roberto Gómez Bolaños",
    username: "rgomez_admin",
    password_mask: "••••••••",
    email: "roberto.gomez@alborada.com",
    phone: "3187776655",
    address: "Calle 50 # 12 - 44, Bucaramanga",
    complex_id: "4",
    complex_name: "Quintas de la Alborada",
    status: "Suspendido",
    created_at: "2024-04-15",
  },
  {
    id: "104",
    full_name: "Andrea Patricia Silva",
    username: "asilva_admin",
    password_mask: "••••••••",
    email: "andrea.silva@email.com",
    phone: "3201112233",
    address: "Avenida 19 # 100 - 10, Bogotá",
    complex_id: null,
    complex_name: null,
    status: "Activo",
    created_at: "2024-05-01",
  },
];

export default function AdministradoresPage() {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    complex_id: "" as string,
    status: "Activo" as "Activo" | "Suspendido",
  });

  // Delete modal state
  const [deletingAdmin, setDeletingAdmin] = useState<AdminUser | null>(null);

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingAdmin(null);
    setFormData({
      full_name: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      address: "",
      complex_id: "",
      status: "Activo",
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      full_name: admin.full_name,
      username: admin.username,
      password: "password123", // placeholder for editing
      email: admin.email,
      phone: admin.phone,
      address: admin.address,
      complex_id: admin.complex_id || "",
      status: admin.status,
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedComplex = mockComplexOptions.find((c) => c.id === formData.complex_id);

    if (editingAdmin) {
      // Update
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === editingAdmin.id
            ? {
                ...a,
                full_name: formData.full_name,
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                complex_id: formData.complex_id || null,
                complex_name: selectedComplex ? selectedComplex.name : null,
                status: formData.status,
              }
            : a
        )
      );
    } else {
      // Create
      const newAdmin: AdminUser = {
        id: Date.now().toString(),
        full_name: formData.full_name,
        username: formData.username,
        password_mask: "••••••••",
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        complex_id: formData.complex_id || null,
        complex_name: selectedComplex ? selectedComplex.name : null,
        status: formData.status,
        created_at: new Date().toISOString().split("T")[0],
      };
      setAdmins((prev) => [newAdmin, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteAdmin = () => {
    if (!deletingAdmin) return;
    setAdmins((prev) => prev.filter((a) => a.id !== deletingAdmin.id));
    setDeletingAdmin(null);
  };

  const toggleAdminStatus = (admin: AdminUser) => {
    const newStatus = admin.status === "Activo" ? "Suspendido" : "Activo";
    setAdmins((prev) =>
      prev.map((a) => (a.id === admin.id ? { ...a, status: newStatus } : a))
    );
  };

  // Filter admins
  const filteredAdmins = admins.filter((a) => {
    const matchesSearch =
      a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.complex_name && a.complex_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "todos" || a.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Súper Admin
            </span>
            <span className="text-xs text-slate-400">Plataforma Global</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-indigo-400" />
            Gestión de Usuarios Administradores
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Crea administradores, gestiona sus datos de acceso y asígnalos a cada conjunto residencial.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <Plus className="h-5 w-5" />
          Crear Nuevo Administrador
        </button>
      </div>

      {/* Search Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, usuario, correo o conjunto..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Estado:</span>
          {["todos", "Activo", "Suspendido"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-white border border-slate-800"
              }`}
            >
              {st === "todos" ? "Todos" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Administrators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredAdmins.map((admin) => (
          <div
            key={admin.id}
            className="rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all p-5 shadow-md flex flex-col justify-between space-y-4"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-bold text-sm shadow">
                  {admin.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {admin.full_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-indigo-300">
                      @{admin.username}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {admin.status === "Activo" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <UserCheck className="h-3.5 w-3.5" /> Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <UserX className="h-3.5 w-3.5" /> Suspendido
                  </span>
                )}
              </div>
            </div>

            {/* Assigned Conjunto Badge */}
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs">
              <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider mb-1">
                Conjunto Asignado:
              </span>
              {admin.complex_name ? (
                <div className="flex items-center gap-2 text-indigo-200 font-semibold">
                  <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="truncate">{admin.complex_name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <UserX className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Sin conjunto asignado actualmente</span>
                </div>
              )}
            </div>

            {/* Admin details list */}
            <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate font-mono text-slate-300">{admin.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="font-mono text-slate-300">{admin.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{admin.address || "No especificada"}</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                <Key className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Contraseña: <strong className="font-mono text-slate-300">{admin.password_mask}</strong></span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => toggleAdminStatus(admin)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  admin.status === "Suspendido"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900"
                    : "bg-amber-950/60 text-amber-300 border border-amber-800/60 hover:bg-amber-900/60"
                }`}
              >
                {admin.status === "Suspendido" ? "Reactivar Admin" : "Suspender Admin"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(admin)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  title="Editar administrador"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeletingAdmin(admin)}
                  className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition-colors"
                  title="Eliminar administrador"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAdmins.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400">
            <Users className="h-12 w-12 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No se encontraron usuarios administradores</p>
            <p className="text-xs text-slate-500 mt-1">Prueba cambiando el término de búsqueda o crea un nuevo usuario.</p>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-400" />
                {editingAdmin ? "Editar Usuario Administrador" : "Crear Usuario Administrador"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Nombre Completo del Administrador *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Ej: Carlos Eduardo Mendoza"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Usuario de Acceso *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Ej: cmendoza_admin"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!editingAdmin}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ej: carlos@bosquesdelsol.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Celular *
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
                  Dirección del Administrador
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ej: Calle 100 # 15 - 20, Bogotá"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Asignar Conjunto Residencial
                  </label>
                  <select
                    value={formData.complex_id}
                    onChange={(e) => setFormData({ ...formData, complex_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Sin conjunto asignado --</option>
                    {mockComplexOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Estado Inicial
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Activo" | "Suspendido",
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Suspendido">Suspendido</option>
                  </select>
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
                  {editingAdmin ? "Guardar Cambios" : "Crear Administrador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">¿Eliminar Usuario Administrador?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ¿Estás seguro de que deseas eliminar a{" "}
              <strong className="text-white">{deletingAdmin.full_name}</strong> (@{deletingAdmin.username})? Esta acción removerá su acceso administrativo.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingAdmin(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAdmin}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md transition-colors"
              >
                Sí, Eliminar Administrador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
