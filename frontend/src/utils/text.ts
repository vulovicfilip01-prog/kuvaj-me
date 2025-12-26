/**
 * Normalizes Serbian text by replacing diacritics with their Latin equivalents.
 * (ć,č -> c, š -> s, đ -> d, ž -> z)
 */
export function normalizeSerbianText(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Basic diacritic removal
    .replace(/[čć]/g, 'c')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .replace(/đ/g, 'd')
    .trim();
}
