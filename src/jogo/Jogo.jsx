// ============================================================================
// Jogo.jsx - Motor do jogo (o cerebro, independente do conteudo)
// ----------------------------------------------------------------------------
// Recebe UMA trilha por prop e cuida de TODO o estado da partida: qual
// exercicio, a resposta, o resultado, os erros, as dicas e os indicadores que
// acompanham o aluno pela trilha (vidas, streak, XP). Decide qual tela mostrar
// (exercicio, licao interrompida ou conclusao). Nao conhece os tipos de
// exercicio: usa o registro (exercicios/registro.jsx) pra verificar e desenhar
// os numeros de dificuldade vem do config.js.
//
// aoVoltar (opcional) volta pro catalogo de trilhas (quando o App tiver um).
// ============================================================================

import { useState } from 'react'
// funcoes do registro: o motor usa elas SEM conhecer os tipos de exercicio
import { verificar, respostaInicial, temResposta } from '../exercicios/registro.jsx'
// os numeros da dificuldade/pontuacao ficam todos no config.js (faceis de ajustar)
import {
  VIDAS_INICIAIS,
  ENERGIA_IA_INICIAL,
  ERROS_PARA_PERDER_VIDA,
  XP_BASE,
  XP_PENALIDADE_ERRO,
  XP_MINIMO,
  XP_BONUS_POR_STREAK,
  ERROS_PARA_DICA,
  ERROS_PARA_RESPOSTA,
  MENSAGEM_ERRO_SIMPLES,
} from '../config.js'

import TelaChat from './telas/TelaChat.jsx' // apresentacao atual: conversa com a Lari
import TelaLicaoInterrompida from './telas/TelaLicaoInterrompida.jsx'
import TelaConclusao from './telas/TelaConclusao.jsx'
import Quadrinho from '../quadrinhos/Quadrinho.jsx' // quadrinho de fechamento da trilha

// XP ganho num exercicio acertado: a base menos um desconto por erro, mas nunca
// abaixo do piso. Math.max devolve o MAIOR dos dois, entao segura o XP_MINIMO.
function calcularXp(erros) {
  return Math.max(XP_BASE - XP_PENALIDADE_ERRO * erros, XP_MINIMO)
}

// Feedback que cresce conforme o aluno erra o MESMO exercicio:
//  - poucos erros: so avisa que errou
//  - a partir de ERROS_PARA_DICA: mostra a dica
//  - a partir de ERROS_PARA_RESPOSTA: entrega a resposta completa (feedbackErrado)
//   Apenas no MVP REMOVER DEPOIS
function mensagemErro(exercicio, erros) {
  if (erros >= ERROS_PARA_RESPOSTA) return exercicio.feedbackErrado
  if (erros >= ERROS_PARA_DICA) return 'Dica: ' + exercicio.dica
  return MENSAGEM_ERRO_SIMPLES
}

