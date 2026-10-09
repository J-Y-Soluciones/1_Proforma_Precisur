import { describe, it, expect } from 'vitest';
import { createQuotationPdf } from './quotation-pdf';
import { initialQuotation } from '@/stores/quotation';
describe('commercial PDF confidentiality', () => {
 it('omits internal workshop notes and technician names', () => {
  const doc = createQuotationPdf({ ...initialQuotation, note: 'INTERNAL_WORKSHOP_NOTE_123' });
  const output = doc.output();
  expect(output).not.toContain('INTERNAL_WORKSHOP_NOTE_123');
  expect(output).not.toContain('Jorge Valdivia');
  expect(output).not.toContain('Marcos Benavente');
  expect(doc.getNumberOfPages()).toBe(2);
 });
});
