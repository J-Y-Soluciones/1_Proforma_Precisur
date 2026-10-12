import { useState } from "react";
import {
  Users,
  Truck,
  Plus,
  Search,
  ShieldCheck,
  Store,
  MessageCircle,
  UserCheck,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useQuotationStore, money } from "@/stores/quotation";
import { QuickEntry, SupplierDrawer, type EntryKind } from "./quick-entry";

export function Directory() {
  const s = useQuotationStore();
  const [tab, setTab] = useState("technicians");
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("Todas");
  const [supplierCategory, setSupplierCategory] = useState("Todos");
  const [filter, setFilter] = useState("Todos");
  const [entry, setEntry] = useState<EntryKind>(null);
  const [drawer, setDrawer] = useState(false);

  // Categorías registradas en vivo desde los proveedores en el store
  const allRegisteredCategories = Array.from(
    new Set(["Todos", ...s.suppliers.flatMap((p) => p.categories)]),
  );

  // Filtrado de técnicos
  const people = s.technicians.filter(
    (p) =>
      `${p.name} ${p.dni} ${p.specialty}`.toLowerCase().includes(query.toLowerCase()) &&
      (specialty === "Todas" || p.specialty.includes(specialty)) &&
      (filter === "Todos" || (filter === "Asignados") === s.labor.some((t) => t.id === p.id)),
  );

  // Filtrado reactivo de proveedores
  const suppliersFiltered = s.suppliers.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.categories.some((c) => c.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory =
      supplierCategory === "Todos" ||
      p.categories.some((c) => c.toLowerCase() === supplierCategory.toLowerCase());
    return matchesQuery && matchesCategory;
  });

  return (
    <>
      <div className="eyebrow">DIRECTORIO DE RECURSOS / CUADRILLA & PERSONAL TÉCNICO</div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 mt-2">
        <div className="min-w-0">
          <h1 className="page-title">Recursos & directorios operativos</h1>
          <p className="page-subtitle">
            Tarifas por jornada, homologaciones técnicas y catálogo de proveedores locales
            clasificados por rubro.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setEntry(tab === "technicians" ? "technician" : "supplier")}
        >
          <Plus />
          <span className="hidden sm:inline">
            {tab === "technicians" ? "Nuevo técnico" : "Nuevo proveedor"}
          </span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-6 mb-5">
        <Button
          variant={tab === "technicians" ? "default" : "secondary"}
          onClick={() => {
            setTab("technicians");
            setQuery("");
          }}
        >
          <Users />
          Cuadrilla & técnicos ({s.technicians.length})
        </Button>
        <Button
          variant={tab === "suppliers" ? "default" : "secondary"}
          onClick={() => {
            setTab("suppliers");
            setQuery("");
          }}
        >
          <Truck />
          Proveedores locales ({s.suppliers.length})
        </Button>
      </div>

      {/* Barra de Búsqueda y Filtros Dinámicos */}
      <div className="panel p-3 flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
          <input
            className="control pl-9 text-xs"
            aria-label="Buscar en directorio"
            placeholder={
              tab === "technicians"
                ? "Buscar por nombre, DNI o especialidad…"
                : "Buscar por nombre de proveedor o rubro (ej. válvulas, soldadura)…"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {tab === "technicians" ? (
          <>
            <select
              className="control w-auto text-xs"
              aria-label="Filtrar especialidad"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              <option>Todas</option>
              <option>Soldador</option>
              <option>Gasfitero</option>
              <option>Drywall</option>
              <option>Electricista</option>
              <option>Montajista</option>
            </select>
            <div className="flex gap-1">
              {["Todos", "Disponibles", "Asignados"].map((x) => (
                <Button
                  key={x}
                  size="sm"
                  variant={filter === x ? "default" : "secondary"}
                  onClick={() => setFilter(x)}
                >
                  {x}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <Tag size={13} className="text-muted-foreground" />
              <select
                className="control w-auto text-xs font-medium"
                value={supplierCategory}
                onChange={(e) => setSupplierCategory(e.target.value)}
              >
                {allRegisteredCategories.map((c) => (
                  <option key={c} value={c}>
                    {c === "Todos" ? "Todos los rubros" : c}
                  </option>
                ))}
              </select>
            </div>

            <Button size="sm" variant="secondary" onClick={() => setDrawer(true)}>
              <Search size={13} className="mr-1" />
              Búsqueda externa
            </Button>
          </>
        )}
      </div>

      <div className="panel overflow-x-auto">
        {tab === "technicians" ? (
          <table className="data-table min-w-[800px]">
            <thead>
              <tr>
                <th>Técnico operativo</th>
                <th>DNI</th>
                <th>Especialidad & homologación</th>
                <th>Estado operativo</th>
                <th className="text-right">Tarifa / jornada</th>
                <th>Asignar</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => {
                const assigned = s.labor.some((x) => x.id === p.id);
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="flex gap-3 items-center">
                        <span className="avatar">
                          {p.name
                            .split(" ")
                            .slice(0, 2)
                            .map((x) => x[0])
                            .join("")}
                        </span>
                        <div className="text-[11px] font-medium">
                          {p.name}
                          <div className="text-[9px] text-muted-foreground mt-1">
                            Operario técnico · Arequipa
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="mono text-[11px]">{p.dni}</td>
                    <td>
                      <div className="text-[11px] font-medium">{p.specialty}</div>
                      <span className="badge success mt-2">
                        <ShieldCheck size={11} />
                        Homologación vigente
                      </span>
                      <p className="text-[9px] text-muted-foreground mt-2">
                        SCTR activo · Arequipa
                      </p>
                    </td>
                    <td>
                      <span className={`badge ${assigned ? "warning" : "success"}`}>
                        {assigned ? "Asignado · Cotización activa" : "Disponible · Taller / Obra"}
                      </span>
                    </td>
                    <td className="text-right">
                      <strong className="mono text-base">{money(p.dailyRate)}</strong>
                      <p className="text-muted-foreground text-[9px] mt-1">PEN / Turno 8H</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={assigned}
                          onCheckedChange={() => s.toggleTechnician(p.id)}
                          aria-label={`Asignar ${p.name}`}
                        />
                        <span className="text-[9px] text-muted-foreground">
                          {assigned ? "En cuadrilla" : "Asignar"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table className="data-table min-w-[750px]">
            <thead>
              <tr>
                <th>Proveedor Comercial</th>
                <th>Rubro & Especialidad</th>
                <th>RUC / Ubicación</th>
                <th>Contacto Directo</th>
                <th className="text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {suppliersFiltered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                      <span className="avatar">
                        <Store size={15} />
                      </span>
                      {p.name}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {p.categories.map((cat) => (
                        <span key={cat} className="badge blue text-[10px] font-medium px-2 py-0.5">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-[11px] text-muted-foreground">
                    <span className="font-mono text-slate-300 block">{p.ruc}</span>
                    <span>{p.zone}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-300">{p.phone}</span>
                      <a
                        href={`https://wa.me/51${p.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hola ${p.name}, le saludamos de Multiservicios Precisur. ¿Tienen disponibilidad en su rubro para cotizar?`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600/25 border border-emerald-500/20 font-medium"
                      >
                        <MessageCircle size={12} /> Contactar WSP
                      </a>
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="badge success text-[9px]">Registrado</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {((tab === "technicians" && people.length === 0) ||
          (tab === "suppliers" && suppliersFiltered.length === 0)) && (
          <p className="py-10 text-center text-muted-foreground text-xs">
            No se encontraron registros para los criterios seleccionados.
          </p>
        )}

        <div className="table-footer">
          <span className="flex items-center gap-2">
            Mostrando {tab === "technicians" ? people.length : suppliersFiltered.length} registros
            operativos
          </span>
          <span className="mono text-xs">01</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div className="panel p-5">
          <div className="eyebrow flex justify-between">
            Costo jornada base (8H)
            <Users size={15} className="text-primary" />
          </div>
          <div className="mono text-xl mt-5">
            {money(
              s.technicians.reduce((a, p) => a + p.dailyRate, 0) / (s.technicians.length || 1),
            )}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Promedio de la cuadrilla registrada
          </p>
        </div>
        <div className="panel p-5">
          <div className="eyebrow flex justify-between">
            Homologación & SCTR
            <ShieldCheck size={15} className="text-success" />
          </div>
          <div className="mono text-xl text-success mt-5">100% activas</div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Datos de demostración · Verificación documental al día
          </p>
        </div>
        <div className="panel p-5">
          <div className="eyebrow flex justify-between">
            Capacidad de despliegue
            <UserCheck size={15} className="text-warning" />
          </div>
          <div className="mono text-xl text-warning mt-5">
            {s.technicians.length - s.labor.length} disponibles
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            {s.labor.length} técnicos en la cuadrilla activa
          </p>
        </div>
      </div>

      {entry && <QuickEntry kind={entry} close={() => setEntry(null)} />}
      <SupplierDrawer
        open={drawer}
        close={() => setDrawer(false)}
        materialId={s.materials[0]?.id}
      />
    </>
  );
}
