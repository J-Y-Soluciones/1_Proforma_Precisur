import { useState } from 'react';
import { Check, ChevronDown, Plus, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { useQuotationStore } from '@/stores/quotation';
import { filterSuppliers, supplierExists, supplierLeadTime } from '@/lib/supplier-options';

export function SupplierCombobox({ 
  materialId, 
  value, 
  index, 
  onRegister 
}: { 
  materialId: string; 
  value: string; 
  index: number; 
  onRegister: (name: string) => void 
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const suppliers = useQuotationStore(s => s.suppliers);
  const updateMaterial = useQuotationStore(s => s.updateMaterial);
  
  const options = filterSuppliers(suppliers, query);
  const canRegister = Boolean(query.trim()) && !supplierExists(suppliers, query);

  const selectSupplier = (name: string) => {
    // 1. Asigna el proveedor al material en la tabla
    updateMaterial(materialId, { supplier: name });
    // 2. Si no existía en el catálogo del store, lo añade
    useQuotationStore.getState().addSupplier(name);
    setOpen(false);
  };

  const register = () => {
    setOpen(false);
    onRegister(query.trim());
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <Popover open={open} onOpenChange={next => { setOpen(next); if(next) setQuery(''); }}>
        <PopoverTrigger asChild>
          <Button 
            variant="secondary" 
            size="sm" 
            role="combobox" 
            aria-expanded={open} 
            aria-label={`Proveedor material ${index}`} 
            className="h-7 max-w-[210px] text-[9px] px-2 rounded-full font-medium"
          >
            <Store className="size-3 mr-1 text-slate-400"/>
            <span className="truncate">Prov: {value || 'Seleccionar'}</span>
            <ChevronDown className="size-3 shrink-0 ml-1 opacity-50"/>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" sideOffset={6} className="p-0 w-[320px] max-w-[calc(100vw-32px)]">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Buscar proveedor..." 
              value={query} 
              onValueChange={setQuery} 
              onKeyDown={event => { 
                if (event.key === 'Enter' && canRegister) { 
                  event.preventDefault(); 
                  event.stopPropagation(); 
                  register(); 
                } 
              }}
            />
            <CommandList>
              <CommandGroup heading="Proveedores homologados">
                {options.map(name => (
                  <CommandItem key={name} value={name} onSelect={() => selectSupplier(name)}>
                    <Store className="size-3.5 mr-2 text-slate-400"/>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium">{name}</div>
                      <div className="text-[10px] text-muted-foreground">{supplierLeadTime(name)}</div>
                    </div>
                    {value === name && <Check className="text-emerald-500 size-4"/>}
                  </CommandItem>
                ))}
                {canRegister && (
                  <CommandItem 
                    value={`register-${query}`} 
                    onSelect={register} 
                    className="text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 py-2.5 font-semibold"
                  >
                    <Plus className="size-4 mr-2"/>
                    <span className="min-w-0 flex-1 break-words">Registrar "{query.trim()}"</span>
                    <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-400">Enter ↵</span>
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <span className={`text-[8px] font-medium ${supplierLeadTime(value) === 'Stock Inmediato' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
        {supplierLeadTime(value)}
      </span>
    </div>
  );
}