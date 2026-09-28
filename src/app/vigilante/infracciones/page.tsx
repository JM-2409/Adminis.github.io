"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function VigilanteInfraccionesPage() {
  const [apartmentUnit, setApartmentUnit] = useState("");
  const [residentName, setResidentName] = useState("");
  const [infractionType, setInfractionType] = useState("Ruido excesivo / Fiesta");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/vigilante/infractions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apartment_unit: apartmentUnit,
          resident_name: residentName,
          infraction_type: infractionType,
          description,
        }),
      });

      if (!res.ok) throw new Error("Error al reportar infracción");

      setMessage("¡Infracción registrada y enviada al administrador!");
      setApartmentUnit("");
      setResidentName("");
      setDescription("");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" /> Anotar Infracción de Residente
        </h2>
        <p className="text-xs text-slate-400 mt-1">Reporte de novedades e incumplimientos de convivencia</p>
      </div>

      {message && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
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
          <div>
            <label className="block text-slate-300 font-medium mb-1">Residente (Opcional)</label>
            <input
              type="text"
              value={residentName}
              onChange={(e) => setResidentName(e.target.value)}
              placeholder="Ej: Ana Rodríguez"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Tipo de Infracción</label>
          <select
            value={infractionType}
            onChange={(e) => setInfractionType(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
          >
            <option value="Ruido excesivo / Fiesta">Ruido excesivo / Fiesta a deshoras</option>
            <option value="Mal parqueo vehicular">Mal parqueo de vehículo o invasión</option>
            <option value="Mascotas sin correa / Excrementos">Mascotas en zonas comunes sin correa/limpieza</option>
            <option value="Basuras fuera de horario">Disposición indebida de basuras</option>
            <option value="Uso indebido de zonas comunes">Uso no autorizado de zonas comunes</option>
            <option value="Falta de respeto a personal">Irrespeto a personal de seguridad/aseo</option>
            <option value="Otra infracción">Otra infracción</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Descripción de los hechos</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escriba los detalles observados por la portería..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition text-xs uppercase tracking-wider disabled:opacity-50"
        >
          {submitting ? "Enviando..." : "Enviar Reporte al Administrador"}
        </button>
      </form>
    </div>
  );
}
