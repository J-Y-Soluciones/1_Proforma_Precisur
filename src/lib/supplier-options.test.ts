import { beforeEach, describe, expect, it } from 'vitest';
import { filterSuppliers, supplierExists, supplierLeadTime } from './supplier-options';
import { useQuotationStore } from '@/stores/quotation';
describe('supplier selection and registration', () => {
 beforeEach(() => useQuotationStore.getState().reset());
 it('offers the requested existing suppliers and searches without accents', () => {
  expect(filterSuppliers([], 'aceros')).toEqual(['Aceros Arequipa S.A.']);
  expect(filterSuppliers([], 'ferreteria')).toEqual(['Ferretería El Cono S.A.C.']);
 });
 it('permits registration only for an unknown trimmed name', () => {
  expect(supplierExists([], ' aceros arequipa s.a. ')).toBe(true);
  expect(supplierExists([], 'Ferretería Los Andes')).toBe(false);
 });
 it('assigns an existing supplier only to the targeted row with its lead time', () => {
  useQuotationStore.getState().addSupplier('Sealing Solution Perú', 'm1');
  const rows = useQuotationStore.getState().materials;
  expect(rows[0]?.supplier).toBe('Sealing Solution Perú');
  expect(supplierLeadTime(rows[0]?.supplier ?? '')).toBe('24-48h Lima');
  expect(rows[1]?.supplier).toBe('Ferretería El Cono E.I.R.L.');
  expect(supplierLeadTime('Aceros Arequipa S.A.')).toBe('Stock Inmediato');
 });
 it('registers the searched name and assigns it to the original row', () => {
  useQuotationStore.getState().addSupplier('Ferretería Los Andes', 'm2');
  expect(useQuotationStore.getState().suppliers).toContain('Ferretería Los Andes');
  expect(useQuotationStore.getState().materials[1]?.supplier).toBe('Ferretería Los Andes');
  expect(useQuotationStore.getState().materials[0]?.supplier).toBe('Aceros Arequipa S.A.');
 });
});