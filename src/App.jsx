// ============================================================================
// App.jsx - Raiz da aplicacao
// ----------------------------------------------------------------------------
// Controla a navegacao entre as "telas" grandes, uma de cada vez:
//   0) INICIAL      - apresenta o projeto; o "Comecar" leva pra historia.
//   1) ABERTURA     - quadrinho da lore (a Lari apresenta a DevForge).
//   2) CATALOGO     - escolher a trilha (so a Trilha 1, por enquanto).
//   3) INTRO        - quadrinho de abertura da trilha (antes do 1o exercicio).
//   4) JOGO         - o motor da trilha escolhida (com o quadrinho de fechamento).
//
// A navegacao e so "ifs" em sequencia: o primeiro caso que bater e o que aparece.
// INTROS/FINAIS sao mapas trilhaId -> roteiro (so a Trilha 1 tem, por ora).
// ============================================================================

import { useState } from 'react'
import Jogo from './jogo/Jogo.jsx'
import TelaInicial from './jogo/telas/TelaInicial.jsx'
import TelaCatalogo from './jogo/telas/TelaCatalogo.jsx'
import Quadrinho from './quadrinhos/Quadrinho.jsx'
import abertura from './quadrinhos/abertura.js'
import trilha1Intro from './quadrinhos/trilha1-intro.js'
import trilha1Final from './quadrinhos/trilha1-final.js'
import { bloco, trilhas } from './trilhas/index.js'

// Intro de quadrinho por trilha (trilhaId -> roteiro), tocada ao "Comecar".
const INTROS = { leitura: trilha1Intro }
// Fechamento por trilha (trilhaId -> roteiro), tocado ao concluir a trilha.
const FINAIS = { leitura: trilha1Final }

export default function App() {
  // comecou = se o aluno ja clicou "Comecar" na tela inicial de apresentacao
  const [comecou, setComecou] = useState(false)
  const [viuAbertura, setViuAbertura] = useState(false)
  const [trilhaId, setTrilhaId] = useState(null) // null = nenhuma trilha escolhida
  // introsVistas = um Set com os ids das trilhas cuja intro ja foi vista nesta sessao
  const [introsVistas, setIntrosVistas] = useState(() => new Set())
  // acha o objeto da trilha escolhida (undefined enquanto nenhuma foi escolhida)
  const trilha = trilhas.find((t) => t.id === trilhaId)

  // 0) Tela inicial: apresenta o projeto. "Comecar" leva pra historia (abertura).
  if (!comecou) {
    return <TelaInicial aoComecar={() => setComecou(true)} />
  }

  // 1) Abertura da lore. Pular/Comecar leva ao catalogo.
  if (!viuAbertura) {
    return <Quadrinho roteiro={abertura} aoFinalizar={() => setViuAbertura(true)} />
  }

  // 2) Catalogo (enquanto nenhuma trilha foi escolhida).
  if (!trilha) {
    return <TelaCatalogo bloco={bloco} trilhas={trilhas} aoEscolher={setTrilhaId} />
  }

  // 3) Intro da trilha
  const intro = INTROS[trilha.id]
  if (intro && !introsVistas.has(trilha.id)) {
    // new Set(vistas).add(id) = cria um Set NOVO com o id a mais (nunca mexe no antigo)
    return (
      <Quadrinho
        roteiro={intro}
        aoFinalizar={() => setIntrosVistas((vistas) => new Set(vistas).add(trilha.id))}
      />
    )
  }

  // 4) Jogo da trilha escolhida (com o quadrinho de fechamento, se houver).
  // key={trilha.id} faz o React recriar o Jogo do zero ao trocar de trilha.
  return (
    <Jogo
      key={trilha.id}
      trilha={trilha}
      roteiroFinal={FINAIS[trilha.id] || null}
      aoVoltar={() => setTrilhaId(null)}
    />
  )
}
