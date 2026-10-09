import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { 
  ShieldAlert, ArrowLeft, CheckCircle2, XCircle, 
  TrendingUp, Truck, ChevronDown, ChevronUp, LockKeyhole,
  Smartphone, Monitor, MapPin, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { useQuotationStore, calculateTotals, money } from '@/stores/quotation';
import { toast } from 'sonner';

export function Approval() {
  const navigate = useNavigate();
  const s = useQuotationStore();
  const t = calculateTotals(s);

  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('desktop');
  const [margin, setMargin] = useState<number>(s.marginPercent || 35);
  const [freight, setFreight] = useState<number>(s.commercialFreight || 250);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);
  const [rejectOpen, setRejectOpen] = useState<boolean>(false);
  const [observation, setObservation] = useState<string>('');

  const baseCost = t.direct || 3486.00;
  const subtotalVenta = (baseCost + freight) / (1 - margin / 100);
  const utilidadBruta = subtotalVenta - (baseCost + freight);
  const igv = subtotalVenta * 0.18;
  const totalCotizacion = subtotalVenta + igv;

  const handleApprove = () => {
    s.setMargin(margin);
    s.setCommercialFreight(freight);
    s.setStatus('Aprobada');
    
    toast.success('¡Cotización aprobada por Gerencia!', {
      description: 'Generando proforma oficial Nº 60-000569...'
    });

    // La ruta exacta registrada en las rutas de TanStack es:
    navigate({ to: '/ficha-emitida' });
  };

  const handleConfirmReject = () => {
    if (!observation.trim()) {
      toast.error('Indica el motivo técnico de devolución.');
      return;
    }
    s.reject(observation);
    toast.warning('Proforma devuelta al Taller con observaciones.');
    setRejectOpen(false);
    navigate({ to: '/cotizador' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* Barra de Controles */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <button 
              onClick={() => navigate({ to: '/cotizador' })}
              className="hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={13} /> Volver al Cotizador
            </button>
            <span>/</span>
            <span className="font-mono text-slate-300">{s.quotationNumber || 'COTIZACIÓN Nº 60-000569'}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Aprobación Gerencial
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-normal">
              Rol: Gerente General
            </span>
          </h1>
        </div>

        {/* Toggle para la Presentación */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex items-center gap-1">
            <button
              onClick={() => setDeviceView('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                deviceView === 'mobile' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone size={14} /> 📱 Vista Celular (Gerente en Obra)
            </button>
            <button
              onClick={() => setDeviceView('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                deviceView === 'desktop' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor size={14} /> 💻 Vista Escritorio / Tablet
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor Adaptativo */}
      <div className={`transition-all duration-300 ${
        deviceView === 'mobile' 
          ? 'max-w-[420px] mx-auto p-4 bg-slate-950/80 border-2 border-slate-800 rounded-[38px] shadow-2xl ring-8 ring-slate-900/60' 
          : 'w-full'
      }`}>
        
        {deviceView === 'mobile' && (
          <div className="w-full flex justify-between items-center px-4 pt-1 pb-4 text-[11px] text-slate-400 font-mono">
            <span>09:41</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto"></div>
            <span>5G 100%</span>
          </div>
        )}

        <div className={`space-y-5 ${deviceView === 'desktop' ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start space-y-0' : ''}`}>
          
          {/* COLUMNA 1: CLIENTE Y COSTO BASE TALLER */}
          <div className={`space-y-4 ${deviceView === 'desktop' ? 'lg:col-span-5' : ''}`}>
            
            {/* Tarjeta Cliente */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">APROBACIÓN DE PROFORMA</span>
                  <h3 className="text-sm font-bold text-slate-100 mt-0.5">{s.client.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">RUC: {s.client.ruc}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  HABIDO
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-500 shrink-0"/> {s.client.address}</p>
                <p className="flex items-center gap-1.5"><Building2 size={12} className="text-slate-500 shrink-0"/> Modalidad: {s.mode === 'service' ? 'Servicio Integral' : 'Suministro'}</p>
              </div>
            </div>

            {/* Tarjeta Costo Directo Taller */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <LockKeyhole size={15} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">CONFIDENCIAL · SOLO INTERNO</h3>
                    <p className="text-[10px] text-slate-500">Costo Base Liquidado (Sin Margen)</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Costo Taller
                </span>
              </div>

              <div>
                <div className="text-2xl font-black font-mono text-slate-100">
                  {money(baseCost)} <span className="text-xs font-normal text-slate-400">PEN</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Equivalente aprox: USD ${(baseCost / 3.765).toFixed(2)}
                </div>
              </div>

              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">• Materiales & Insumos ({s.materials.length} partidas)</span>
                  <span className="font-mono">{money(t.materials)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">• Mano de Obra ({s.labor.length} técnicos)</span>
                  <span className="font-mono">{money(t.labor)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">• Movilidad / Flete Taller-Obra</span>
                  <span className="font-mono">{money(s.logistics.freight)}</span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full text-[11px] h-8 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700"
              >
                {showBreakdown ? (
                  <>Ocultar detalle <ChevronUp size={13} className="ml-1" /></>
                ) : (
                  <>Ver Desglose de Insumos y Cuadrilla <ChevronDown size={13} className="ml-1" /></>
                )}
              </Button>

              {showBreakdown && (
                <div className="pt-2 border-t border-slate-800 text-[10px] space-y-1.5 text-slate-400 bg-slate-950/60 p-3 rounded-lg">
                  {s.materials.map(m => (
                    <p key={m.id}>• {m.qty}x {m.name} ({m.spec})</p>
                  ))}
                  {s.labor.map(tech => (
                    <p key={tech.id} className="text-blue-400">• {tech.name} - {tech.specialty} ({tech.days} jorn.)</p>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* COLUMNA 2: MARGEN, PARÁMETROS Y DECISIÓN */}
          <div className={`space-y-4 ${deviceView === 'desktop' ? 'lg:col-span-7' : ''}`}>
            
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <TrendingUp size={14} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-200">Margen & Parámetros</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Interactivo
                </span>
              </div>

              {/* Presets */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  PRESETS DE MARGEN OBJETIVO
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 30, 35, 40].map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant={margin === preset ? "default" : "secondary"}
                      onClick={() => setMargin(preset)}
                      className={`h-8 text-xs font-bold ${
                        margin === preset 
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      {preset}%
                    </Button>
                  ))}
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Ajuste Fino de Margen Comercial:</span>
                  <span className="font-bold text-blue-400 font-mono">{margin}%</span>
                </div>
                <Slider
                  value={[margin]}
                  min={10}
                  max={60}
                  step={1}
                  onValueChange={(val) => setMargin(val[0])}
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>10% Mín</span>
                  <span className="text-blue-400">Margen Sugerido (35%)</span>
                  <span>60% Máx</span>
                </div>
              </div>

              {/* Utilidad Bruta */}
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center text-xs">
                <span className="text-emerald-300 font-medium">Utilidad Bruta Estimada:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  + {money(utilidadBruta)}
                </span>
              </div>

              {/* Flete Facturable */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Truck size={13} className="text-slate-400" />
                    FLETE COMERCIAL FACTURABLE (S/):
                  </label>
                  <input
                    type="number"
                    value={freight}
                    onChange={(e) => setFreight(Number(e.target.value) || 0)}
                    className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right font-mono font-bold text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500">Gastos de movilización y seguro de traslado incluidos al cliente.</p>
              </div>
            </div>

            {/* Propuesta Comercial Final */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-200">Propuesta Comercial Final</h3>
                <span className="text-[10px] text-slate-400 font-mono">18% IGV INCLUIDO</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Venta Base (Costo + Margen + Flete):</span>
                  <span className="font-mono text-slate-200 font-bold">{money(subtotalVenta)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>I.G.V. de Ley (18.00%):</span>
                  <span className="font-mono text-slate-200 font-bold">{money(igv)}</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-slate-200">TOTAL PROPUESTA A FACTURAR:</div>
                    <div className="text-[10px] text-slate-500">Aprox. USD ${(totalCotizacion / 3.765).toFixed(2)} · T.C. 3.765</div>
                  </div>
                  <div className="text-xl font-black font-mono text-emerald-400">
                    {money(totalCotizacion)}
                  </div>
                </div>
              </div>

              {/* Botonera */}
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

      {/* DIÁLOGO CENTRADO DE RECHAZO (REEMPLAZA AL DRAWER INFERIOR) */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2 text-slate-100">
              <ShieldAlert className="text-rose-400 size-4" /> Devolver a Taller con Observaciones
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Escribe las instrucciones prioritarias para el cotizador de taller antes de emitir formalmente.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ej: Confirmar calibración de manómetros en planta antes del montaje el día lunes..."
              className="h-28 bg-slate-950 border-slate-800 text-slate-200 text-xs resize-none focus:border-blue-500"
            />
          </div>

          <DialogFooter className="flex gap-2 justify-end sm:justify-end pt-2">
            <Button variant="secondary" size="sm" onClick={() => setRejectOpen(false)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300">
              Cancelar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmReject} className="text-xs bg-rose-600 hover:bg-rose-500">
              Confirmar Devolución
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
