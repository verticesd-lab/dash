// Utilitários para máscaras de input

/**
 * Aplica máscara de telefone brasileiro
 * Formato: (11) 99999-9999
 */
export function maskPhone(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length <= 10) {
    // Telefone fixo: (11) 9999-9999
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    // Celular: (11) 99999-9999
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15)
  }
}

/**
 * Aplica máscara de CNPJ
 * Formato: 12.345.678/0001-90
 */
export function maskCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  return numbers
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18)
}

/**
 * Aplica máscara de CPF
 * Formato: 123.456.789-01
 */
export function maskCPF(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  return numbers
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
    .slice(0, 14)
}

/**
 * Aplica máscara de CEP
 * Formato: 12345-678
 */
export function maskCEP(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  return numbers
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .slice(0, 9)
}

/**
 * Remove todos os caracteres não numéricos
 */
export function unmask(value: string): string {
  return value.replace(/\D/g, '')
}
