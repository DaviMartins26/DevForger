// ============================================================================
// useAlbert.js - a "logica" do chat de duvidas com o Albert
// ----------------------------------------------------------------------------
// Custom hook (funcao que comeca com "use" e usa os hooks do React) que agrupa
// toda a logica do Albert num lugar so, deixando a tela (AlbertOverlay) cuidando
// apenas do visual. A tela chama useAlbert(...) e recebe de volta o estado (as
// mensagens, o texto digitado...) e as acoes (abrir, perguntar).
// ============================================================================

import { useState, useEffect, useRef } from 'react'
import { ENERGIA_IA_INICIAL } from '../../../config.js'
import { perguntarAlbert, respostaMockAlbert } from '../../../ia/albert.js'

// energiaIA: quantas perguntas o aluno ainda pode fazer (a "moeda" do Albert).
// aoGastarEnergiaIA: funcao do motor (Jogo.jsx) que tira 1 de energia.
// exercicio: o exercicio atual, enviado junto da pergunta para dar contexto a IA.
export function useAlbert({ energiaIA, aoGastarEnergiaIA, exercicio }) {
  const [aberta, setAberta] = useState(false) // a janela do Albert esta aberta?
  const [msgs, setMsgs] = useState([]) // as mensagens da conversa com o Albert
  const [input, setInput] = useState('') // o que o aluno esta digitando
  const [digitando, setDigitando] = useState(false) // mostrar o "...digitando"?
  const [erro, setErro] = useState('') // aviso em vermelho (ex.: "escreva algo")
  const [recargaSeg, setRecargaSeg] = useState(null) // segundos do cronometro de recarga

  // useRef aponta pro elemento invisivel no fim da lista, pra rolarmos ate la.
  const fimRef = useRef(null)

  // toda vez que chega mensagem nova (ou liga o digitando), rola o chat ate o fim.
  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, digitando])

  // Cronometro (mock) de recarga: quando a energia esta abaixo do maximo, mostra
  // "nova energia em 24h" e vai descontando 1 segundo. Ainda NAO recarrega de
  // verdade - e so o visual do contador (a recarga real fica para o futuro).
  useEffect(() => {
    if (energiaIA >= ENERGIA_IA_INICIAL) {
      setRecargaSeg(null) // energia cheia: esconde o cronometro
      return
    }
    // comeca em 24h (so na primeira vez que fica abaixo do maximo)
    setRecargaSeg((s) => (s == null ? 24 * 3600 : s))
    // setInterval repete um codigo a cada X ms; aqui tira 1 segundo a cada 1000ms.
    const id = setInterval(() => setRecargaSeg((s) => (s == null ? s : Math.max(0, s - 1))), 1000)
    // a faxina (return do useEffect) para o setInterval pra nao rodar a toa.
    return () => clearInterval(id)
  }, [energiaIA])

  // abrirDuvida: abre a janela do Albert. Na primeira vez, ele se apresenta e avisa
  // que pergunta fora do assunto tambem gasta energia.
  function abrirDuvida() {
    if (!msgs.length) {
      setMsgs([
        {
          de: 'albert',
          texto:
            'Eu sou o Albert. Pergunte sobre o exercicio ou sobre a linguagem - cada pergunta custa 1 de energia. Aviso: pergunta fora do assunto ou impropria gasta energia do mesmo jeito.',
        },
      ])
    }
    setErro('')
    setAberta(true)
  }

  // enviarDuvida: manda a pergunta do aluno para o Albert (a IA de verdade).
  function enviarDuvida() {
    const q = input.trim() // tira espacos sobrando das pontas
    if (!q) {
      setErro('Escreva sua duvida primeiro.')
      return
    }
    if (energiaIA <= 0) {
      setErro('Sem energia para perguntar agora.')
      return
    }
    setErro('')
    setInput('') // limpa a caixa de texto
    // [...m, novo] cria uma NOVA lista com tudo que ja tinha + a fala do aluno.
    setMsgs((m) => [...m, { de: 'nos', texto: q }])
    aoGastarEnergiaIA() // desconta 1 de energia
    setDigitando(true) // liga o "...digitando" do Albert

    // perguntarAlbert fala com o backend (/api/albert -> Gemini). Devolve uma
    // PROMISE (resposta que chega "depois"). Encadeamos:
    //  .then    -> deu certo: adiciona a resposta do Albert na conversa
    //  .catch   -> deu errado (IA fora/sem chave): usa uma resposta local (mock)
    //  .finally -> aconteca o que acontecer: desliga o "...digitando"
    perguntarAlbert({ pergunta: q, exercicio })
      .then((texto) => {
        setMsgs((m) => [...m, { de: 'albert', texto }])
      })
      .catch(() => {
        setMsgs((m) => [...m, { de: 'albert', texto: respostaMockAlbert() }])
      })
      .finally(() => setDigitando(false))
  }

  // Devolvemos para a tela tudo que ela precisa para mostrar e controlar o chat.
  return {
    aberta,
    setAberta,
    msgs,
    input,
    setInput,
    digitando,
    erro,
    setErro,
    recargaSeg,
    fimRef,
    abrirDuvida,
    enviarDuvida,
  }
}
