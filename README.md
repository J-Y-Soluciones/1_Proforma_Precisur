# Precísur Operax

Actúa como Lead Frontend & UI/UX Engineer especializado en React, Tailwind CSS, Lucide Icons y shadcn/ui.

Construye la plataforma interactiva "JY Operax B2B" para Multiservicios Precisur S.A.C. (RUC: 20610357874).
NO crees un mockup estático ni utilices iframes. La aplicación debe ser una Single Page Application (SPA) modular con un Store Global de Zustand (useQuotationStore) donde todos los cálculos de costos y márgenes sean reactivos en tiempo real.

Revisa las imágenes adjuntas para replicar la paleta de colores (tema oscuro industrial Slate/Zinc con acentos Blue-600 y Emerald-500, y tema blanco/institucional limpio en la Ficha Comercial PDF).

---

### 1. STORE GLOBAL REACTIVO (`useQuotationStore`)
El estado central debe sincronizar:
- `quotationNumber`: "COTIZACION: Nº 60-000569"
- `client`: { ruc: "20601234567", name: "Consorcio Minero del Sur S.A.C.", address: "Mz. F Lote 12, Parque Industrial Río Seco, Cerro Colorado, Arequipa", contact: "Ing. Carlos Mendoza (958 432 109)", paymentTerm: "Crédito 30 Días" }
- `materials`: Array con { id, name, spec, qty, um, currency ('PEN'|'USD'), unitCost, hasIgv (boolean), supplier }
- `labor`: Array con { id, name, specialty, dni, dailyRate, days }
- `logistics`: { freight: 120, equipmentRental: 200, epp: 83.50 }
- `marginPercent`: 35 (slider de 10% a 60%)
- Fórmulas automáticas en el store:
  * Costo Directo Base = Σ Insumos (en PEN con T.C. 3.765) + Σ (Tarifa * Días de Cuadrilla) + Σ Logística
  * Subtotal Venta = Costo Directo Base / (1 - (marginPercent / 100))
  * Utilidad Bruta = Subtotal Venta - Costo Directo Base
  * IGV Venta = Subtotal Venta * 0.18
  * Total Comercial = Subtotal Venta + IGV Venta

---

### 2. VISTAS Y COMPONENTES A IMPLEMENTAR

#### A. `/cotizador` (Cotizador Operativo Taller - Imagen 1):
- Metadatos de cabecera con T.C. SUNAT (USD 1 = S/ 3.765).
- Tabla de Materiales 100% editable: inputs de cantidad, costo unitario, selector de moneda (USD/PEN), toggle [SIN IGV | +IGV 18%] y selector de proveedor.
- Sección Cuadrilla & Mano de Obra: tarjetas de técnicos con tarifa de jornada (8H) y selector de días.
- Sección Gastos Operativos: Flete Taller-Obra, alquiler de motosoldadora Miller y viáticos/EPP.
- Sidebar Confidencial (Costo Interno Consolidado): distribución porcentual (Mat 47%, M.O. 44%, Log 9%), total directo base (S/ 3,486.00) y botón "Enviar a Revisión Gerencial (F5)".

#### B. MODALES Y DRAWERS (Sobre el Cotizador):
1. `QuickClientModal` (Dialog):
   - Input RUC con botón "Validar SUNAT" que active el badge "HABIDO • ACTIVO".
   - Razón Social, Dirección en Río Seco, Contacto, Teléfono con badge WSP y selector de condición de pago.
2. `QuickTechnicianModal` (Dialog):
   - Asignar técnico externo: Nombre, DNI con badge "RENIEC OK", selector con chips rápidos (6G ASME IX, Montajista Piping, Electricista Industrial) y tarifa diaria editable.
3. `QuickSupplierModal` (Dialog):
   - Alta rápida de proveedor no registrado (Ferretería Los Andes).
4. `ExternalSupplierSearchDrawer` (Sheet lateral - Imagen 4):
   - Búsqueda de proveedores con filtros por zona operativa de Arequipa (Parque Industrial, Río Seco, Cercado) y botón para incorporarlos a la partida.

#### C. `/aprobacion-movil` (Aprobación Gerencial - Imagen 2):
- Contenedor responsive simulando pantalla de smartphone.
- Desglose del costo liquidado de taller (S/ 3,486.00).
- Slider interactivo de Margen Comercial (10% a 60%) y botones preset ([25%], [30%], [35%], [40%]) que recalculen en vivo: Utilidad Bruta, Subtotal e IGV.
- Input para Flete Comercial Facturable.
- Botón "Aprobar Cotización" (navega a la ficha emitida) y botón "Rechazar" (abre Sheet inferior con textarea obligatorio de observaciones).

#### D. `/ficha-emitida` (Panel de Despacho & Impresión PDF - Imagen 3 y PDF Precisur):
- Vista de auditoría comercial: botones para "Compartir por WhatsApp Directo" (con mensaje preformateado) y "Copiar Enlace Seguro".
- Vista de impresión / PDF oficial de Multiservicios Precisur S.A.C. (RUC: 20610357874):
  * Estructura de 2 páginas A4 con encabezado institucional, correlativo Nº 60-000569, términos comerciales obligatorios en mayúsculas ("EL PRODUCTO SE ENTREGA CON PREVIO DEPÓSITO", etc.), cuentas corrientes BCP (2157400205061), firma de Frida López y sedes de Lima y Arequipa.

#### E. `/directorio` (Catálogo de Recursos - Imagen 5):
- Tabla de operarios con badges de disponibilidad, homologación ASME IX / SCTR y switch para asignar a la cuadrilla activa.

De momento deja un PDF genérico al descargar las proformas, porque tengo el modelo del PDF solo que ya no puedo adjuntar mas archivos

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3216d5a8-2cc3-45f0-9d8e-a63ed5dbf519).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
