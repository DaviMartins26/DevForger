// Tela simples de um exercicio
// ---------------------------------------------
// So DESENHA (nao guarda estado): recebe tudo por props do motor e mostra o
// enunciado, o campo de resposta e os botoes. A logica fica no Jogo (motor).
// ---------------------------------------------

// pega o CampoResposta do registro pra desenhar o campo certo do tipo do exercicio
import { CampoResposta } from '../../exercicios/registro.jsx'

// os valores entre { } sao os props: vem do Jogo (motor)
export default function TelaExercicio({ exercicio, resposta, setResposta, resultado, podeVerificar, aoVerificar, aoTentarDeNovo, aoAvancar }) {
  // resultado: null (respondendo), true (acertou) ou false (errou)
  const acertou = resultado === true

  return (
    <div>
      {/* o enunciado do exercicio */}
      <p>{exercicio.enunciado}</p>

      {/* so mostra o bloco de codigo SE o exercicio tiver o campo codigo
          (o && desenha o que vem depois apenas quando a esquerda e verdadeira) */}
      {exercicio.codigo && <pre>{exercicio.codigo}</pre>}

      {/* o campo de resposta (o registro escolhe o certo pelo tipo do exercicio).
          travado = trava o campo depois de responder (resultado deixa de ser null) */}
      <CampoResposta
        exercicio={exercicio}
        resposta={resposta}
        setResposta={setResposta}
        travado={resultado !== null}
        acertou={acertou}
      />

      {/* enquanto nao respondeu, mostra o Verificar (travado se nao houver resposta) */}
      {resultado === null && (
        <button onClick={aoVerificar} disabled={!podeVerificar}>Verificar</button>
      )}

      {/* acertou: elogio + botao de avancar */}
      {acertou && (
        <>
          <p>Acertou!</p>
          <button onClick={aoAvancar}>Proximo</button>
        </>
      )}

      {/* errou: avisa (sem revelar a resposta) + botao pra tentar de novo */}
      {resultado === false && (
        <>
          <p>Errado. Tente de novo.</p>
          <button onClick={aoTentarDeNovo}>Tentar de novo</button>
        </>
      )}
    </div>
  )
}
