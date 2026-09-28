"use client";

import { useState, useEffect } from "react";
import { Package, CheckCircle, PackageCheck } from "lucide-react";

interface Parcel {
  id: string;
  apartment_unit: string;
  recipient_name: string;
  courier_company: string;
  description: string;
  received_by: string;
  delivered_by?: string;
  delivered_to?: string;
  status: string;
  received_at: string;
}

export default function VigilantePaquetesPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [apartmentUnit, setApartmentUnit] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [courierCompany, setCourierCompany] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Delivery Modal
  const [deliveringParcel, setDeliveringParcel] = useState<Parcel | null>(null);
  const [deliveredTo, setDeliveredTo] = useState("");

  const fetchParcels = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vigilante/parcels");
      const data = await res.json();
      if (res.ok) setParcels(data.parcels || []);
    } catch {
      console.error("Error al obtener paquetes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/vigilante/parcels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apartment_unit: apartmentUnit,
          recipient_name: recipientName,
          courier_company: courierCompany,
          description,
        }),
      });

      if (!res.ok) throw new Error("Error al registrar paquete");

      setMessage("¡Paquete registrado en portería!");
      setApartmentUnit("");
      setRecipientName("");
      setCourierCompany("");
      setDescription("");
      fetchParcels();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeliver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveringParcel) return;

    try {
      const res = await fetch(`/api/vigilante/parcels/${deliveringParcel.id}/deliver`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delivered_to: deliveredTo }),
      });

      if (res.ok) {
        setDeliveringParcel(null);
        setDeliveredTo("");
        fetchParcels();
      }
    } catch {
      console.error("Error al entregar paquete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
          <Package className="w-5 h-5 text-emerald-400" /> Recepción de Paquetería
        </h2>
        <p className="text-xs text-slate-400 mt-1">Recibir y entregar encomiendas o paquetes</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Form Recepcion */}
      <form onSubmit={handleRegister} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
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
            <label className="block text-slate-300 font-medium mb-1">Destinatario</label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Ej: Ana Rodríguez"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Empresa / Transportadora</label>
          <input
            type="text"
            required
            value={courierCompany}
            onChange={(e) => setCourierCompany(e.target.value)}
            placeholder="Ej: Servientrega, MercadoLibre, Amazon"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Descripción de la caja/sobre</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Caja mediana café de Amazon"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition text-xs uppercase tracking-wider disabled:opacity-50"
        >
          {submitting ? "Registrando..." : "Registrar Recepción"}
        </button>
      </form>

      {/* List Paquetes Pendientes */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center justify-between">
          <span>Paquetes Pendientes de Entrega</span>
          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full text-xs">
            {parcels.filter((p) => p.status === "Pendiente").length}
          </span>
        </h3>

        {loading ? (
          <p className="text-xs text-slate-500">Cargando paquetes...</p>
        ) : parcels.length > 0 ? (
          parcels.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs space-x-2"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Apto {p.apartment_unit}</span>
                  <span className="text-slate-300 font-medium truncate">({p.recipient_name})</span>
                </div>
                <div className="text-slate-400">
                  Empresa: <span className="text-emerald-400 font-semibold">{p.courier_company}</span>
                </div>
                <div className="text-slate-500 truncate">{p.description || "Sin descripción"}</div>
              </div>

              {p.status === "Pendiente" ? (
                <button
                  onClick={() => setDeliveringParcel(p)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-[11px] shrink-0"
                >
                  Entregar
                </button>
              ) : (
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Entregado</span>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">No hay paquetes pendientes en portería.</p>
        )}
      </div>

      {/* Modal Entrega */}
      {deliveringParcel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-full max-w-sm space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-emerald-400" /> Confirmar Entrega de Paquete
            </h3>
            <div className="text-xs text-slate-300 bg-slate-800/80 p-3 rounded-lg space-y-1">
              <p><strong className="text-white">Apto:</strong> {deliveringParcel.apartment_unit}</p>
              <p><strong className="text-white">Para:</strong> {deliveringParcel.recipient_name}</p>
              <p><strong className="text-white">Transportadora:</strong> {deliveringParcel.courier_company}</p>
            </div>

            <form onSubmit={handleDeliver} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre de quien reclama el paquete</label>
                <input
                  type="text"
                  required
                  value={deliveredTo}
                  onChange={(e) => setDeliveredTo(e.target.value)}
                  placeholder="Ej: Ana María Rodríguez"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeliveringParcel(null)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                >
                  Registrar Entrega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
