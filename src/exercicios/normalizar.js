// Utilitarios compartilhados entre os tipos de exercicio.

// Normaliza texto livre para comparar sem frescura: remove espacos, quebras de
// linha e virgulas, e deixa minusculo. Assim "1 2 3", "123" e "1,2,3"
// acabam saindo iguais já que js tem problemas nesse tipo de coisa
export function normalizar(valor) {
  return String(valor).replace(/[\s,]/g, '').toLowerCase()
}
