import { calculateTotals, money } from '@/stores/quotation';
import type { QuotationData } from '@/stores/quotation';

export function getQuotationHtmlTemplate(s: QuotationData): string {
  const t = calculateTotals(s);

  const featuresList: string[] = [];

  // Recorre las partidas de servicio para generar las especificaciones del documento
  if (s.services && s.services.length > 0) {
    s.services.forEach((srv) => {
      if (srv.description) {
        featuresList.push(`• ${srv.title}: ${srv.description}`);
      }
    });
  } else {
    featuresList.push('• Desmontaje, mantenimiento y habilitado según requerimiento técnico.');
  }

  // Agrega datos de la cuadrilla técnica
  if (s.labor && s.labor.length > 0) {
    s.labor.forEach((tech) => {
      featuresList.push(`• Cuadrilla técnica: ${tech.specialty} (${tech.days} jorn. 8h). Cobertura SCTR Salud y Pensión activa.`);
    });
  }

  // Pruebas y logística
  featuresList.push('• Pruebas no destructivas mediante líquidos penetrantes (PT) y control de calidad.');
  featuresList.push(`• Traslado de equipos y cuadrilla hacia ${s.client?.address || 'frente de obra'}.`);
  featuresList.push('• Plazo de ejecución garantizado: 04 días hábiles tras recepción de O/S formal.');

  const featuresHtml = featuresList.map((item) => `<li>${item.replace(/^[•\-\*]\s*/, '')}</li>`).join('');

  return `
  <div id="pdf-root" style="font-family: Arial, Helvetica, sans-serif; color: #1e293b; background: #ffffff; width: 794px; margin: 0 auto; box-sizing: border-box;">
    <style>
      .page-container {
        width: 794px;
        min-height: 1120px;
        padding: 40px 48px;
        background: #ffffff;
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .page-break {
        page-break-before: always;
      }
      .bg-waves {
        position: absolute;
        top: 0;
        right: 0;
        width: 440px;
        height: 100px;
        pointer-events: none;
      }
      .header-box {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 12px;
      }
      .brand-title {
        font-size: 18px;
        font-weight: 900;
        color: #0f2d59;
        margin: 0;
        text-transform: uppercase;
      }
      .client-card {
        margin-top: 14px;
        padding: 10px 14px;
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font-size: 11px;
        line-height: 1.5;
      }
      .visual-gallery {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 12px;
      }
      .visual-slot {
        height: 115px;
        border: 1px dashed #94a3b8;
        border-radius: 6px;
        background: #f8fafc;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 8px;
      }
      .section-banners {
        display: grid;
        grid-template-columns: 5fr 7fr;
        gap: 14px;
        margin-top: 14px;
      }
      .banner-title {
        background: #dbeafe;
        border: 1px solid #bfdbfe;
        color: #1e3a8a;
        font-weight: 900;
        font-size: 10.5px;
        text-transform: uppercase;
        padding: 5px 10px;
        border-radius: 4px;
      }
      .proposal-body {
        display: grid;
        grid-template-columns: 5fr 7fr;
        gap: 14px;
        margin-top: 8px;
        align-items: start;
      }
      .pricing-card {
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background: #ffffff;
        font-size: 11px;
      }
      .pricing-row {
        display: flex;
        justify-content: space-between;
        padding: 7px 12px;
        border-bottom: 1px solid #f1f5f9;
        font-weight: 600;
      }
      .pricing-row.total-yellow {
        background: #fef08a !important;
        color: #854d0e;
        border-top: 2px solid #eab308;
        border-bottom: none;
        font-size: 12px;
        font-weight: 900;
      }
      .features-list {
        margin: 0;
        padding-left: 18px;
        font-size: 9.5px;
        color: #334155;
        line-height: 1.55;
      }
      .features-list li {
        margin-bottom: 4px;
      }
      .footer-box {
        border-top: 2px solid #0284c7;
        padding-top: 8px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 8px;
        color: #475569;
        line-height: 1.35;
      }
    </style>

    <!-- PÁGINA 1 -->
    <div class="page-container" id="pdf-page-1">
      <svg class="bg-waves" viewBox="0 0 500 120" preserveAspectRatio="none">
        <path d="M0,0 L500,0 L500,60 Q380,120 260,60 T0,70 Z" fill="#0284c7" opacity="0.15"></path>
        <path d="M120,0 L500,0 L500,45 Q400,90 290,40 T120,50 Z" fill="#0f2d59" opacity="0.18"></path>
      </svg>

      <div>
        <div class="header-box">
          <div style="display: flex; align-items: center; gap: 12px;">
            <svg style="width: 48px; height: 48px;" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="#22c55e" opacity="0.15" />
              <path d="M50 15 L58 28 L72 24 L74 38 L88 42 L82 55 L90 66 L78 74 L78 88 L64 85 L56 96 L45 88 L34 94 L28 82 L14 82 L18 68 L8 58 L18 48 L14 34 L28 32 L32 18 L46 22 Z" fill="#22c55e"/>
              <circle cx="50" cy="50" r="26" fill="#ffffff" />
              <circle cx="40" cy="45" r="5" fill="#0f2d59" />
              <circle cx="50" cy="40" r="6" fill="#0f2d59" />
              <circle cx="60" cy="45" r="5" fill="#0f2d59" />
              <path d="M32 60 Q50 50 68 60 L65 68 Q50 60 35 68 Z" fill="#0f2d59" />
            </svg>
            <div>
              <h1 class="brand-title">MULTISERVICIOS PRECISUR</h1>
              <p style="font-size: 9px; color: #64748b; margin: 2px 0 0 0; font-weight: 600;">Mantenimiento Mecánico Industrial & Calderería Pesada</p>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 9.5px; font-weight: 700; color: #0f2d59;">07 DE OCTUBRE DEL 2026</div>
            <div style="font-size: 14px; font-weight: 900; color: #0284c7; margin-top: 2px;">${s.quotationNumber || 'COTIZACION: Nº 60-000569'}</div>
          </div>
        </div>

        <div class="client-card">
          <div><strong>RAZON SOCIAL:</strong> ${(s.client?.name || 'CONSORCIO MINERO DEL SUR S.A.C.').toUpperCase()}</div>
          <div><strong>RUC:</strong> ${s.client?.ruc || '20601234567'} &nbsp;|&nbsp; <strong>Pte.:</strong> ${s.client?.contact || 'Ing. Carlos Mendoza'}</div>
          <div><strong>FRENTE:</strong> ${(s.client?.address || 'PARQUE INDUSTRIAL RÍO SECO, CERRO COLORADO, AREQUIPA').toUpperCase()}</div>
          <div style="margin-top: 6px; font-size: 9.5px; font-style: italic; color: #475569;">
            De nuestra consideración: Nos es grato saludarle y de acuerdo a su solicitud, le hacemos llegar nuestra propuesta comercial.
          </div>
        </div>

        <div class="visual-gallery">
          <div class="visual-slot">
            <span style="font-size: 9px; font-weight: 800; color: #334155;">[ FOTO REFERENCIAL: FRENTE DE OBRA ]</span>
            <span style="font-size: 8px; color: #64748b; margin-top: 2px;">Inspección técnica en ${s.client?.address ? s.client.address.split(',')[0] : 'frente de obra'}</span>
          </div>
          <div class="visual-slot">
            <span style="font-size: 9px; font-weight: 800; color: #334155;">[ FOTO REFERENCIAL: DETALLE PIPING ]</span>
            <span style="font-size: 8px; color: #64748b; margin-top: 2px;">Habilitado y calibración según norma ASME B31.3</span>
          </div>
        </div>

        <div class="section-banners">
          <div class="banner-title">PROPUESTA COMERCIAL</div>
          <div class="banner-title">CARACTERISTICAS</div>
        </div>

        <div class="proposal-body">
          <div class="pricing-card">
            <div class="pricing-row"><span>PRECIO DE VENTA:</span><span>${money(t.subtotal)}</span></div>
            <div class="pricing-row"><span>IGV 18%:</span><span>${money(t.igv)}</span></div>
            <div class="pricing-row total-yellow"><span>PRECIO TOTAL UND:</span><span>${money(t.total)}</span></div>
          </div>

          <div>
            <ul class="features-list">
              ${featuresHtml}
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-box">
        <div>
          <div><strong>SEDE LIMA:</strong> NRO. 1782 URB. PERU LIMA - LIMA - SAN MARTIN DE PORRES</div>
          <div><strong>SEDE AREQUIPA:</strong> AV. ANDRÉS AVELINO CÁCERES. C.C. VOLCÁN CENTER, MZ F LT. 6. JLBR. AREQUIPA</div>
        </div>
        <div style="text-align: right; font-weight: 700;">
          <div>+51 915 157 257 / +51 992 805 221</div>
          <div style="font-size: 7.5px; color: #94a3b8;">PÁGINA 1 / 2</div>
        </div>
      </div>
    </div>

    <!-- PÁGINA 2 -->
    <div class="page-container page-break" id="pdf-page-2">
      <svg class="bg-waves" viewBox="0 0 500 120" preserveAspectRatio="none">
        <path d="M0,0 L500,0 L500,60 Q380,120 260,60 T0,70 Z" fill="#0284c7" opacity="0.15"></path>
        <path d="M120,0 L500,0 L500,45 Q400,90 290,40 T120,50 Z" fill="#0f2d59" opacity="0.18"></path>
      </svg>

      <div>
        <div class="header-box">
          <div style="display: flex; align-items: center; gap: 12px;">
            <h1 class="brand-title">MULTISERVICIOS PRECISUR</h1>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: 900; color: #0284c7;">${s.quotationNumber || 'COTIZACION: Nº 60-000569'}</div>
          </div>
        </div>

        <div style="margin-top: 24px;">
          <div style="font-size: 12px; font-weight: 900; color: #0f2d59; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px;">
            TERMINOS Y CONDICIONES DE NUESTROS SERVICIOS
          </div>
          <div style="font-size: 10px; font-weight: 800; color: #0f172a; line-height: 2.1;">
            <div>• EL PRODUCTO SE ENTREGA CON PREVIO DEPOSITO.</div>
            <div>• UNA VEZ SALIDA LA MERCADERIA NO HAY OPCIÓN A CAMBIOS NI DEVOLUCIONES.</div>
            <div>• SI ACEPTA LAS SIGUIENTES PAUTAS SIRVASE A REALIZAR EL ABONO CORRESPONDIENTE.</div>
            <div>• VALIDEZ DE LA OFERTA: 15 DÍAS CALENDARIO.</div>
            <div>• CONDICIÓN DE PAGO: ${(s.client?.paymentTerm || 'CRÉDITO 30 DÍAS').toUpperCase()}.</div>
          </div>
        </div>

        <div style="margin-top: 28px; border: 1px solid #bfdbfe; background: #eff6ff; border-radius: 8px; padding: 16px; text-align: center;">
          <span style="background: #0284c7; color: #ffffff; font-size: 10px; font-weight: 900; padding: 4px 14px; border-radius: 20px;">
            CUENTA SOLES BCP
          </span>
          <div style="font-size: 22px; font-weight: 900; color: #0f2d59; margin: 8px 0 3px 0; font-family: monospace;">
            2157400205061
          </div>
          <div style="font-size: 10px; color: #475569; font-weight: 600;">
            Multiservicios Precisur S.A.C. | RUC: 20610357874
          </div>
        </div>

        <p style="text-align: center; font-size: 10px; color: #64748b; font-style: italic; margin-top: 36px;">
          Sin otro particular, nos despedimos de usted, esperando su pronta respuesta.
        </p>

        <div style="margin-top: 28px; text-align: center; width: 230px; margin-left: auto; margin-right: auto; border-top: 1px solid #94a3b8; padding-top: 8px;">
          <div style="font-size: 12px; font-weight: 900; color: #0284c7;">FRIDA LOPEZ</div>
          <div style="font-size: 9.5px; font-weight: 700; color: #475569;">ASESOR COMERCIAL</div>
          <div style="font-size: 9px; color: #64748b; margin-top: 2px;">Celular: 908 903 093 | servicios@multiserviciosprecisur.com</div>
        </div>
      </div>

      <div class="footer-box">
        <div>
          <div><strong>SEDE LIMA:</strong> NRO. 1782 URB. PERU LIMA - LIMA - SAN MARTIN DE PORRES</div>
          <div><strong>SEDE AREQUIPA:</strong> AV. ANDRÉS AVELINO CÁCERES. C.C. VOLCÁN CENTER, MZ F LT. 6. JLBR. AREQUIPA</div>
        </div>
        <div style="text-align: right; font-weight: 700;">
          <div>+51 915 157 257 / +51 992 805 221</div>
          <div style="font-size: 7.5px; color: #94a3b8;">PÁGINA 2 / 2</div>
        </div>
      </div>
    </div>
  </div>
  `;
}

export function downloadQuotation(s: any) {
  if (typeof window === 'undefined') return;
  document.body.style.pointerEvents = 'auto';

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cotizacion_${(s.quotationNumber || '60-000569').replace(/[^a-zA-Z0-9-]/g, '_')}_Precisur</title>
        <style>
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0; padding: 0; background: #ffffff; }
        </style>
      </head>
      <body>
        ${getQuotationHtmlTemplate(s)}
      </body>
    </html>
  `);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    try {
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }
  }, 300);
}

export function printQuotationDirect(s: any) {
  downloadQuotation(s);
}
