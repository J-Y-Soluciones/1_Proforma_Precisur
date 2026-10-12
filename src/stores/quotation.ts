import { create } from "zustand";

export const EXCHANGE_RATE = 3.765;
export const IGV_RATE = 0.18;

export type Material = {
  id: string;
  name: string;
  spec: string;
  qty: number;
  um: string;
  currency: "PEN" | "USD";
  unitCost: number;
  hasIgv: boolean;
  supplier: string;
  markupPercent: number;
};

export type SupplierRecord = {
  id: string;
  name: string;
  ruc: string;
  phone: string;
  zone: string;
  categories: string[];
};

export type SupplierContact = {
  id: string;
  name: string;
  phone: string;
  ruc?: string;
  zone?: string;
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
  serviceMarginPercent: number;
  status:
    "Borrador Operativo" | "Pendiente de aprobación" | "Aprobada" | "Borrador con Observaciones";
  observations: string;
  note: string;
  mode: "service" | "supply";
  suppliers: SupplierRecord[];
  technicians: Technician[];
};

export const initialMaterials: Material[] = [
  {
    id: "m1",
    name: "Válvula de Compuerta Acero 2” ANSI 150",
    spec: "Extremos bridados · Cierre hermético",
    qty: 4,
    um: "UND",
    currency: "PEN",
    unitCost: 185,
    hasIgv: false,
    supplier: "Aceros Arequipa S.A.",
    markupPercent: 20,
  },
  {
    id: "m2",
    name: "Tubería Galvanizada SCH 40 2” (Tramos 6m)",
    spec: "Uso industrial y sanitario",
    qty: 2,
    um: "MTR",
    currency: "PEN",
    unitCost: 48.5,
    hasIgv: false,
    supplier: "Ferretería Industrial El Cono E.I.R.L.",
    markupPercent: 20,
  },
  {
    id: "m3",
    name: "Empaquetadura y Sellos de Alta Presión 2”",
    spec: "Resistente a fluidos industriales",
    qty: 2,
    um: "UND",
    currency: "PEN",
    unitCost: 32,
    hasIgv: false,
    supplier: "Válvulas & Conexiones del Sur S.A.C.",
    markupPercent: 25,
  },
  {
    id: "m4",
    name: "Soldadura y Electrodos E7018 1/8” (Lata 20kg)",
    spec: "Consumible para estructuras y mantenimiento",
    qty: 1,
    um: "KG",
    currency: "PEN",
    unitCost: 151.5,
    hasIgv: false,
    supplier: "Lincoln Soldacentro",
    markupPercent: 15,
  },
];

export const initialTechnicians: Technician[] = [
  {
    id: "t1",
    name: "Jorge Valdivia Quispe",
    specialty: "Soldador / Cerrajero Estructural",
    dni: "43981289",
    dailyRate: 200,
    days: 3,
    available: true,
  },
  {
    id: "t2",
    name: "Marcos Benavente Choque",
    specialty: "Gasfitero Especialista Industrial",
    dni: "29781184",
    dailyRate: 180,
    days: 3,
    available: true,
  },
  {
    id: "t3",
    name: "Carlos Ramos Huanca",
    specialty: "Maestro Drywall & Acabados",
    dni: "45892134",
    dailyRate: 160,
    days: 2,
    available: true,
  },
  {
    id: "t4",
    name: "Víctor Mendoza Apaza",
    specialty: "Electricista Comercial & Bombas",
    dni: "42109845",
    dailyRate: 190,
    days: 2,
    available: true,
  },
];

