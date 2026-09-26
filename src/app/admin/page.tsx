'use client';

import { useState, useEffect } from 'react';
import {
  Building2, Car, Users, Package, ShieldCheck, DollarSign, LogOut,
  RefreshCw, Plus, Clock, Settings, AlertTriangle, CheckCircle, Calendar,
  FileText, Shield, Key
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'summary' | 'visitors' | 'private_parking' | 'access' | 'packages' | 'reservations' | 'fines' | 'users'>('summary');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals / forms state
  const [occupyModal, setOccupyModal] = useState<any>(null); // parking spot selected for occupancy
  const [visitorPlaca, setVisitorPlaca] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorType, setVisitorType] = useState<'carro' | 'moto'>('carro');
  const [visitorUnit, setVisitorUnit] = useState('');

  // Release modal
  const [releaseModal, setReleaseModal] = useState<any>(null);
  const [releasePaymentMethod, setReleasePaymentMethod] = useState<'efectivo' | 'nequi' | 'bancolombia' | 'transferencia'>('efectivo');

  // Tariffs form state
  const [carroHora, setCarroHora] = useState(5000);
  const [motoHora, setMotoHora] = useState(3000);
  const [carroDia, setCarroDia] = useState(35000);
  const [motoDia, setMotoDia] = useState(20000);

  // Access Control logs state
  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [newAccessName, setNewAccessName] = useState('');
  const [newAccessCedula, setNewAccessCedula] = useState('');
  const [newAccessPlaca, setNewAccessPlaca] = useState('');
  const [newAccessUnit, setNewAccessUnit] = useState('');
  const [newAccessType, setNewAccessType] = useState<'peatonal' | 'vehicular'>('peatonal');

  // Packages state
  const [packagesList, setPackagesList] = useState<any[]>([]);
  const [pkgUnit, setPkgUnit] = useState('');
  const [pkgSender, setPkgSender] = useState('');
  const [pkgCourier, setPkgCourier] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');

  // Reservations state
  const [reservationsList, setReservationsList] = useState<any[]>([]);
  const [resName, setResName] = useState('');
  const [resDate, setResDate] = useState('');
  const [resStart, setResStart] = useState('14:00');
  const [resEnd, setResEnd] = useState('18:00');
  const [resAreaId, setResAreaId] = useState('');
  const [resValor, setResValor] = useState(50000);

  // Fines state
  const [finesList, setFinesList] = useState<any[]>([]);
  const [fineName, setFineName] = useState('');
  const [fineReason, setFineReason] = useState('');
  const [fineValor, setFineValor] = useState(100000);

  // Users state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'vigilante' | 'residente' | 'presidente'>('vigilante');
  const [newUserTorre, setNewUserTorre] = useState('Torre A');
  const [newUserNumero, setNewUserNumero] = useState('101');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        if (data.tariffs) {
          setCarroHora(data.tariffs.carro_hora);
          setMotoHora(data.tariffs.moto_hora);
          setCarroDia(data.tariffs.carro_dia);
          setMotoDia(data.tariffs.moto_dia);
        }
      }
    } catch {
      setErrorMsg('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessLogs = async () => {
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

  const fetchReservations = async () => {
    const res = await fetch('/api/admin/reservations');
    if (res.ok) {
      const data = await res.json();
      setReservationsList(data.reservations || []);
    }
  };

  const fetchFines = async () => {
    const res = await fetch('/api/admin/fines');
    if (res.ok) {
      const data = await res.json();
      setFinesList(data.fines || []);
    }
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const data = await res.json();
      setUsersList(data.users || []);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAccessLogs();
    fetchPackages();
    fetchReservations();
    fetchFines();
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  // 1. Occupy Visitor Parking
  const handleOccupyVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!occupyModal) return;

    try {
      const res = await fetch('/api/admin/visitor-parking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'occupy',
          parking_id: occupyModal.id,
          placa: visitorPlaca,
          nombre_visitante: visitorName,
          tipo_vehiculo: visitorType,
          unidad_destino_texto: visitorUnit,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error al ocupar');
        return;
      }

      setMessage('Puesto ocupado exitosamente');
      setOccupyModal(null);
      setVisitorPlaca('');
      setVisitorName('');
      setVisitorUnit('');
      fetchStats();
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  // 2. Release Visitor Parking
  const handleReleaseVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!releaseModal) return;

    try {
      const res = await fetch('/api/admin/visitor-parking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'release',
          parking_id: releaseModal.id,
          metodo_pago: releasePaymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error al liberar');
        return;
      }

      setMessage(data.message || 'Puesto liberado y pago registrado');
      setReleaseModal(null);
      fetchStats();
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  // 3. Update Tariffs
  const handleUpdateTariffs = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/visitor-parking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carro_hora: carroHora,
          moto_hora: motoHora,
          carro_dia: carroDia,
          moto_dia: motoDia,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error al guardar tarifas');
        return;
      }

      setMessage('Tarifas de parqueadero actualizadas');
      fetchStats();
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  // 4. Access Control Entry
  const handleCreateAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/access-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: newAccessType,
          nombre: newAccessName,
          cedula: newAccessCedula,
          placa: newAccessPlaca,
          unidad_destino: newAccessUnit,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error registrando');
        return;
      }

      setMessage('Ingreso registrado');
      setNewAccessName('');
      setNewAccessCedula('');
      setNewAccessPlaca('');
      setNewAccessUnit('');
      fetchAccessLogs();
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  const handleRegisterExit = async (logId: string) => {
    try {
      const res = await fetch('/api/admin/access-control', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log_id: logId }),
      });

      if (res.ok) {
        setMessage('Salida registrada');
        fetchAccessLogs();
      }
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  // 5. Register Package
  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unidad_texto: pkgUnit,
          remitente: pkgSender,
          empresa_mensajeria: pkgCourier,
          descripcion: pkgDesc,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error al guardar paquete');
        return;
      }

      setMessage('Paquete recibido y guardado');
      setPkgUnit('');
      setPkgSender('');
      setPkgCourier('');
      setPkgDesc('');
      fetchPackages();
      fetchStats();
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  const handleDeliverPackage = async (pkgId: string) => {
    try {
      const res = await fetch('/api/admin/packages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id: pkgId }),
      });

      if (res.ok) {
        setMessage('Paquete marcado como entregado');
        fetchPackages();
        fetchStats();
      }
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  // 6. Create Reservation
  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          common_area_id: resAreaId || stats?.commonAreas?.[0]?.id,
          solicitante_nombre: resName,
          fecha_reserva: resDate,
          hora_inicio: resStart,
          hora_fin: resEnd,
          valor: resValor,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error reservando');
        return;
      }

      setMessage('Reserva confirmada');
      setResName('');
      setResDate('');
      fetchReservations();
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  // 7. Create Fine
  const handleCreateFine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/fines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitante_nombre: fineName,
          motivo: fineReason,
          valor: fineValor,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error creando multa');
        return;
      }

      setMessage('Multa aplicada');
      setFineName('');
      setFineReason('');
      fetchFines();
      fetchStats();
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  const handlePayFine = async (fineId: string) => {
    try {
      const res = await fetch('/api/admin/fines', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fine_id: fineId, metodo_pago: 'efectivo' }),
      });

      if (res.ok) {
        setMessage('Multa marcada como pagada');
        fetchFines();
        fetchStats();
      }
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  // 8. Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: newUserName,
          username: newUserUsername,
          password: newUserPassword,
          role: newUserRole,
          torre_bloque: newUserTorre,
          numero_unidad: newUserNumero,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error creando usuario');
        return;
      }

      setMessage('Usuario creado con éxito');
      setNewUserName('');
      setNewUserUsername('');
      setNewUserPassword('');
      fetchUsers();
    } catch {
      setErrorMsg('Error de conexión');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">ParkControl Total</h1>
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              Panel Administración de Conjunto
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchStats}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
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

      {/* Navigation Tabs */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-6 flex gap-2 overflow-x-auto text-sm font-medium">
        <button
          onClick={() => setActiveTab('summary')}
          className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'summary'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Dashboard Principal</span>
        </button>

        <button
          onClick={() => setActiveTab('visitors')}
          className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'visitors'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Parqueaderos Visitantes Grid (V-01 a V-20)</span>
        </button>

        <button
          onClick={() => setActiveTab('access')}
          className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'access'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Control Acceso</span>
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'packages'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Paquetería</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'reservations'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Zonas Comunes</span>
        </button>

        <button
          onClick={() => setActiveTab('fines')}
          className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'fines'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Multas y Pagos</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'users'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestión Usuarios</span>
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {message && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: SUMMARY METRICS */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 uppercase font-semibold">Parq. Privados</div>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {stats?.privateOccupied || 0} / {stats?.privateTotal || 0}
                </div>
                <div className="text-xs text-slate-500 mt-1">Ocupados</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 uppercase font-semibold">Parq. Visitantes</div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                  {stats?.visitorFree || 20} Libres
                </div>
                <div className="text-xs text-slate-500 mt-1">de {stats?.visitorTotal || 20} puestos</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 uppercase font-semibold">Ingresos del Día</div>
                <div className="text-2xl font-extrabold text-indigo-400 mt-1">
                  ${(stats?.dailyIncome || 0).toLocaleString('es-CO')}
                </div>
                <div className="text-xs text-slate-500 mt-1">COP recaudados</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 uppercase font-semibold">Paquetes Pendientes</div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">
                  {stats?.pendingPackagesCount || 0}
                </div>
                <div className="text-xs text-slate-500 mt-1">Por entregar</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 uppercase font-semibold">Multas Pendientes</div>
                <div className="text-2xl font-extrabold text-red-400 mt-1">
                  {stats?.pendingFinesCount || 0}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  ${(stats?.totalPendingFines || 0).toLocaleString('es-CO')} COP
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 uppercase font-semibold">Salón Social</div>
                <div className="text-2xl font-extrabold text-blue-400 mt-1">Disponible</div>
                <div className="text-xs text-slate-500 mt-1">Estado actual</div>
              </div>
            </div>

            {/* Tarifas section */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">Tarifas de Parqueadero Visitantes</h3>
                <span className="text-xs text-slate-400">Editables por Administración</span>
              </div>

              <form onSubmit={handleUpdateTariffs} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Carro Hora ($)</label>
                  <input
                    type="number"
                    value={carroHora}
                    onChange={(e) => setCarroHora(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Moto Hora ($)</label>
                  <input
                    type="number"
                    value={motoHora}
                    onChange={(e) => setMotoHora(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Carro Día ($)</label>
                  <input
                    type="number"
                    value={carroDia}
                    onChange={(e) => setCarroDia(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Moto Día ($)</label>
                  <input
                    type="number"
                    value={motoDia}
                    onChange={(e) => setMotoDia(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>

                <div className="md:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-lg shadow-indigo-600/20"
                  >
                    Guardar Tarifas
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: VISITOR PARKING GRID (20 Spots: V-01 to V-20) */}
        {activeTab === 'visitors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Parqueaderos de Visitantes</h2>
                <p className="text-sm text-slate-400">
                  Malla interactiva de 20 puestos (Verde = Libre, Rojo = Ocupado con cobro automático)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {stats?.visitorParkings?.map((spot: any) => {
                const isOccupied = spot.estado === 'ocupado';
                return (
                  <div
                    key={spot.id}
                    className={`border rounded-2xl p-4 flex flex-col justify-between h-40 transition-all ${
                      isOccupied
                        ? 'bg-red-500/10 border-red-500/40 text-red-300'
                        : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-lg">{spot.codigo}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isOccupied ? 'bg-red-500 text-white' : 'bg-emerald-500 text-slate-950'
                        }`}
                      >
                        {spot.estado}
                      </span>
                    </div>

                    {isOccupied ? (
                      <div className="space-y-1 text-xs">
                        <div className="font-bold text-white text-sm">Placa: {spot.placa}</div>
                        <div className="truncate">Visitante: {spot.nombre_visitante}</div>
                        <div>Destino: {spot.unidad_destino_texto}</div>
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-400/80 font-medium">Disponible para ingreso</div>
                    )}

                    <div>
                      {isOccupied ? (
                        <button
                          onClick={() => setReleaseModal(spot)}
                          className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold text-xs py-1.5 rounded-lg transition-colors shadow"
                        >
                          Liberar y Cobrar
                        </button>
                      ) : (
                        <button
                          onClick={() => setOccupyModal(spot)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs py-1.5 rounded-lg transition-colors shadow"
                        >
                          Ocupar Puesto
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ACCESS CONTROL */}
        {activeTab === 'access' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Registrar Ingreso (Peatonal / Vehicular)</h3>
              <form onSubmit={handleCreateAccess} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <select
                  value={newAccessType}
                  onChange={(e) => setNewAccessType(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                >
                  <option value="peatonal">Peatonal</option>
                  <option value="vehicular">Vehicular</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Nombre Visitante"
                  value={newAccessName}
                  onChange={(e) => setNewAccessName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Cédula"
                  value={newAccessCedula}
                  onChange={(e) => setNewAccessCedula(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Placa (Si es vehicular)"
                  value={newAccessPlaca}
                  onChange={(e) => setNewAccessPlaca(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Unidad Destino (ej. Torre A 101)"
                  value={newAccessUnit}
                  onChange={(e) => setNewAccessUnit(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <button
                  type="submit"
                  className="md:col-span-5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl shadow"
                >
                  Registrar Ingreso
                </button>
              </form>
            </div>

            {/* Access Logs Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Visitante / Cédula</th>
                    <th className="p-4">Placa</th>
                    <th className="p-4">Destino</th>
                    <th className="p-4">Hora Entrada</th>
                    <th className="p-4">Hora Salida</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {accessLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="p-4 uppercase text-xs font-bold text-indigo-400">{log.tipo}</td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{log.nombre}</div>
                        <div className="text-xs text-slate-500">C.C. {log.cedula || 'N/A'}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-amber-400">{log.placa || '-'}</td>
                      <td className="p-4">{log.unidad_destino}</td>
                      <td className="p-4 text-xs">
                        {log.hora_entrada ? new Date(log.hora_entrada).toLocaleTimeString('es-CO') : '-'}
                      </td>
                      <td className="p-4 text-xs">
                        {log.hora_salida ? new Date(log.hora_salida).toLocaleTimeString('es-CO') : '-'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            log.estado === 'adentro'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {log.estado}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {log.estado === 'adentro' && (
                          <button
                            onClick={() => handleRegisterExit(log.id)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700"
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

        {/* TAB 4: PACKAGES */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Registrar Recepción de Paquete</h3>
              <form onSubmit={handleCreatePackage} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Unidad Destino (ej. Torre A 101)"
                  value={pkgUnit}
                  onChange={(e) => setPkgUnit(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Remitente"
                  value={pkgSender}
                  onChange={(e) => setPkgSender(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Empresa Mensajería (Servientrega, Coordinadora...)"
                  value={pkgCourier}
                  onChange={(e) => setPkgCourier(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Descripción del Paquete"
                  value={pkgDesc}
                  onChange={(e) => setPkgDesc(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <button
                  type="submit"
                  className="md:col-span-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl shadow"
                >
                  Guardar Paquete
                </button>
              </form>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Unidad Destino</th>
                    <th className="p-4">Mensajería</th>
                    <th className="p-4">Remitente / Detalle</th>
                    <th className="p-4">Fecha Recepción</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {packagesList.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{pkg.unidad_texto}</td>
                      <td className="p-4 text-amber-400 font-semibold">{pkg.empresa_mensajeria || 'Particular'}</td>
                      <td className="p-4">
                        <div>{pkg.remitente || 'Sin remitente'}</div>
                        <div className="text-xs text-slate-500">{pkg.descripcion}</div>
                      </td>
                      <td className="p-4 text-xs">
                        {new Date(pkg.fecha_recepcion).toLocaleString('es-CO')}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            pkg.estado === 'pendiente'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}
                        >
                          {pkg.estado}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {pkg.estado === 'pendiente' && (
                          <button
                            onClick={() => handleDeliverPackage(pkg.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg"
                          >
                            Marcar Entregado
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

        {/* TAB 5: RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Reserva de Zonas Comunes (Salón Social / BBQ / Proyector)</h3>
              <form onSubmit={handleCreateReservation} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nombre Solicitante / Unidad"
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  type="date"
                  required
                  value={resDate}
                  onChange={(e) => setResDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  type="number"
                  required
                  placeholder="Valor Reserva ($)"
                  value={resValor}
                  onChange={(e) => setResValor(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <button
                  type="submit"
                  className="md:col-span-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl shadow"
                >
                  Confirmar Reserva
                </button>
              </form>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Zona Comun</th>
                    <th className="p-4">Solicitante</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Valor</th>
                    <th className="p-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {reservationsList.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{res.common_areas?.nombre || 'Salón Social'}</td>
                      <td className="p-4">{res.solicitante_nombre}</td>
                      <td className="p-4 text-xs">{res.fecha_reserva}</td>
                      <td className="p-4 text-indigo-400 font-bold">${Number(res.valor).toLocaleString('es-CO')}</td>
                      <td className="p-4 capitalize text-xs font-semibold text-emerald-400">{res.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: FINES & PAYMENTS */}
        {activeTab === 'fines' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Aplicar Multa</h3>
              <form onSubmit={handleCreateFine} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Infractor (Nombre o Unidad)"
                  value={fineName}
                  onChange={(e) => setFineName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Motivo de la Multa"
                  value={fineReason}
                  onChange={(e) => setFineReason(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  type="number"
                  required
                  placeholder="Valor ($)"
                  value={fineValor}
                  onChange={(e) => setFineValor(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <button
                  type="submit"
                  className="md:col-span-3 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl shadow"
                >
                  Registrar Multa
                </button>
              </form>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Infractor</th>
                    <th className="p-4">Motivo</th>
                    <th className="p-4">Valor</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {finesList.map((fine) => (
                    <tr key={fine.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{fine.visitante_nombre || 'Unidad'}</td>
                      <td className="p-4">{fine.motivo}</td>
                      <td className="p-4 text-red-400 font-bold">${Number(fine.valor).toLocaleString('es-CO')}</td>
                      <td className="p-4 capitalize text-xs font-semibold">{fine.estado}</td>
                      <td className="p-4 text-right">
                        {fine.estado === 'pendiente' && (
                          <button
                            onClick={() => handlePayFine(fine.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg"
                          >
                            Cobrar Multa
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

        {/* TAB 7: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Crear Usuario (Vigilante / Residente / Presidente)</h3>
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nombre Completo"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Nombre de Usuario (login)"
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  type="password"
                  required
                  placeholder="Contraseña"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                >
                  <option value="vigilante">Vigilante</option>
                  <option value="residente">Residente</option>
                  <option value="presidente">Presidente de Consejo</option>
                </select>

                {newUserRole === 'residente' && (
                  <>
                    <input
                      type="text"
                      placeholder="Torre / Bloque (ej. Torre A)"
                      value={newUserTorre}
                      onChange={(e) => setNewUserTorre(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                    />
                    <input
                      type="text"
                      placeholder="Número de Unidad (ej. 101)"
                      value={newUserNumero}
                      onChange={(e) => setNewUserNumero(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                    />
                  </>
                )}

                <button
                  type="submit"
                  className="md:col-span-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl shadow"
                >
                  Guardar Usuario
                </button>
              </form>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Nombre / Usuario</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4">Unidad Asignada</th>
                    <th className="p-4">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">
                        <div>{u.full_name}</div>
                        <div className="text-xs text-slate-400 font-normal">@{u.username}</div>
                      </td>
                      <td className="p-4 capitalize text-indigo-400 font-semibold text-xs">{u.role}</td>
                      <td className="p-4 text-xs">
                        {u.units ? `${u.units.torre_bloque} - ${u.units.numero_unidad}` : '-'}
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {new Date(u.created_at).toLocaleDateString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Occupy Visitor Parking */}
      {occupyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Ocupar Puesto {occupyModal.codigo}</h3>
            <form onSubmit={handleOccupyVisitor} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Placa del Vehículo</label>
                <input
                  type="text"
                  required
                  placeholder="ABC123"
                  value={visitorPlaca}
                  onChange={(e) => setVisitorPlaca(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nombre Visitante</label>
                <input
                  type="text"
                  required
                  placeholder="Juan Pérez"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tipo de Vehículo</label>
                <select
                  value={visitorType}
                  onChange={(e) => setVisitorType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                >
                  <option value="carro">Carro</option>
                  <option value="moto">Moto</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Unidad Destino</label>
                <input
                  type="text"
                  required
                  placeholder="Torre A 101"
                  value={visitorUnit}
                  onChange={(e) => setVisitorUnit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setOccupyModal(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Confirmar Ocupación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Release & Fee Calculation */}
      {releaseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Liberar y Cobrar Puesto {releaseModal.codigo}</h3>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-sm">
              <div><span className="text-slate-400">Placa:</span> <span className="font-bold text-amber-400">{releaseModal.placa}</span></div>
              <div><span className="text-slate-400">Visitante:</span> {releaseModal.nombre_visitante}</div>
              <div><span className="text-slate-400">Unidad Destino:</span> {releaseModal.unidad_destino_texto}</div>
              <div><span className="text-slate-400">Hora Entrada:</span> {new Date(releaseModal.hora_entrada).toLocaleString('es-CO')}</div>
            </div>

            <form onSubmit={handleReleaseVisitor} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Método de Pago</label>
                <select
                  value={releasePaymentMethod}
                  onChange={(e) => setReleasePaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="nequi">Nequi</option>
                  <option value="bancolombia">Bancolombia</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReleaseModal(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs shadow"
                >
                  Liberar y Registrar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
