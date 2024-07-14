import { validateValues } from '../../src/utils/validateValues';

test('should validate total and installment values', () => {
  expect(validateValues(1000, 10, 100)).toBe(true);
  expect(validateValues(1000, 10, 90)).toBe(false);
});
