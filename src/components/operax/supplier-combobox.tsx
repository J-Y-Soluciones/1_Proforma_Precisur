import { useState } from "react";
import { Check, ChevronsUpDown, Plus, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuotationStore } from "@/stores/quotation";

interface SupplierComboboxProps {
  materialId: string;
  value: string;
  index: number;
  onRegister: (name: string) => void;
}

export function SupplierCombobox({ materialId, value, index, onRegister }: SupplierComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const s = useQuotationStore();

  // Asegurar que leemos el nombre tanto si suppliers viene como string[] o como SupplierRecord[]
  const supplierNames = s.suppliers.map((sup) => (typeof sup === "string" ? sup : sup.name));

  const handleSelect = (currentValue: string) => {
    s.updateMaterial(materialId, { supplier: currentValue });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={`Seleccionar proveedor material ${index}`}
          className="h-7 w-full justify-between text-[10px] bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-slate-100 font-normal px-2 mt-1"
        >
          <span className="truncate flex items-center gap-1.5">
            <Store size={12} className="text-primary shrink-0" />
            {value ? value : "Seleccionar proveedor..."}
          </span>
          <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0 bg-slate-950 border-slate-800 text-slate-200"
        align="start"
      >
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Buscar o registrar proveedor..."
            value={search}
            onValueChange={setSearch}
            className="text-xs h-8 text-slate-100"
          />
          <CommandList className="max-h-56">
            <CommandEmpty className="p-2 text-center text-xs text-muted-foreground">
              <p className="mb-2">No se encontró "{search}".</p>
              <Button
                size="sm"
                variant="secondary"
                className="w-full text-[10px] h-7 bg-slate-800 hover:bg-slate-700 text-slate-200"
                onClick={() => {
                  setOpen(false);
                  onRegister(search);
                }}
              >
                <Plus size={11} className="mr-1" /> Registrar "{search}"
              </Button>
            </CommandEmpty>
            <CommandGroup heading="Proveedores Registrados" className="text-[10px] text-slate-400">
              {supplierNames.map((name) => (
                <CommandItem
                  key={name}
                  value={name}
                  onSelect={() => handleSelect(name)}
                  className="text-xs text-slate-200 cursor-pointer hover:bg-slate-900 aria-selected:bg-slate-900"
                >
                  <Check
                    className={cn(
                      "mr-2 h-3.5 w-3.5 text-primary",
                      value.toLowerCase() === name.toLowerCase() ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="truncate">{name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
