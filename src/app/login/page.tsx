"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ShieldCheck,
  UserCheck,
  ShieldAlert,
  KeyRound,
  User,
  PlusCircle,
  Mail,
  Phone,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Super Admin form state
  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regMessage, setRegMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falló el inicio de sesión");
      }

      router.push(data.redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegMessage(null);

    try {
      const res = await fetch("/api/auth/register-super-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: regFullName,
          username: regUsername,
          password: regPassword,
          email: regEmail,
          phone: regPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al registrar súper usuario");

      setRegMessage({ type: "success", text: data.message });
      setTimeout(() => {
        setMode("login");
        setUsername(regUsername);
        setPassword(regPassword);
      }, 1500);
    } catch (err: unknown) {
      setRegMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error de registro",
      });
    } finally {
      setRegLoading(false);
    }
  };

  const setDemoCredentials = (u: string, p: string) => {
    setMode("login");
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          ConjuntoControl Total
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Plataforma Integral de Administración de Conjuntos Residenciales
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-4 shadow-2xl rounded-2xl sm:px-10 space-y-6">
          {mode === "login" ? (
            /* VISTA DE INICIO DE SESIÓN */
            <>
              <form className="space-y-5" onSubmit={handleLoginSubmit}>
                {loginError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Usuario
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ingrese su usuario"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Contraseña
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full flex justify-center py-3 px-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition text-sm uppercase tracking-wider"
                >
                  {loginLoading ? "Ingresando..." : "Iniciar Sesión"}
                </button>
              </form>

              {/* Opción Crear Súper Usuario */}
              <div className="border-t border-slate-800 pt-4 text-center">
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 rounded-lg border border-amber-500/30 transition w-full justify-center"
                >
                  <PlusCircle className="w-4 h-4" /> Crear Súper Usuario (Dueño de Plataforma)
                </button>
              </div>

              {/* Cuentas Demo Rápidas */}
              <div className="border-t border-slate-800 pt-4">
                <p className="text-xs text-slate-400 font-medium mb-3 text-center uppercase tracking-wider">
                  Acceso Rápido de Prueba (Demo)
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDemoCredentials("admin_master", "admin123")}
                    className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-left transition flex items-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-slate-200">Súper Admin</div>
                      <div className="text-slate-400 text-[10px]">admin_master</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoCredentials("admin_mirador", "admin123")}
                    className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-left transition flex items-center space-x-2"
                  >
                    <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-slate-200">Admin Conjunto</div>
                      <div className="text-slate-400 text-[10px]">admin_mirador</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoCredentials("vigilante_porteria", "vigi123")}
                    className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-left transition flex items-center space-x-2"
                  >
                    <User className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-slate-200">Vigilante</div>
                      <div className="text-slate-400 text-[10px]">vigilante_porteria</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoCredentials("residente_201", "resi123")}
                    className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-left transition flex items-center space-x-2"
                  >
                    <User className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-slate-200">Residente</div>
                      <div className="text-slate-400 text-[10px]">residente_201</div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* VISTA DE REGISTRO SÚPER USUARIO */
            <div className="space-y-5">
              <div className="text-center border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-amber-400">Crear Súper Usuario</h3>
                <p className="text-xs text-slate-400 mt-1">Dueño de Plataforma</p>
              </div>

              {regMessage && (
                <div
                  className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                    regMessage.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  {regMessage.type === "success" && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  <span>{regMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Nombre Completo</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Ej: Súper Admin Principal"
                      className="block w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Nombre de Usuario (Login)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="Ej: mi_super_usuario"
                      className="block w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Contraseña</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="admin@conjunto.com"
                      className="block w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Teléfono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+57 300 0000000"
                      className="block w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full flex justify-center py-3 px-4 rounded-lg font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 transition text-sm uppercase tracking-wider"
                >
                  {regLoading ? "Creando..." : "Crear Súper Usuario"}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio de Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
