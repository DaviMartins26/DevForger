// ============================================================================
// AlbertOverlay.jsx - a janela (overlay) do chat de duvidas com o Albert
// ----------------------------------------------------------------------------
// E so a PARTE VISUAL do chat do Albert: a janelinha que abre por cima da tela
// do exercicio. Toda a logica (estado, enviar pergunta, cronometro) mora no hook
// useAlbert; aqui a gente so recebe esses dados por props e desenha. Por isso
// este arquivo nao tem useState/useEffect - so JSX.
// ============================================================================

import { ALBERT_ICON, formatarRecarga } from './chatUtils.js'
import { Mensagem, IndicadorDigitando } from './componentes.jsx'

export function AlbertOverlay({
  energiaIA,
  msgs,
  input,
  setInput,
  digitando,
  erro,
  setErro,
  recargaSeg,
  fimRef,
  aoPerguntar,
  aoFechar,
}) {
  return (
    <div className="outro-overlay" role="dialog" aria-label="Chat com o Albert">
      <div className="outro-painel">
        <header className="outro-top">
          <img className="chat-avatar" src={ALBERT_ICON} alt="" />
          <div className="chat-top-titulo">
            <strong>Albert</strong>
            <span>Tire sua duvida · ⚡ {energiaIA}</span>
            {/* so mostra o cronometro quando recargaSeg nao e null (energia abaixo do maximo) */}
            {recargaSeg != null && (
              <span className="albert-recarga">🕒 Nova energia em: {formatarRecarga(recargaSeg)}</span>
            )}
          </div>
          <button className="chat-btn-ghost" onClick={aoFechar} title="Fechar">
            ✕
          </button>
        </header>

        <div className="outro-log">
          {/* .map percorre as mensagens e devolve uma <Mensagem> para cada uma */}
          {msgs.map((m, i) => (
            <Mensagem key={i} m={m} />
          ))}
          {digitando && <IndicadorDigitando de="albert" />}
          <div ref={fimRef} />
        </div>

        <footer className="outro-dock">
          <textarea
            className="proj-code"
            value={input}
            onChange={(e) => {
              setInput(e.target.value) // guarda o que o aluno digita
              setErro('') // some com o aviso de erro assim que ele digita
            }}
            rows={3}
            placeholder="Pergunte sobre o exercicio ou a linguagem..."
            aria-label="Sua duvida"
          />
          <div className="proj-dock-linha">
            <span className="proj-hint">
              Cada pergunta custa 1 ⚡ (mesmo se for fora do assunto) · voce tem {energiaIA}
            </span>
            {erro && <span className="proj-erro">{erro}</span>}
            <button className="chat-btn-enviar" onClick={aoPerguntar} disabled={energiaIA <= 0}>
              Perguntar ▶
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
