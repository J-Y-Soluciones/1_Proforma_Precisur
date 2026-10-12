import { useState, useEffect } from "react";
import {
  Building2,
  Check,
  ShieldCheck,
  Search,
  Users,
  Store,
  MapPin,
  Phone,
  AlertTriangle,
  Plus,
  Link2,
  TrendingDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useQuotationStore, type Client } from "@/stores/quotation";
import { toast } from "sonner";

export type EntryKind = "client" | "technician" | "supplier" | null;

export function QuickEntry({
  kind,
  close,
  materialId,
  initialSupplierName,
}: {
  kind: EntryKind;
  close: () => void;
  materialId?: string | undefined;
  initialSupplierName?: string | undefined;
}) {
  const s = useQuotationStore();
  const [client, setClient] = useState<Client>(s.client);
  const [rucChecked, setRucChecked] = useState(false);
  const [name, setName] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("Soldador / Cerrajero");
  const [rate, setRate] = useState(180);
  const [supplier, setSupplier] = useState(
    initialSupplierName ?? "Ferretería Los Andes Sur E.I.R.L.",
  );
  const [supplierRuc, setSupplierRuc] = useState("20608976541");
  const [zone, setZone] = useState("Cerro Colorado (Río Seco)");

  const [chips, setChips] = useState(["Tuberías & Válvulas"]);

  const [allCategories, setAllCategories] = useState([
    "Tuberías & Válvulas",
    "Aceros & Perfiles",
    "Soldadura & Gases",
    "Ferretería General",
    "EPPs & Herramientas",
  ]);
  const [newCatInput, setNewCatInput] = useState("");

  const handleAddNewCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (!allCategories.includes(trimmed)) {
      setAllCategories((prev) => [...prev, trimmed]);
    }
    if (!chips.includes(trimmed)) {
      setChips((prev) => [...prev, trimmed]);
    }
    setNewCatInput("");
    toast.success(`Rubro "${trimmed}" añadido y seleccionado`);
  };

  const updateClient = (key: keyof Client, value: string) =>
    setClient((c) => ({ ...c, [key]: value }));

  const title =
    kind === "client"
      ? "Registrar Cliente Corporativo B2B"
      : kind === "technician"
        ? "Registrar Técnico / Especialista"
        : "Registrar Nuevo Proveedor";

  return (
    <Dialog
      open={kind !== null}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto w-[calc(100%-32px)] sm:max-w-[490px] bg-card p-0 gap-0">
        <DialogHeader className="p-6 border-b text-left">
          <div className="flex items-start gap-3">
            <span className="brand-mark bg-primary/15 text-primary">
              {kind === "client" ? (
                <Building2 size={20} />
              ) : kind === "technician" ? (
                <Users size={20} />
              ) : (
                <Store size={20} />
              )}
            </span>
            <div className="min-w-0 pr-4">
              <DialogTitle className="text-base leading-6">{title}</DialogTitle>
              <DialogDescription className="text-xs mt-1">
                Multiservicios Precisur · Alta rápida
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (kind === "client")
              s.setClient({
                ...client,
                contact: phone.trim()
                  ? `${client.contact.replace(/\s*\([^)]*\)/g, "")} (${phone.trim()})`
                  : client.contact,
              });
            if (kind === "technician")
              s.addTechnician({
                id: crypto.randomUUID(),
                name,
                dni,
                specialty,
                dailyRate: rate,
                days: 1,
                available: true,
              });
            if (kind === "supplier") {
              s.addSupplier(
                {
                  name: supplier,
                  ruc: supplierRuc,
                  phone,
                  zone,
                  categories: chips,
                },
                materialId,
              );
            }
            toast.success(
              kind === "client"
                ? "Cliente asignado a la cotización"
                : kind === "technician"
                  ? "Técnico incorporado a la cuadrilla"
                  : "Proveedor registrado y seleccionado",
            );
            close();
          }}
        >
          <div className="p-6 space-y-4">
            {kind === "client" && (
              <>
                <div>
                  <label className="form-label">
                    RUC (11 dígitos) <span className="text-destructive">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="control mono"
                      required
                      pattern="[0-9]{11}"
                      maxLength={11}
                      value={client.ruc}
                      onChange={(e) => {
                        updateClient("ruc", e.target.value.replace(/\D/g, ""));
                        setRucChecked(false);
                      }}
                      aria-label="RUC del cliente"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="shrink-0 h-9"
                      onClick={() => {
                        if (client.ruc.length === 11) {
                          setRucChecked(true);
                          toast.info("Validación local de demostración; SUNAT no conectado");
                        } else toast.error("Ingresa un RUC de 11 dígitos");
                      }}
                    >
                      <Search />
                      Validar SUNAT
                    </Button>
                  </div>
                  {rucChecked && (
                    <div className="mt-2">
                      <span className="badge success">
                        <ShieldCheck size={12} />
                        HABIDO • ACTIVO
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="form-label">Razón Social Fiscal *</label>
                  <input
                    className="control"
                    required
                    value={client.name}
                    onChange={(e) => updateClient("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Dirección de Entrega / Frente de Obra *</label>
                  <input
                    className="control"
                    required
                    value={client.address}
                    onChange={(e) => updateClient("address", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Contacto técnico *</label>
                    <input
                      className="control"
                      required
                      value={client.contact}
                      onChange={(e) => updateClient("contact", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">
                      Teléfono / WhatsApp <span className="badge success">WSP</span>
                    </label>
                    <input
                      className="control"
                      placeholder="958 432 109"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Condición de pago acordada *</label>
                  <select
                    className="control"
                    value={client.paymentTerm}
                    onChange={(e) => updateClient("paymentTerm", e.target.value)}
                  >
                    <option>Contado / Previo depósito</option>
                    <option>50% Adelanto / 50% Entrega</option>
                    <option>Crédito 15 Días</option>
                    <option>Crédito 30 Días</option>
                  </select>
                </div>
              </>
            )}

            {kind === "technician" && (
              <>
                <div>
                  <label className="form-label">Nombres y apellidos completos *</label>
                  <input
                    className="control"
                    required
                    value={name}
                    placeholder="Carlos Ramos Huanca"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">DNI (8 dígitos) *</label>
                    <input
                      className="control mono"
                      required
                      pattern="[0-9]{8}"
                      maxLength={8}
                      value={dni}
                      onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Teléfono / WhatsApp</label>
                    <input
                      className="control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="954 112 890"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Especialidad / Oficio *</label>
                  <select
                    className="control"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  >
                    <option>Soldador / Cerrajero</option>
                    <option>Gasfitero Especialista</option>
                    <option>Maestro Drywall & Pintura</option>
                    <option>Electricista Industrial</option>
                    <option>Mecánico Montajista</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Tarifa por jornada (8h) *</label>
                    <input
                      className="control mono"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Modalidad de Pago</label>
                    <select className="control">
                      <option>Recibo por Honorarios</option>
                      <option>Por Avance / Obra</option>
                      <option>Planilla</option>
                    </select>
                  </div>
                </div>
                <div className="notice">
                  <ShieldCheck />
                  <span>
                    <strong>COSTO INTERNO PROTEGIDO.</strong> No se muestra al cliente en la
                    proforma comercial emitida.
                  </span>
                </div>
              </>
            )}

            {kind === "supplier" && (
              <>
                <div>
                  <label className="form-label">Razón Social / Nombre Comercial *</label>
                  <input
                    className="control"
                    required
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">RUC (11 dígitos) *</label>
                  <input
                    className="control mono"
                    required
                    pattern="[0-9]{11}"
                    maxLength={11}
                    value={supplierRuc}
                    onChange={(e) => setSupplierRuc(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                {s.suppliers.some((p) => p.name.toLowerCase() === supplier.toLowerCase()) && (
                  <div className="notice">
                    <AlertTriangle />
                    <div>
                      <strong>PROVEEDOR YA REGISTRADO</strong>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          s.addSupplier(
                            {
                              name: supplier,
                              ruc: supplierRuc,
                              phone,
                              zone,
                              categories: chips,
                            },
                            materialId,
                          );
                          toast.success(`Datos y rubros actualizados para ${supplier}`);
                          close();
                        }}
                      >
                        <Link2 />
                        Vincular existente
                      </Button>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Teléfono / WhatsApp</label>
                    <input
                      className="control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="959 887 711"
                    />
                  </div>
                  <div>
                    <label className="form-label">Distrito / Zona</label>
                    <select
                      className="control"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                    >
                      <option>Cerro Colorado (Río Seco)</option>
                      <option>Parque Industrial</option>
                      <option>Cercado</option>
                      <option>Lima (Despacho / Envío)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-1 border-t">
                  <label className="form-label text-xs font-semibold">
                    Especialidad / Rubro Comercial (Selecciona o crea)
                  </label>

                  <div className="flex flex-wrap gap-1.5">
                    {allCategories.map((x) => {
                      const selected = chips.includes(x);
                      return (
                        <Button
                          key={x}
                          type="button"
                          variant={selected ? "default" : "secondary"}
                          size="sm"
                          className={`text-[10px] h-7 px-2.5 rounded-full transition-all ${
                            selected
                              ? "bg-blue-600 hover:bg-blue-500 text-white font-medium"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                          onClick={() =>
                            setChips((c) => (c.includes(x) ? c.filter((v) => v !== x) : [...c, x]))
                          }
                        >
                          {selected && <Check size={11} className="mr-1" />}
                          {x}
                        </Button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      className="control text-xs flex-1 h-8 bg-slate-950 border-slate-700"
                      placeholder="Crear otro rubro (ej. Bombas, Torno, Pinturas)..."
                      value={newCatInput}
                      onChange={(e) => setNewCatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddNewCategory();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-slate-700 hover:bg-slate-800 text-slate-200 shrink-0"
                      onClick={handleAddNewCategory}
                    >
                      <Plus size={12} className="mr-1" /> Añadir
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="p-5 border-t flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={close}>
              Cancelar
            </Button>
            <Button type="submit" className="text-xs">
              <Check />
              Guardar y {kind === "technician" ? "asignar a cuadrilla" : "asignar a cotización"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Historial real de cotizaciones vinculado a cada producto individual
type ProductQuoteCandidate = {
  name: string;
  zone: string;
  ruc: string;
  address: string;
  phone: string;
  priceQuote: number;
  hasIgv: boolean;
  category: string;
};

const quotesCatalogByProduct: Record<string, ProductQuoteCandidate[]> = {
  "Válvula de Compuerta Acero 2” ANSI 150": [
    {
      name: "Válvulas & Conexiones del Sur S.A.C.",
      zone: "Cercado",
      ruc: "20549812301",
      address: "Vía Evitamiento Km 3.5, Cerro Colorado",
      phone: "954442190",
      priceQuote: 175.0,
      hasIgv: false,
      category: "Tuberías & Válvulas",
    },
    {
      name: "Aceros Arequipa S.A.",
      zone: "Parque Industrial",
      ruc: "20100072252",
      address: "Av. Industrial 412, Parque Industrial",
      phone: "958334112",
      priceQuote: 185.0,
      hasIgv: false,
      category: "Tuberías & Válvulas",
    },
    {
      name: "Ferretería Industrial El Cono E.I.R.L.",
      zone: "Río Seco",
      ruc: "20601982341",
      address: "Mz. B Lote 4, Río Seco, Cerro Colorado",
      phone: "959110204",
      priceQuote: 195.0,
      hasIgv: true,
      category: "Ferretería General",
    },
  ],
  "Tubería Galvanizada SCH 40 2” (Tramos 6m)": [
    {
      name: "Ferretería Industrial El Cono E.I.R.L.",
      zone: "Río Seco",
      ruc: "20601982341",
      address: "Mz. B Lote 4, Río Seco, Cerro Colorado",
      phone: "959110204",
      priceQuote: 48.5,
      hasIgv: false,
      category: "Tuberías & Válvulas",
    },
    {
      name: "Aceros Arequipa S.A.",
      zone: "Parque Industrial",
      ruc: "20100072252",
      address: "Av. Industrial 412, Parque Industrial",
      phone: "958334112",
      priceQuote: 52.0,
      hasIgv: false,
      category: "Aceros & Perfiles",
    },
    {
      name: "Ferretería Los Andes Sur E.I.R.L.",
      zone: "Río Seco",
      ruc: "20608976541",
      address: "Av. Las Américas 204, Cerro Colorado",
      phone: "959887711",
      priceQuote: 56.0,
      hasIgv: true,
      category: "Ferretería General",
    },
  ],
  "Empaquetadura y Sellos de Alta Presión 2”": [
    {
      name: "Válvulas & Conexiones del Sur S.A.C.",
      zone: "Cercado",
      ruc: "20549812301",
      address: "Vía Evitamiento Km 3.5, Cerro Colorado",
      phone: "954442190",
      priceQuote: 32.0,
      hasIgv: false,
      category: "Tuberías & Válvulas",
    },
    {
      name: "Ferretería Industrial El Cono E.I.R.L.",
      zone: "Río Seco",
      ruc: "20601982341",
      address: "Mz. B Lote 4, Río Seco, Cerro Colorado",
      phone: "959110204",
      priceQuote: 36.5,
      hasIgv: true,
      category: "Ferretería General",
    },
    {
      name: "Ferretería Los Andes Sur E.I.R.L.",
      zone: "Río Seco",
      ruc: "20608976541",
      address: "Av. Las Américas 204, Cerro Colorado",
      phone: "959887711",
      priceQuote: 39.0,
      hasIgv: false,
      category: "Ferretería General",
    },
  ],
  "Soldadura y Electrodos E7018 1/8” (Lata 20kg)": [
    {
      name: "Lincoln Soldacentro",
      zone: "Cerro Colorado",
      ruc: "20489102931",
      address: "Calle Los Talleres 102, Cerro Colorado",
      phone: "954112890",
      priceQuote: 151.5,
      hasIgv: false,
      category: "Soldadura & Gases",
    },
    {
      name: "Ferretería Industrial El Cono E.I.R.L.",
      zone: "Río Seco",
      ruc: "20601982341",
      address: "Mz. B Lote 4, Río Seco, Cerro Colorado",
      phone: "959110204",
      priceQuote: 158.0,
      hasIgv: true,
      category: "Ferretería General",
    },
    {
      name: "Aceros Arequipa S.A.",
      zone: "Parque Industrial",
      ruc: "20100072252",
      address: "Av. Industrial 412, Parque Industrial",
      phone: "958334112",
      priceQuote: 162.0,
      hasIgv: false,
      category: "Aceros & Perfiles",
    },
  ],
};

const defaultCandidates: ProductQuoteCandidate[] = [
  {
    name: "Ferretería Industrial El Cono E.I.R.L.",
    zone: "Río Seco",
    ruc: "20601982341",
    address: "Mz. B Lote 4, Río Seco, Cerro Colorado",
    phone: "959 110 204",
    priceQuote: 100.0,
    hasIgv: true,
    category: "Ferretería General",
  },
  {
    name: "Aceros Arequipa S.A.",
    zone: "Parque Industrial",
    ruc: "20100072252",
    address: "Av. Industrial 412, Parque Industrial, Arequipa",
    phone: "958 334 112",
    priceQuote: 110.0,
    hasIgv: false,
    category: "Aceros & Perfiles",
  },
];

export function SupplierDrawer({
  open,
  close,
  materialId,
}: {
  open: boolean;
  close: () => void;
  materialId?: string | undefined;
}) {
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState("Todos");
  const s = useQuotationStore();

  const currentMaterial = s.materials.find((m) => m.id === materialId) ?? s.materials[0];

  // Función de coincidencia flexible (ignora comillas curvas, rectas y mayúsculas)
  const getCandidatesForCurrent = (): ProductQuoteCandidate[] => {
    if (!currentMaterial) return defaultCandidates;
    const cleanCurrent = currentMaterial.name
      .toLowerCase()
      .replace(/["”'’]/g, "")
      .trim();

    const matchedKey = Object.keys(quotesCatalogByProduct).find((key) => {
      const cleanKey = key
        .toLowerCase()
        .replace(/["”'’]/g, "")
        .trim();
      return (
        cleanKey === cleanCurrent ||
        cleanCurrent.includes(cleanKey) ||
        cleanKey.includes(cleanCurrent)
      );
    });

    if (matchedKey && quotesCatalogByProduct[matchedKey]) {
      return quotesCatalogByProduct[matchedKey];
    }

    // Fallback dinámico usando el costo unitario del propio insumo si no está en el diccionario
    return [
      {
        name: "Ferretería Industrial El Cono E.I.R.L.",
        zone: "Río Seco",
        ruc: "20601982341",
        address: "Mz. B Lote 4, Río Seco, Cerro Colorado",
        phone: "959 110 204",
        priceQuote: currentMaterial.unitCost,
        hasIgv: currentMaterial.hasIgv,
        category: "Ferretería General",
      },
      {
        name: "Aceros Arequipa S.A.",
        zone: "Parque Industrial",
        ruc: "20100072252",
        address: "Av. Industrial 412, Parque Industrial, Arequipa",
        phone: "958 334 112",
        priceQuote: Math.round(currentMaterial.unitCost * 1.08 * 10) / 10,
        hasIgv: false,
        category: "Aceros & Perfiles",
      },
      {
        name: "Válvulas & Conexiones del Sur S.A.C.",
        zone: "Cercado",
        ruc: "20549812301",
        address: "Vía Evitamiento Km 3.5, Cerro Colorado",
        phone: "954 442 190",
        priceQuote: Math.round(currentMaterial.unitCost * 0.95 * 10) / 10,
        hasIgv: false,
        category: "Tuberías & Válvulas",
      },
    ];
  };

  const candidatesForProduct = getCandidatesForCurrent();

  // Diccionario de cotizaciones indexado por `${materialId}_${ruc}` para aislar productos
  const [quotes, setQuotes] = useState<Record<string, { price: number; hasIgv: boolean }>>({});

  const getCandidateQuote = (p: ProductQuoteCandidate) => {
    if (!currentMaterial) return { price: p.priceQuote, hasIgv: p.hasIgv };
    const key = `${currentMaterial.id}_${p.ruc}`;
    return quotes[key] ?? { price: p.priceQuote, hasIgv: p.hasIgv };
  };

  const filtered = candidatesForProduct
    .filter(
      (x) =>
        (zone === "Todos" || x.zone === zone) &&
        (x.name.toLowerCase().includes(query.toLowerCase()) ||
          x.category.toLowerCase().includes(query.toLowerCase())),
    )
    .sort((a, b) => {
      const priceA = getCandidateQuote(a).price;
      const priceB = getCandidateQuote(b).price;
      return priceA - priceB;
    });

  const updateQuotePrice = (ruc: string, price: number) => {
    if (!currentMaterial) return;
    const key = `${currentMaterial.id}_${ruc}`;
    setQuotes((prev) => ({
      ...prev,
      [key]: {
        hasIgv: prev[key]?.hasIgv ?? false,
        price: Math.max(0, price),
      },
    }));
  };

  const toggleQuoteIgv = (ruc: string) => {
    if (!currentMaterial) return;
    const key = `${currentMaterial.id}_${ruc}`;
    const currentCandidate = candidatesForProduct.find((c) => c.ruc === ruc);
    const existing = quotes[key] ?? {
      price: currentCandidate?.priceQuote ?? 0,
      hasIgv: currentCandidate?.hasIgv ?? false,
    };
    setQuotes((prev) => ({
      ...prev,
      [key]: {
        price: existing.price,
        hasIgv: !existing.hasIgv,
      },
    }));
  };

  const handleApplyPrice = (p: ProductQuoteCandidate) => {
    const quote = getCandidateQuote(p);
    if (currentMaterial) {
      s.updateMaterial(currentMaterial.id, {
        supplier: p.name,
        unitCost: quote.price,
        hasIgv: quote.hasIgv,
      });
      if (!s.suppliers.some((sup) => sup.name.toLowerCase() === p.name.toLowerCase())) {
        s.addSupplier(
          {
            name: p.name,
            ruc: p.ruc,
            phone: p.phone,
            zone: p.zone,
            categories: [p.category],
          },
          currentMaterial.id,
        );
      }
      toast.success(
        `Precio de S/ ${quote.price.toFixed(2)} (${p.name}) aplicado a "${currentMaterial.name}"`,
      );
    }
    close();
  };

  const handleSaveToDirectory = (p: ProductQuoteCandidate) => {
    if (!s.suppliers.some((sup) => sup.name.toLowerCase() === p.name.toLowerCase())) {
      s.addSupplier({
        name: p.name,
        ruc: p.ruc,
        phone: p.phone,
        zone: p.zone,
        categories: [p.category],
      });
      toast.success(`"${p.name}" guardado en tu directorio permanente de proveedores`);
    } else {
      toast.info("Este proveedor ya está en tu directorio");
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) close();
      }}
    >
      <SheetContent className="w-full sm:max-w-[490px] bg-card overflow-y-auto">
        <SheetHeader className="text-left border-b pb-4">
          <SheetTitle className="flex gap-2 items-center text-base">
            <Search className="text-primary" size={20} />
            Comparativa de Proveedores para este Insumo
          </SheetTitle>
          <SheetDescription className="text-xs">
            {currentMaterial ? (
              <span className="block mt-1">
                Cotizaciones registradas para:{" "}
                <strong className="text-foreground text-blue-400 block mt-0.5">
                  {currentMaterial.name}
                </strong>
              </span>
            ) : (
              "Directorio asistido de cotización rápida"
            )}
          </SheetDescription>
        </SheetHeader>

        {/* Buscador dentro del insumo */}
        <div className="mt-4 relative">
          <Search size={15} className="absolute top-3 left-3 text-muted-foreground" />
          <input
            className="control pl-9 text-xs"
            placeholder="Buscar distribuidor para este insumo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filtros de zona */}
        <div className="field-label mt-4 text-[10px]">Filtrar por zona comercial</div>
        <div className="flex flex-wrap gap-1 mb-4">
          {["Todos", "Parque Industrial", "Río Seco", "Cercado", "Lima"].map((x) => (
            <Button
              size="sm"
              variant={x === zone ? "default" : "secondary"}
              key={x}
              className="text-[10px] h-7 px-2.5"
              onClick={() => setZone(x)}
            >
              {x}
            </Button>
          ))}
        </div>

        {/* Lista de proveedores para ESTE producto */}
        <div className="space-y-4">
          {filtered.map((p, i) => {
            const currentQuote = getCandidateQuote(p);
            const isRegistered = s.suppliers.some(
              (sup) => sup.name.toLowerCase() === p.name.toLowerCase(),
            );

            return (
              <div
                className="panel p-4 border hover:border-slate-700 transition-colors bg-slate-950/70"
                key={p.ruc}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-foreground truncate">{p.name}</div>
                    <p className="text-[10px] text-muted-foreground flex gap-1 items-center mt-0.5">
                      <MapPin size={11} className="shrink-0" /> {p.address}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    {i === 0 && (
                      <span className="badge success text-[8px] flex items-center gap-1 font-bold">
                        <TrendingDown size={10} /> MEJOR PRECIO
                      </span>
                    )}
                    {p.zone === "Lima" && (
                      <span className="badge warning text-[8px]">ENVÍO PROVINCIA</span>
                    )}
                    {isRegistered && (
                      <span className="badge success text-[8px]">EN DIRECTORIO</span>
                    )}
                  </div>
                </div>

                {/* Caja de precio y cotización */}
                <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium text-slate-300">
                      Última cotización recibida:
                    </span>
                    <a
                      href={`https://wa.me/51${p.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Hola ${p.name}, le saludamos de Multiservicios Precisur. ¿Tienen disponible ${currentMaterial?.name || "el insumo"} y a qué precio con factura?`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 font-medium"
                    >
                      <Phone size={11} /> Consultar WSP
                    </a>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 flex-1">
                      <span className="text-[11px] text-muted-foreground font-mono">S/</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentQuote.price || ""}
                        onChange={(e) => updateQuotePrice(p.ruc, parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="bg-transparent text-xs font-mono font-bold text-slate-100 w-full focus:outline-none"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toggleQuoteIgv(p.ruc)}
                      className={`text-[9px] h-8 font-bold border ${
                        currentQuote.hasIgv
                          ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                          : "border-slate-700 bg-slate-800 text-slate-400"
                      }`}
                    >
                      {currentQuote.hasIgv ? "+ 18% IGV" : "SIN IGV"}
                    </Button>
                  </div>
                </div>

                {/* Acciones */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {!isRegistered ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-[10px] h-8 bg-slate-800 hover:bg-slate-700 text-slate-300"
                      onClick={() => handleSaveToDirectory(p)}
                    >
                      <Plus size={12} className="mr-1" /> Guardar Proveedor
                    </Button>
                  ) : (
                    <span className="text-[10px] text-muted-foreground flex items-center justify-center font-mono">
                      RUC: {p.ruc}
                    </span>
                  )}

                  <Button
                    variant="default"
                    size="sm"
                    className="text-[10px] h-8 bg-blue-600 hover:bg-blue-500 text-white font-medium col-span-1"
                    onClick={() => handleApplyPrice(p)}
                  >
                    <Check size={12} className="mr-1" /> Aplicar a proforma
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
