// ============================================================================
// chatUtils.js - "ferramentas" puras do chat (NAO tem React aqui)
// ----------------------------------------------------------------------------
// Este arquivo guarda as CONSTANTES (listas de falas, caminhos de imagem) e as
// FUNCOES AUXILIARES do chat. Sao funcoes "puras": recebem dados e devolvem um
// valor, sem desenhar nada na tela e sem guardar estado. Ficam separadas da tela
// pq a TelaChat fica mais curta e cuida so de mostrar as coisas
// ============================================================================

// AVATARES: os rostos da Lari, um para cada situacao. E um objeto (um mapa de
// chave -> valor). Para pegar o rosto de duvida escreve-se AVATARES.lari.dica,
// que devolve a string '/chat/lari/duvida.png'. Os arquivos ficam em public/chat/.
export const AVATARES = {
  lari: {
    normal: '/chat/lari/normal.png', // rosto padrao
    dica: '/chat/lari/duvida.png', // quando esta dando uma dica
    erro: '/chat/lari/erro.png', // quando o aluno errou
  },
}

// ALBERT_ICON: o rosto do Albert (uma imagem so). Ele e "da gestao anterior",
// por isso o estilo de arte e diferente - e piada da historia, nao um erro.
export const ALBERT_ICON = '/chat/albert/icone.png'

// formatarRecarga: recebe SEGUNDOS e devolve um texto "23h 59m 58s". Usada no
// cronometro (mock) de recarga da energia do Albert.
export function formatarRecarga(s) {
  const h = Math.floor(s / 3600) // horas inteiras
  const m = Math.floor((s % 3600) / 60) // o resto em minutos (% = resto da divisao)
  const sec = s % 60 // o que sobra em segundos
  const dois = (n) => String(n).padStart(2, '0') // sempre 2 digitos: 9 -> "09"
  return `${h}h ${dois(m)}m ${dois(sec)}s`
}

// As tres listas abaixo sao falas da Lari, para a convesa ter um minimo de variacao.
// A tela sorteia UMA frase de cada lista quando precisa (ver a funcao sortear).
export const SAUDACOES = [
  'Bora começar! Primeiro desafio:',
  'Vamos nessa! Dá uma olhada:',
  'Começando a trilha — primeira missão:',
  'Preparada? Então olha só:',
]
export const PONTES = [
  'Boa, acertou mais uma! Agora o problema é:',
  'Mandou bem! Próximo desafio:',
  'Isso aí! Bora pro próximo:',
  'Show de bola! Segura essa:',
  'Perfeito, mais um ponto! Agora essa:',
]
export const PERDA_ENERGIA = [
  'Ih... essa custou 1 de vida. Bora com calma!',
  'Opa, lá se foi 1 de vida. Respira e tenta de novo.',
  'Esse erro custou vida. Sem pressa, você consegue.',
]

// resumirResposta: cada TIPO de exercicio guarda a resposta num formato diferente
// (um numero, um texto, uma lista...). Esta funcao transforma essa resposta num
// TEXTO curto, que vai aparecer na bolha "nos" (a fala do aluno) no chat.
// O "switch" escolhe o que fazer de acordo com exercicio.tipo.
export function resumirResposta(exercicio, resposta) {
  switch (exercicio.tipo) {
    case 'multipla':
      // exercicio.opcoes e uma lista; "resposta" e o indice escolhido. O "?." evita
      // erro se opcoes nao existir, e o "??" usa o texto padrao se vier vazio.
      return exercicio.opcoes?.[resposta] ?? '(sem resposta)'
    case 'contrastantes':
      return exercicio.versoes?.[resposta]?.rotulo ?? '(sem resposta)'
    case 'lacuna':
      return resposta ? '"' + resposta + '"' : '(vazio)'
    case 'saidaMultipla':
      // Aqui a resposta e uma LISTA (varias saidas). O .map percorre cada rotulo e
      // monta "Saida 1: 8"; o .join('\n') cola tudo com quebra de linha, para ficar
      // uma saida por linha (e nao tudo grudado).
      return Array.isArray(resposta)
        ? exercicio.rotulos.map((rotulo, i) => rotulo + ': ' + resposta[i]).join('\n')
        : ''
    case 'associacao':
      // Mesma ideia, mas mostrando as ligacoes "4 + 3 -> 7", uma por linha.
      return Array.isArray(resposta)
        ? (exercicio.esquerda || []).map((item, i) => item + ' -> ' + resposta[i]).join('\n')
        : ''
    case 'parsons':
      // resposta e a lista de linhas ja reordenadas; juntamos com "  /  " no meio.
      return Array.isArray(resposta) ? resposta.join('  /  ') : ''
    default:
      // Qualquer outro tipo: so vira texto puro.
      return String(resposta)
  }
}

// gabaritoLinhas: monta o gabarito "quebrado por linha" para a Lari mostrar a
// resposta certa no MESMO formato da bolha do aluno (uma coisa por linha). So faz
// sentido nos tipos com VARIAS respostas (saidaMultipla e associacao). Nos outros
// (uma resposta so) devolve null, e a tela entende que nao ha nada extra a mostrar.
export function gabaritoLinhas(exercicio) {
  if (exercicio.tipo === 'saidaMultipla') {
    const rotulos = exercicio.rotulos || []
    const respostas = exercicio.respostas || []
    if (rotulos.length <= 1) return null // uma saida so: nao precisa quebrar
    return rotulos.map((rotulo, i) => rotulo + ': ' + respostas[i]).join('\n')
  }
  if (exercicio.tipo === 'associacao') {
    const esquerda = exercicio.esquerda || []
    const correto = exercicio.correto || []
    if (!esquerda.length) return null
    return esquerda.map((item, i) => item + ' -> ' + correto[i]).join('\n')
  }
  return null
}

// sortear: devolve UM item aleatorio de uma lista. Math.random() da um numero
// entre 0 e 1; multiplicando pelo tamanho da lista e arredondando para baixo
// (Math.floor) obtemos um indice valido (de 0 ate tamanho-1).
export function sortear(frases) {
  return frases[Math.floor(Math.random() * frases.length)]
}
