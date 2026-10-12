import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ArrowLeft,
  Printer,
  Download,
  Share2,
  MessageCircle,
  Copy,
  Eye,
  LockKeyhole,
  ShieldCheck,
  Clock,
  MapPin,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuotationStore, calculateTotals, money } from "@/stores/quotation";
import { downloadQuotation, printQuotationDirect } from "@/lib/quotation-pdf";
import { toast } from "sonner";

export function Issued() {
  const navigate = useNavigate();
  const s = useQuotationStore();
  const t = calculateTotals(s);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Mensaje preformateado para enviar en 1 clic por WhatsApp al cliente
  const whatsappMessage =
    `Estimado(a) *${s.client.name}*,\n\nLe saludamos de *Multiservicios Precisur S.A.C.* Adjuntamos la propuesta comercial formal *${s.quotationNumber}*.\n\n` +
    `• *Monto Total:* ${money(t.total)} (Inc. IGV)\n` +
    `• *Condición:* ${s.client.paymentTerm}\n` +
    `• *Vigencia:* 15 días calendario\n\n` +
    `Puede consultar los detalles y especificaciones técnicas en el documento formal adjunto. Quedamos atentos a sus comentarios.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://operax.precisur.pe/p/${encodeURIComponent(s.quotationNumber)}`,
    );
    setCopiedLink(true);
    toast.success("Enlace de consulta copiado al portapapeles");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedMsg(true);
    toast.success("Texto de WhatsApp copiado");
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const cleanPhone = s.client.contact.replace(/\D/g, "").slice(-9);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* Barra de cabecera */}
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
            Ficha Comercial Emitida
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} /> PROPUESTA APROBADA
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => printQuotationDirect(s)}
            className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
          >
            <Printer size={14} className="mr-1.5 text-slate-400" /> Imprimir
          </Button>
          <Button
            size="sm"
            onClick={() => downloadQuotation(s)}
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20"
          >
            <Download size={14} className="mr-1.5" /> Descargar PDF Oficial
          </Button>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* DOCUMENTO PROFORMA / VISTA CLIENTE */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Membrete Precisur */}
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-base font-extrabold text-slate-100 tracking-wider">
                  MULTISERVICIOS PRECISUR S.A.C.
                </h2>
                <p className="text-xs text-slate-400">
                  Servicios Generales · Mantenimiento · Obras Menores
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  RUC: 20610357874 · Cerro Colorado, Arequipa
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                  {s.quotationNumber}
                </span>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center justify-end gap-1">
                  <Clock size={11} /> Vigencia: 15 días
                </p>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  CLIENTE / RAZÓN SOCIAL:
                </span>
                <p className="font-semibold text-slate-200 mt-0.5">{s.client.name}</p>
                <p className="text-slate-400 font-mono text-[11px]">RUC: {s.client.ruc}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  FRENTE DE ENTREGA / CONTACTO:
                </span>
                <p className="text-slate-300 mt-0.5 flex items-center gap-1.5">
                  <MapPin size={12} className="text-slate-500 shrink-0" /> {s.client.address}
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5 font-mono">{s.client.contact}</p>
              </div>
            </div>

            {/* Partidas Comerciales de la Proforma */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                ALCANCE Y ESPECIFICACIONES DE LA PROPUESTA
              </span>

              <div className="space-y-3">
                {s.services.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                        ÍTEM {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Cant: {item.qty} {item.um}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen Económico */}
            <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
              <div className="text-xs text-slate-500 space-y-0.5">
                <p>• Precios expresados en Soles (PEN).</p>
                <p>• Forma de pago acordada: {s.client.paymentTerm}.</p>
              </div>

              <div className="w-full sm:w-64 space-y-1.5 text-xs bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Neto:</span>
                  <span className="font-mono text-slate-200">{money(t.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>I.G.V. (18%):</span>
                  <span className="font-mono text-slate-200">{money(t.igv)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-100 border-t border-slate-800 pt-1.5">
                  <span>TOTAL A PAGAR:</span>
                  <span className="font-mono text-emerald-400 text-base">{money(t.total)}</span>
                </div>
              </div>
            </div>

            {/* Pie institucional de JY Soluciones */}
            <div className="text-[10px] text-slate-500 text-center border-t border-slate-800/80 pt-3">
              Documento digital generado a través de{" "}
              <strong className="text-slate-400">JY Operax B2B</strong> · Multiservicios Precisur
              S.A.C.
            </div>
          </div>
        </div>

        {/* PANEL LATERAL: DESPACHO Y CONTROL */}
        <div className="lg:col-span-4 space-y-5">
          {/* Despacho WhatsApp */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Share2 size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200">Despacho WhatsApp</h3>
                  <p className="text-[10px] text-slate-500">Envío directo en 1 clic</p>
                </div>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LISTO
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Mensaje preparado para el cliente:
              </label>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {whatsappMessage}
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`https://wa.me/51${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <MessageCircle size={15} /> Compartir por WhatsApp (Directo)
              </a>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyMessage}
                className="w-full text-xs h-9 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                <Copy size={13} className="mr-1.5" />{" "}
                {copiedMsg ? "¡Copiado!" : "Copiar texto del mensaje"}
              </Button>
            </div>
          </div>

          {/* Enlace Seguro de Consulta */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <ExternalLink size={14} className="text-blue-400" /> Enlace de Consulta para el
              Cliente
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              El cliente puede abrir este link para ver la propuesta sin visualizar ningún costo
              interno ni margen.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="w-full text-xs h-9 border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800"
            >
              <Copy size={13} className="mr-1.5" />{" "}
              {copiedLink ? "¡Enlace copiado!" : "Copiar enlace público"}
            </Button>
          </div>

          {/* Auditoría Interna / Confidencialidad */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px]">
              <LockKeyhole size={14} /> CONTROL INTERNO GERENCIAL
            </div>
            <div className="pt-2 border-t border-slate-800 space-y-1 text-slate-400 text-[11px]">
              <div className="flex justify-between">
                <span>Costo Directo Base:</span>
                <span className="font-mono text-slate-200">{money(t.direct)}</span>
              </div>
              <div className="flex justify-between">
                <span>Margen Servicio:</span>
                <span className="font-mono text-blue-400">{s.serviceMarginPercent}%</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-slate-800/80">
                <span>Utilidad Estimada:</span>
                <span className="font-mono">+{money(t.totalProfit)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
