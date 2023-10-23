export function convertCurrency(value, decimalPlaces) {
	return value.toLocaleString("pt-BR", {
		minimumFractionDigits: decimalPlaces,
	});
}
