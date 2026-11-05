// ============================================================================
// TelaChat.jsx - resolver exercicios como uma conversa com a Lari
// ----------------------------------------------------------------------------
// Esta tela recebe as mesmas props da TelaExercicio (vindas do motor Jogo.jsx):
// o que muda e so a APRESENTACAO - em vez de um formulario, uma conversa. A Lari
// manda o exercicio como mensagem, o aluno responde, ela "digita" e responde
// certo/errado; acertando, manda o proximo. A dica tambem e negociada na conversa.
//
// Para a tela nao ficar gigante, a LOGICA foi separada num "custom hook" e as
// pecinhas visuais em componentes (pasta ./chat/):
//   - useChatLari  -> toda a conversa com a Lari (estado + o que fazer)
//   - Mensagem / IndicadorDigitando -> bolhas e "...digitando"
// Aqui a TelaChat so "monta" essas pecas e desenha o cabecalho/HUD, a conversa e
// o rodape (dock) com o campo de resposta e os botoes.
// ============================================================================

import { CampoResposta } from '../../exercicios/registro.jsx'
import { formatarRecarga } from './chat/chatUtils.js'
import { Mensagem, IndicadorDigitando } from './chat/componentes.jsx'
import { AlbertOverlay } from './chat/AlbertOverlay.jsx'
import { useChatLari } from './chat/useChatLari.js'
import { useAlbert } from './chat/useAlbert.js'

export default function TelaChat({
  trilhaTitulo,
  vidas,
  streak,
  xpTotal,
  indice,
  total,
  exercicio,
  resposta,
  setResposta,
  resultado,
  textoErro,
  podeVerificar,
  confirmandoDica,
  dicaPedida,
  aoPedirDica,
  aoConfirmarDica,
  aoCancelarDica,
  aoVerificar,
  aoTentarDeNovo,
  aoAvancar,
  aoVoltar,
  aula,
  energiaIA,
  aoGastarEnergiaIA,
}) {
  // Conversa com a Lari: o hook devolve as mensagens, se ela esta "digitando", a
  // marca do fim da lista (para rolar) e as acoes dos botoes.
  const lari = useChatLari({
    exercicio,
    indice,
    aula,
    resultado,
    textoErro,
    vidas,
    resposta,
    aoVerificar,
    aoPedirDica,
    aoConfirmarDica,
    aoCancelarDica,
  })

  // Chat de duvidas com o Albert (a IA): estado e acoes proprias, moeda propria (energiaIA).
  const albert = useAlbert({ energiaIA, aoGastarEnergiaIA, exercicio })

  // "respondendo" e verdadeiro quando o aluno pode responder agora: ainda nao ha
  // resultado, nao estamos confirmando dica e a Lari nao esta digitando.
  const respondendo = resultado === null && !confirmandoDica && !lari.digitando

  return (
    <div className="chat-tela">
      <div className="chat-painel">
        <div className="chat-inner">
          {/* CABECALHO: voltar, titulo da trilha e o HUD (vida, streak, XP) */}
          <header className="chat-top">
            {aoVoltar && (
              <button className="chat-btn-ghost" onClick={aoVoltar} title="Voltar ao catálogo">
                ←
              </button>
            )}
            <div className="chat-top-titulo">
              <strong>Lari — DevForge</strong>
              <span>
                {trilhaTitulo} · Exercício {indice + 1}/{total}
              </span>
            </div>
            <div className="chat-hud">
              <span title="Vida (erros no exercício)">❤️ {vidas}</span>
              <span title="Energia (chat com o Albert)">⚡ {energiaIA}</span>
              {/* o cronometro de recarga so aparece quando a energia esta abaixo do maximo */}
              {albert.recargaSeg != null && (
                <span title="Recarga da energia do Albert">🕒 {formatarRecarga(albert.recargaSeg)}</span>
              )}
              <span title="Streak">🔥 {streak}</span>
              <span title="XP">✦ {xpTotal}</span>
            </div>
          </header>

          {/* CONVERSA: uma <Mensagem> para cada bolha; o "...digitando" no fim */}
          <div className="chat-log">
            {lari.mensagens.map((m, i) => (
              <Mensagem key={i} m={m} />
            ))}
            {lari.digitando && <IndicadorDigitando de="lari" />}
            <div ref={lari.fimRef} />
          </div>

          {/* RODAPE (dock): muda conforme o momento - responder, confirmar dica,
              avancar (acertou) ou tentar de novo (errou) */}
          <footer className="chat-dock">
            {respondendo && (
              <>
                <div className="chat-campo">
                  <CampoResposta
                    exercicio={exercicio}
                    resposta={resposta}
                    setResposta={setResposta}
                    travado={false}
                    acertou={false}
                  />
                </div>
                <div className="chat-dock-acoes">
                  <button
                    className="chat-btn-dica"
                    onClick={lari.pedirDica}
                    disabled={dicaPedida}
                    title={dicaPedida ? 'Dica já usada neste exercício' : 'Pedir dica da Lari (-1 vida)'}
                  >
                    💡
                  </button>
                  <button
                    className="chat-btn-dica"
                    onClick={albert.abrirDuvida}
                    disabled={energiaIA <= 0}
                    title={energiaIA <= 0 ? 'Sem energia para falar com o Albert' : 'Falar com o Albert (-1 energia)'}
                  >
                    🧓
                  </button>
                  <button className="chat-btn-enviar" onClick={lari.enviar} disabled={!podeVerificar}>
                    Enviar ▶
                  </button>
                </div>
              </>
            )}

            {confirmandoDica && (
              <div className="chat-dock-acoes chat-centro">
                <button className="chat-btn-enviar" onClick={lari.dicaSim}>
                  Sim (−1 ❤️)
                </button>
                <button className="chat-btn-ghost" onClick={lari.dicaNao}>
                  Não
                </button>
              </div>
            )}

            {resultado === true && !lari.digitando && (
              <div className="chat-dock-acoes chat-centro">
                <button className="chat-btn-enviar" onClick={aoAvancar}>
                  Próxima ▶
                </button>
              </div>
            )}

            {resultado === false && !lari.digitando && (
              <div className="chat-dock-acoes chat-centro">
                <button className="chat-btn-enviar" onClick={aoTentarDeNovo}>
                  Tentar de novo ↩
                </button>
              </div>
            )}
          </footer>
        </div>
      </div>

      {/* A janela do Albert so e desenhada quando foi aberta (albert.aberta). */}
      {albert.aberta && (
        <AlbertOverlay
          energiaIA={energiaIA}
          msgs={albert.msgs}
          input={albert.input}
          setInput={albert.setInput}
          digitando={albert.digitando}
          erro={albert.erro}
          setErro={albert.setErro}
          recargaSeg={albert.recargaSeg}
          fimRef={albert.fimRef}
          aoPerguntar={albert.enviarDuvida}
          aoFechar={() => albert.setAberta(false)}
        />
      )}
    </div>
  )
}
