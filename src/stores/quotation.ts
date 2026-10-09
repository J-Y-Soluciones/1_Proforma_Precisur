import { create } from 'zustand';

export const EXCHANGE_RATE = 3.765;
export const IGV_RATE = 0.18;

export type Material = {
  id: string;
  name: string;
  spec: string;
  qty: number;
  um: string;
  currency: 'PEN' | 'USD';
  unitCost: number;
  hasIgv: boolean;
  supplier: string;
};

export type Technician = {
  id: string;
  name: string;
  specialty: string;
  dni: string;
  dailyRate: number;
  days: number;
  available?: boolean;
};

export type Client = {
  ruc: string;
  name: string;
  address: string;
  contact: string;
  paymentTerm: string;
};

export type ServiceItem = {
  id: string;
  itemNumber: string;
  title: string;
  description: string;
  tags: string[];
  um: string;
  qty: number;
};

export type QuotationData = {
  quotationNumber: string;
  client: Client;
  services: ServiceItem[];
  materials: Material[];
  labor: Technician[];
  logistics: { freight: number; equipmentRental: number; epp: number };
  marginPercent: number;
  commercialFreight: number;
  status: 'Borrador Operativo' | 'Pendiente de aprobación' | 'Aprobada' | 'Borrador con Observaciones';
  observations: string;
  note: string;
  mode: 'service' | 'supply';
  suppliers: string[];
  technicians: Technician[];
};

export const initialMaterials: Material[] = [
  { id: 'm1', name: 'Válvula de Compuerta Acero Forjado 2” ANSI 150', spec: 'ASTM A105 · Trim 8 · Extremos bridados RF', qty: 4, um: 'UND', currency: 'PEN', unitCost: 185, hasIgv: false, supplier: 'Aceros Arequipa S.A.' },
  { id: 'm2', name: 'Tubería Cédula 40 ASTM A53 Gr. B 2” (Tramos 6m)', spec: 'Costura ERW · Acero al carbono · Uso industrial', qty: 2, um: 'MTR', currency: 'PEN', unitCost: 48.5, hasIgv: false, supplier: 'Ferretería El Cono E.I.R.L.' },
  { id: 'm3', name: 'Empaquetadura Espirometálica Grafito 2” 150#', spec: 'Anillo exterior SS316 · ASME B16.20 · ASTM 304', qty: 2, um: 'UND', currency: 'PEN', unitCost: 32, hasIgv: false, supplier: 'Sealing Solution Perú' },
  { id: 'm4', name: 'Soldadura E7018 1/8” Lincoln Electric (Lata 20kg)', spec: 'Bajo hidrógeno · Alta tenacidad · Consumible certificado', qty: 1, um: 'KG', currency: 'PEN', unitCost: 151.5, hasIgv: false, supplier: 'Lincoln Soldacentro' },
];

export const initialTechnicians: Technician[] = [
  { id: 't1', name: 'Jorge Valdivia Quispe', specialty: 'Soldador de Alta Presión (6G ASME IX)', dni: '43981289', dailyRate: 320, days: 4, available: true },
  { id: 't2', name: 'Marcos Benavente Choque', specialty: 'Mecánico Montajista / Piping', dni: '29781184', dailyRate: 250, days: 3, available: true },
  { id: 't3', name: 'Carlos Alberto Ramos Huanca', specialty: 'Soldador de Alta Presión (6G ASME IX)', dni: '45892134', dailyRate: 300, days: 1, available: true },
  { id: 't4', name: 'Víctor Raúl Mendoza Apaza', specialty: 'Tornero Mecánico / Calibración de Válvulas', dni: '42109845', dailyRate: 280, days: 1, available: true },
];

export const initialServices: ServiceItem[] = [
  {
    id: 's1',
    itemNumber: '01',
    title: 'Servicio Integral de Mantenimiento Skid Valvular Línea Hidráulica Nº 4',
    description: 'Desmontaje, habilitado y cambio de valvulería de alta presión bajo estándares ASME B31.3 / API 598. Soldadura homologada 6G AWS D1.1, inspección mediante ensayos no destructivos por líquidos penetrantes (PT) y calibración de empaquetaduras espirometálicas 2" 150#. Incluye consumibles industriales, cuadrilla técnica calificada y supervisor SSOMA permanente en turno.',
    tags: ['ASME B31.3', 'API 598', 'AWS D1.1 6G', 'Dossier PT Incluido'],
    um: 'GLB',
    qty: 1
  },
  {
    id: 's2',
    itemNumber: '02',
    title: 'Flete Operativo, Transporte de Equipos y Movilización a Frente de Obra',
    description: 'Traslado terrestre ida y vuelta de equipos mecánicos de torque, motosoldadora industrial Lincoln Ranger y movilización de cuadrilla técnica desde Taller Central Precisur hasta Planta Río Seco. Cobertura con póliza de seguro vehicular y pólizas SCTR Salud y Pensión vigentes.',
    tags: ['Flete Arequipa', 'SCTR Vigente'],
    um: 'GLB',
    qty: 1
  }
];

