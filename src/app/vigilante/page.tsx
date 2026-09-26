'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Package, LogOut, RefreshCw, CheckCircle, ArrowRightLeft, UserCheck } from 'lucide-react';

export default function VigilantePanel() {
  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [packagesList, setPackagesList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'access' | 'packages'>('access');
  const [message, setMessage] = useState('');

  // Form state access
  const [tipo, setTipo] = useState<'peatonal' | 'vehicular'>('peatonal');
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [placa, setPlaca] = useState('');
  const [unidad, setUnidad] = useState('');

  // Form state packages
  const [pkgUnit, setPkgUnit] = useState('');
  const [pkgSender, setPkgSender] = useState('');
  const [pkgCourier, setPkgCourier] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');

  const fetchLogs = async () => {
    const res = await fetch('/api/admin/access-control');
    if (res.ok) {
      const data = await res.json();
      setAccessLogs(data.logs || []);
    }
  };

  const fetchPackages = async () => {
    const res = await fetch('/api/admin/packages');
    if (res.ok) {
      const data = await res.json();
      setPackagesList(data.packages || []);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchPackages();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const handleRegisterAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/access-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, nombre, cedula, placa, unidad_destino: unidad }),
    });

    if (res.ok) {
      setMessage('Ingreso registrado correctamente');
      setNombre('');
      setCedula('');
      setPlaca('');
      setUnidad('');
      fetchLogs();
    }
  };

  const handleExit = async (id: string) => {
    const res = await fetch('/api/admin/access-control', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log_id: id }),
    });

    if (res.ok) {
      setMessage('Salida registrada correctamente');
      fetchLogs();
    }
  };

  const handleRegisterPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unidad_texto: pkgUnit, remitente: pkgSender, empresa_mensajeria: pkgCourier, descripcion: pkgDesc }),
    });

    if (res.ok) {
      setMessage('Paquete guardado en portería');
      setPkgUnit('');
      setPkgSender('');
      setPkgCourier('');
      setPkgDesc('');
      fetchPackages();
    }
  };

  const handleDeliverPackage = async (id: string) => {
    const res = await fetch('/api/admin/packages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ package_id: id }),
    });

    if (res.ok) {
      setMessage('Paquete entregado al residente');
      fetchPackages();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">ParkControl Total</h1>
            <p className="text-xs text-emerald-400 font-semibold uppercase">Panel de Vigilancia y Portería</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-800 text-slate-300 hover:bg-red-600/20 hover:text-red-400 px-3 py-2 rounded-xl text-sm font-medium border border-slate-700"
        >
          <LogOut className="w-4 h-4" />
          <span>Salir</span>
        </button>
      </header>

      <div className="bg-slate-900/50 border-b border-slate-800 px-6 flex gap-4 text-sm font-medium">
        <button
          onClick={() => setActiveTab('access')}
          className={`py-3 border-b-2 ${activeTab === 'access' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-slate-400'}`}
        >
          Control de Acceso
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`py-3 border-b-2 ${activeTab === 'packages' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-slate-400'}`}
        >
          Paquetería y Correspondencia
        </button>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        {message && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
            {message}
          </div>
        )}

        {activeTab === 'access' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white">Botón Rápido de Registro de Entrada</h2>
              <form onSubmit={handleRegisterAccess} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm font-bold text-emerald-400"
                >
                  <option value="peatonal">Peatonal</option>
                  <option value="vehicular">Vehicular</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Nombre Visitante"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Cédula"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Placa"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Unidad (Torre A 101)"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white"
                />
                <button
                  type="submit"
                  className="md:col-span-5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-base py-3.5 rounded-xl shadow-lg"
                >
                   REGISTRAR INGRESO
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Visitante</th>
                    <th className="p-4">Placa</th>
                    <th className="p-4">Destino</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {accessLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="p-4 font-bold text-emerald-400 uppercase">{log.tipo}</td>
                      <td className="p-4 font-semibold text-white">{log.nombre}</td>
                      <td className="p-4 text-amber-400 font-mono font-bold">{log.placa || '-'}</td>
                      <td className="p-4">{log.unidad_destino}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${log.estado === 'adentro' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                          {log.estado}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {log.estado === 'adentro' && (
                          <button
                            onClick={() => handleExit(log.id)}
                            className="bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold"
                          >
                            Registrar Salida
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white">Recepción Rápida de Paquete</h2>
              <form onSubmit={handleRegisterPackage} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Unidad Destino (ej. Torre A 101)"
                  value={pkgUnit}
                  onChange={(e) => setPkgUnit(e.target.value)}
                  className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Remitente"
                  value={pkgSender}
                  onChange={(e) => setPkgSender(e.target.value)}
                  className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Empresa Mensajería"
                  value={pkgCourier}
                  onChange={(e) => setPkgCourier(e.target.value)}
                  className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Descripción"
                  value={pkgDesc}
                  onChange={(e) => setPkgDesc(e.target.value)}
                  className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white"
                />
                <button
                  type="submit"
                  className="md:col-span-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl shadow"
                >
                  REGISTRAR PAQUETE
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-4">Unidad</th>
                    <th className="p-4">Mensajería</th>
                    <th className="p-4">Detalle</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {packagesList.map((pkg) => (
                    <tr key={pkg.id}>
                      <td className="p-4 font-bold text-white">{pkg.unidad_texto}</td>
                      <td className="p-4 text-amber-400 font-semibold">{pkg.empresa_mensajeria || 'Particular'}</td>
                      <td className="p-4">{pkg.descripcion || 'Sin detalle'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${pkg.estado === 'pendiente' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {pkg.estado}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {pkg.estado === 'pendiente' && (
                          <button
                            onClick={() => handleDeliverPackage(pkg.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                          >
                            Entregar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
