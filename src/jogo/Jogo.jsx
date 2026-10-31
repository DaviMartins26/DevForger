// Motor do jogo (o "cerebro")
// ---------------------------------------------
// Guarda o ESTADO (qual exercicio, a resposta, o resultado) e manda a tela
// desenhar. Recebe a trilha por prop. Comeca pequeno; cresce quando precisar.
// ---------------------------------------------

import { useState } from 'react'
// funcoes do registro: o motor usa elas SEM conhecer os tipos de exercicio
import { verificar, respostaInicial, temResposta } from '../exercicios/registro.jsx'
import TelaExercicio from './telas/TelaExercicio.jsx'

export default function Jogo({ trilha }) {
  // useState cria uma "memoria": [valor agora, funcao que troca o valor].
  // indice = em qual exercicio da trilha estamos (comeca no 0, o primeiro)
  const [indice, setIndice] = useState(0)

  // o exercicio atual = o da posicao "indice" dentro da lista de exercicios
  const exercicio = trilha.exercicios[indice]

  // a resposta do usuario. O "() =>" faz o valor inicial ser calculado so uma vez
  const [resposta, setResposta] = useState(() => respostaInicial(exercicio))

  // resultado: null (ainda nao verificou), true (acertou) ou false (errou)
  const [resultado, setResultado] = useState(null)

  // clicou Verificar: guarda se acertou (true/false) no resultado
  function aoVerificar() {
    setResultado(verificar(exercicio, resposta))
  }

  // clicou Tentar de novo (depois de errar): volta o resultado pra null, o que
  // faz o botao Verificar aparecer de novo (a opcao escolhida continua marcada)
  function aoTentarDeNovo() {
    setResultado(null)
  }

  // clicou Proximo: vai pro proximo exercicio e limpa resposta/resultado
  function aoAvancar() {
    const prox = indice + 1
    // se nao existe proximo (era o ultimo exercicio), nao faz nada: evita quebrar
    // ao ler trilha.exercicios[prox] (que seria undefined). Aqui, no futuro, entra
    // a tela de conclusao.
    if (prox >= trilha.exercicios.length) return
    setIndice(prox)
    setResposta(respostaInicial(trilha.exercicios[prox]))
    setResultado(null)
  }

  // desenha a tela passando o estado e as acoes (os botoes la chamam estas funcoes)
  return (
    <TelaExercicio
      exercicio={exercicio}
      resposta={resposta}
      setResposta={setResposta}
      resultado={resultado}
      podeVerificar={temResposta(exercicio, resposta)}
      aoVerificar={aoVerificar}
      aoTentarDeNovo={aoTentarDeNovo}
      aoAvancar={aoAvancar}
    />
  )
}
