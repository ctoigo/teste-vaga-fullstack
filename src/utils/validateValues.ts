export const validateValues = (
  vlTotal: number,
  qtPrestacoes: number,
  vlPresta: number
): boolean => {
  const totalFromPrestacoes = vlPresta * qtPrestacoes;
  return Math.round(vlTotal) === Math.round(totalFromPrestacoes);
};
