"use client";

import { useState, useEffect } from "react";
import { UserPlus, Car, User, CheckCircle, AlertCircle, LogOut } from "lucide-react";

interface Visitor {
  id: string;
  type: string;
  name: string;
  document: string;
  apartment_unit: string;
  license_plate?: string;
  parking_spot?: string;
  entry_time: string;
  status: string;
}

export default function VigilanteVisitantesPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"Peatonal" | "Vehicular">("Peatonal");
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [apartmentUnit, setApartmentUnit] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [parkingSpot, setParkingSpot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vigilante/visitors");
      const data = await res.json();
      if (res.ok) setVisitors(data.visitors || []);
    } catch {
      console.error("Error al obtener visitantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/vigilante/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name,
          document,
          apartment_unit: apartmentUnit,
          license_plate: type === "Vehicular" ? licensePlate : undefined,
          parking_spot: type === "Vehicular" ? parkingSpot : undefined,
        }),
      });

      if (!res.ok) throw new Error("Error al registrar ingreso");

      setMessage("¡Ingreso registrado correctamente!");
      setName("");
      setDocument("");
      setApartmentUnit("");
      setLicensePlate("");
      setParkingSpot("");
      fetchVisitors();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExit = async (id: string) => {
    try {
      const res = await fetch(`/api/vigilante/visitors/${id}/exit`, {
        method: "PATCH",
      });

      if (res.ok) {
        fetchVisitors();
      }
    } catch {
      console.error("Error al registrar salida");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
          <UserPlus className="w-5 h-5 text-emerald-400" /> Registrar Visita
        </h2>
        <p className="text-xs text-slate-400 mt-1">Ingreso Peatonal o Vehicular a la copropiedad</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Formulario Registro */}
      <form onSubmit={handleRegister} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType("Peatonal")}
            className={`p-2.5 rounded-lg border font-semibold flex items-center justify-center gap-1.5 ${
              type === "Peatonal"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <User className="w-4 h-4" /> Peatonal
          </button>
          <button
            type="button"
            onClick={() => setType("Vehicular")}
            className={`p-2.5 rounded-lg border font-semibold flex items-center justify-center gap-1.5 ${
              type === "Vehicular"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <Car className="w-4 h-4" /> Vehicular
          </button>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Nombre Completo</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Juan Pérez"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Documento / C.C.</label>
            <input
              type="text"
              required
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              placeholder="Ej: 10123456"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Unidad / Apto</label>
            <input
              type="text"
              required
              value={apartmentUnit}
              onChange={(e) => setApartmentUnit(e.target.value)}
              placeholder="Ej: T1-201"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
            />
          </div>
        </div>

        {type === "Vehicular" && (
          <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Placa Vehículo</label>
              <input
                type="text"
                required
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="Ej: ABC-123"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white uppercase"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Parqueadero Asignado</label>
              <input
                type="text"
                required
                value={parkingSpot}
                onChange={(e) => setParkingSpot(e.target.value)}
                placeholder="Ej: Visitantes #05"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition text-xs uppercase tracking-wider disabled:opacity-50"
        >
          {submitting ? "Registrando..." : "Registrar Ingreso"}
        </button>
      </form>

      {/* Lista Visitantes En Sitio */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center justify-between">
          <span>Visitantes Activos En Sitio</span>
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs">
            {visitors.filter((v) => v.status === "En sitio").length}
          </span>
        </h3>

        {loading ? (
          <p className="text-xs text-slate-500">Cargando visitantes...</p>
        ) : visitors.length > 0 ? (
          visitors.map((v) => (
            <div
              key={v.id}
              className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs space-x-2"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white truncate">{v.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      v.type === "Vehicular"
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {v.type}
                  </span>
                </div>
                <div className="text-slate-400">
                  Apto: <span className="text-slate-200 font-medium">{v.apartment_unit}</span> | C.C: {v.document}
                </div>
                {v.license_plate && (
                  <div className="text-slate-400">
                    Placa: <span className="text-amber-400 font-semibold">{v.license_plate}</span> (Pq: {v.parking_spot})
                  </div>
                )}
              </div>

              {v.status === "En sitio" ? (
                <button
                  onClick={() => handleExit(v.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-[11px] shrink-0"
                >
                  Registrar Salida
                </button>
              ) : (
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Finalizado</span>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">No hay visitantes actualmente en sitio.</p>
        )}
      </div>
    </div>
  );
}
