export const supplierSuggestions = ['Aceros Arequipa S.A.', 'Ferretería El Cono S.A.C.'];
export const normalizeSupplier = (name: string) => name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
export function filterSuppliers(names: string[], query: string) {
 return [...new Set([...supplierSuggestions, ...names])].filter(name => normalizeSupplier(name).includes(normalizeSupplier(query)));
}
export function supplierExists(names: string[], query: string) {
 return [...supplierSuggestions, ...names].some(name => normalizeSupplier(name) === normalizeSupplier(query));
}
export function supplierLeadTime(name: string) {
 if (name === 'Aceros Arequipa S.A.' || name.startsWith('Ferretería El Cono')) return 'Stock Inmediato';
 if (name === 'Sealing Solution Perú' || name === 'Lincoln Soldacentro') return '24-48h Lima';
 return 'Por confirmar';
}