export const initialSuppliers: SupplierRecord[] = [
  {
    id: "sup1",
    name: "Aceros Arequipa S.A.",
    ruc: "20100072252",
    phone: "958334112",
    zone: "Parque Industrial · Arequipa",
    categories: ["Aceros & Perfiles"],
  },
  {
    id: "sup2",
    name: "Ferretería Industrial El Cono E.I.R.L.",
    ruc: "20601982341",
    phone: "959110204",
    zone: "Cerro Colorado · Arequipa",
    categories: ["Ferretería General", "Tuberías & Válvulas"],
  },
  {
    id: "sup3",
    name: "Válvulas & Conexiones del Sur S.A.C.",
    ruc: "20549812301",
    phone: "954442190",
    zone: "Cercado · Arequipa",
    categories: ["Tuberías & Válvulas"],
  },
  {
    id: "sup4",
    name: "Lincoln Soldacentro",
    ruc: "20489102931",
    phone: "954112890",
    zone: "Cerro Colorado · Arequipa",
    categories: ["Soldadura & Gases"],
  },
  {
    id: "sup5",
    name: "Ferretería Los Andes Sur E.I.R.L.",
    ruc: "20608976541",
    phone: "959887711",
    zone: "Cerro Colorado · Arequipa",
    categories: ["Ferretería General"],
  },
];

export const initialServices: ServiceItem[] = [
  {
    id: "s1",
    itemNumber: "01",
    title: "Servicio Integral de Mantenimiento de Tuberías y Valvulería",
    description:
      "Desmontaje, reparación y reemplazo de valvulería y tuberías dañadas en red principal. Incluye cuadrilla técnica de campo, pruebas de estanqueidad y consumibles operativos.",
    tags: ["Mantenimiento Arequipa", "Personal Calificado"],
    um: "GLB",
    qty: 1,
  },
  {
    id: "s2",
    itemNumber: "02",
    title: "Flete Operativo, Transporte de Equipos y Cuadrilla",
    description:
      "Traslado terrestre de ida y vuelta de cuadrilla técnica y herramientas desde Taller Precisur hasta el frente de obra en Cerro Colorado.",
    tags: ["Movilidad Local", "Cobertura Arequipa"],
    um: "GLB",
    qty: 1,
  },
];

export const initialQuotation: QuotationData = {
  quotationNumber: "COTIZACION: Nº 60-000569",
  client: {
    ruc: "20601234567",
    name: "Consorcio Minero del Sur S.A.C.",
    address: "Mz. F Lote 12, Parque Industrial Río Seco, Cerro Colorado, Arequipa",
    contact: "Ing. Carlos Mendoza (958 432 109)",
    paymentTerm: "Crédito 30 Días",
  },
  services: initialServices,
  materials: initialMaterials,
  labor: initialTechnicians.slice(0, 2),
  logistics: { freight: 120, equipmentRental: 150, epp: 80 },
  serviceMarginPercent: 35,
  status: "Borrador Operativo",
  observations: "",
  note: "",
  mode: "service",
  suppliers: initialSuppliers,
  technicians: initialTechnicians,
};

export const materialDirectCost = (m: Material) =>
  m.qty * m.unitCost * (m.currency === "USD" ? EXCHANGE_RATE : 1) * (m.hasIgv ? 1 + IGV_RATE : 1);

export const materialSaleTotal = (m: Material) =>
  materialDirectCost(m) * (1 + (m.markupPercent || 0) / 100);

