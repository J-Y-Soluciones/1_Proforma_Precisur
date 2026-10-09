import { createFileRoute } from '@tanstack/react-router';
import { Approval } from '@/components/operax/approval';
import { quotationHead } from '@/lib/quotation-meta';
export const Route = createFileRoute('/aprobacion-movil')({ head: () => quotationHead('Aprobación gerencial', 'Revisión de márgenes y aprobación comercial de cotizaciones Precisur.', '/aprobacion-movil'), component: Approval });
