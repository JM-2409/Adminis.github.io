"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Car,
  Phone,
  Mail,
  Dog,
  X,
  ParkingSquare,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";

interface Unit {
  id: string;
  sector: string; // Torre A, Manzana 3, Bloque 1, o "N/A"
  unitNumber: string; // Apt 301, Casa 12
  residentName: string;
  document: string;
  role: "Propietario" | "Inquilino";
  phone: string;
  email: string;
  parkingSpot?: string; // Opcional
  vehiclesCount: number;
  petsCount: number;
  hasAppAccess: boolean;
  username?: string;
}

export default function ResidentesPage() {
  const [units, setUnits] = useState<Unit[]>([
    {
      id: "RES-101",
      sector: "Torre A",
      unitNumber: "Apt 101",
      residentName: "Jaime Alberto Restrepo",
      document: "10203040",
      role: "Propietario",
      phone: "+57 310 456 7890",
      email: "jaime.restrepo@gmail.com",
      parkingSpot: "P-12",
      vehiclesCount: 1,
      petsCount: 1,
      hasAppAccess: true,
      username: "jrestrepo101",
    },
    {
      id: "RES-102",
      sector: "Torre A",
      unitNumber: "Apt 102",
      residentName: "Mariana Silva",
      document: "52988112",
      role: "Inquilino",
      phone: "+57 315 987 6543",
      email: "marianasilva@hotmail.com",
      parkingSpot: "", // Sin parqueadero
      vehiclesCount: 0,
      petsCount: 0,
      hasAppAccess: false,
    },
    {
      id: "RES-201",
      sector: "Manzana 2",
      unitNumber: "Casa 15",
      residentName: "Roberto Carlos Duque",
      document: "79123456",
      role: "Propietario",
      phone: "+57 300 112 2334",
      email: "rduque@empresa.com",
      parkingSpot: "Garaje Propio",
      vehiclesCount: 1,
      petsCount: 2,
      hasAppAccess: true,
      username: "rduque_casa15",
    },
    {
      id: "RES-301",
      sector: "Bloque C",
      unitNumber: "Apt 301",
      residentName: "Clara Inés Montoya",
      document: "41982334",
      role: "Propietario",
      phone: "+57 320 555 4433",
      email: "clara.montoya@outlook.com",
      parkingSpot: "",
      vehiclesCount: 0,
      petsCount: 1,
      hasAppAccess: false,
    },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    sector: "Torre A",
    unitNumber: "",
    residentName: "",
    document: "",
    role: "Propietario" as "Propietario" | "Inquilino",
    phone: "",
    email: "",
    parkingSpot: "",
    vehiclesCount: 0,
    petsCount: 0,
    createCredentials: false,
    username: "",
    password: "",
  });

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.unitNumber || !formData.residentName) return;

    const newUnit: Unit = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      sector: formData.sector || "N/A",
      unitNumber: formData.unitNumber,
      residentName: formData.residentName,
      document: formData.document || "S/D",
      role: formData.role,
      phone: formData.phone || "Sin teléfono",
      email: formData.email || "Sin correo",
      parkingSpot: formData.parkingSpot || undefined,
      vehiclesCount: Number(formData.vehiclesCount),
      petsCount: Number(formData.petsCount),
      hasAppAccess: formData.createCredentials,
      username: formData.createCredentials ? formData.username : undefined,
    };

    setUnits([newUnit, ...units]);
    setShowModal(false);
    setFormData({
      sector: "Torre A",
      unitNumber: "",
      residentName: "",
      document: "",
      role: "Propietario",
      phone: "",
      email: "",
      parkingSpot: "",
      vehiclesCount: 0,
      petsCount: 0,
      createCredentials: false,
      username: "",
      password: "",
    });
  };

  const filteredUnits = units.filter((u) => {
    return (
      u.residentName.toLowerCase().includes(search.toLowerCase()) ||
      u.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
      u.sector.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Directorio de Unidades y Residentes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Control de propietarios, inquilinos, parqueaderos asignados y credenciales de acceso.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-bold hover:bg-emerald-400 transition-colors shadow-md w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Registrar Residente
        </button>
      </div>

      {/* Buscador */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por residente, unidad o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-[#111827] py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Tarjetas de Residentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            className="rounded-2xl border border-slate-800 bg-[#111827] p-5 shadow-md hover:bg-slate-800/60 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
                  {unit.sector !== "N/A" ? `${unit.sector} - ` : ""}{unit.unitNumber}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    unit.role === "Propietario"
                      ? "bg-blue-950/80 text-blue-300 border-blue-800/50"
                      : "bg-purple-950/80 text-purple-300 border-purple-800/50"
                  }`}
                >
                  {unit.role}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-white">
                {unit.residentName}
              </h3>
              <span className="text-[11px] text-slate-400 block mb-2">
                C.C. {unit.document}
              </span>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{unit.phone}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{unit.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ParkingSquare className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {unit.parkingSpot ? (
                      <strong className="text-emerald-400">{unit.parkingSpot}</strong>
                    ) : (
                      <em className="text-slate-500 font-normal">Sin parqueadero asignado</em>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Car className="h-3.5 w-3.5 text-slate-400" /> {unit.vehiclesCount}
                </span>
                <span className="flex items-center gap-1">
                  <Dog className="h-3.5 w-3.5 text-amber-400" /> {unit.petsCount}
                </span>
              </div>

              <div>
                {unit.hasAppAccess ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-900/50">
                    <UserCheck className="h-3 w-3" /> App Activa
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 font-normal">
                    Sin usuario app
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Agregar Residente */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 overflow-y-auto backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-[#111827] p-5 sm:p-6 shadow-2xl border border-slate-800 my-auto text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-extrabold text-white">Registrar Residente</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUnit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Torre / Bloque / Manzana
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Torre A / Manzana 2"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Número de Unidad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Apt 301 / Casa 12"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Nombre Completo Residente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Camilo Torres"
                  value={formData.residentName}
                  onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Documento Identidad
                  </label>
                  <input
                    type="text"
                    placeholder="C.C. 10203040"
                    value={formData.document}
                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Rol
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as "Propietario" | "Inquilino" })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Propietario">Propietario</option>
                    <option value="Inquilino">Inquilino</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Celular
                  </label>
                  <input
                    type="text"
                    placeholder="+57 300..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Parqueadero (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: P-12 o dejar en blanco"
                    value={formData.parkingSpot}
                    onChange={(e) => setFormData({ ...formData, parkingSpot: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Checkbox para creación opcional de credenciales para app móvil */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.createCredentials}
                    onChange={(e) =>
                      setFormData({ ...formData, createCredentials: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      ¿Crear usuario y contraseña para la app de residente?
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal block">
                      Opcional. Permite al residente ingresar a su portal en el futuro.
                    </span>
                  </div>
                </label>

                {formData.createCredentials && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">
                        Nombre de Usuario
                      </label>
                      <input
                        type="text"
                        required={formData.createCredentials}
                        placeholder="Ej: residente_apt301"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value.toLowerCase().trim() })
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs sm:text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">
                        Contraseña Inicial
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required={formData.createCredentials}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 pr-10 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-800 text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  Guardar Residente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
