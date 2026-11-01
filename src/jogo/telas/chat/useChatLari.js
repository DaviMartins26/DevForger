// ============================================================================
// useChatLari.js - a "logica" da conversa com a Lari
// ----------------------------------------------------------------------------
// Custom hook (funcao que comeca com "use" e usa os hooks do React) que concentra
// toda a conversa com a Lari: guardar as mensagens, mandar o enunciado quando
// comeca um exercicio, mostrar a Lari "digitando" e responder certo/errado, e
// cuidar do fluxo da dica. A tela (TelaChat) so chama useChatLari(...) e recebe de
// volta as mensagens e as acoes (enviar, pedirDica...), ficando bem mais curta.
// ============================================================================

import { useState, useEffect, useRef } from 'react'
import {
  resumirResposta,
  gabaritoLinhas,
  SAUDACOES,
  PONTES,
  PERDA_ENERGIA,
  sortear,
} from './chatUtils.js'

export function useChatLari({
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
}) {
  const [mensagens, setMensagens] = useState([]) // todas as bolhas da conversa
  const [digitando, setDigitando] = useState(false) // mostrar o "...digitando" da Lari?

  // useRef guarda valores entre redesenhos SEM redesenhar a tela. Usamos como marcadores de controle do fluxo
  const fimRef = useRef(null) // elemento invisivel no fim da lista (para rolar ate ele)
  const perguntaFeitaRef = useRef(null) // id do exercicio cuja pergunta ja foi enviada
  const aguardaFeedbackRef = useRef(false) // o aluno enviou e estamos esperando o resultado
  const vidasAntesRef = useRef(vidas) // quanta vida havia ANTES de verificar (p/ detectar a perda)
  const aulaFeitaRef = useRef(false) // a mini-aula da trilha ja foi mostrada?

  // push: adiciona UMA mensagem no fim da conversa. "de" = quem fala ('lari'/'nos'),
  // humor = normal/dica/erro. [...m, nova] cria uma NOVA lista (nunca mexemos na antiga)
  function push(de, texto, codigo, humor = 'normal') {
    setMensagens((m) => [...m, { de, texto, codigo, humor }])
  }

  // EFEITO 1 - a Lari apresenta o exercicio ao ENTRAR nele (uma vez por exercicio).
  useEffect(() => {
    if (perguntaFeitaRef.current === exercicio.id) return // ja apresentou este: nao repete
    perguntaFeitaRef.current = exercicio.id
    // Mini-aula da trilha: no 1o exercicio (indice 0), se a trilha tiver "aula", a
    // Lari manda cada frase da aula numa bolha. forEach percorre a lista e, para cada
    // frase, chama push (sem devolver nada - diferente do .map, que devolve uma lista)
    if (indice === 0 && Array.isArray(aula) && aula.length && !aulaFeitaRef.current) {
      aulaFeitaRef.current = true
      aula.forEach((frase) => push('lari', frase, undefined, 'normal'))
    }
    // Fala humana: saudacao no 1o exercicio, "ponte" (apos acertar) nos demais.
    const intro = indice === 0 ? sortear(SAUDACOES) : sortear(PONTES)
    push('lari', intro + ' ' + exercicio.enunciado, exercicio.codigo, 'normal')
    // "nota": uma explicacao curta do conceito, que vem DEPOIS do enunciado.
    if (exercicio.nota) push('lari', exercicio.nota, undefined, 'normal')
  }, [exercicio.id, exercicio.enunciado, exercicio.codigo, indice, aula])

  // EFEITO 2 - quando o motor termina de corrigir (resultado deixa de ser null), a
  // Lari "digita" um instante e entao responde certo/errado.
  useEffect(() => {
    if (resultado === null) {
      aguardaFeedbackRef.current = false
      return
    }
    if (!aguardaFeedbackRef.current) return // o resultado mudou, mas nao foi um envio nosso
    aguardaFeedbackRef.current = false
    // Perdeu vida neste erro? (a vida so cai a partir do 3o erro no exercicio)
    const perdeuEnergia = resultado === false && vidas < vidasAntesRef.current
    setDigitando(true)
    // setTimeout espera 650ms (so para parecer que ela esta digitando) e entao
    // monta a resposta. Guardamos o "t" para poder cancelar na faxina (return).
    const t = setTimeout(() => {
      setDigitando(false)
      // Gabarito "rico": se o exercicio traz o campo "gabarito" (uma linha por saida,
      // ja explicando a conta), a Lari manda UMA mensagem so com ele.
      const gabaritoRico = Array.isArray(exercicio.gabarito) ? exercicio.gabarito.join('\n') : null
      if (resultado) {
        if (gabaritoRico) {
          push('lari', gabaritoRico, undefined, 'normal')
        } else {
          push('lari', exercicio.feedbackCerto, undefined, 'normal')
          const g = gabaritoLinhas(exercicio) // gabarito generico, uma coisa por linha
          if (g) push('lari', g, undefined, 'normal')
        }
      } else {
        // So revelamos a resposta completa depois de erros suficientes (quando o
        // textoErro ja e o feedback completo do exercicio).
        const revelaCompleto = textoErro === exercicio.feedbackErrado
        if (revelaCompleto && gabaritoRico) {
          push('lari', gabaritoRico, undefined, 'erro')
        } else {
          push('lari', textoErro, undefined, 'erro')
          if (revelaCompleto) {
            const g = gabaritoLinhas(exercicio)
            if (g) push('lari', g, undefined, 'erro')
          }
        }
        if (perdeuEnergia) push('lari', sortear(PERDA_ENERGIA), undefined, 'erro')
      }
    }, 650)
    return () => clearTimeout(t) // faxina: cancela o timer se o efeito recomecar
  }, [resultado, textoErro, exercicio.feedbackCerto, exercicio.feedbackErrado, vidas])

  // EFEITO 3 - rola a conversa ate o fim sempre que chega mensagem ou liga o "digitando".
  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, digitando])

  // ---- Acoes que os botoes do chat chamam -----------------------------------
  // enviar: o aluno mandou a resposta. Mostramos a fala dele, marcamos que estamos
  // esperando o feedback e pedimos ao motor para verificar.
  function enviar() {
    vidasAntesRef.current = vidas // guarda a vida atual p/ comparar depois
    push('nos', resumirResposta(exercicio, resposta))
    aguardaFeedbackRef.current = true
    aoVerificar()
  }
  // pedirDica: o aluno pede dica; a Lari avisa o custo e espera a confirmacao.
  function pedirDica() {
    push('nos', 'Posso pedir uma dica?')
    push('lari', 'Claro! A dica custa 1 vida. Quer que eu mostre?', undefined, 'dica')
    aoPedirDica()
  }
  // dicaSim: o aluno confirmou; mostramos a dica e o motor desconta 1 vida.
  function dicaSim() {
    push('nos', 'Pode mandar!')
    push('lari', 'Dica: ' + exercicio.dica, undefined, 'dica')
    aoConfirmarDica()
  }
  // dicaNao: o aluno desistiu da dica.
  function dicaNao() {
    push('nos', 'Deixa, vou tentar sozinho.')
    push('lari', 'Isso! Da mais uma olhada com calma.', undefined, 'normal')
    aoCancelarDica()
  }

  return { mensagens, digitando, fimRef, enviar, pedirDica, dicaSim, dicaNao }
}
