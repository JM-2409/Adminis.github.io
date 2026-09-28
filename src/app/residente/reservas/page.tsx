"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, CheckCircle } from "lucide-react";

interface Reservation {
  id: string;
  facility_name: string;
  event_date: string;
  time_slot: string;
  fee_amount: number;
  status: string;
}

export default function ResidenteReservasPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [facilityName, setFacilityName] = useState("Salón Social");
  const [eventDate, setEventDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("02:00 PM - 08:00 PM");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/residente/reservations")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setReservations(data.reservations || []);
      })
      .catch(() => console.error("Error al obtener reservas"))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshReservations = async () => {
    try {
      const res = await fetch("/api/residente/reservations");
      const data = await res.json();
      if (res.ok) setReservations(data.reservations || []);
    } catch {
      console.error("Error al actualizar reservas");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/residente/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facility_name: facilityName,
          event_date: eventDate,
          time_slot: timeSlot,
        }),
      });

      if (!res.ok) throw new Error("Error al solicitar reserva");

      setMessage("¡Solicitud de reserva enviada a administración!");
      setShowModal(false);
      refreshReservations();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Error al solicitar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" /> Reserva Zonas Comunes
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Alquiler de Salón Social, Terrazas y Zonas BBQ</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Reservar
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-slate-500">Cargando reservas...</p>
      ) : reservations.length > 0 ? (
        <div className="space-y-3 text-xs">
          {reservations.map((r) => (
            <div key={r.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{r.facility_name}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    r.status === "Aprobada"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : r.status === "Pendiente"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div className="text-slate-300">
                <p><strong>Fecha reservada:</strong> {r.event_date}</p>
                <p><strong>Horario:</strong> {r.time_slot}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 text-center py-6">No registra reservas de zonas comunes.</p>
      )}

      {/* Modal Reserva */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-full max-w-sm space-y-4">
            <h3 className="font-bold text-white text-base">Reservar Zona Común</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Zona o Instalación</label>
                <select
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Salón Social Principal">Salón Social Principal</option>
                  <option value="Terraza BBQ #1">Terraza BBQ #1</option>
                  <option value="Terraza BBQ #2">Terraza BBQ #2</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Fecha del Evento</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Franja Horaria</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="09:00 AM - 01:00 PM">09:00 AM - 01:00 PM (Mañana)</option>
                  <option value="02:00 PM - 08:00 PM">02:00 PM - 08:00 PM (Tarde/Noche)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg"
                >
                  Solicitar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
