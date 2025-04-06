/**
 * Validates a Brazilian CPF (tax ID) number.
 * Checks for proper format, digit sequence, and verification digits.
 * @param taxId - The CPF string to validate, can include formatting characters
 * @returns Boolean indicating if the CPF is valid
 */
export function validateTaxId(taxId: string): boolean {
  taxId = taxId.replace(/\D/g, '')
  
  if (taxId.length !== 11) return false
  
  if (/^(\d)\1+$/.test(taxId)) return false
  
  let sum: number = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(taxId.charAt(i)) * (10 - i)
  }
  
  let remainder: number = 11 - (sum % 11)
  let checkDigit1: number = remainder === 10 || remainder === 11 ? 0 : remainder
  
  if (checkDigit1 !== parseInt(taxId.charAt(9))) {
    return false
  }
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(taxId.charAt(i)) * (11 - i)
  }
  
  remainder = 11 - (sum % 11)
  let checkDigit2: number = remainder === 10 || remainder === 11 ? 0 : remainder
  
  return checkDigit2 === parseInt(taxId.charAt(10))
}

/**
 * Formats a string as a Brazilian CPF (tax ID) with proper punctuation.
 * @param value - The raw value to format as CPF
 * @returns Formatted CPF string (e.g., "123.456.789-09")
 */
export function formatTaxId(value: string): string {
  value = value.replace(/\D/g, '')
  
  if (value.length <= 3) {
    return value
  } else if (value.length <= 6) {
    return value.replace(/(\d{3})(\d+)/, '$1.$2')
  } else if (value.length <= 9) {
    return value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
  } else {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4').substring(0, 14)
  }
}

/**
 * Formats a string as a Brazilian phone number with proper formatting.
 * @param value - The raw phone number string
 * @returns Formatted phone number string (e.g., "(11) 98765-4321")
 */
export function formatPhone(value: string): string {
  value = value.replace(/\D/g, '')
  
  if (value.length <= 2) {
    return value
  } else if (value.length <= 7) {
    return value.replace(/(\d{2})(\d+)/, '($1) $2')
  } else {
    return value.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3').substring(0, 15)
  }
}

/**
 * Formats a string as a Brazilian postal code (CEP).
 * @param value - The raw postal code string
 * @returns Formatted postal code (e.g., "12345-678")
 */
export function formatZipCode(value: string): string {
  value = value.replace(/\D/g, '')
  
  if (value.length <= 5) {
    return value
  } else {
    return value.replace(/(\d{5})(\d+)/, '$1-$2').substring(0, 9)
  }
}

/**
 * Formats a date string to localized Brazilian format.
 * @param date - The date string in ISO format (YYYY-MM-DD)
 * @returns Date formatted in Brazilian format (DD/MM/YYYY)
 */
export function formatDate(date: string): string {
  if (!date) return ''
  const dateObj: Date = new Date(date)
  return new Intl.DateTimeFormat('pt-BR').format(dateObj)
}

/**
 * Formats a number as Brazilian currency (BRL).
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "1.234,56")
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

/**
 * Converts a string with currency formatting to its numeric value.
 * @param value - The formatted currency string
 * @returns The numeric value in decimal format
 */
export function currencyToNumber(value: string): number {
  const numericValue: string = value.replace(/\D/g, '')
  
  if (numericValue) {
    return parseFloat(numericValue) / 100
  } else {
    return 0
  }
}

/**
 * Validates if a string represents a valid Brazilian phone number.
 * @param phone - The phone number string to validate
 * @returns Boolean indicating if the phone number is valid
 */
export function validatePhone(phone: string): boolean {
  return phone.replace(/\D/g, '').length === 11
}

/**
 * Validates if a string represents a valid Brazilian postal code (CEP).
 * @param zipCode - The postal code string to validate
 * @returns Boolean indicating if the postal code is valid
 */
export function validateZipCode(zipCode: string): boolean {
  return zipCode.replace(/\D/g, '').length === 8
}

/**
 * Validates if a string has at least a specified number of words.
 * @param value - The string to validate
 * @param minWords - Minimum number of words required
 * @returns Boolean indicating if the string has at least the minimum number of words
 */
export function validateMinWords(value: string, minWords: number = 2): boolean {
  return value.trim().split(/\s+/).length >= minWords
}

/**
 * Calculates minimum date for age validation.
 * @param minAge - Minimum age in years
 * @returns ISO date string representing the latest birthdate allowed
 */
export function getMinDateForAge(minAge: number = 18): string {
  const date: Date = new Date()
  date.setFullYear(date.getFullYear() - minAge)
  return date.toISOString().split('T')[0]
}

/**
 * Calculates maximum date for age validation.
 * @param maxAge - Maximum age in years
 * @returns ISO date string representing the earliest birthdate allowed
 */
export function getMaxDateForAge(maxAge: number = 65): string {
  const date: Date = new Date()
  date.setFullYear(date.getFullYear() - maxAge)
  return date.toISOString().split('T')[0]
}

/**
 * Validates if a person's age is within a specified range.
 * @param birthDate - The birthdate string in ISO format (YYYY-MM-DD)
 * @param minAge - Minimum age in years
 * @param maxAge - Maximum age in years
 * @returns Boolean indicating if the age is within the valid range
 */
export function validateAge(birthDate: string, minAge: number = 18, maxAge: number = 65): boolean {
  const birthDateObj: Date = new Date(birthDate)
  
  const minAgeDate: Date = new Date()
  minAgeDate.setFullYear(minAgeDate.getFullYear() - minAge)
  
  const maxAgeDate: Date = new Date()
  maxAgeDate.setFullYear(maxAgeDate.getFullYear() - maxAge)
  
  return birthDateObj <= minAgeDate && birthDateObj >= maxAgeDate
}

/**
 * Formats a state input to ensure it contains only uppercase letters.
 * Removes any non-letter characters and converts to uppercase.
 * @param value - The state value to format
 * @returns Formatted state code with only uppercase letters
 */
export function formatState(value: string): string {
  return value.replace(/[^a-zA-Z]/g, '').toUpperCase();
}

/**
 * Validates if a string is a valid Brazilian state code.
 * Checks if it contains exactly 2 uppercase letters.
 * @param state - The state code string to validate
 * @returns Boolean indicating if the state code is valid
 */
export function validateState(state: string): boolean {
  return /^[A-Z]{2}$/.test(state);
}

/**
 * Fetches address information from a Brazilian postal code using the ViaCEP API.
 * @param zipCode - The postal code to look up
 * @returns Promise containing address data if successful
 */
export async function fetchAddressByZipCode(zipCode: string): Promise<any> {
  zipCode = zipCode.replace(/\D/g, '')
  
  if (zipCode.length !== 8) {
    throw new Error('Invalid ZIP code format')
  }
  
  try {
    const response: Response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
    const data = await response.json()
    
    if (data.erro) {
      throw new Error('ZIP code not found')
    }
    
    return {
      street: data.logradouro,
      district: data.bairro,
      city: data.localidade,
      state: data.uf
    }
  } catch (error) {
    throw error
  }
}