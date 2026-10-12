import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  LockKeyhole,
  Package,
  Users,
  Truck,
  Plus,
  Trash2,
  ShieldCheck,
  Check,
  Save,
  Info,
  MapPin,
  Phone,
  Wrench,
  ChevronRight,
  Clock3,
  Download,
  FileCheck2,
  Eye,
  Printer,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useQuotationStore,
  calculateTotals,
  materialDirectCost,
  materialSaleTotal,
  money,
} from "@/stores/quotation";
import { QuickEntry, SupplierDrawer, type EntryKind } from "./quick-entry";
import {
  downloadQuotation,
  getQuotationHtmlTemplate,
  printQuotationDirect,
} from "@/lib/quotation-pdf";
import { toast } from "sonner";
import { SupplierCombobox } from "./supplier-combobox";

export function Estimator() {
  const s = useQuotationStore();
  const t = calculateTotals(s);
  const [entry, setEntry] = useState<EntryKind>(null);
  const [drawer, setDrawer] = useState(false);
  const [materialId, setMaterialId] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [supplierName, setSupplierName] = useState<string>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();

  const review = () => {
    s.setStatus("Pendiente de aprobación");
    navigate({ to: "/aprobacion-movil" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F5") {
        e.preventDefault();
        useQuotationStore.getState().setStatus("Pendiente de aprobación");
        navigate({ to: "/aprobacion-movil" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const openSupplier = (id: string, name: string) => {
    setMaterialId(id);
    setSupplierName(name);
    setEntry("supplier");
  };

  const openPriceComparison = (id?: string) => {
    setMaterialId(id);
    setDrawer(true);
  };

  return (
    <>
      {/* Migas de pan y Estado superior */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="eyebrow flex items-center gap-2">
          <span>OPERACIONES</span>
          <ChevronRight size={11} />
          <span className="text-foreground">COTIZADOR ACTIVO</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className={`badge ${s.status.includes("Observaciones") ? "warning" : "blue"}`}>
            <i className="online-dot" />
            {s.status}
          </span>
          <span className="text-[9px] text-muted-foreground hidden sm:inline-flex items-center gap-1">
            <Clock3 size={11} />
            {saved ? "Borrador guardado en sesión" : "Sesión de trabajo activa"}
          </span>
        </div>
      </div>

      {/* Título de la página y Botón Vista Previa PDF */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="page-title mt-0">Cotizador operativo</h1>
            <span className="badge blue hidden sm:inline-flex">AREQUIPA OPERAX</span>
          </div>
          <p className="page-subtitle">
            Costeo técnico y propuesta comercial · Multiservicios Precisur S.A.C.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreviewOpen(true)}
          className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200"
        >
          <Eye size={14} className="mr-1 text-blue-400" />
          <span className="hidden sm:inline">Vista previa PDF</span>
        </Button>
      </div>

      {/* Barra de metadatos SUNAT */}
      <div className="panel mb-5 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px]">
          <FileCheck2 size={14} className="text-primary" />
          <span className="mono font-medium">{s.quotationNumber}</span>
          <span className="text-muted-foreground mx-2 hidden xl:inline">
            Operador: Recepción Operativa / Precisur
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-muted-foreground">T.C. referencial SUNAT</span>
          <span className="mono text-foreground">USD 1 = S/ 3.765</span>
          <span className="badge success">PEN</span>
        </div>
      </div>

      {s.observations && (
        <div className="notice mb-5">
          <Info />
          <span>
            <strong>Observaciones de gerencia:</strong> {s.observations}
          </span>
        </div>
      )}

      {/* Estructura Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_310px] gap-5 items-start">
        <div className="min-w-0 space-y-5">
          {/* 1. Tarjeta de Cliente */}
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title">
                  <Building2 />
                  Cliente & parámetros de operación
                </h2>
                <p className="panel-description">Entidad fiscal y condiciones del servicio</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-primary"
                onClick={() => setEntry("client")}
              >
                <Plus />
                <span className="hidden sm:inline">Cliente</span>
              </Button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
                <div>
                  <label className="field-label">Razón social del cliente</label>
                  <div className="control flex justify-between gap-2 items-center">
                    <span className="truncate text-[11px] font-medium">{s.client.name}</span>
                    <span className="badge success text-[8px]">
                      <Check size={9} />
                      HABIDO
                    </span>
                  </div>
                </div>
                <div>
                  <label className="field-label">RUC / SUNAT (activo)</label>
                  <div className="control flex gap-2 items-center mono">
                    <ShieldCheck size={13} className="text-success" />
                    {s.client.ruc}
                  </div>
                </div>
                <div>
                  <label className="field-label">Dirección de entrega / frente de obra</label>
                  <div className="control flex items-start gap-2 text-[10px]">
                    <MapPin size={13} className="text-muted-foreground shrink-0" />
                    {s.client.address}
                  </div>
                </div>
                <div>
                  <label className="field-label">Contacto técnico / teléfono</label>
                  <div className="control text-[10px] flex gap-2">
                    <Phone size={13} className="text-muted-foreground shrink-0" />
                    {s.client.contact}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t flex flex-wrap gap-x-5 gap-y-2 text-[9px]">
                <span className="text-muted-foreground">
                  Moneda <strong className="text-foreground ml-1 mono">PEN (S/)</strong>
                </span>
                <span className="text-muted-foreground">
                  Condición <strong className="text-foreground ml-1">{s.client.paymentTerm}</strong>
                </span>
                <span className="text-success flex gap-1 items-center">
                  <ShieldCheck size={11} />
                  Cliente de demostración
                </span>
              </div>
            </div>
            <div className="border-t px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <span className="field-label mb-0">Modalidad de cotización</span>
              <div className="flex bg-background p-1 rounded gap-1">
                <Button
                  size="sm"
                  variant={s.mode === "service" ? "default" : "ghost"}
                  onClick={() => s.setMode("service")}
                  className="text-[10px]"
                >
                  <Wrench />
                  Servicio integral
                </Button>
                <Button
                  size="sm"
                  variant={s.mode === "supply" ? "default" : "ghost"}
                  onClick={() => s.setMode("supply")}
                  className="text-[10px]"
                >
                  <Package />
                  Suministro / Reventa
                </Button>
              </div>
            </div>
          </section>

          {/* 2. Partidas Comerciales de Servicio */}
          {s.mode === "service" && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2 className="panel-title flex items-center gap-2">
                    <Wrench className="size-4 text-primary" />
                    Partidas Comerciales & Alcance Técnico
                  </h2>
                  <p className="panel-description">
                    {s.services.length} partida(s) de servicio que figurarán en la propuesta del
                    cliente
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-[10px]"
                  onClick={s.addService}
                >
                  <Plus size={13} className="mr-1" />
                  Agregar Partida
                </Button>
              </div>

              <div className="p-4 space-y-4">
                {s.services.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        ÍTEM {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">U.M.:</span>
                        <input
                          type="text"
                          className="table-input w-14 text-center font-mono text-xs"
                          value={item.um}
                          onChange={(e) => s.updateService(item.id, { um: e.target.value })}
                        />
                        <span className="text-[10px] text-muted-foreground ml-2">Cant.:</span>
                        <input
                          type="number"
                          min="1"
                          className="table-input w-12 text-center font-mono text-xs"
                          value={item.qty}
                          onChange={(e) =>
                            s.updateService(item.id, { qty: Number(e.target.value) || 1 })
                          }
                        />
                        {s.services.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive ml-2"
                            onClick={() => s.removeService(item.id)}
                          >
                            <Trash2 size={13} />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="field-label text-[10px] uppercase font-bold text-slate-400">
                        Título del servicio
                      </label>
                      <input
                        type="text"
                        className="control w-full text-xs font-semibold text-slate-100 mt-1"
                        value={item.title}
                        onChange={(e) => s.updateService(item.id, { title: e.target.value })}
                        placeholder="Ej: Servicio Integral de Reparación y Mantenimiento..."
                      />
                    </div>

                    <div>
                      <label className="field-label text-[10px] uppercase font-bold text-slate-400">
                        Descripción del servicio & Especificaciones técnicas
                      </label>
                      <textarea
                        rows={3}
                        className="control w-full text-xs leading-relaxed text-slate-200 mt-1 resize-y"
                        value={item.description}
                        onChange={(e) => s.updateService(item.id, { description: e.target.value })}
                        placeholder="Detalle de trabajos a realizar, pruebas y alcance operativo..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Mano de Obra y Cuadrilla (Paso 1: Se define el técnico y sus requerimientos) */}
          {s.mode === "service" && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2 className="panel-title">
                    <Users />
                    Mano de obra especializada & cuadrilla
                  </h2>
                  <p className="panel-description">
                    Paso 1: Asigna a los especialistas que definen la tarifa y requerimientos
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-[9px]"
                  onClick={() => setEntry("technician")}
                >
                  <Plus />
                  <span className="hidden sm:inline">Asignar técnico</span>
                </Button>
              </div>

              <div className="px-4">
                {s.labor.map((person) => (
                  <div className="technician-card" key={person.id}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="avatar">
                        <Wrench size={16} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium">
                          {person.name}
                          <span className="badge success text-[7px] ml-2">Disponible Arequipa</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-1">{person.specialty}</p>
                        <p className="mono text-[8px] text-muted-foreground mt-1">
                          DNI {person.dni}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <label className="field-label text-[7px]">Tarifa / jornada 8h</label>
                        <div className="flex items-center gap-1 mono">
                          <span className="text-[9px] text-muted-foreground">S/</span>
                          <input
                            className="table-input w-14"
                            type="number"
                            min="0"
                            step="0.01"
                            value={person.dailyRate}
                            onChange={(e) =>
                              s.updateLabor(person.id, {
                                dailyRate: Math.max(0, Number(e.target.value)),
                              })
                            }
                          />
                        </div>
                      </div>
                      <span className="text-muted-foreground">×</span>
                      <div>
                        <label className="field-label text-[7px]">Jornadas</label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          className="table-input w-10"
                          value={person.days}
                          onChange={(e) =>
                            s.updateLabor(person.id, { days: Math.max(1, Number(e.target.value)) })
                          }
                        />
                      </div>
                      <div className="min-w-[86px] text-right">
                        <label className="field-label text-[7px]">Subtotal</label>
                        <strong className="mono text-success text-[11px]">
                          {money(person.dailyRate * person.days)}
                        </strong>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => s.toggleTechnician(person.id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
                {s.labor.length === 0 && (
                  <p className="text-muted-foreground text-xs py-6">Sin técnicos asignados.</p>
                )}
              </div>
              <div className="table-footer justify-end">
                SUBTOTAL MANO DE OBRA{" "}
                <strong className="mono text-foreground ml-3 text-xs">{money(t.laborCost)}</strong>
              </div>
            </section>
          )}

          {/* 4. Tabla de Materiales (Paso 2: Se cargan los materiales con markup de la asistenta) */}
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title">
                  <Package />
                  Partidas de Materiales & Suministros
                </h2>
                <p className="panel-description">
                  Paso 2: Costeo de insumos requeridos · Compara precios en Arequipa y Lima
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="text-[9px]"
                onClick={() => openPriceComparison(s.materials[0]?.id)}
              >
                <Scale className="mr-1" size={13} />
                <span className="hidden sm:inline">Comparar Precios</span>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cant.</th>
                    <th>Descripción / Insumo</th>
                    <th>U.M.</th>
                    <th>Costo unit.</th>
                    <th>Impuesto</th>
                    <th>% Margen</th>
                    <th className="text-right">Costo (S/)</th>
                    <th className="text-right">Venta (S/)</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {s.materials.map((m, i) => {
                    const cost = materialDirectCost(m);
                    const sale = materialSaleTotal(m);
                    return (
                      <tr key={m.id}>
                        <td>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="table-input w-11"
                            value={m.qty}
                            onChange={(e) =>
                              s.updateMaterial(m.id, { qty: Math.max(0, Number(e.target.value)) })
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="table-name"
                            value={m.name}
                            onChange={(e) => s.updateMaterial(m.id, { name: e.target.value })}
                          />
                          <input
                            className="table-spec"
                            value={m.spec}
                            onChange={(e) => s.updateMaterial(m.id, { spec: e.target.value })}
                          />
                          <div className="flex items-center gap-1 mt-1">
                            <SupplierCombobox
                              materialId={m.id}
                              value={m.supplier}
                              index={i + 1}
                              onRegister={(name) => openSupplier(m.id, name)}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-blue-400 hover:text-blue-300"
                              title="Comparar cotizaciones de este insumo"
                              onClick={() => openPriceComparison(m.id)}
                            >
                              <Scale size={12} />
                            </Button>
                          </div>
                        </td>
                        <td>
                          <input
                            className="table-input w-10 text-[9px]"
                            value={m.um}
                            onChange={(e) => s.updateMaterial(m.id, { um: e.target.value })}
                          />
                        </td>
                        <td>
                          <div className="flex gap-1 items-center">
                            <select
                              className="table-input w-12 text-[8px]"
                              value={m.currency}
                              onChange={(e) =>
                                s.updateMaterial(m.id, {
                                  currency: e.target.value === "USD" ? "USD" : "PEN",
                                })
                              }
                            >
                              <option>PEN</option>
                              <option>USD</option>
                            </select>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="table-input w-16 text-right"
                              value={m.unitCost}
                              onChange={(e) =>
                                s.updateMaterial(m.id, {
                                  unitCost: Math.max(0, Number(e.target.value)),
                                })
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-1 text-[8px] ${m.hasIgv ? "text-primary" : "text-muted-foreground"}`}
                            onClick={() => s.updateMaterial(m.id, { hasIgv: !m.hasIgv })}
                          >
                            {m.hasIgv ? "+IGV 18%" : "SIN IGV"}
                          </Button>
                        </td>
                        <td>
                          <div className="flex items-center gap-0.5">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              className="table-input w-12 text-center text-xs font-mono font-bold text-blue-400"
                              value={m.markupPercent ?? 20}
                              onChange={(e) =>
                                s.updateMaterial(m.id, {
                                  markupPercent: Math.max(0, Number(e.target.value)),
                                })
                              }
                            />
                            <span className="text-[10px] text-muted-foreground">%</span>
                          </div>
                        </td>
                        <td className="text-right whitespace-nowrap mono text-[11px] text-slate-400">
                          {money(cost)}
                        </td>
                        <td className="text-right whitespace-nowrap mono text-[11px] font-bold text-emerald-400">
                          {money(sale)}
                        </td>
                        <td>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => s.removeMaterial(m.id)}
                          >
                            <Trash2 size={13} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary px-0 h-6 text-[10px]"
                onClick={s.addMaterial}
              >
                <Plus />
                Agregar material
              </Button>
              <span>
                SUBTOTAL INSUMOS (VENTA){" "}
                <strong className="mono text-foreground ml-3 text-xs">
                  {money(t.materialsSale)}
                </strong>
              </span>
            </div>
          </section>

          {/* 5. Gastos Logísticos */}
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title">
                  <Truck />
                  Gastos operativos & logística
                </h2>
                <p className="panel-description">
                  Costos directos de movilidad interna o flete interprovincial
                </p>
              </div>
              <span className="badge warning">COSTO DIRECTO</span>
            </div>
            <div className="px-4">
              {(
                [
                  {
                    key: "freight",
                    name: "Flete / Movilidad",
                    description: "Traslado Taller Precisur → Frente de obra o recojo de insumos",
                    icon: Truck,
                  },
                  {
                    key: "equipmentRental",
                    name: "Alquiler de equipos",
                    description: "Equipos especiales o herramientas alquiladas para la labor",
                    icon: Wrench,
                  },
                  {
                    key: "epp",
                    name: "Viáticos & EPPs",
                    description: "Seguridad y protección para la cuadrilla en campo",
                    icon: ShieldCheck,
                  },
                ] as const
              )
                .filter((x) => s.mode === "service" || x.key === "freight")
                .map((x) => (
                  <div
                    key={x.key}
                    className="grid grid-cols-[minmax(0,1fr)_100px] sm:grid-cols-[170px_minmax(0,1fr)_100px] items-center gap-3 py-4 border-b last:border-0"
                  >
                    <span className="text-[10px] font-medium flex items-center gap-2">
                      <x.icon size={14} className="text-warning" />
                      {x.name}
                    </span>
                    <p className="text-[9px] text-muted-foreground hidden sm:block">
                      {x.description}
                    </p>
                    <div className="flex gap-1 items-center mono text-[10px]">
                      <span className="text-muted-foreground">S/</span>
                      <input
                        className="table-input w-full text-right"
                        type="number"
                        min="0"
                        step="0.01"
                        value={s.logistics[x.key]}
                        onChange={(e) => s.setLogistics(x.key, Number(e.target.value))}
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div className="table-footer justify-end">
              SUBTOTAL LOGÍSTICA{" "}
              <strong className="mono text-foreground ml-3 text-xs">
                {money(t.logisticsCost)}
              </strong>
            </div>
          </section>
        </div>

        {/* Sidebar Confidencial */}
        <aside className="space-y-4 xl:sticky xl:top-5">
          <section className="panel">
            <div className="panel-heading">
              <h2 className="panel-title text-xs">
                <LockKeyhole className="text-warning" />
                Costo interno consolidado
              </h2>
              <span className="badge warning text-[7px]">CONFIDENCIAL</span>
            </div>
            <div className="p-4">
              <div className="eyebrow text-[8px] mb-4">DESGLOSE DE COSTO DIRECTO</div>
              <div className="cost-line">
                <span>Materiales & suministros</span>
                <strong>{money(t.materialsCost)}</strong>
              </div>
              {s.mode === "service" && (
                <div className="cost-line">
                  <span>Mano de obra técnica</span>
                  <strong>{money(t.laborCost)}</strong>
                </div>
              )}
              <div className="cost-line">
                <span>Flete / movilidad</span>
                <strong>{money(s.logistics.freight)}</strong>
              </div>

              <div className="bg-background rounded p-4 mt-5 border">
                <div className="eyebrow text-primary text-[8px]">COSTO BASE DIRECTO OPERATIVO</div>
                <div className="total-value mt-3" data-testid="direct-total">
                  {money(t.direct)}
                </div>
                <p className="mono text-[9px] text-muted-foreground mt-2">
                  Equivalente USD{" "}
                  {(t.direct / 3.765).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="notice mt-5">
                <Info />
                <span>
                  Márgenes comerciales, flete facturable e IGV se definirán en la aprobación
                  gerencial.
                </span>
              </div>

              <Button className="w-full mt-5 text-[11px]" onClick={review}>
                <ShieldCheck />
                Enviar a Revisión Gerencial
                <kbd className="ml-auto bg-primary-foreground/15 px-1 rounded text-[8px]">F5</kbd>
              </Button>
              <Button
                className="w-full mt-2 text-[10px]"
                variant="secondary"
                onClick={() => {
                  setSaved(true);
                  toast.success("Borrador conservado en la sesión actual");
                }}
              >
                <Save />
                Guardar borrador operativo
              </Button>
            </div>
          </section>
        </aside>
      </div>

      {/* Modal Vista Previa */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-950 border-slate-800 p-6 text-slate-100 shadow-2xl">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-3">
            <DialogTitle className="text-sm font-bold flex items-center gap-2 text-slate-100">
              <Eye size={16} className="text-blue-400" />
              Vista Previa Oficial — {s.quotationNumber}
            </DialogTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => printQuotationDirect(s)}>
                <Printer size={13} className="mr-1.5" /> Imprimir
              </Button>
              <Button size="sm" onClick={() => downloadQuotation(s)}>
                <Download size={13} className="mr-1.5" /> Descargar PDF
              </Button>
            </div>
          </DialogHeader>

          <div
            className="p-4 bg-slate-900/60 rounded-lg overflow-x-auto shadow-inner flex justify-center mt-3 border border-slate-800/80"
            dangerouslySetInnerHTML={{ __html: getQuotationHtmlTemplate(s) }}
          />
        </DialogContent>
      </Dialog>

      {entry && (
        <QuickEntry
          key={entry}
          kind={entry}
          close={() => setEntry(null)}
          materialId={materialId}
          initialSupplierName={supplierName}
        />
      )}
      <SupplierDrawer open={drawer} close={() => setDrawer(false)} materialId={materialId} />
    </>
  );
}