export function calculateTotals(
  data: Pick<QuotationData, "materials" | "labor" | "logistics" | "serviceMarginPercent" | "mode">,
) {
  const materialsCost = data.materials.reduce((a, m) => a + materialDirectCost(m), 0);
  const materialsSale = data.materials.reduce((a, m) => a + materialSaleTotal(m), 0);
  const materialsProfit = materialsSale - materialsCost;

  const laborCost =
    data.mode === "supply" ? 0 : data.labor.reduce((a, t) => a + t.dailyRate * t.days, 0);

  const logisticsCost =
    data.logistics.freight +
    (data.mode === "supply" ? 0 : data.logistics.equipmentRental + data.logistics.epp);

  const direct = materialsCost + laborCost + logisticsCost;

  const serviceBaseCost = laborCost + logisticsCost;
  const serviceSale = serviceBaseCost / (1 - (data.serviceMarginPercent || 0) / 100);
  const serviceProfit = serviceSale - serviceBaseCost;

  const subtotal = materialsSale + (data.mode === "supply" ? serviceBaseCost : serviceSale);
  const totalProfit = materialsProfit + (data.mode === "supply" ? 0 : serviceProfit);

  const igv = subtotal * IGV_RATE;
  const total = subtotal + igv;

  return {
    materialsCost,
    materialsSale,
    materialsProfit,
    laborCost,
    logisticsCost,
    direct,
    serviceSale,
    serviceProfit,
    subtotal,
    totalProfit,
    igv,
    total,
  };
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
  addSupplier: (supplier: Partial<SupplierRecord> & { name: string }, materialId?: string) => void;
  setLogistics: (key: keyof QuotationData["logistics"], value: number) => void;
  setServiceMargin: (v: number) => void;
  setStatus: (status: QuotationData["status"]) => void;
  reject: (text: string) => void;
  setNote: (text: string) => void;
  setMode: (mode: QuotationData["mode"]) => void;
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
          name: "Nuevo suministro / material",
          spec: "Especificación del producto",
          qty: 1,
          um: "UND",
          currency: "PEN",
          unitCost: 0,
          hasIgv: false,
          supplier: s.suppliers[0]?.name ?? "",
          markupPercent: 20,
        },
      ],
    })),
  removeMaterial: (id) => set((s) => ({ materials: s.materials.filter((m) => m.id !== id) })),
  updateLabor: (id, patch) =>
    set((s) => ({ labor: s.labor.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
  toggleTechnician: (id) =>
    set((s) => ({
      labor: s.labor.some((t) => t.id === id)
        ? s.labor.filter((t) => t.id !== id)
        : [...s.labor, ...s.technicians.filter((t) => t.id === id)],
    })),
  addTechnician: (t) =>
    set((s) => ({ technicians: [...s.technicians, t], labor: [...s.labor, t] })),
  addService: () =>
    set((s) => ({
      services: [
        ...s.services,
        {
          id: crypto.randomUUID(),
          itemNumber: String(s.services.length + 1).padStart(2, "0"),
          title: "Nueva Partida de Servicio Técnico",
          description: "Describa el trabajo a realizar por la cuadrilla.",
          tags: ["Servicio Técnico"],
          um: "GLB",
          qty: 1,
        },
      ],
    })),
  updateService: (id, patch) =>
    set((s) => ({
      services: s.services.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  removeService: (id) =>
    set((s) => ({
      services: s.services.filter((item) => item.id !== id),
    })),
  setClient: (client) => set({ client }),
  addSupplier: (suppData, materialId) =>
    set((s) => {
      const existingIndex = s.suppliers.findIndex(
        (p) => p.name.toLowerCase() === suppData.name.toLowerCase(),
      );

      let updatedSuppliers: SupplierRecord[];

      if (existingIndex >= 0) {
        const existing = s.suppliers[existingIndex]!;
        const mergedCategories = Array.from(
          new Set([...existing.categories, ...(suppData.categories || [])]),
        );
        const updated: SupplierRecord = {
          ...existing,
          ...suppData,
          id: existing.id,
          categories: mergedCategories,
        };
        updatedSuppliers = [...s.suppliers];
        updatedSuppliers[existingIndex] = updated;
      } else {
        const newSup: SupplierRecord = {
          id: crypto.randomUUID(),
          name: suppData.name,
          ruc: suppData.ruc || "20608976541",
          phone: suppData.phone || "959887711",
          zone: suppData.zone || "Cerro Colorado · Arequipa",
          categories:
            suppData.categories && suppData.categories.length > 0
              ? suppData.categories
              : ["Ferretería General"],
        };
        updatedSuppliers = [...s.suppliers, newSup];
      }

      return {
        suppliers: updatedSuppliers,
        materials: materialId
          ? s.materials.map((m) => (m.id === materialId ? { ...m, supplier: suppData.name } : m))
          : s.materials,
      };
    }),
  setLogistics: (key, value) =>
    set((s) => ({ logistics: { ...s.logistics, [key]: Math.max(0, value) } })),
  setServiceMargin: (v) => set({ serviceMarginPercent: Math.min(60, Math.max(10, v)) }),
  setStatus: (status) => set({ status }),
  reject: (text) => {
    if (text.trim()) set({ observations: text.trim(), status: "Borrador con Observaciones" });
  },
  setNote: (note) => set({ note }),
  setMode: (mode) => set({ mode }),
  reset: () => set(initialQuotation),
}));

export const money = (value: number) =>
  `S/ ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
