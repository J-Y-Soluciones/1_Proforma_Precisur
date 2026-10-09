import { describe, it, expect, beforeEach } from 'vitest';
import { type Material, calculateTotals, initialQuotation, materialTotal, useQuotationStore } from './quotation';
const testMaterial: Material = { id: 'test', name: 'Valve', spec: 'ANSI 150', qty: 1, um: 'UND', currency: 'PEN', unitCost: 100, hasIgv: false, supplier: 'Test' };
describe('quotation financial rules', () => {
 beforeEach(() => useQuotationStore.getState().reset());
 it('starts at the requested S/ 3486 direct cost with 120 freight, 200 rental and 83.50 EPP', () => { expect(initialQuotation.logistics).toEqual({ freight: 120, equipmentRental: 200, epp: 83.5 }); expect(calculateTotals(initialQuotation).direct).toBe(3486); });
 it('converts USD to PEN at 3.765', () => { expect(materialTotal({ ...testMaterial, qty: 2, unitCost: 100, currency: 'USD' })).toBe(753); });
 it('adds 18% when purchase IGV is enabled', () => { expect(materialTotal({ ...testMaterial, qty: 1, unitCost: 100, hasIgv: true })).toBe(118); });
 it('computes labor from daily rate times days', () => { expect(calculateTotals(initialQuotation).labor).toBe(320 * 4 + 250 * 3); });
 it('uses a 35% margin, not a markup', () => { const t = calculateTotals(initialQuotation); expect(t.sale).toBeCloseTo(3486 / 0.65); expect(t.profit).toBeCloseTo(t.sale - 3486); });
 it('applies 18% sales IGV and total', () => { const t = calculateTotals(initialQuotation); expect(t.igv).toBeCloseTo(t.subtotal * 0.18); expect(t.total).toBeCloseTo(t.subtotal * 1.18); });
 it('limits margin to 10–60%', () => { const s = useQuotationStore.getState(); s.setMargin(0); expect(useQuotationStore.getState().marginPercent).toBe(10); s.setMargin(99); expect(useQuotationStore.getState().marginPercent).toBe(60); });
 it.each([25, 30, 35, 40])('recalculates preset %s', marginPercent => { useQuotationStore.getState().setMargin(marginPercent); expect(calculateTotals(useQuotationStore.getState()).sale).toBeCloseTo(3486 / (1 - marginPercent / 100)); });
 it('adds commercial freight to taxable sale, not internal costs', () => { const t = calculateTotals({ ...initialQuotation, commercialFreight: 250 }); expect(t.direct).toBe(3486); expect(t.subtotal).toBeCloseTo(3486 / 0.65 + 250); });
 it('requires observations to return the quote', () => { useQuotationStore.getState().reject('   '); expect(useQuotationStore.getState().status).toBe('Borrador Operativo'); useQuotationStore.getState().reject('Revisar tarifa'); expect(useQuotationStore.getState().status).toBe('Borrador con Observaciones'); });
 it('excludes labor and equipment in supply mode', () => { expect(calculateTotals({ ...initialQuotation, mode: 'supply' }).direct).toBe(1172.5); });
});
