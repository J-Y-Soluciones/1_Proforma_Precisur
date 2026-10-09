import { createFileRoute } from '@tanstack/react-router';
import { Issued } from '@/components/operax/issued';
import { quotationHead } from '@/lib/quotation-meta';
export const Route = createFileRoute('/ficha-emitida')({ head: () => quotationHead('Proforma comercial', 'Ficha comercial, descarga PDF y despacho de cotizaciones de Multiservicios Precisur.', '/ficha-emitida'), component: Issued });
