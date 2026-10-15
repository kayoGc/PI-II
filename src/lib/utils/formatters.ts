/**
 * Normaliza uma string de valor monetário digitada pelo usuário para Float padrão (ex: 45.90)
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  
  // Remove tudo que não for dígito
  const cleanDigits = value.replace(/\D/g, '');
  
  if (!cleanDigits) return 0;

  // Converte para centavos e divide por 100 para obter as casas decimais corretas
  const numericValue = Number(cleanDigits) / 100;
  return numericValue;
}

/**
 * Formata um número float para o padrão visual brasileiro (ex: 45.9 -> R$ 45,90)
 */
export function formatCurrencyInput(value: string): string {
  const numericValue = parseCurrency(value);
  return numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}