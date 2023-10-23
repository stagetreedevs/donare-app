export function truncateText(value, qtdCaracteres) {
	if (value != null) {
		return value.length < qtdCaracteres - 2
			? `${value}`
			: `${value.substring(0, qtdCaracteres)}...`;
	} else {
		return null;
	}
}