// roteiroFinal (opcional): quadrinho tocado ao concluir a trilha, antes da tela
// de conclusao (vem do App; so a Trilha 1 tem, por enquanto).
export default function Jogo({ trilha, aoVoltar, roteiroFinal = null }) {
  // useState cria uma "memoria" do componente: (valor agora, funcao que troca o valor)
  // trocar o valor por essa funcao faz o React redesenhar a tela.
  const [indice, setIndice] = useState(0)
  // guarda o indice anterior pra detectar "troquei de exercicio" durante o render
  const [indiceAnterior, setIndiceAnterior] = useState(0)
  // a resposta do aluno. O "() =>" calcula o valor inicial uma unica vez
  const [resposta, setResposta] = useState(() => respostaInicial(trilha.exercicios[0]))
  // resultado: null (ainda nao verificou), true (acertou) ou false (errou)
  const [resultado, setResultado] = useState(null)
  // quantas vezes o aluno errou ESTE exercicio (zera ao trocar de exercicio)
  const [errosNoExercicio, setErrosNoExercicio] = useState(0)
  // dica sob demanda: se o aluno ja trocou 1 vida pela dica neste exercicio
  const [dicaPedida, setDicaPedida] = useState(false)
  // se esta mostrando o pedido de confirmacao da dica (sem usar window.confirm, feio)
  const [confirmandoDica, setConfirmandoDica] = useState(false)

  // Indicadores que NAO reiniciam entre exercicios (so no "Recomecar"):
  const [vidas, setVidas] = useState(VIDAS_INICIAIS)
  const [streak, setStreak] = useState(0)
  const [xpTotal, setXpTotal] = useState(0)
  // Energia do chat com o Albert (moeda separada das vidas).
  const [energiaIA, setEnergiaIA] = useState(ENERGIA_IA_INICIAL)

  // se o aluno concluiu a trilha (passou do ultimo exercicio)
  const [finalizado, setFinalizado] = useState(false)
  // se ja viu o quadrinho de fechamento da trilha (quando houver roteiroFinal)
  const [viuFinal, setViuFinal] = useState(false)

  // o exercicio atual = o da posicao "indice" na lista da trilha
  const exercicio = trilha.exercicios[indice]
  const total = trilha.exercicios.length
  const ultimo = indice === total - 1

  // Padrao do React: ao trocar de exercicio (indice mudou), reinicia resposta,
  // resultado, erros e a dica AINDA no render (sem useEffect). vidas/streak/XP
  // NAO sao tocados aqui - eles atravessam a trilha inteira.
  if (indice !== indiceAnterior) {
    setIndiceAnterior(indice)
    setResposta(respostaInicial(exercicio))
    setResultado(null)
    setErrosNoExercicio(0)
    setDicaPedida(false)
    setConfirmandoDica(false)
  }

  // clicou Verificar: ve se acertou e atualiza os indicadores
  function aoVerificar() {
    const acertou = verificar(exercicio, resposta)
    setResultado(acertou)
    if (acertou) {
      // sobe o streak e ganha XP: base (com desconto por erro) + bonus por streak
      const novoStreak = streak + 1
      setStreak(novoStreak)
      // a forma setXp(xp => ...) usa o valor mais atual, sem depender do render
      setXpTotal((xp) => xp + calcularXp(errosNoExercicio) + XP_BONUS_POR_STREAK * novoStreak)
    } else {
      // conta o erro, zera o streak e perde 1 vida a cada ERROS_PARA_PERDER_VIDA erros
      const novosErros = errosNoExercicio + 1
      setErrosNoExercicio(novosErros)
      setStreak(0)
      // o % (resto) da 0 quando novosErros e multiplo de ERROS_PARA_PERDER_VIDA (3, 6, 9...)
      if (novosErros % ERROS_PARA_PERDER_VIDA === 0) setVidas((v) => v - 1)
    }
  }

  // dica sob demanda, passo 1: so abre a confirmacao na pagina (uma vez por exercicio)
  function aoPedirDica() {
    if (dicaPedida) return
    setConfirmandoDica(true)
  }

  // passo 2: o aluno confirma -> troca 1 vida pela dica
  function aoConfirmarDica() {
    setVidas((v) => v - 1)
    setDicaPedida(true)
    setConfirmandoDica(false)
  }

  // passo 2 (alternativa): desistiu da dica
  function aoCancelarDica() {
    setConfirmandoDica(false)
  }

  // clicou Tentar de novo: volta o resultado pra null (o Verificar reaparece)
  function aoTentarDeNovo() {
    setResultado(null)
  }

  // gasta 1 de energia do chat com o Albert (nao mexe nas vidas)
  function aoGastarEnergiaIA() {
    setEnergiaIA((e) => Math.max(0, e - 1))
  }

  // clicou Proximo: avanca; se era o ultimo, marca a trilha como concluida
  function aoAvancar() {
    if (ultimo) setFinalizado(true)
    else setIndice((i) => i + 1)
  }

  // clicou Recomecar: zera TUDO e volta pro primeiro exercicio
  function aoRecomecar() {
    setIndice(0)
    setIndiceAnterior(0)
    setResposta(respostaInicial(trilha.exercicios[0]))
    setResultado(null)
    setErrosNoExercicio(0)
    setDicaPedida(false)
    setConfirmandoDica(false)
    setVidas(VIDAS_INICIAIS)
    setEnergiaIA(ENERGIA_IA_INICIAL)
    setStreak(0)
    setXpTotal(0)
    setFinalizado(false)
    setViuFinal(false)
  }

  // Escolha da tela. A ordem importa: ficar sem vidas interrompe antes de tudo.
  if (vidas <= 0) {
    return <TelaLicaoInterrompida xpTotal={xpTotal} aoRecomecar={aoRecomecar} aoVoltar={aoVoltar} />
  }
  // Ao concluir a trilha, se houver um quadrinho de fechamento ainda nao visto,
  // mostra ele antes da conclusao. variaveis={{ xp }} injeta a pontuacao real na
  // fala do Chefe (o marcador {xp} do roteiro).
  if (finalizado && roteiroFinal && !viuFinal) {
    return (
      <Quadrinho
        roteiro={roteiroFinal}
        variaveis={{ xp: xpTotal }}
        aoFinalizar={() => setViuFinal(true)}
      />
    )
  }
  if (finalizado) {
    return <TelaConclusao xpTotal={xpTotal} vidas={vidas} aoRecomecar={aoRecomecar} aoVoltar={aoVoltar} />
  }
  // tela normal: a conversa com a Lari (TelaChat). O motor passa o estado e as
  // acoes por props; a tela so desenha. A TelaExercicio (reserva) recebe as mesmas
  // props, entao pra voltar a ela e so trocar <TelaChat por <TelaExercicio aqui.
  return (
    <TelaChat
      trilhaTitulo={trilha.titulo}
      aula={trilha.aula || null}
      vidas={vidas}
      streak={streak}
      xpTotal={xpTotal}
      indice={indice}
      total={total}
      exercicio={exercicio}
      resposta={resposta}
      setResposta={setResposta}
      resultado={resultado}
      textoErro={resultado === false ? mensagemErro(exercicio, errosNoExercicio) : ''}
      podeVerificar={temResposta(exercicio, resposta)}
      dicaPedida={dicaPedida}
      confirmandoDica={confirmandoDica}
      aoPedirDica={aoPedirDica}
      aoConfirmarDica={aoConfirmarDica}
      aoCancelarDica={aoCancelarDica}
      aoVerificar={aoVerificar}
      aoTentarDeNovo={aoTentarDeNovo}
      aoAvancar={aoAvancar}
      aoVoltar={aoVoltar}
      energiaIA={energiaIA}
      aoGastarEnergiaIA={aoGastarEnergiaIA}
    />
  )
}
