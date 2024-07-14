import { formatCurrency } from '../../src/utils/formatCurrency';

test('should format number as BRL currency', () => {
  expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
});
