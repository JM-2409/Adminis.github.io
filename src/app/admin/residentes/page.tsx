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
} from "lucide-react";

interface Unit {
  id: string;
  tower: string;
  apartment: string;
  residentName: string;
  role: "Propietario" | "Inquilino";
  phone: string;
  email: string;
  vehiclesCount: number;
  petsCount: number;
}

export default function ResidentesPage() {
  const [units, setUnits] = useState<Unit[]>([
    {
      id: "APT-101",
      tower: "Torre 1",
      apartment: "101",
      residentName: "Jaime Alberto Restrepo",
      role: "Propietario",
      phone: "+57 310 456 7890",
      email: "jaime.restrepo@gmail.com",
      vehiclesCount: 1,
      petsCount: 1,
    },
    {
      id: "APT-102",
      tower: "Torre 1",
      apartment: "102",
      residentName: "Mariana Silva",
      role: "Inquilino",
      phone: "+57 315 987 6543",
      email: "marianasilva@hotmail.com",
      vehiclesCount: 2,
      petsCount: 0,
    },
    {
      id: "APT-201",
      tower: "Torre 2",
      apartment: "201",
      residentName: "Roberto Carlos Duque",
      role: "Propietario",
      phone: "+57 300 112 2334",
      email: "rduque@empresa.com",
      vehiclesCount: 1,
      petsCount: 2,
    },
    {
      id: "APT-301",
      tower: "Torre 3",
      apartment: "301",
      residentName: "Clara Inés Montoya",
      role: "Propietario",
      phone: "+57 320 555 4433",
      email: "clara.montoya@outlook.com",
      vehiclesCount: 0,
      petsCount: 1,
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedTower, setSelectedTower] = useState("Todas");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    tower: "Torre 1",
    apartment: "",
    residentName: "",
    role: "Propietario" as "Propietario" | "Inquilino",
    phone: "",
    email: "",
    vehiclesCount: 0,
    petsCount: 0,
  });

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.apartment || !formData.residentName) return;

    const newUnit: Unit = {
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      tower: formData.tower,
      apartment: formData.apartment,
      residentName: formData.residentName,
      role: formData.role,
      phone: formData.phone || "Sin teléfono",
      email: formData.email || "Sin correo",
      vehiclesCount: Number(formData.vehiclesCount),
      petsCount: Number(formData.petsCount),
    };

    setUnits([newUnit, ...units]);
    setShowModal(false);
    setFormData({
      tower: "Torre 1",
      apartment: "",
      residentName: "",
      role: "Propietario",
      phone: "",
      email: "",
      vehiclesCount: 0,
      petsCount: 0,
    });
  };

  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.residentName.toLowerCase().includes(search.toLowerCase()) ||
      u.apartment.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesTower = selectedTower === "Todas" || u.tower === selectedTower;
    return matchesSearch && matchesTower;
  });

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Directorio de Unidades y Residentes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Control de propietarios, inquilinos, vehículos registrados y mascotas.
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

      {/* Buscador y Filtro por Torre */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por residente, apto o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(["Todas", "Torre 1", "Torre 2", "Torre 3"] as const).map((tower) => (
            <button
              key={tower}
              onClick={() => setSelectedTower(tower)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                selectedTower === tower
                  ? "bg-slate-800 text-white border-emerald-500/50"
                  : "bg-[#111827] text-slate-300 border-slate-800 hover:bg-slate-800"
              }`}
            >
              {tower}
            </button>
          ))}
        </div>
      </div>

      {/* Cards de Unidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            className="rounded-2xl border border-slate-800 bg-[#111827] p-5 shadow-md hover:bg-[#1f2937] transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-white">
                  {unit.tower} - Apt {unit.apartment}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    unit.role === "Propietario"
                      ? "bg-blue-950 text-blue-300 border-blue-800"
                      : "bg-emerald-950 text-emerald-300 border-emerald-800"
                  }`}
                >
                  {unit.role}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-white">
                {unit.residentName}
              </h3>

              <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{unit.phone}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{unit.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1">
                <Car className="h-4 w-4 text-slate-400" /> {unit.vehiclesCount} Vehículo(s)
              </span>
              <span className="flex items-center gap-1">
                <Dog className="h-4 w-4 text-amber-400" /> {unit.petsCount} Mascota(s)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Agregar Residente */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#111827] p-5 sm:p-6 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-extrabold text-white">Registrar Residente / Unidad</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUnit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Torre / Bloque
                  </label>
                  <select
                    value={formData.tower}
                    onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Torre 1">Torre 1</option>
                    <option value="Torre 2">Torre 2</option>
                    <option value="Torre 3">Torre 3</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Nº Apartamento
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 504"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Camilo Torres"
                  value={formData.residentName}
                  onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Rol
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as "Propietario" | "Inquilino" })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Propietario">Propietario</option>
                    <option value="Inquilino">Inquilino</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    placeholder="+57 300..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Vehículos Registrados
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.vehiclesCount}
                    onChange={(e) => setFormData({ ...formData, vehiclesCount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Mascotas Registradas
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.petsCount}
                    onChange={(e) => setFormData({ ...formData, petsCount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
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
