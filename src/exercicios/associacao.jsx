// tipo de exercicio = associacao (ligar com FIOS)
// ---------------------------------------------
// O aluno ARRASTA um fio da "porta" de cada item da esquerda ate a "porta" da
// resposta certa na direita (estilo os fios do Among Us). Soltar numa porta liga;
// soltar no vazio desliga. A resposta e um ARRAY: para cada item da esquerda,
// qual valor da direita ele foi ligado.
//
// Dados esperados no exercicio:
//  - esquerda : os itens da esquerda (ex.: ['4 + 3', '2 * 5', ...])
//  - opcoes   : os valores da direita, JA com distratores (respostas falsas)
//  - correto  : o valor certo de cada item da esquerda, na mesma ordem
//
// Os fios sao desenhados num <svg> por cima. Usa pointer events (mouse + toque),
// sem biblioteca. (E a parte mais avancada do projeto - leia com calma.)
// ---------------------------------------------

import { useRef, useState, useLayoutEffect } from 'react'

function Campo({ exercicio, resposta, setResposta }) {
  const { esquerda, opcoes } = exercicio
  // portas da direita: valores unicos (new Set tira os repetidos), uma por valor
  const direita = [...new Set(opcoes)]
  // ligacao atual de cada item da esquerda ('' = nenhuma). Vira array se ainda nao for.
  const atual = Array.isArray(resposta) ? resposta : esquerda.map(() => '')

  // refs = referencias aos elementos na tela, pra medir onde cada porta esta:
  const contRef = useRef(null) // o container (os fios sao medidos relativos a ele)
  const esqRefs = useRef([])   // as portas da esquerda (uma por item)
  const dirRefs = useRef({})   // as portas da direita (uma por valor)
  const [coords, setCoords] = useState({ esq: [], dir: {} }) // centro de cada porta
  const [arrasto, setArrasto] = useState(null) // o fio sendo puxado agora: { i, x, y }

  // useLayoutEffect roda DEPOIS de desenhar, mas ANTES de aparecer na tela: a hora
  // certa de medir onde cada porta ficou. Recalcula tambem quando a janela muda.
  useLayoutEffect(() => {
    function calcular() {
      const cont = contRef.current
      if (!cont) return
      const c = cont.getBoundingClientRect()
      // centro de um elemento, em relacao ao canto do container
      const centro = (el) => {
        const r = el.getBoundingClientRect()
        return { x: r.left - c.left + r.width / 2, y: r.top - c.top + r.height / 2 }
      }
      const esq = esqRefs.current.map((el) => (el ? centro(el) : { x: 0, y: 0 }))
      const dir = {}
      for (const v of direita) {
        const el = dirRefs.current[v]
        if (el) dir[v] = centro(el)
      }
      setCoords({ esq, dir })
    }
    calcular()
    window.addEventListener('resize', calcular)
    return () => window.removeEventListener('resize', calcular)
  }, [])

  // posicao do cursor em relacao ao canto do container
  function posRelativa(e) {
    const c = contRef.current.getBoundingClientRect()
    return { x: e.clientX - c.left, y: e.clientY - c.top }
  }

  // comecou a puxar o fio da porta esquerda i
  function aoDescerPorta(i, e) {
    const o = coords.esq[i]
    if (!o) return
    contRef.current.setPointerCapture?.(e.pointerId) // segura o pointer neste elemento
    setArrasto({ i, x: o.x, y: o.y })
  }

  // moveu o cursor: a ponta solta do fio acompanha o cursor
  function aoMover(e) {
    if (!arrasto) return
    const p = posRelativa(e)
    setArrasto((a) => ({ ...a, x: p.x, y: p.y }))
  }

  // soltou: ve se foi EM CIMA de uma porta da direita
  function aoSoltar(e) {
    if (!arrasto) return
    // elementFromPoint diz qual elemento esta embaixo do cursor naquele ponto
    const alvo = document.elementFromPoint(e.clientX, e.clientY)
    // closest sobe na arvore procurando um elemento com o atributo data-porta-dir
    const porta = alvo && alvo.closest ? alvo.closest('[data-porta-dir]') : null
    const copia = [...atual]
    // ligou numa porta? guarda o valor dela. soltou no vazio? desliga ('')
    copia[arrasto.i] = porta ? porta.getAttribute('data-porta-dir') : ''
    setResposta(copia)
    setArrasto(null)
  }

  return (
    <>
      <p>Arraste um fio de cada item da esquerda ate a resposta certa.</p>
      <div
        ref={contRef}
        className="fios"
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={() => setArrasto(null)}
      >
        {/* o SVG fica POR CIMA, desenhando os fios ja ligados + o que esta sendo puxado */}
        <svg className="fios-svg">
          {/* uma linha pra cada ligacao ja feita */}
          {atual.map((v, i) =>
            v && coords.esq[i] && coords.dir[v] ? (
              <line
                key={i}
                className="fio"
                x1={coords.esq[i].x}
                y1={coords.esq[i].y}
                x2={coords.dir[v].x}
                y2={coords.dir[v].y}
              />
            ) : null,
          )}
          {/* o fio que esta sendo puxado agora (da porta ate o cursor) */}
          {arrasto && coords.esq[arrasto.i] ? (
            <line
              className="fio fio-arrasto"
              x1={coords.esq[arrasto.i].x}
              y1={coords.esq[arrasto.i].y}
              x2={arrasto.x}
              y2={arrasto.y}
            />
          ) : null}
        </svg>

        {/* coluna da ESQUERDA: cada item + sua porta (a bolinha pra puxar o fio) */}
        <div className="fios-col fios-esq">
          {esquerda.map((item, i) => (
            <div className="fios-row" key={i}>
              <code>{item}</code>
              <span
                className={'fios-porta' + (atual[i] ? ' fios-ligada' : '')}
                ref={(el) => (esqRefs.current[i] = el)}
                onPointerDown={(e) => aoDescerPorta(i, e)}
                title="Arraste ate a resposta"
              />
            </div>
          ))}
        </div>

        {/* coluna da DIREITA: a porta (onde o fio liga) + o valor */}
        <div className="fios-col fios-dir">
          {direita.map((v) => (
            <div className="fios-row" key={v}>
              <span
                className="fios-porta"
                data-porta-dir={v}
                ref={(el) => (dirRefs.current[v] = el)}
              />
              <span>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default {
  Campo,
  // acertou se a ligacao de CADA item da esquerda for a certa (compara com "correto")
  verificar: (exercicio, resposta) =>
    Array.isArray(resposta) && exercicio.correto.every((valor, i) => resposta[i] === valor),
  // comeca com tudo desligado (uma '' por item da esquerda)
  respostaInicial: (exercicio) => exercicio.esquerda.map(() => ''),
  // so habilita o Verificar quando TODOS os itens foram ligados em algo
  temResposta: (exercicio, resposta) =>
    Array.isArray(resposta) && resposta.every((v) => v !== ''),
}
