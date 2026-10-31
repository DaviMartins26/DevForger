// tipo de exercicio = preenchimento de lacuna
// ---------------------------------------------
// O aluno completa um pedaco que falta NO MEIO de um codigo. A tela mostra o
// codigo "antes" + uma caixinha de texto + o codigo "depois". A resposta e o
// texto digitado (string).
//
// Dados esperados no exercicio:
//  - antes    : o codigo que vem ANTES da lacuna (string)
//  - depois   : o codigo que vem DEPOIS da lacuna (string)
//  - resposta : o texto certo da lacuna (ex.: 'a + b'); pode ser uma LISTA de
//              respostas aceitas quando ha mais de uma certa (ex.: ['a + b', 'b + a'])
//
// A comparacao IGNORA espacos e maiusculas, entao "a+b", "a + b" e "A + B" valem
// todos igual (bom quando a lacuna e uma expressao, nao so uma palavra).
// (o modelo comentado campo a campo esta no multipla.jsx)
// ---------------------------------------------

// funcao que desenha o codigo com a caixinha no meio
function Campo({ exercicio, resposta, setResposta, travado }) {
  return (
    // <pre> preserva as quebras de linha e os espacos do codigo; a caixinha entra no meio
    <pre>
      {exercicio.antes}
      <input
        type="text"
        size="8"
        value={resposta}
        disabled={travado}                             // trava depois de responder
        onChange={(e) => setResposta(e.target.value)}  // guarda o que o aluno digita
        style={{ fontFamily: 'inherit' }}              // herda a fonte de codigo do <pre>
      />
      {exercicio.depois}
    </pre>
  )
}

// limpa um texto pra comparar sem frescura: tira TODOS os espacos e poe minusculo.
// \s+ = qualquer espaco (um ou mais); o replace troca eles por "" (nada).
function limpar(texto) {
  return String(texto).replace(/\s+/g, '').toLowerCase()
}

// uma lacuna pode ter MAIS DE UMA resposta certa (ex.: 'a + b' e 'b + a' dao o
// mesmo resultado). Por isso exercicio.resposta pode ser uma string OU uma lista;
// aqui a gente sempre devolve uma lista, pra facilitar a comparacao.
function respostasCertas(exercicio) {
  return Array.isArray(exercicio.resposta) ? exercicio.resposta : [exercicio.resposta]
}

// forma o exercicio na tela (mesmo contrato dos outros tipos)
export default {
  Campo,
  // acertou se o texto digitado, ja limpo, bater com ALGUMA das respostas certas.
  // .some devolve true se a regra valer pra pelo menos UM item da lista.
  verificar: (exercicio, resposta) =>
    typeof resposta === 'string' &&
    respostasCertas(exercicio).some((certa) => limpar(resposta) === limpar(certa)),
  // comeca vazio (nada digitado)
  respostaInicial: () => '',
  // so habilita o Verificar quando digitou algo (nao so espacos)
  temResposta: (exercicio, resposta) => typeof resposta === 'string' && resposta.trim() !== '',
}
