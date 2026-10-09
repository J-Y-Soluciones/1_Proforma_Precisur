import { createFileRoute } from '@tanstack/react-router';
import { Directory } from '@/components/operax/directory';
import { quotationHead } from '@/lib/quotation-meta';
export const Route = createFileRoute('/directorio')({ head: () => quotationHead('Directorio operativo', 'Técnicos especializados y proveedores industriales de Arequipa para Precisur.', '/directorio'), component: Directory });
