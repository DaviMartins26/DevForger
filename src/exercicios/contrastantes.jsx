// tipo de exercicio = casos contrastantes
// ---------------------------------------------
// Mostra DUAS (ou mais) versoes quase iguais de um codigo; o aluno escolhe a que
// faz o que o enunciado pede. A resposta e o INDICE (numero) da versao escolhida.
//
// Dados esperados no exercicio:
//  - versoes : lista de { rotulo, codigo } (cada opcao tem um nome e o codigo)
//  - correta : o indice (0, 1, ...) da versao certa
//
// Reusa a corDaOpcao do multipla.jsx: ao ACERTAR, a versao certa fica verde e as
// outras vermelhas; ao errar, nada e revelado.
// ---------------------------------------------

import { corDaOpcao } from './multipla.jsx'

// funcao que desenha as versoes como opcoes (radio) + o codigo de cada uma
function Campo({ exercicio, resposta, setResposta, travado, acertou }) {
  return (
    // fieldset disabled trava todas as opcoes de uma vez (depois de responder)
    <fieldset disabled={travado}>
      {/* .map percorre as versoes e desenha uma opcao pra cada uma */}
      {exercicio.versoes.map((versao, i) => {
        const ehCorreta = i === exercicio.correta
        return (
          <div key={i}>
            <label
              style={{
                display: 'block',
                color: corDaOpcao(acertou, ehCorreta),
                fontWeight: acertou && ehCorreta ? 'bold' : 'normal',
              }}
            >
              <input
                type="radio"
                name={exercicio.id}        // mesmo name agrupa os radios (so um marcado)
                checked={resposta === i}
                onChange={() => setResposta(i)}
              />{' '}
              {versao.rotulo}
              {acertou && ehCorreta ? ' (correta)' : ''}
            </label>
            {/* o codigo daquela versao, com a formatacao preservada (<pre>) */}
            <pre>{versao.codigo}</pre>
          </div>
        )
      })}
    </fieldset>
  )
}

// forma o exercicio na tela (mesmo contrato dos outros tipos)
export default {
  Campo,
  // acertou se o indice escolhido for o da versao certa
  verificar: (exercicio, resposta) => resposta === exercicio.correta,
  respostaInicial: () => null,   // comeca sem nada escolhido
  temResposta: (exercicio, resposta) => resposta !== null,
}
