// ============================================================================
// componentes.jsx - pecinhas visuais do chat
// ----------------------------------------------------------------------------
// Um "componente" em React e uma funcao que devolve um pedaco de tela (JSX).
// Estas tres pecinhas - o avatar, a bolha de mensagem e o "...digitando" - sao
// usadas pela TelaChat. Ter uma versao so de cada uma evita repetir o mesmo
// codigo e deixa a TelaChat mais curta.
// ============================================================================

import { AVATARES, ALBERT_ICON } from './chatUtils.js'

// Avatar: mostra o rostinho de quem esta falando.
// "de" diz quem fala ('lari', 'albert' ou 'nos'); "humor" escolhe o rosto da Lari.
// O jogador ('nos') NAO tem rosto (decisao de design), por isso devolve null.
export function Avatar({ de, humor }) {
  if (de === 'lari')
    return <img className="chat-avatar" src={AVATARES.lari[humor || 'normal']} alt="" />
  if (de === 'albert') return <img className="chat-avatar" src={ALBERT_ICON} alt="" />
  return null
}

// Mensagem: desenha UMA linha do chat - o avatar + a bolha com o texto.
// Recebe "m", um objeto de mensagem no formato { de, texto, codigo?, humor? }.
// Se a mensagem tiver "codigo", mostramos tambem um bloco de codigo (<pre>).
// O "&&" abaixo e um atalho: so desenha o <pre> QUANDO m.codigo existir.
export function Mensagem({ m }) {
  return (
    <div className={'chat-msg chat-msg-' + m.de}>
      <Avatar de={m.de} humor={m.humor} />
      <div className="chat-bolha">
        <div className="chat-bolha-txt">{m.texto}</div>
        {m.codigo && <pre className="chat-codigo">{m.codigo}</pre>}
      </div>
    </div>
  )
}

// IndicadorDigitando: as tres bolinhas de "esta digitando...". "de" diz de quem
// e o balao (aqui so a Lari), para mostrar o avatar certo ao lado.
export function IndicadorDigitando({ de }) {
  return (
    <div className={'chat-msg chat-msg-' + de}>
      <Avatar de={de} humor="normal" />
      <div className="chat-bolha chat-digitando">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}
