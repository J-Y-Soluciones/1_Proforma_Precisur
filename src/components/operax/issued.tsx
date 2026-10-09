import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Download, Printer, ShieldCheck, Send, Copy, Link2,
  History, Wrench, LockKeyhole, ArrowLeft,
  CheckCircle2, QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuotationStore, calculateTotals, money } from '@/stores/quotation';
import { downloadQuotation, printQuotationDirect } from '@/lib/quotation-pdf';
import { toast } from 'sonner';

export function Issued() {
  const s = useQuotationStore();
  const t = calculateTotals(s);
  const [history, setHistory] = useState(false);
  const [requireRuc, setRequireRuc] = useState(true);

  const message = `Estimado *${s.client.contact}*,\nAdjuntamos la propuesta comercial Nº 60-000569 de Multiservicios Precisur S.A.C. para *${s.client.name}*.\n\n• Monto total: *${money(t.total)} PEN* (Inc. IGV)\n• Plazo: 04 días hábiles\n• Condición de pago: ${s.client.paymentTerm}\n\nQuedamos atentos a su confirmación.`;

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copiado al portapapeles');
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  return (
    <>
      <div className="space-y-6 screen-only">
        {/* Barra Superior */}
        <div className="flex flex-wrap justify-between gap-3 items-center">
          <div className="flex items-center gap-2 text-xs">
            <Link to="/cotizador" className="text-slate-400 hover:text-slate-200 flex items-center gap-1">
              <ArrowLeft size={12} /> Cotizaciones
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 font-mono">PROP-2026-0481</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={11} /> PROPUESTA EMITIDA & APROBADA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => setHistory(!history)} className="h-8 text-xs bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700">
              <History size={13} className="mr-1.5" /> Historial
            </Button>
            <Button size="sm" variant="secondary" onClick={() => printQuotationDirect(s)} className="h-8 text-xs bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700">
              <Printer size={13} className="mr-1.5" /> Imprimir
            </Button>
            <Button size="sm" onClick={() => downloadQuotation(s)} className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white">
              <Download size={13} className="mr-1.5" /> Descargar PDF
            </Button>
          </div>
        </div>

        {history && (
          <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
            <div className="font-semibold text-slate-200">Historial de Auditoría</div>
            <p className="text-slate-400">Creado por: Ing. R. Huamán (Taller Arequipa) · Aprobado por: Gerencia General</p>
            {s.observations && <p className="text-amber-400">Observaciones: {s.observations}</p>}
          </div>
        )}

        {/* Layout Principal */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">

            {/* Cabecera */}
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Wrench size={22} />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-100 tracking-tight">MULTISERVICIOS PRECISUR S.A.C.</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Mantenimiento Mecánico Industrial & Calderería Pesada</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">RUC: <strong className="text-slate-400">20610357874</strong> · Planta Central: Parque Industrial Río Seco, Arequipa</p>
                </div>
              </div>

              <div className="border border-slate-800 bg-slate-950/60 rounded-lg p-3 text-right min-w-[200px]">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PROFORMA TÉCNICA COMERCIAL</div>
                <div className="text-base font-bold text-blue-400 font-mono mt-0.5">PROP-2026-0481</div>
                <div className="text-[10px] text-slate-500 mt-1 flex justify-end gap-2">
                  <span>Emisión: 08/10/2026</span>
                  <span>·</span>
                  <span>Vence: 23/10/2026 (15 días)</span>
                </div>
              </div>
            </div>

            {/* Ficha Cliente & Frente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/50 border border-slate-800/80 rounded-lg p-4 text-xs">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">RAZÓN SOCIAL / CLIENTE</div>
                <div className="text-sm font-bold text-slate-100">{s.client.name}</div>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="font-mono text-slate-400">RUC: {s.client.ruc}</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    HABIDO / ACTIVO
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] pt-1">Atención: {s.client.contact}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">FRENTE OPERATIVO / MODALIDAD</div>
                <div className="text-sm font-bold text-slate-200">Planta Arequipa — Módulo Hidráulico Sur</div>
                <div className="text-slate-400 text-[11px]">{s.client.address}</div>
                <div className="text-slate-400 text-[11px] pt-1">
                  Modalidad: <span className="text-blue-400 font-medium">{s.mode === 'service' ? 'Servicio Integral a Todo Costo' : 'Suministro / Reventa'}</span> · Moneda: Soles (PEN)
                </div>
              </div>
            </div>

            {/* Tabla Dinámica de Partidas */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold text-left">
                    <th className="py-2.5 pr-3">ÍTEM</th>
                    <th className="py-2.5 px-3">DESCRIPCIÓN DEL SERVICIO & ESPECIFICACIONES TÉCNICAS</th>
                    <th className="py-2.5 px-3">U.M.</th>
                    <th className="py-2.5 px-3 text-right">CANT.</th>
                    <th className="py-2.5 px-3 text-right">P. UNITARIO (S/)</th>
                    <th className="py-2.5 pl-3 text-right">TOTAL (S/)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {s.services.map((item, index) => {
                    const itemTotal = index === 0 ? t.sale : (index === 1 ? s.commercialFreight : 0);
                    return (
                      <tr key={item.id}>
                        <td className="py-4 pr-3 align-top font-mono text-slate-400">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="py-4 px-3 align-top space-y-2">
                          <div className="font-bold text-slate-100 text-xs">
                            {item.title}
                          </div>
                          <p className="text-slate-400 leading-relaxed text-[11px] whitespace-pre-line">
                            {item.description}
                          </p>
                          {item.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {item.tags.map((tag) => (
                                <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-3 align-top text-slate-400 font-mono">{item.um}</td>
                        <td className="py-4 px-3 align-top text-right font-mono text-slate-300">
                          {item.qty.toFixed(2)}
                        </td>
                        <td className="py-4 px-3 align-top text-right font-mono text-slate-300">
                          {money(itemTotal / item.qty)}
                        </td>
                        <td className="py-4 pl-3 align-top text-right font-mono font-bold text-slate-100">
                          {money(itemTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Resumen Final */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-800 items-start">
              <div className="md:col-span-7 space-y-4 text-xs">
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">IMPORTE EN LETRAS</div>
                  <div className="font-semibold text-slate-200 mt-0.5">SON: SEIS MIL SEISCIENTOS VEINTITRÉS CON 43/100 SOLES (PEN).</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">Ref. Extranjera: USD ${(t.total / 3.765).toFixed(2)} (T.C. Oficial: S/ 3.765)</div>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-400">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CONDICIONES CONTRACTUALES</div>
                  <ul className="space-y-1 list-disc pl-4">
                    <li><strong>Validez de Oferta:</strong> 15 días calendario a partir de su emisión.</li>
                    <li><strong>Plazo de Ejecución:</strong> 04 días hábiles tras recepción de Orden de Servicio formal.</li>
                    <li><strong>Condición de Pago:</strong> {s.client.paymentTerm}.</li>
                    <li><strong>Garantía Operativa:</strong> 12 meses con entrega de Dossier de Calidad y Pruebas Hidrostáticas.</li>
                  </ul>
                </div>
              </div>

              <div className="md:col-span-5 bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Venta Neta:</span>
                  <span className="font-mono text-slate-200">{money(t.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>I.G.V. de Ley (18.00%):</span>
                  <span className="font-mono text-slate-200">{money(t.igv)}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-sm pt-2.5 border-t border-slate-800 text-slate-100">
                  <div>
                    <div>TOTAL COMERCIAL</div>
                    <div className="text-[10px] font-normal text-slate-400">Facturable con O/S</div>
                  </div>
                  <span className="font-mono text-emerald-400 text-base">{money(t.total)}</span>
                </div>
              </div>
            </div>

            {/* Firmas y Sellos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs text-slate-400 items-center">
              <div className="flex items-center gap-2.5">
                <Wrench size={18} className="text-slate-500 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">RESPONSABLE TÉCNICO</div>
                  <div className="font-semibold text-slate-200">Ing. R. Huamán</div>
                  <div className="text-[10px] font-mono text-slate-500">CIP Nº 184291</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">APROBACIÓN COMERCIAL</div>
                  <div className="font-semibold text-slate-200">Gerencia Operaciones</div>
                  <div className="text-[10px] text-emerald-500 font-medium">Firma Digital Verificada</div>
                </div>
              </div>

              <div className="flex items-center justify-start sm:justify-end gap-2.5">
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-500 text-right">VERIFICACIÓN SUNAT</div>
                  <div className="font-mono text-[10px] text-slate-400 text-right">TOKEN-0481-B2B</div>
                </div>
                <QrCode size={28} className="text-slate-400 shrink-0" />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/60 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Documento firmado electrónicamente. Validez jurídica Ley Nº 27269.
              </span>
              <span>SHA-256: 7f83b1...a94c REV: 01 (ORIGINAL)</span>
            </div>
          </div>

          {/* Panel Lateral: WhatsApp y Auditoría */}
          <aside className="space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Send size={14} className="text-emerald-400" /> Despacho WhatsApp Directo
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CLIENTE NOTIFICABLE
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">DESTINATARIO:</div>
                <div className="font-semibold text-slate-200">Ing. Carlos Mendoza</div>
                <div className="text-[11px] text-slate-400 font-mono">+51 958 432 109</div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase">MENSAJE EDITABLE PREPARADO</div>
                <textarea
                  id="whatsapp-message"
                  defaultValue={message}
                  className="w-full h-36 bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-300 leading-relaxed resize-none focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2 pt-1">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9"
                  onClick={() => {
                    const field = document.getElementById('whatsapp-message');
                    const text = field instanceof HTMLTextAreaElement ? field.value : message;
                    window.open(`https://wa.me/51958432109?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <Send size={13} className="mr-1.5" /> Compartir por WhatsApp (Directo)
                </Button>
                <Button
                  variant="secondary"
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs h-9 border border-slate-700"
                  onClick={() => {
                    const field = document.getElementById('whatsapp-message');
                    copy(field instanceof HTMLTextAreaElement ? field.value : message);
                  }}
                >
                  <Copy size={13} className="mr-1.5" /> Copiar Mensaje al Portapapeles
                </Button>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 shadow-xl text-xs">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Link2 size={14} className="text-blue-400" /> Enlace Seguro de Cotización
              </h3>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">URL OFICIAL DE ACCESO CLIENTE</div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-[10px] text-slate-300 break-all">
                  <span className="truncate">https://operax.precisur.pe/p/PROP-2026-0481</span>
                  <button onClick={() => copy('https://operax.precisur.pe/p/PROP-2026-0481')} className="text-slate-400 hover:text-white shrink-0">
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-[11px] font-semibold text-slate-200">Validación RUC 20601234567 para acceder</div>
                  <div className="text-[10px] text-slate-400 leading-tight">Exige confirmación de RUC previo a descarga de PDF.</div>
                </div>
                <input
                  type="checkbox"
                  checked={requireRuc}
                  onChange={(e) => setRequireRuc(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <Button
                variant="secondary"
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs h-9 border border-slate-700 mt-2"
                onClick={() => copy('https://operax.precisur.pe/p/PROP-2026-0481')}
              >
                <Copy size={13} className="mr-1.5" /> Copiar Enlace Público Directo
              </Button>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2.5 shadow-xl text-xs">
              <h3 className="font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                <ShieldCheck size={14} className="text-amber-400" /> Auditoría & Control Interno
              </h3>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Estado Operativo:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Emitida & Notificada
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Aprobado por:</span>
                <span className="text-slate-200 font-semibold">Gerencia General (08/10/2026)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Elaborador:</span>
                <span className="text-slate-200 font-semibold">Ing. R. Huamán (Taller AQP)</span>
              </div>
              <div className="flex justify-between py-1 items-center">
                <span className="text-amber-400 flex items-center gap-1">
                  <LockKeyhole size={11} /> [CONFIDENCIAL · SOLO GERENCIA]
                </span>
                <span className="font-mono text-emerald-400 font-bold">{s.marginPercent.toFixed(2)}%</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
