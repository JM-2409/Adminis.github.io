'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, Users, ShieldCheck, Plus, Edit, CheckCircle, AlertTriangle, XCircle, LogOut, RefreshCw, KeyRound, UserPlus
} from 'lucide-react';

interface Conjunto {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  telefono: string;
  email_contacto: string;
  estado_suscripcion: 'activa' | 'suspendida' | 'vencida' | 'prueba';
  plan: 'basico' | 'pro' | 'enterprise';
  max_unidades: number;
  max_parqueaderos_visitantes: number;
  created_at: string;
}

interface AppUser {
  id: string;
  username: string;
  full_name: string;
  role: string;
  conjunto_id: string | null;
  activo: boolean;
  created_at: string;
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [conjuntos, setConjuntos] = useState<Conjunto[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  // New Conjunto modal state
  const [showConjuntoModal, setShowConjuntoModal] = useState(false);
  const [newNombre, setNewNombre] = useState('');
  const [newDireccion, setNewDireccion] = useState('');
  const [newCiudad, setNewCiudad] = useState('Bogota');
  const [newNit, setNewNit] = useState('');
  const [newTelefono, setNewTelefono] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPlan, setNewPlan] = useState<'basico' | 'pro' | 'enterprise'>('pro');

  // Edit Conjunto modal state
  const [editingConjunto, setEditingConjunto] = useState<Conjunto | null>(null);

