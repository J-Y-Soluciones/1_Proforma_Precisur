import { createFileRoute } from '@tanstack/react-router';
import { Estimator } from '@/components/operax/estimator';
import { quotationHead } from '@/lib/quotation-meta';
export const Route = createFileRoute('/cotizador')({ head: () => quotationHead('Cotizador operativo', 'Costeo reactivo de materiales, cuadrilla y logística industrial de Precisur.', '/cotizador'), component: Estimator });
