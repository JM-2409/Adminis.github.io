'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Building2, User, Lock, KeyRound, UserPlus, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
  const [fullName, setFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'super_admin' | 'administracion' | 'vigilante' | 'residente'>('administracion');
  const [secretCode, setSecretCode] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || 'Error al iniciar sesión');
        setIsLoggingIn(false);
        return;
      }

      // Redirect according to role
      const role = data.role;
      const redirectRoutes: Record<string, string> = {
        super_admin: '/super-admin',
        administracion: '/admin',
        vigilante: '/vigilante',
        residente: '/residente',
        presidente: '/presidente',
      };

      router.push(redirectRoutes[role] || '/admin');
      router.refresh();
    } catch {
      setLoginError('Error de conexión con el servidor');
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setIsRegistering(true);

    try {
      const res = await fetch('/api/auth/register-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          username: regUsername,
          password: regPassword,
          role: regRole,
          secret_code: regRole === 'super_admin' ? secretCode : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRegError(data.error || 'Error al crear la cuenta de prueba');
        setIsRegistering(false);
        return;
      }

      setRegSuccess('¡Cuenta de prueba creada con éxito! Ya puedes iniciar sesión arriba.');
      setFullName('');
      setRegUsername('');
      setRegPassword('');
      setSecretCode('');
      setIsRegistering(false);
    } catch {
      setRegError('Error de conexión con el servidor');
      setIsRegistering(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background styling elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3.5 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30 shadow-xl shadow-blue-900/20">
            <Building2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
            ParkControl Total
          </h1>
          <p className="text-sm text-slate-400">
            Sistema Integral de Administración de Propiedad Horizontal Multi-Conjunto
          </p>
        </div>

        {/* Main Login Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Escribe tu usuario"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-slate-100 placeholder-slate-500 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-slate-100 placeholder-slate-500 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all text-base disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoggingIn ? (
                <span>Ingresando...</span>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Temporary Registration Section */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-semibold text-slate-200">
              Crear cuenta de prueba (Temporal)
            </h2>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {regError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{regSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                placeholder="Ej. Juan Pérez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Usuario Deseado</label>
                <input
                  type="text"
                  required
                  placeholder="ej. admin1"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Rol de Usuario</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as 'super_admin' | 'administracion' | 'vigilante' | 'residente')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="administracion">Administrador de Conjunto</option>
                <option value="super_admin">Super Administrador (Protegido con Código)</option>
                <option value="vigilante">Vigilante</option>
                <option value="residente">Empleado Residente</option>
              </select>
            </div>

            {regRole === 'super_admin' && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg space-y-1.5">
                <label className="block text-xs font-medium text-amber-300 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" />
                  Código Secreto de Super Admin
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ingresa el código secreto (ej. 768)"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-lg py-2 px-3 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isRegistering ? 'Creando cuenta...' : 'Crear Cuenta de Prueba'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
