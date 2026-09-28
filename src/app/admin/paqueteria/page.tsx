"use client";

import { useState } from "react";
import {
  Package,
  PackageCheck,
  Plus,
  Search,
  Clock,
  X,
} from "lucide-react";

interface Parcel {
  id: string;
  apartment: string;
  recipient: string;
  courier: string;
  description: string;
  receivedAt: string;
  deliveredAt?: string;
  status: "Pendiente" | "Entregado";
}

export default function PaqueteriaPage() {
  const [parcels, setParcels] = useState<Parcel[]>([
    {
      id: "PKG-001",
      apartment: "Torre 1 - Apt 203",
      recipient: "Daniela Morales",
      courier: "MercadoLibre",
      description: "Caja mediana (Electrónicos)",
      receivedAt: "Hoy, 09:15 AM",
      status: "Pendiente",
    },
    {
      id: "PKG-002",
      apartment: "Torre 3 - Apt 704",
      recipient: "Felipe Osorio",
      courier: "Amazon",
      description: "Sobren de cartón",
      receivedAt: "Hoy, 10:30 AM",
      status: "Pendiente",
    },
    {
      id: "PKG-003",
      apartment: "Torre 2 - Apt 101",
      recipient: "Maritza Restrepo",
      courier: "Servientrega",
      description: "Documentos prioritarios",
      receivedAt: "Ayer, 03:45 PM",
      deliveredAt: "Ayer, 06:10 PM",
      status: "Entregado",
    },
    {
      id: "PKG-004",
      apartment: "Torre 1 - Apt 502",
      recipient: "Gonzalo Vargas",
      courier: "Coordinadora",
      description: "Caja grande (Hogar)",
      receivedAt: "Ayer, 11:00 AM",
      deliveredAt: "Ayer, 05:20 PM",
      status: "Entregado",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"Todos" | "Pendiente" | "Entregado">("Todos");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    apartment: "",
    recipient: "",
    courier: "MercadoLibre",
    description: "",
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.apartment || !formData.recipient) return;

    const newParcel: Parcel = {
      id: `PKG-${Math.floor(100 + Math.random() * 900)}`,
      apartment: formData.apartment,
      recipient: formData.recipient,
      courier: formData.courier,
      description: formData.description || "Paquete estándar",
      receivedAt: "Hace un momento",
      status: "Pendiente",
    };

    setParcels([newParcel, ...parcels]);
    setShowModal(false);
    setFormData({
      apartment: "",
      recipient: "",
      courier: "MercadoLibre",
      description: "",
    });
  };

  const markDelivered = (id: string) => {
    setParcels(
      parcels.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "Entregado",
              deliveredAt: "Hace un momento",
            }
          : p
      )
    );
  };

  const filteredParcels = parcels.filter((p) => {
    const matchesSearch =
      p.apartment.toLowerCase().includes(search.toLowerCase()) ||
      p.recipient.toLowerCase().includes(search.toLowerCase()) ||
      p.courier.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === "Pendiente") return matchesSearch && p.status === "Pendiente";
    if (filterStatus === "Entregado") return matchesSearch && p.status === "Entregado";
    return matchesSearch;
  });

  const pendingCount = parcels.filter((p) => p.status === "Pendiente").length;
  const deliveredCount = parcels.filter((p) => p.status === "Entregado").length;

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Control de Paquetería y Correspondencia
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Registro de recepción e entrega de encomiendas en portería.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-bold hover:bg-emerald-400 transition-colors shadow-md w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Recepcionar Paquete
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-slate-800 bg-[#111827] shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-400 shrink-0">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Pendientes por Entregar</span>
            <p className="text-2xl font-extrabold text-white">{pendingCount} paquetes</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-[#111827] shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 shrink-0">
            <PackageCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Entregados Recientemente</span>
            <p className="text-2xl font-extrabold text-white">{deliveredCount} paquetes</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por apto, residente o empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(["Todos", "Pendiente", "Entregado"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                filterStatus === status
                  ? "bg-slate-800 text-white border-emerald-500/50"
                  : "bg-[#111827] text-slate-300 border-slate-800 hover:bg-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Paquetes */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] shadow-md overflow-hidden max-w-full">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
            <thead className="bg-slate-900 border-b border-slate-800 text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-3 sm:p-4">Código / Destinatario</th>
                <th className="p-3 sm:p-4">Ubicación</th>
                <th className="p-3 sm:p-4">Empresa / Detalle</th>
                <th className="p-3 sm:p-4">Recepción</th>
                <th className="p-3 sm:p-4">Estado</th>
                <th className="p-3 sm:p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredParcels.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50">
                  <td className="p-3 sm:p-4 font-bold text-white">
                    <div className="text-[11px] font-mono text-slate-400">{p.id}</div>
                    <div>{p.recipient}</div>
                  </td>
                  <td className="p-3 sm:p-4 font-bold text-slate-200 whitespace-nowrap">
                    {p.apartment}
                  </td>
                  <td className="p-3 sm:p-4 text-slate-300">
                    <div className="font-bold text-xs text-blue-400">{p.courier}</div>
                    <div className="text-xs text-slate-400">{p.description}</div>
                  </td>
                  <td className="p-3 sm:p-4 text-xs text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {p.receivedAt}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 whitespace-nowrap">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                        p.status === "Pendiente"
                          ? "bg-amber-950 text-amber-300 border-amber-800"
                          : "bg-emerald-950 text-emerald-300 border-emerald-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-right whitespace-nowrap">
                    {p.status === "Pendiente" ? (
                      <button
                        onClick={() => markDelivered(p.id)}
                        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-sm"
                      >
                        <PackageCheck className="h-3.5 w-3.5" /> Entregar
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        Entregado {p.deliveredAt}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Recepcionar Paquete */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#111827] p-5 sm:p-6 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-extrabold text-white">Registrar Recepción de Paquete</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Apartamento Destino
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Torre 1 - Apt 402"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Nombre del Destinatario
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sofía Gómez"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Empresa Transportadora
                </label>
                <select
                  value={formData.courier}
                  onChange={(e) => setFormData({ ...formData, courier: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="MercadoLibre">MercadoLibre</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Servientrega">Servientrega</option>
                  <option value="Coordinadora">Coordinadora</option>
                  <option value="Deprisa">Deprisa</option>
                  <option value="Otra / Domicilio">Otra / Domicilio</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Descripción u Observaciones
                </label>
                <input
                  type="text"
                  placeholder="Ej: Caja de cartón o sobre amarillo"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
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
                  Confirmar Recepción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
