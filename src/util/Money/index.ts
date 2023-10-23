export function numberToUSLocale(number) {
  return String(number)
    .replace('R$', '')
    .replace(' ', '')
    .replace('.', '')
    .replace(',', '.');
}