import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Building2, LockKeyhole, Package, Users, Truck, Plus,
  Search, Trash2, ShieldCheck, ArrowRight, Check, Save,
  Info, MapPin, Phone, Wrench, ChevronRight, Clock3,
  Download, FileCheck2, Eye, Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { useQuotationStore, calculateTotals, materialTotal, money } from '@/stores/quotation';
import { QuickEntry, SupplierDrawer, type EntryKind } from './quick-entry';
import { downloadQuotation, getQuotationHtmlTemplate, printQuotationDirect } from '@/lib/quotation-pdf';
import { toast } from 'sonner';
import { SupplierCombobox } from './supplier-combobox';

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
    s.setStatus('Pendiente de aprobación');
    navigate({ to: '/aprobacion-movil' });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        useQuotationStore.getState().setStatus('Pendiente de aprobación');
        navigate({ to: '/aprobacion-movil' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const openSupplier = (id: string, name: string) => {
    setMaterialId(id);
    setSupplierName(name);
    setEntry('supplier');
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
          <span className={`badge ${s.status.includes('Observaciones') ? 'warning' : 'blue'}`}>
            <i className="online-dot" />
            {s.status}
          </span>
          <span className="text-[9px] text-muted-foreground hidden sm:inline-flex items-center gap-1">
            <Clock3 size={11} />
            {saved ? 'Borrador guardado en sesión' : 'Sesión de trabajo activa'}
          </span>
        </div>
      </div>

      {/* Título de la página y Botón Vista Previa PDF */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="page-title mt-0">Cotizador operativo</h1>
            <span className="badge blue hidden sm:inline-flex">TALLER AREQUIPA</span>
          </div>
          <p className="page-subtitle">Costeo técnico y propuesta comercial · Multiservicios Precisur S.A.C.</p>
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
          <span className="text-muted-foreground mx-2 hidden xl:inline">Elaborador: Ing. R. Huamán</span>
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
          <span><strong>Observaciones de gerencia:</strong> {s.observations}</span>
        </div>
      )}

      {/* Estructura Principal: Formulario y Sidebar Confidencial */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_310px] gap-5 items-start">
        <div className="min-w-0 space-y-5">

          {/* Tarjeta de Cliente */}
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title"><Building2 />Cliente & parámetros de operación</h2>
                <p className="panel-description">Entidad fiscal y condiciones del servicio</p>
              </div>
              <Button size="sm" variant="ghost" className="text-primary" onClick={() => setEntry('client')}>
                <Plus /><span className="hidden sm:inline">Cliente</span>
              </Button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
                <div>
                  <label className="field-label">Razón social del cliente</label>
                  <div className="control flex justify-between gap-2 items-center">
                    <span className="truncate text-[11px] font-medium">{s.client.name}</span>
                    <span className="badge success text-[8px]"><Check size={9} />HABIDO</span>
                  </div>
                </div>
                <div>
                  <label className="field-label">RUC / SUNAT (activo)</label>
                  <div className="control flex gap-2 items-center mono">
                    <ShieldCheck size={13} className="text-success" />{s.client.ruc}
                  </div>
                </div>
                <div>
                  <label className="field-label">Dirección de entrega / frente de obra</label>
                  <div className="control flex items-start gap-2 text-[10px]">
                    <MapPin size={13} className="text-muted-foreground shrink-0" />{s.client.address}
                  </div>
                </div>
                <div>
                  <label className="field-label">Contacto técnico / teléfono</label>
                  <div className="control text-[10px] flex gap-2">
                    <Phone size={13} className="text-muted-foreground shrink-0" />{s.client.contact}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t flex flex-wrap gap-x-5 gap-y-2 text-[9px]">
                <span className="text-muted-foreground">Moneda <strong className="text-foreground ml-1 mono">PEN (S/)</strong></span>
                <span className="text-muted-foreground">Condición <strong className="text-foreground ml-1">{s.client.paymentTerm}</strong></span>
                <span className="text-success flex gap-1 items-center"><ShieldCheck size={11} />Cliente de demostración</span>
              </div>
            </div>
            <div className="border-t px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <span className="field-label mb-0">Modalidad de cotización</span>
              <div className="flex bg-background p-1 rounded gap-1">
                <Button size="sm" variant={s.mode === 'service' ? 'default' : 'ghost'} onClick={() => s.setMode('service')} className="text-[10px]">
                  <Wrench />Servicio integral
                </Button>
                <Button size="sm" variant={s.mode === 'supply' ? 'default' : 'ghost'} onClick={() => s.setMode('supply')} className="text-[10px]">
                  <Package />Suministro / Reventa
                </Button>
              </div>
            </div>
          </section>

          {/* Partidas Comerciales de Servicio */}
          {s.mode === 'service' && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2 className="panel-title flex items-center gap-2">
                    <Wrench className="size-4 text-primary" />
                    Partidas Comerciales & Alcance Técnico
                  </h2>
                  <p className="panel-description">
                    {s.services.length} partida(s) de servicio que figurarán en la propuesta del cliente
                  </p>
                </div>
                <Button size="sm" variant="secondary" className="text-[10px]" onClick={s.addService}>
                  <Plus size={13} className="mr-1" />
                  Agregar Partida
                </Button>
              </div>

              <div className="p-4 space-y-4">
                {s.services.map((item, index) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        ÍTEM {String(index + 1).padStart(2, '0')}
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
                          onChange={(e) => s.updateService(item.id, { qty: Number(e.target.value) || 1 })}
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
                        placeholder="Ej: Servicio Integral de Mantenimiento Skid Valvular..."
                      />
                    </div>

                    <div>
                      <label className="field-label text-[10px] uppercase font-bold text-slate-400">
                        Descripción del servicio & Especificaciones técnicas (Multilínea)
                      </label>
                      <textarea
                        rows={3}
                        className="control w-full text-xs leading-relaxed text-slate-200 mt-1 resize-y"
                        value={item.description}
                        onChange={(e) => s.updateService(item.id, { description: e.target.value })}
                        placeholder="Detalla normas aplicadas (ASME, API, AWS), pruebas PT, torque, desmontaje, etc."
                      />
                    </div>

                    <div>
                      <label className="field-label text-[10px] uppercase font-bold text-slate-400">
                        Etiquetas de certificación / normas (separadas por coma)
                      </label>
                      <input
                        type="text"
                        className="control w-full text-xs text-slate-300 mt-1 font-mono"
                        value={item.tags?.join(', ') || ''}
                        onChange={(e) => s.updateService(item.id, {
                          tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                        })}
                        placeholder="Ej: ASME B31.3, API 598, AWS D1.1 6G, Dossier PT Incluido"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tabla de Materiales */}
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title"><Package />Partidas técnicas — Materiales & suministros</h2>
                <p className="panel-description">{s.materials.length} partidas · Costos de adquisición en PEN / USD</p>
              </div>
              <Button size="sm" variant="secondary" className="text-[9px]" onClick={() => { setMaterialId(s.materials[0]?.id); setDrawer(true); }}>
                <Search /><span className="hidden sm:inline">Buscar proveedores</span>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cant.</th>
                    <th>Descripción / trazabilidad</th>
                    <th>U.M.</th>
                    <th>Costo unit.</th>
                    <th>Impuesto</th>
                    <th className="text-right">Subtotal (S/)</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {s.materials.map((m, i) => (
                    <tr key={m.id}>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="table-input w-11"
                          aria-label={`Cantidad material ${i + 1}`}
                          value={m.qty}
                          onChange={e => s.updateMaterial(m.id, { qty: Math.max(0, Number(e.target.value)) })}
                        />
                      </td>
                      <td>
                        <input
                          className="table-name"
                          aria-label={`Nombre material ${i + 1}`}
                          value={m.name}
                          onChange={e => s.updateMaterial(m.id, { name: e.target.value })}
                        />
                        <input
                          className="table-spec"
                          aria-label={`Especificación material ${i + 1}`}
                          value={m.spec}
                          onChange={e => s.updateMaterial(m.id, { spec: e.target.value })}
                        />
                        <SupplierCombobox
                          materialId={m.id}
                          value={m.supplier}
                          index={i + 1}
                          onRegister={name => openSupplier(m.id, name)}
                        />
                      </td>
                      <td>
                        <input
                          className="table-input w-10 text-[9px]"
                          aria-label={`Unidad material ${i + 1}`}
                          value={m.um}
                          onChange={e => s.updateMaterial(m.id, { um: e.target.value })}
                        />
                      </td>
                      <td>
                        <div className="flex gap-1 items-center">
                          <select
                            className="table-input w-12 text-[8px]"
                            aria-label={`Moneda material ${i + 1}`}
                            value={m.currency}
                            onChange={e => s.updateMaterial(m.id, { currency: e.target.value === 'USD' ? 'USD' : 'PEN' })}
                          >
                            <option>PEN</option>
                            <option>USD</option>
                          </select>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="table-input w-16 text-right"
                            aria-label={`Costo material ${i + 1}`}
                            value={m.unitCost}
                            onChange={e => s.updateMaterial(m.id, { unitCost: Math.max(0, Number(e.target.value)) })}
                          />
                        </div>
                        <p className="text-[8px] text-muted-foreground mono mt-2">
                          {money(m.unitCost * (m.currency === 'USD' ? 3.765 : 1))}
                        </p>
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 px-1 text-[8px] ${m.hasIgv ? 'text-primary' : 'text-muted-foreground'}`}
                          aria-label={`IGV material ${i + 1}`}
                          aria-pressed={m.hasIgv}
                          onClick={() => s.updateMaterial(m.id, { hasIgv: !m.hasIgv })}
                        >
                          {m.hasIgv ? '+IGV 18%' : 'SIN IGV'}
                        </Button>
                      </td>
                      <td className="text-right whitespace-nowrap mono text-[11px] font-medium">
                        {money(materialTotal(m))}
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          aria-label={`Eliminar material ${i + 1}`}
                          onClick={() => s.removeMaterial(m.id)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <Button variant="ghost" size="sm" className="text-primary px-0 h-6 text-[10px]" onClick={s.addMaterial}>
                <Plus />Agregar material
              </Button>
              <span>SUBTOTAL INSUMOS <strong className="mono text-foreground ml-3 text-xs">{money(t.materials)}</strong></span>
            </div>
          </section>

          {/* Mano de Obra y Cuadrilla */}
          {s.mode === 'service' && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2 className="panel-title"><Users />Mano de obra especializada & cuadrilla</h2>
                  <p className="panel-description">Costeo de técnicos de taller · Jornadas de 8h y tarifas asignadas</p>
                </div>
                <Button size="sm" variant="secondary" className="text-[9px]" onClick={() => setEntry('technician')}>
                  <Plus /><span className="hidden sm:inline">Asignar técnico</span>
                </Button>
              </div>

              <div className="px-4">
                {s.labor.map((person, i) => (
                  <div className="technician-card" key={person.id}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="avatar"><Wrench size={16} /></span>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium">
                          {person.name}
                          <span className="badge success text-[7px] ml-2">Disponible taller</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-1">{person.specialty}</p>
                        <p className="mono text-[8px] text-muted-foreground mt-1">DNI {person.dni}</p>
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
                            aria-label={`Tarifa técnico ${i + 1}`}
                            value={person.dailyRate}
                            onChange={e => s.updateLabor(person.id, { dailyRate: Math.max(0, Number(e.target.value)) })}
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
                          aria-label={`Días técnico ${i + 1}`}
                          value={person.days}
                          onChange={e => s.updateLabor(person.id, { days: Math.max(1, Number(e.target.value)) })}
                        />
                      </div>
                      <div className="min-w-[86px] text-right">
                        <label className="field-label text-[7px]">Subtotal</label>
                        <strong className="mono text-success text-[11px]">{money(person.dailyRate * person.days)}</strong>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" aria-label={`Quitar técnico ${i + 1}`} onClick={() => s.toggleTechnician(person.id)}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
                {s.labor.length === 0 && <p className="text-muted-foreground text-xs py-6">Sin técnicos asignados.</p>}
              </div>
              <div className="table-footer justify-end">
                SUBTOTAL MANO DE OBRA <strong className="mono text-foreground ml-3 text-xs">{money(t.labor)}</strong>
              </div>
            </section>
          )}

          {/* Gastos Logísticos */}
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title"><Truck />Gastos operativos, alquileres & logística</h2>
                <p className="panel-description">Costos directos de traslado, equipos y seguridad</p>
              </div>
              <span className="badge warning">COSTO DIRECTO</span>
            </div>
            <div className="px-4">
              {([
                { key: 'freight', name: 'Flete / Movilidad', description: 'Traslado Taller Precisur → Frente de obra Cerro Colorado', icon: Truck },
                { key: 'equipmentRental', name: 'Alquiler de equipos', description: 'Motosoldadora Miller · cables porta-electrodo · tarifa 2 días', icon: Wrench },
                { key: 'epp', name: 'Viáticos & EPPs', description: 'Arnés normado, líneas de vida y caretas de seguridad', icon: ShieldCheck }
              ] as const)
                .filter(x => s.mode === 'service' || x.key === 'freight')
                .map(x => (
                  <div key={x.key} className="grid grid-cols-[minmax(0,1fr)_100px] sm:grid-cols-[170px_minmax(0,1fr)_100px] items-center gap-3 py-4 border-b last:border-0">
                    <span className="text-[10px] font-medium flex items-center gap-2">
                      <x.icon size={14} className="text-warning" />
                      {x.name}
                    </span>
                    <p className="text-[9px] text-muted-foreground hidden sm:block">{x.description}</p>
                    <div className="flex gap-1 items-center mono text-[10px]">
                      <span className="text-muted-foreground">S/</span>
                      <input
                        className="table-input w-full text-right"
                        type="number"
                        min="0"
                        step="0.01"
                        aria-label={x.name}
                        value={s.logistics[x.key]}
                        onChange={e => s.setLogistics(x.key, Number(e.target.value))}
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div className="table-footer justify-end">
              SUBTOTAL LOGÍSTICA <strong className="mono text-foreground ml-3 text-xs">{money(t.logistics)}</strong>
            </div>
          </section>
        </div>

        {/* Sidebar Confidencial */}
        <aside className="space-y-4 xl:sticky xl:top-5">
          <section className="panel">
            <div className="panel-heading">
              <h2 className="panel-title text-xs"><LockKeyhole className="text-warning" />Costo interno consolidado</h2>
              <span className="badge warning text-[7px]">CONFIDENCIAL</span>
            </div>
            <div className="p-4">
              <div className="eyebrow text-[8px] mb-4">DESGLOSE DE COSTO DIRECTO</div>
              <div className="cost-line"><span>Materiales & suministros</span><strong>{money(t.materials)}</strong></div>
              <div className="cost-line"><span>Mano de obra técnica</span><strong>{money(t.labor)}</strong></div>
              <div className="cost-line"><span>Flete / movilidad Taller–Obra</span><strong>{money(s.logistics.freight)}</strong></div>
              {s.mode === 'service' && (
                <>
                  <div className="cost-line"><span>Alquiler de equipos</span><strong>{money(s.logistics.equipmentRental)}</strong></div>
                  <div className="cost-line"><span>Viáticos & EPP específico</span><strong>{money(s.logistics.epp)}</strong></div>
                </>
              )}

              <div className="bg-background rounded p-4 mt-5 border">
                <div className="eyebrow text-primary text-[8px]">COSTO BASE DIRECTO OPERATIVO</div>
                <div className="total-value mt-3" data-testid="direct-total">{money(t.direct)}</div>
                <p className="mono text-[9px] text-muted-foreground mt-2">
                  Equivalente USD {(t.direct / 3.765).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="flex justify-between eyebrow text-[7px] mt-5 mb-3">
                <span>Distribución de costos</span>
                <span>100% asignado</span>
              </div>
              <div className="cost-bar">
                {[t.materials, t.labor, t.logistics].map((v, i) => (
                  <span key={i} style={{ flex: t.direct ? v / t.direct : 1 }} />
                ))}
              </div>
              <div className="flex justify-between text-[8px] text-muted-foreground mt-3">
                <span><i className="inline-block w-1 h-1 bg-primary mr-1" />Mat. {t.direct ? (t.materials / t.direct * 100).toFixed(1) : 0}%</span>
                <span><i className="inline-block w-1 h-1 bg-success mr-1" />M.O. {t.direct ? (t.labor / t.direct * 100).toFixed(1) : 0}%</span>
                <span><i className="inline-block w-1 h-1 bg-warning mr-1" />Log. {t.direct ? (t.logistics / t.direct * 100).toFixed(1) : 0}%</span>
              </div>

              <div className="notice mt-5">
                <Info />
                <span>Resumen de costo directo interno. Márgenes comerciales, IGV de venta y precio final se definirán en revisión gerencial.</span>
              </div>

              <Button className="w-full mt-5 text-[11px]" onClick={review}>
                <ShieldCheck />Enviar a Revisión Gerencial
                <kbd className="ml-auto bg-primary-foreground/15 px-1 rounded text-[8px]">F5</kbd>
              </Button>
              <Button
                className="w-full mt-2 text-[10px]"
                variant="secondary"
                onClick={() => { setSaved(true); toast.success('Borrador conservado en la sesión actual'); }}
              >
                <Save />Guardar borrador operativo
              </Button>
              <Button
                className="w-full mt-2 h-6 text-[9px] text-muted-foreground hover:text-slate-200"
                variant="ghost"
                onClick={() => setPreviewOpen(true)}
              >
                Vista previa proforma PDF<ArrowRight size={10} className="ml-1" />
              </Button>
            </div>
          </section>

          <section className="panel p-4">
            <div className="eyebrow text-[8px] flex justify-between">
              VALIDACIÓN OPERATIVA<ShieldCheck size={12} className="text-success" />
            </div>
            <div className="cost-line text-[9px]"><span>Normativa mecánica</span><strong>ASME B31.3 / API 598</strong></div>
            <div className="cost-line text-[9px]"><span>Inspección END</span><strong>Líquidos penetrantes (PT)</strong></div>
            <div className="text-success text-[9px] flex items-center gap-1">
              <Check size={12} />Materiales y cuadrilla asignados
            </div>
          </section>

          <div className="flex gap-2 text-muted-foreground text-[9px] leading-5 p-1">
            <LockKeyhole size={13} className="shrink-0 mt-1" />
            Los costos internos no se incluyen en la ficha comercial del cliente.
          </div>
        </aside>
      </div>

      {/* ========================================================= */}
      {/* MODAL DIALOG: VISTA PREVIA OFICIAL PRECISUR               */}
      {/* ========================================================= */}
      <Dialog
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) {
            document.body.style.pointerEvents = 'auto';
          }
        }}
      >
        <DialogContent
          onEscapeKeyDown={() => { document.body.style.pointerEvents = 'auto'; }}
          onPointerDownOutside={() => { document.body.style.pointerEvents = 'auto'; }}
          className="max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-950 border-slate-800 p-6 text-slate-100 shadow-2xl"
        >
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

          {/* Visor Renderizado de las 2 páginas institucionales */}
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
      <SupplierDrawer
        open={drawer}
        close={() => setDrawer(false)}
        materialId={materialId}
      />
    </>
  );
}