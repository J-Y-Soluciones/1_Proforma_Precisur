import { createFileRoute } from "@tanstack/react-router";
import { Estimator } from "@/components/operax/estimator";
import { quotationHead } from "@/lib/quotation-meta";
export const Route = createFileRoute("/")({
  head: () => quotationHead('JY Operax — Cotizaciones industriales', 'Plataforma operativa de presupuestos y cotizaciones de Multiservicios Precisur S.A.C.', '/'),
  component: Estimator,
});
