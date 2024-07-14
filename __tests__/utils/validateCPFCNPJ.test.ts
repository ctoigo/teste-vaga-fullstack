import {
  isValidCNPJ,
  isValidCPF,
  validateCPFOrCNPJ,
} from '../../src/utils/validateCPFCNPJ';

test('should validate CPF or CNPJ', () => {
  expect(validateCPFOrCNPJ('12345678901')).toBe(false);
  expect(validateCPFOrCNPJ('11144477735')).toBe(true);
  expect(validateCPFOrCNPJ('12345678000191')).toBe(false);
  expect(validateCPFOrCNPJ('04252011000110')).toBe(true);
});