export const initialQuotation: QuotationData = {
  quotationNumber: 'COTIZACION: Nº 60-000569',
  client: {
    ruc: '20601234567',
    name: 'Consorcio Minero del Sur S.A.C.',
    address: 'Mz. F Lote 12, Parque Industrial Río Seco, Cerro Colorado, Arequipa',
    contact: 'Ing. Carlos Mendoza (958 432 109)',
    paymentTerm: 'Crédito 30 Días'
  },
  services: initialServices,
  materials: initialMaterials,
  labor: initialTechnicians.slice(0, 2),
  logistics: { freight: 120, equipmentRental: 200, epp: 83.5 },
  marginPercent: 35,
  commercialFreight: 250,
  status: 'Borrador Operativo',
  observations: '',
  note: '',
  mode: 'service',
  suppliers: ['Aceros Arequipa S.A.', 'Ferretería El Cono E.I.R.L.', 'Sealing Solution Perú', 'Lincoln Soldacentro'],
  technicians: initialTechnicians,
};

export const materialTotal = (m: Material) =>
  m.qty * m.unitCost * (m.currency === 'USD' ? EXCHANGE_RATE : 1) * (m.hasIgv ? 1 + IGV_RATE : 1);

export function calculateTotals(data: Pick<QuotationData, 'materials' | 'labor' | 'logistics' | 'marginPercent' | 'commercialFreight' | 'mode'>) {
  const materials = data.materials.reduce((a, m) => a + materialTotal(m), 0);
  const labor = data.mode === 'supply' ? 0 : data.labor.reduce((a, t) => a + t.dailyRate * t.days, 0);
  const logistics = data.logistics.freight + (data.mode === 'supply' ? 0 : data.logistics.equipmentRental + data.logistics.epp);
  const direct = materials + labor + logistics;
  const sale = direct / (1 - data.marginPercent / 100);
  const profit = sale - direct;
  const subtotal = sale + (data.commercialFreight || 0);
  const igv = subtotal * IGV_RATE;
  return { materials, labor, logistics, direct, sale, profit, subtotal, igv, total: subtotal + igv };
}

type Actions = {
  updateMaterial: (id: string, patch: Partial<Material>) => void;
  addMaterial: () => void;
  removeMaterial: (id: string) => void;
  updateLabor: (id: string, patch: Partial<Technician>) => void;
  toggleTechnician: (id: string) => void;
  addTechnician: (t: Technician) => void;
  addService: () => void;
  updateService: (id: string, patch: Partial<ServiceItem>) => void;
  removeService: (id: string) => void;
  setClient: (c: Client) => void;
  addSupplier: (name: string, materialId?: string) => void;
  setLogistics: (key: keyof QuotationData['logistics'], value: number) => void;
  setMargin: (v: number) => void;
  setCommercialFreight: (v: number) => void;
  setStatus: (status: QuotationData['status']) => void;
  reject: (text: string) => void;
  setNote: (text: string) => void;
  setMode: (mode: QuotationData['mode']) => void;
  reset: () => void;
};

export const useQuotationStore = create<QuotationData & Actions>((set) => ({
  ...initialQuotation,
  updateMaterial: (id, patch) =>
    set((s) => ({ materials: s.materials.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
  addMaterial: () =>
    set((s) => ({
      materials: [
        ...s.materials,
        {
          id: crypto.randomUUID(),
          name: 'Nuevo material industrial',
          spec: 'Especificación técnica',
          qty: 1,
          um: 'UND',
          currency: 'PEN',
          unitCost: 0,
          hasIgv: false,
          supplier: s.suppliers[0] ?? ''
        }
      ]
    })),
  removeMaterial: (id) =>
    set((s) => ({ materials: s.materials.filter((m) => m.id !== id) })),
  updateLabor: (id, patch) =>
    set((s) => ({ labor: s.labor.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
  toggleTechnician: (id) =>
    set((s) => ({
      labor: s.labor.some((t) => t.id === id)
        ? s.labor.filter((t) => t.id !== id)
        : [...s.labor, ...s.technicians.filter((t) => t.id === id)]
    })),
  addTechnician: (t) =>
    set((s) => ({ technicians: [...s.technicians, t], labor: [...s.labor, t] })),
  addService: () =>
    set((s) => ({
      services: [
        ...s.services,
        {
          id: crypto.randomUUID(),
          itemNumber: String(s.services.length + 1).padStart(2, '0'),
          title: 'Nueva Partida de Servicio Técnico',
          description: 'Describa el alcance de mantenimiento, soldadura, pruebas o montaje.',
          tags: ['ASME B31.3'],
          um: 'GLB',
          qty: 1
        }
      ]
    })),
  updateService: (id, patch) =>
    set((s) => ({
      services: s.services.map((item) => (item.id === id ? { ...item, ...patch } : item))
    })),
  removeService: (id) =>
    set((s) => ({
      services: s.services.filter((item) => item.id !== id)
    })),
  setClient: (client) => set({ client }),
  addSupplier: (name, materialId) =>
    set((s) => ({
      suppliers: s.suppliers.includes(name) ? s.suppliers : [...s.suppliers, name],
      materials: s.materials.map((m) => (m.id === materialId ? { ...m, supplier: name } : m))
    })),
  setLogistics: (key, value) =>
    set((s) => ({ logistics: { ...s.logistics, [key]: Math.max(0, value) } })),
  setMargin: (v) =>
    set({ marginPercent: Math.min(60, Math.max(10, v)) }),
  setCommercialFreight: (v) =>
    set({ commercialFreight: Math.max(0, v) }),
  setStatus: (status) => set({ status }),
  reject: (text) => {
    if (text.trim()) set({ observations: text.trim(), status: 'Borrador con Observaciones' });
  },
  setNote: (note) => set({ note }),
  setMode: (mode) => set({ mode }),
  reset: () => set(initialQuotation),
}));

export const money = (value: number) =>
  `S/ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;