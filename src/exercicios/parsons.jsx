// tipo de exercicio = parsons (reordenar linhas ARRASTANDO)
// ---------------------------------------------
// O aluno recebe as linhas de um programa EMBARALHADAS e arrasta cada uma pra
// cima/baixo ate formar a ordem certa. A resposta e um ARRAY com as linhas na
// ordem atual.
//
// Dados esperados no exercicio:
//  - linhas   : a ordem embaralhada inicial (array de strings)
//  - correta  : UMA ordem certa (array), OU
//  - corretas : VARIAS ordens certas (array de arrays), quando mais de uma ordem
//               vale. Se "corretas" existir, "correta" e ignorada.
//
// O arrastar usa "pointer events" (onPointerDown / onPointerMove / onPointerUp),
// que funcionam com mouse E com o dedo (toque), sem precisar de biblioteca.
// ---------------------------------------------

import { useRef, useState } from 'react'

// devolve a lista de ordens aceitas (sempre como uma lista de listas)
function ordensAceitas(exercicio) {
  if (Array.isArray(exercicio.corretas)) return exercicio.corretas
  return [exercicio.correta]
}

function Campo({ resposta, setResposta, travado }) {
  // durante a troca de exercicio a resposta pode nao ser array por um instante
  const linhas = Array.isArray(resposta) ? resposta : []
  // useRef guarda uma referencia ao <ol> desenhado, pra medir onde cada item esta
  const listaRef = useRef(null)
  // qual linha esta sendo arrastada agora (o indice dela), ou null se nenhuma
  const [arrastando, setArrastando] = useState(null)

  // descobre SOBRE qual item o cursor esta, comparando a posicao Y do cursor com
  // o meio de cada item da lista
  function indiceSob(clientY) {
    const itens = listaRef.current ? listaRef.current.querySelectorAll('[data-linha]') : []
    for (let j = 0; j < itens.length; j++) {
      const r = itens[j].getBoundingClientRect() // posicao e tamanho do item na tela
      if (clientY < r.top + r.height / 2) return j
    }
    return itens.length - 1
  }

  // apertou o mouse/dedo em cima da linha i: comeca a arrastar ela
  function aoDescer(i) {
    if (travado) return
    setArrastando(i)
  }

  // moveu o cursor: se passou por cima de outra linha, troca a ordem ao vivo
  function aoMover(e) {
    if (arrastando === null) return // so reage se estiver arrastando algo
    const alvo = indiceSob(e.clientY)
    if (alvo >= 0 && alvo !== arrastando) {
      const copia = [...linhas]                   // copia a lista (nunca mexe na antiga)
      const [linha] = copia.splice(arrastando, 1) // tira a linha arrastada da posicao antiga
      copia.splice(alvo, 0, linha)                // enfia ela na posicao nova
      setResposta(copia)
      setArrastando(alvo)                         // agora ela esta na posicao "alvo"
    }
  }

  // soltou o mouse/dedo: para de arrastar
  function aoSoltar() {
    setArrastando(null)
  }

  return (
    // <ol> = lista ordenada; os pointer events ficam na lista inteira
    // <ol> = lista ordenada; os pointer events ficam na lista inteira. A aparencia
    // (cores, bordas) fica no styles.css nas classes parsons-*, pra seguir o tema.
    <ol
      ref={listaRef}
      className="parsons-lista"
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerLeave={aoSoltar}
    >
      {linhas.map((linha, i) => (
        <li
          key={i}
          data-linha                               // marca usada pelo indiceSob pra achar os itens
          // parsons-arrastando (classe extra) so entra na linha que esta sendo arrastada
          className={'parsons-item' + (arrastando === i ? ' parsons-arrastando' : '')}
          onPointerDown={() => aoDescer(i)}
        >
          <span aria-hidden="true">⠿ </span>
          {/* a indentacao do codigo (white-space: pre) fica no CSS .parsons-item code */}
          <code>{linha === '' ? ' ' : linha}</code>
        </li>
      ))}
    </ol>
  )
}

export default {
  Campo,
  // acertou se a ordem atual bater com ALGUMA das ordens aceitas. O join('\n')
  // junta a lista num texto so, pra comparar as duas ordens de forma simples.
  verificar: (exercicio, resposta) =>
    Array.isArray(resposta) &&
    ordensAceitas(exercicio).some((ordem) => resposta.join('\n') === ordem.join('\n')),
  // comeca com as linhas embaralhadas (uma copia, pra nao mexer nos dados originais)
  respostaInicial: (exercicio) => [...exercicio.linhas],
  // sempre tem uma ordem, entao o Verificar ja fica liberado
  temResposta: (exercicio, resposta) => Array.isArray(resposta),
}
