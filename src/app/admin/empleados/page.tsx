"use client";

import { useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  Search,
  Key,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Eye,
  EyeOff,
  User,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  username: string;
  role: string;
  status: "Activo" | "Inactivo";
  createdAt: string;
}

export default function EmpleadosPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "EMP-001",
      name: "Turno Vigilancia Diurno",
      username: "vigilancia_dia",
      role: "Vigilante",
      status: "Activo",
      createdAt: "10/01/2025",
    },
    {
      id: "EMP-002",
      name: "Carlos Mario Restrepo",
      username: "crestrepo",
      role: "Vigilante Principal",
      status: "Activo",
      createdAt: "15/01/2025",
    },
    {
      id: "EMP-003",
      name: "Turno Vigilancia Nocturno",
      username: "vigilancia_noche",
      role: "Vigilante",
      status: "Activo",
      createdAt: "20/01/2025",
    },
    {
      id: "EMP-004",
      name: "Auxiliar Recepción",
      username: "recepcion",
      role: "Atención al Residente",
      status: "Inactivo",
      createdAt: "01/02/2025",
    },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        username: employee.username,
        password: "", // Contraseña vacía por seguridad en edición
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: "",
        username: "",
        password: "",
      });
    }
    setShowPassword(false);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username) return;

    if (editingEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee.id
            ? {
                ...emp,
                name: formData.name,
                username: formData.username,
              }
            : emp
        )
      );
    } else {
      const newEmp: Employee = {
        id: `EMP-00${employees.length + 1}`,
        name: formData.name,
        username: formData.username,
        role: "Vigilante / Empleado",
        status: "Activo",
        createdAt: new Date().toLocaleDateString("es-CO"),
      };
      setEmployees([newEmp, ...employees]);
    }

    setShowModal(false);
  };

  const toggleStatus = (id: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id
          ? { ...emp, status: emp.status === "Activo" ? "Inactivo" : "Activo" }
          : emp
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario de empleado?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden text-slate-100">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            Gestión de Empleados y Vigilancia
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Administración de cuentas de acceso para el personal de ronderos, portería y vigilancia.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors shadow-sm w-full sm:w-auto"
        >
          <UserPlus className="h-4 w-4" />
          Crear Nuevo Empleado
        </button>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl border border-slate-800 bg-[#111827] shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-900/50">
            <User className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase block">Total Usuarios</span>
            <p className="text-2xl font-bold text-slate-100">{employees.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-[#111827] shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-900/50">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase block">Activos con Acceso</span>
            <p className="text-2xl font-bold text-slate-100">
              {employees.filter((e) => e.status === "Activo").length}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-[#111827] shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-900 text-slate-400 border border-slate-800">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase block">Inactivos</span>
            <p className="text-2xl font-bold text-slate-100">
              {employees.filter((e) => e.status === "Inactivo").length}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-[#111827] py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Tabla de Empleados */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] shadow-sm overflow-hidden max-w-full">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
            <thead className="bg-[#0f172a] border-b border-slate-800 text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-3 sm:p-4">Nombre / Descripción</th>
                <th className="p-3 sm:p-4">Nombre de Usuario</th>
                <th className="p-3 sm:p-4">Fecha Registro</th>
                <th className="p-3 sm:p-4">Estado</th>
                <th className="p-3 sm:p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 sm:p-4 font-semibold text-slate-100">
                    <div>{emp.name}</div>
                    <div className="text-[11px] font-normal text-slate-400">{emp.id}</div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className="font-mono bg-slate-900 border border-slate-800 px-2 py-1 rounded text-xs font-medium text-emerald-400">
                      @{emp.username}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-slate-400 text-xs">
                    {emp.createdAt}
                  </td>
                  <td className="p-3 sm:p-4">
                    <button
                      onClick={() => toggleStatus(emp.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        emp.status === "Activo"
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/50"
                          : "bg-slate-900 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {emp.status === "Activo" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-slate-500" />
                      )}
                      {emp.status}
                    </button>
                  </td>
                  <td className="p-3 sm:p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(emp)}
                      title="Editar usuario o restablecer contraseña"
                      className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      title="Eliminar usuario"
                      className="p-1.5 rounded-lg border border-red-950 bg-red-950/30 text-red-400 hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Crear/Editar Empleado */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 overflow-y-auto backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-[#111827] p-5 sm:p-6 shadow-2xl border border-slate-800 my-auto text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Key className="h-5 w-5 text-emerald-400" />
                {editingEmployee ? "Modificar Empleado" : "Crear Usuario de Empleado"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Nombre del Empleado o Turno
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Turno Noche / Juan Perez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Nombre de Usuario (Login)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: vigilante_dia"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value.toLowerCase().trim() })
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-100 font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  {editingEmployee
                    ? "Nueva Contraseña (dejar en blanco para no modificar)"
                    : "Contraseña de Acceso"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!editingEmployee}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 pr-10 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                💡 Este usuario tendrá permisos exclusivos de recepción, control de visitantes, paquetería y autorizaciones de trasteos.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-800 text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-600 transition-colors"
                >
                  {editingEmployee ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
