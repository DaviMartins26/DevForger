// ============================================================================
// TelaExercicio.jsx - Tela do exercicio atual (so desenha)
// ----------------------------------------------------------------------------
// Tela "burra": nao guarda estado, so mostra o que o motor (Jogo.jsx) manda por
// props - os indicadores, o enunciado, o codigo, o campo de resposta e os
// botoes/feedback. O campo certo de cada tipo vem do registro (CampoResposta).
// ============================================================================

// pega o CampoResposta do registro pra desenhar o campo certo do tipo do exercicio
import { CampoResposta } from '../../exercicios/registro.jsx'

// os valores entre { } sao os props: vem do Jogo (motor)
export default function TelaExercicio({
  trilhaTitulo,
  vidas,
  streak,
  xpTotal,
  indice,
  total,
  ultimo,
  exercicio,
  resposta,
  setResposta,
  resultado, // null = respondendo | true = acertou | false = errou
  textoErro, // mensagem ja pronta pro caso de erro (errado / dica / resposta)
  podeVerificar, // habilita (ou nao) o botao Verificar
  dicaPedida, // se o aluno ja trocou 1 vida pela dica neste exercicio
  confirmandoDica, // se esta mostrando o pedido de confirmacao da dica
  aoPedirDica,
  aoConfirmarDica,
  aoCancelarDica,
  aoVerificar,
  aoTentarDeNovo,
  aoAvancar,
  aoVoltar, // volta pro catalogo (opcional)
}) {
  // atalho: acertou quando o resultado e exatamente true
  const acertou = resultado === true

  return (
    <main>
      <h1>DevForge</h1>

      {/* so mostra o botao de voltar SE o App passou a funcao aoVoltar */}
      {aoVoltar && (
        <p>
          <button type="button" onClick={aoVoltar}>&larr; Voltar ao catálogo</button>
        </p>
      )}

      <p><strong>{trilhaTitulo}</strong></p>

      {/* indicadores que acompanham o aluno pela trilha inteira */}
      <p>Vidas: {vidas} | Streak: {streak} | XP: {xpTotal}</p>
      <p>Exercício {indice + 1} de {total} - {exercicio.titulo}</p>

      <h2>{exercicio.enunciado}</h2>

      {/* so mostra o bloco de codigo se o exercicio tiver o campo codigo
          (o && so desenha a direita quando a esquerda e verdadeira) */}
      {exercicio.codigo && <pre>{exercicio.codigo}</pre>}

      {/* o campo de resposta certo (o registro escolhe pelo tipo do exercicio).
          travado trava o campo depois de responder (resultado deixa de ser null) */}
      <CampoResposta
        exercicio={exercicio}
        resposta={resposta}
        setResposta={setResposta}
        travado={resultado !== null}
        acertou={acertou}
      />

      {/* dica sob demanda: troca 1 vida pela dica. so antes de responder e
          enquanto a dica ainda nao foi pedida */}
      {resultado === null && !dicaPedida && !confirmandoDica && (
        <p><button type="button" onClick={aoPedirDica}>Pedir dica (-1 vida)</button></p>
      )}
      {confirmandoDica && (
        <p>
          Trocar 1 vida por uma dica?{' '}
          <button type="button" onClick={aoConfirmarDica}>Sim, trocar 1 vida</button>{' '}
          <button type="button" onClick={aoCancelarDica}>Cancelar</button>
        </p>
      )}
      {dicaPedida && <p className="ok">Dica: {exercicio.dica}</p>}

      {/* respondendo: mostra o Verificar (travado se ainda nao ha resposta) */}
      {resultado === null && (
        <p><button type="button" onClick={aoVerificar} disabled={!podeVerificar}>Verificar</button></p>
      )}

      {/* acertou: elogio + avancar (no ultimo, o texto muda pra Ver resultado) */}
      {acertou && (
        <>
          <p className="ok">{exercicio.feedbackCerto}</p>
          <p><button type="button" onClick={aoAvancar}>{ultimo ? 'Ver resultado' : 'Próximo'}</button></p>
        </>
      )}

      {/* errou: feedback progressivo (vem pronto do motor) + tentar de novo */}
      {resultado === false && (
        <>
          <p className="erro">{textoErro}</p>
          <p><button type="button" onClick={aoTentarDeNovo}>Tentar de novo</button></p>
        </>
      )}
    </main>
  )
}
