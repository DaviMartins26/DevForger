// ============================================================================
// quadrinhos/Quadrinho.jsx - MOTOR de quadrinho (independente do conteudo)
// ----------------------------------------------------------------------------
// Recebe um ROTEIRO (ex.: abertura.js) e o desenha quadro a quadro:
//   - a arte (imagem) ou um placeholder quando a arte ainda nao existe;
//   - os baloes de fala posicionados POR CIMA da imagem, com o texto vindo do
//     codigo (nao da imagem) - por isso a i18n (PT/EN) e so troca de string;
//   - navegacao (Anterior / Proximo) e o botao PULAR (puxa o fim do arco).
//
// Mesma ideia das trilhas: o roteiro e SO DADOS; este arquivo e a logica que os
// desenha. Trocar a historia = trocar o roteiro, sem mexer aqui.
//
// Props:
//   - roteiro       : objeto { titulo, quadros: [...] } (ver abertura.js)
//   - aoFinalizar   : chamado ao pular ou passar do ultimo quadro
//   - idiomaInicial : 'pt' (padrao) | 'en'
//   - variaveis     : valores injetados nas falas via {chave} (ex.: { xp })
// ============================================================================

import { useState } from 'react'

// rotulo mostrado antes da fala, por personagem (a chave vem do balao.quem)
const QUEM = { lari: 'Lari', nos: 'Nos', rival: 'Rival', chef: 'Chefe' }

// aplicarVariaveis: troca marcadores {chave} na fala pelos valores de `variaveis`.
// Ex.: "Voce fez {xp} pontos" + { xp: 230 } -> "Voce fez 230 pontos". A regex
// /\{(\w+)\}/g acha cada {palavra}; se nao houver valor, deixa o marcador como esta.
function aplicarVariaveis(texto, variaveis) {
  return String(texto).replace(/\{(\w+)\}/g, (marcador, chave) =>
    chave in variaveis ? variaveis[chave] : marcador,
  )
}

export default function Quadrinho({ roteiro, aoFinalizar, idiomaInicial = 'pt', variaveis = {} }) {
  // indice = em qual quadro estamos; idioma = 'pt' ou 'en' (toggle do botao)
  const [indice, setIndice] = useState(0)
  const [idioma, setIdioma] = useState(idiomaInicial)

  const quadros = roteiro.quadros
  const quadro = quadros[indice] // o quadro atual
  const ultimo = indice === quadros.length - 1

  // Proximo: no ultimo quadro, finaliza (sai do quadrinho); senao, avanca um.
  function proximo() {
    if (ultimo) aoFinalizar()
    else setIndice(indice + 1)
  }
  // Anterior: volta um quadro (trava no primeiro, pra nao ir pra indice -1).
  function anterior() {
    if (indice > 0) setIndice(indice - 1)
  }

  return (
    <div className="quadrinho">
      {/* barra de cima: titulo/contador + botoes de idioma e pular */}
      <div className="quadrinho-barra">
        <span>
          {roteiro.titulo} - quadro {indice + 1}/{quadros.length}
        </span>
        <span>
          {/* prova de que a i18n e so por codigo: o botao troca o idioma das falas,
              sem trocar a imagem (o texto nao esta desenhado na arte) */}
          <button onClick={() => setIdioma(idioma === 'pt' ? 'en' : 'pt')}>
            {idioma === 'pt' ? 'EN' : 'PT'}
          </button>{' '}
          <button onClick={aoFinalizar}>Pular</button>
        </span>
      </div>

      {/* palco = a area da arte; os baloes sao posicionados POR CIMA dela */}
      <div className="quadrinho-palco">
        {/* tem imagem? mostra a arte. Senao, um placeholder com a descricao do quadro.
            (o ? : escolhe entre os dois - um "if" que devolve JSX) */}
        {quadro.imagem ? (
          <img className="quadrinho-arte" src={quadro.imagem} alt="" />
        ) : (
          <div className="quadrinho-arte quadrinho-placeholder">
            <span>[arte pendente] {quadro.descricao}</span>
          </div>
        )}

        {/* um balao pra cada fala do quadro. left/top/width vem do roteiro em %,
            pra cair DENTRO do balao branco ja desenhado na arte. */}
        {quadro.baloes.map((balao, i) => (
          <div
            key={i}
            className="quadrinho-balao"
            style={{ left: `${balao.x}%`, top: `${balao.y}%`, width: `${balao.w}%` }}
          >
            {/* QUEM[balao.quem] = nome bonito do personagem; se nao achar, usa a chave crua */}
            <strong>{QUEM[balao.quem] || balao.quem}:</strong>{' '}
            {/* pega a fala no idioma atual e troca os {marcadores} por valores */}
            {aplicarVariaveis(balao.texto[idioma], variaveis)}
          </div>
        ))}
      </div>

      {/* navegacao de baixo: Anterior (travado no 1o) e Proximo/Comecar (no ultimo) */}
      <div className="quadrinho-nav">
        <button onClick={anterior} disabled={indice === 0}>
          Anterior
        </button>
        <button onClick={proximo}>{ultimo ? 'Comecar' : 'Proximo'}</button>
      </div>
    </div>
  )
}
