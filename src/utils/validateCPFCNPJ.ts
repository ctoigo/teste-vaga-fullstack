export const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11) return false;

  if (/^(\d)\1+$/.test(cpf)) return false;

  const calcCheckDigit = (digits: string) => {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += parseInt(digits[i]) * (digits.length + 1 - i);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const checkDigit1 = calcCheckDigit(cpf.slice(0, 9));
  const checkDigit2 = calcCheckDigit(cpf.slice(0, 10));

  return checkDigit1 === parseInt(cpf[9]) && checkDigit2 === parseInt(cpf[10]);
};

export const isValidCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14) return false;

  if (/^(\d)\1+$/.test(cnpj)) return false;

  const calcCheckDigit = (digits: string, multipliers: number[]): number => {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += parseInt(digits[i]) * multipliers[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const multipliers1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const multipliers2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const checkDigit1 = calcCheckDigit(cnpj.slice(0, 12), multipliers1);
  const checkDigit2 = calcCheckDigit(cnpj.slice(0, 13), multipliers2);

  return checkDigit1 === parseInt(cnpj[12]) && checkDigit2 === parseInt(cnpj[13]);
};

export const validateCPFOrCNPJ = (cpfCnpj: string): boolean => {
  return cpfCnpj.length === 11 ? isValidCPF(cpfCnpj) : isValidCNPJ(cpfCnpj);
};
