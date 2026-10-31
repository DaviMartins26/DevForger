// tipo de exercicio = prever a saida (varias caixas de texto)
// ---------------------------------------------
// O programa imprime varios valores; o aluno preenche cada saida, em ordem, numa
// caixinha de texto. A resposta do usuario e um ARRAY de textos (um por caixa) e
// TODAS precisam bater com o gabarito.
//
// Dados esperados no exercicio:
//  - rotulos   : nome de cada caixa (ex.: ['Saida 1', 'Saida 2'])
//  - respostas : o valor certo de cada caixa (ex.: ['8', '15'])
//
// (o modelo comentado campo a campo esta no multipla.jsx)
// ---------------------------------------------

// normalizar deixa o texto "limpo" pra comparar: tira espacos/virgulas e poe em
// minusculo, entao "8 ", "8" e "8," acabam contando como iguais.
import { normalizar } from './normalizar.js'

// funcao que desenha as caixinhas de resposta (uma por saida)
function Campo({ exercicio, resposta, setResposta, travado }) {
  // escrever: muda SO a caixa de indice i, mantendo as outras como estavam.
  function escrever(i, valor) {
    // [...resposta] cria uma COPIA do array. No React a gente nunca mexe no array
    // antigo direto; sempre monta um novo e manda ele pro setResposta.
    const copia = [...resposta]
    copia[i] = valor     // troca so a posicao i
    setResposta(copia)   // guarda o novo array como resposta
  }

  return (
    <div>
      {/* .map percorre os rotulos e desenha UMA caixa de texto pra cada um.
          "i" e a posicao (0, 1, 2...), usada pra ligar a caixa a sua resposta. */}
      {exercicio.rotulos.map((rotulo, i) => (
        <p key={i}>
          <label>
            {rotulo}:{' '}
            <input
              type="text"
              size="4"
              value={resposta[i]}                            // o texto atual daquela caixa
              disabled={travado}                             // trava depois de responder
              onChange={(e) => escrever(i, e.target.value)}  // ao digitar, atualiza a caixa i
            />
          </label>
        </p>
      ))}
    </div>
  )
}

// forma o exercicio na tela (mesmo contrato dos outros tipos)
export default {
  Campo,
  // acertou SO se a resposta e um array e TODAS as caixas batem com o gabarito.
  // .every devolve true quando a regra vale pra TODOS os itens da lista.
  verificar: (exercicio, resposta) =>
    Array.isArray(resposta) &&
    exercicio.respostas.every((valor, i) => normalizar(resposta[i]) === normalizar(valor)),
  // comeca com todas as caixas vazias (uma '' pra cada resposta esperada)
  respostaInicial: (exercicio) => exercicio.respostas.map(() => ''),
  // so habilita o Verificar quando NENHUMA caixa esta vazia
  temResposta: (exercicio, resposta) =>
    Array.isArray(resposta) && resposta.every((v) => v !== ''),
}
