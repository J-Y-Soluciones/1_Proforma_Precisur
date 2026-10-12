import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  TrendingUp,
  LockKeyhole,
  Smartphone,
  Monitor,
  MapPin,
  Building2,
  Wrench,
  Package,
  Truck,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuotationStore, calculateTotals, money } from "@/stores/quotation";
import { toast } from "sonner";

export function Approval() {
  const navigate = useNavigate();
  const s = useQuotationStore();

  const [deviceView, setDeviceView] = useState<"mobile" | "desktop">("desktop");
  const [serviceMargin, setServiceMargin] = useState<number>(s.serviceMarginPercent ?? 35);
  const [rejectOpen, setRejectOpen] = useState<boolean>(false);
  const [observation, setObservation] = useState<string>("");

  // Cálculo en tiempo real vinculado al margen interactivo del gerente
  const t = calculateTotals({
    ...s,
    serviceMarginPercent: serviceMargin,
  });

  const handleApprove = () => {
    s.setServiceMargin(serviceMargin);
    s.setStatus("Aprobada");

    toast.success("¡Cotización aprobada por Gerencia!", {
      description: `Generando proforma oficial ${s.quotationNumber}...`,
    });

    navigate({ to: "/ficha-emitida" });
  };

  const handleConfirmReject = () => {
    if (!observation.trim()) {
      toast.error("Indica el motivo técnico de devolución.");
      return;
    }
    s.reject(observation);
    toast.warning("Proforma devuelta a Recepción con observaciones.");
    setRejectOpen(false);
    navigate({ to: "/cotizador" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* Barra superior */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <button
              onClick={() => navigate({ to: "/cotizador" })}
              className="hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={13} /> Volver al Cotizador
            </button>
            <span>/</span>
            <span className="font-mono text-slate-300">{s.quotationNumber}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Aprobación Gerencial
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-normal">
              Rol: Gerente General
            </span>
          </h1>
        </div>

        {/* Selector de Vista */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex items-center gap-1">
            <button
              onClick={() => setDeviceView("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                deviceView === "mobile"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone size={14} /> 📱 Vista Celular (Gerente en Obra)
            </button>
            <button
              onClick={() => setDeviceView("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                deviceView === "desktop"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Monitor size={14} /> 💻 Vista Escritorio / Tablet
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor Responsivo */}
      <div
        className={`transition-all duration-300 ${
          deviceView === "mobile"
            ? "max-w-[440px] mx-auto p-4 bg-slate-950/80 border-2 border-slate-800 rounded-[38px] shadow-2xl ring-8 ring-slate-900/60"
            : "w-full"
        }`}
      >
        <div
          className={`space-y-5 ${deviceView === "desktop" ? "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start space-y-0" : ""}`}
        >
          {/* COLUMNA 1: AUDITORÍA Y AJUSTE DE COSTOS BASE */}
          <div className={`space-y-4 ${deviceView === "desktop" ? "lg:col-span-6" : ""}`}>
            {/* Tarjeta Cliente */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    APROBACIÓN DE PROFORMA
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 mt-0.5">{s.client.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">RUC: {s.client.ruc}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  HABIDO
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-slate-500 shrink-0" /> {s.client.address}
                </p>
                <p className="flex items-center gap-1.5">
                  <Building2 size={12} className="text-slate-500 shrink-0" /> Modalidad:{" "}
                  {s.mode === "service" ? "Servicio Integral" : "Suministro / Reventa"}
                </p>
              </div>
            </div>

            {/* 1. REVISIÓN DE MATERIALES & MARGEN INDIVIDUAL */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Package size={15} className="text-primary" />
                  <h3 className="text-xs font-bold text-slate-200">
                    1. Insumos & Margen por Producto
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400">
                  Total Venta:{" "}
                  <strong className="text-emerald-400 font-mono">{money(t.materialsSale)}</strong>
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {s.materials.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-200 truncate">
                        {m.qty}x {m.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">Prov: {m.supplier}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-500 font-mono">Margen:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={m.markupPercent ?? 20}
                        onChange={(e) =>
                          s.updateMaterial(m.id, { markupPercent: Number(e.target.value) || 0 })
                        }
                        className="w-12 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-center font-mono font-bold text-blue-400 text-xs focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>
                  Costo insumos:{" "}
                  <strong className="font-mono text-slate-300">{money(t.materialsCost)}</strong>
                </span>
                <span>
                  Ganancia materiales:{" "}
                  <strong className="font-mono text-emerald-400">
                    +{money(t.materialsProfit)}
                  </strong>
                </span>
              </div>
            </div>

            {/* 2. REVISIÓN Y AJUSTE DE MANO DE OBRA Y CUADRILLA */}
            {s.mode === "service" && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-blue-400" />
                    <h3 className="text-xs font-bold text-slate-200">
                      2. Cuadrilla: Jornadas & Tarifas
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Subtotal M.O.:{" "}
                    <strong className="text-slate-200 font-mono">{money(t.laborCost)}</strong>
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {s.labor.map((person) => (
                    <div
                      key={person.id}
                      className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-200 truncate">{person.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{person.specialty}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div>
                          <label className="text-[8px] text-slate-500 block font-mono">
                            Tarifa (S/)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={person.dailyRate}
                            onChange={(e) =>
                              s.updateLabor(person.id, {
                                dailyRate: Math.max(0, Number(e.target.value)),
                              })
                            }
                            className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono font-bold text-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                        <span className="text-slate-500 text-xs mt-3">×</span>
                        <div>
                          <label className="text-[8px] text-slate-500 block font-mono">
                            Jornadas
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={person.days}
                            onChange={(e) =>
                              s.updateLabor(person.id, {
                                days: Math.max(1, Number(e.target.value)),
                              })
                            }
                            className="w-12 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-center font-mono font-bold text-blue-400 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {s.labor.length === 0 && (
                    <p className="text-xs text-muted-foreground py-2 text-center">
                      Sin operarios asignados.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 3. REVISIÓN Y AJUSTE DE GASTOS OPERATIVOS & LOGÍSTICA */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-warning" />
                  <h3 className="text-xs font-bold text-slate-200">
                    3. Gastos Operativos & Logística
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400">
                  Subtotal Logística:{" "}
                  <strong className="text-slate-200 font-mono">{money(t.logisticsCost)}</strong>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {(
                  [
                    { key: "freight", label: "Flete / Movilidad (Arequipa)", icon: Truck },
                    {
                      key: "equipmentRental",
                      label: "Alquiler de equipos especiales",
                      icon: Wrench,
                    },
                    { key: "epp", label: "Viáticos & EPPs específicos", icon: ShieldCheck },
                  ] as const
                )
                  .filter((item) => s.mode === "service" || item.key === "freight")
                  .map((item) => (
                    <div
                      key={item.key}
                      className="flex justify-between items-center bg-slate-950/70 p-2 rounded-lg border border-slate-800/80"
                    >
                      <span className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                        <item.icon size={13} className="text-warning" /> {item.label}
                      </span>
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-slate-500 text-[10px]">S/</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={s.logistics[item.key]}
                          onChange={(e) => s.setLogistics(item.key, Number(e.target.value) || 0)}
                          className="w-20 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono font-bold text-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Total Costo Directo Consolidado */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex justify-between items-center">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <LockKeyhole size={14} /> COSTO BASE OPERATIVO DIRECTO:
              </div>
              <span className="font-mono text-base font-black text-slate-100">
                {money(t.direct)}
              </span>
            </div>
          </div>

          {/* COLUMNA 2: MARGEN DE SERVICIO Y PRECIO FINAL */}
          <div className={`space-y-4 ${deviceView === "desktop" ? "lg:col-span-6" : ""}`}>
            {/* Control del Margen del Servicio de Precisur */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Wrench size={15} className="text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-200">
                    Margen del Servicio (Intermediación)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Solo Mano de Obra + Logística
                </span>
              </div>

              {s.mode === "service" ? (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 30, 35, 40].map((preset) => (
                      <Button
                        key={preset}
                        type="button"
                        variant={serviceMargin === preset ? "default" : "secondary"}
                        onClick={() => {
                          setServiceMargin(preset);
                          s.setServiceMargin(preset);
                        }}
                        className={`h-8 text-xs font-bold ${
                          serviceMargin === preset
                            ? "bg-blue-600 hover:bg-blue-500 text-white"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        {preset}%
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Margen por gestión de obra:</span>
                      <span className="font-bold text-blue-400 font-mono">{serviceMargin}%</span>
                    </div>
                    <Slider
                      value={[serviceMargin]}
                      min={10}
                      max={60}
                      step={1}
                      onValueChange={(val) => {
                        const nextVal = val[0] ?? serviceMargin;
                        setServiceMargin(nextVal);
                        s.setServiceMargin(nextVal);
                      }}
                      className="py-1"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center text-xs">
                    <span className="text-emerald-300 font-medium">
                      Ganancia por Intermediación:
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      +{money(t.serviceProfit)}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground py-2">
                  Modalidad Suministro: No aplica margen de intermediación sobre mano de obra.
                </p>
              )}
            </div>

            {/* Resumen Final de Venta */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-200">Resumen Comercial Consolidado</h3>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  Utilidad Total: +{money(t.totalProfit)}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Venta Insumos (con margen de producto):</span>
                  <span className="font-mono text-slate-200">{money(t.materialsSale)}</span>
                </div>
                {s.mode === "service" && (
                  <div className="flex justify-between text-slate-400">
                    <span>Venta Servicio Técnico & Flete:</span>
                    <span className="font-mono text-slate-200">{money(t.serviceSale)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span>Subtotal Venta Neta:</span>
                  <span className="font-mono text-slate-100 font-bold">{money(t.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>I.G.V. de Ley (18.00%):</span>
                  <span className="font-mono text-slate-200">{money(t.igv)}</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-slate-200">TOTAL FACTURABLE:</div>
                    <div className="text-[10px] text-slate-500 font-mono">T.C. 3.765</div>
                  </div>
                  <div className="text-xl font-black font-mono text-emerald-400">
                    {money(t.total)}
                  </div>
                </div>
              </div>

              {/* Botonera de Aprobación */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="destructive"
                  onClick={() => setRejectOpen(true)}
                  className="h-10 text-xs font-bold bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30"
                >
                  <XCircle size={14} className="mr-1.5" /> Rechazar
                </Button>

                <Button
                  onClick={handleApprove}
                  className="h-10 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                >
                  <CheckCircle2 size={14} className="mr-1.5" /> Aprobar Cotización
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Devolución */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2 text-slate-100">
              <ShieldAlert className="text-rose-400 size-4" /> Devolver a Recepción con
              Observaciones
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Escribe las instrucciones prioritarias para la asistenta antes de emitir formalmente.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ej: Bajar las jornadas de soldadura de 3 a 2 para ajustar el presupuesto..."
              className="h-28 bg-slate-950 border-slate-800 text-slate-200 text-xs resize-none focus:border-blue-500"
            />
          </div>

          <DialogFooter className="flex gap-2 justify-end sm:justify-end pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRejectOpen(false)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmReject}
              className="text-xs bg-rose-600 hover:bg-rose-500"
            >
              Confirmar Devolución
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