  // New Admin user modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedConjuntoId, setSelectedConjuntoId] = useState('');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/super-admin/conjuntos');
      if (res.ok) {
        const data = await res.json();
        setConjuntos(data.conjuntos || []);
        setUsers(data.users || []);
      }
    } catch {
      setErrorMsg('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleCreateConjunto = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/super-admin/conjuntos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: newNombre,
          direccion: newDireccion,
          ciudad: newCiudad,
          nit: newNit,
          telefono: newTelefono,
          email_contacto: newEmail,
          plan: newPlan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error al crear conjunto');
        return;
      }

      setMessage('Conjunto creado exitosamente');
      setShowConjuntoModal(false);
      setNewNombre('');
      setNewDireccion('');
      setNewNit('');
      setNewTelefono('');
      setNewEmail('');
      fetchData();
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  const handleUpdateConjunto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConjunto) return;

    try {
      const res = await fetch('/api/super-admin/conjuntos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingConjunto),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error al actualizar conjunto');
        return;
      }

      setMessage('Conjunto actualizado');
      setEditingConjunto(null);
      fetchData();
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/super-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: adminFullName,
          username: adminUsername,
          password: adminPassword,
          conjunto_id: selectedConjuntoId,
          role: 'administracion',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error al crear administrador');
        return;
      }

      setMessage('Administrador creado con éxito');
      setShowAdminModal(false);
      setAdminFullName('');
      setAdminUsername('');
      setAdminPassword('');
      fetchData();
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">ParkControl Total</h1>
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
              Panel Super Administrador Global
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchData}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Recargar datos"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-300 px-3.5 py-2 rounded-xl border border-slate-700 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {message && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
            {message}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
              <span>Total Conjuntos</span>
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">{conjuntos.length}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
              <span>Conjuntos Activos</span>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {conjuntos.filter((c) => c.estado_suscripcion === 'activa').length}
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
              <span>Administradores</span>
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {users.filter((u) => u.role === 'administracion').length}
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
              <span>Total Usuarios</span>
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">{users.length}</p>
          </div>
        </div>

        {/* Conjuntos Section Header */}
        <div className="flex justify-between items-center pt-2">
          <div>
            <h2 className="text-xl font-bold text-white">Gestión de Conjuntos Residenciales</h2>
            <p className="text-sm text-slate-400">Crea, edita y administra los conjuntos registrados en la plataforma</p>
          </div>
          <button
            onClick={() => setShowConjuntoModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Conjunto</span>
          </button>
        </div>

        {/* Conjuntos Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Nombre del Conjunto</th>
                  <th className="p-4">Ubicación / Ciudad</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Estado Suscripción</th>
                  <th className="p-4">Admins Registrados</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {conjuntos.map((conjunto) => {
                  const adminsCount = users.filter(
                    (u) => u.conjunto_id === conjunto.id && u.role === 'administracion'
                  ).length;

                  return (
                    <tr key={conjunto.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-medium text-white">
                        <div>{conjunto.nombre}</div>
                        <div className="text-xs text-slate-500">NIT: {conjunto.nit || 'N/A'}</div>
                      </td>
                      <td className="p-4">
                        <div>{conjunto.direccion}</div>
                        <div className="text-xs text-slate-500">{conjunto.ciudad}</div>
                      </td>
                      <td className="p-4 uppercase text-xs font-bold text-indigo-400">
                        {conjunto.plan}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            conjunto.estado_suscripcion === 'activa'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : conjunto.estado_suscripcion === 'suspendida'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {conjunto.estado_suscripcion}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-200">{adminsCount} Admins</span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedConjuntoId(conjunto.id);
                            setShowAdminModal(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium hover:bg-indigo-600/30 transition-colors"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Crear Admin</span>
                        </button>
                        <button
                          onClick={() => setEditingConjunto(conjunto)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Users Directory */}
        <div className="space-y-4 pt-6">
          <div>
            <h2 className="text-xl font-bold text-white">Directorio Global de Usuarios</h2>
            <p className="text-sm text-slate-400">Todos los usuarios creados en el sistema por conjunto</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Usuario / Nombre</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4">Conjunto</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => {
                    const conj = conjuntos.find((c) => c.id === u.conjunto_id);
                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-white">{u.full_name}</div>
                          <div className="text-xs text-slate-400">@{u.username}</div>
                        </td>
                        <td className="p-4 capitalize text-xs font-bold text-blue-400">
                          {u.role}
                        </td>
                        <td className="p-4 text-xs text-slate-300">
                          {conj ? conj.nombre : 'Global (Super Admin)'}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              u.activo ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {u.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-500">
                          {new Date(u.created_at).toLocaleDateString('es-CO')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal: New Conjunto */}
      {showConjuntoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <h3 className="text-lg font-bold text-white">Registrar Nuevo Conjunto</h3>
            <form onSubmit={handleCreateConjunto} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-400 mb-1">Nombre del Conjunto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Conjunto Residencial Alcala"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Dirección</label>
                  <input
                    type="text"
                    required
                    placeholder="Calle 100 # 20-30"
                    value={newDireccion}
                    onChange={(e) => setNewDireccion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={newCiudad}
                    onChange={(e) => setNewCiudad(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">NIT</label>
                  <input
                    type="text"
                    placeholder="900123456-1"
                    value={newNit}
                    onChange={(e) => setNewNit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="601 555 0000"
                    value={newTelefono}
                    onChange={(e) => setNewTelefono(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Plan de Suscripción</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="basico">Básico</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowConjuntoModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold"
                >
                  Guardar Conjunto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Conjunto */}
      {editingConjunto && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <h3 className="text-lg font-bold text-white">Editar Conjunto</h3>
            <form onSubmit={handleUpdateConjunto} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-400 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editingConjunto.nombre}
                  onChange={(e) => setEditingConjunto({ ...editingConjunto, nombre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Estado de Suscripción</label>
                <select
                  value={editingConjunto.estado_suscripcion}
                  onChange={(e) =>
                    setEditingConjunto({ ...editingConjunto, estado_suscripcion: e.target.value as any })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="activa">Activa</option>
                  <option value="suspendida">Suspendida</option>
                  <option value="vencida">Vencida</option>
                  <option value="prueba">Prueba</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Plan</label>
                <select
                  value={editingConjunto.plan}
                  onChange={(e) =>
                    setEditingConjunto({ ...editingConjunto, plan: e.target.value as any })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="basico">Básico</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingConjunto(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Admin User */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <h3 className="text-lg font-bold text-white">Crear Administrador de Conjunto</h3>
            <form onSubmit={handleCreateAdmin} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-400 mb-1">Conjunto Asignado</label>
                <select
                  value={selectedConjuntoId}
                  onChange={(e) => setSelectedConjuntoId(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="">Seleccione un conjunto</option>
                  {conjuntos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ana María Administradora"
                  value={adminFullName}
                  onChange={(e) => setAdminFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nombre de Usuario (Login)</label>
                <input
                  type="text"
                  required
                  placeholder="ej. admin.prueba"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold"
                >
                  Crear Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
