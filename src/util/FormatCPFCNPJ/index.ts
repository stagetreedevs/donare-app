export function formatCNPJCPF(value) {
  var valor;

  value.length == 14
    ? (valor = value.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      ))
    : (valor = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));

  return valor;
}
