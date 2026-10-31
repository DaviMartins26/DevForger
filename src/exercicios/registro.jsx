// Registro central dos tipos de exercicio
// ------------------
// Junta todos os tipos num mapa em modulos
// cada modulo exporta os dados de
// Campo, verificar, respostaInicial, temResposta

// Como adicionar um novo tipo de exericio
//  1- crie um arquivo em src/exercicios/ (multipla.jsx é um bom modelo)
//  2- import aqui e adicone uma linha no mapa REGISTRO
// o motor (jogo/Jogo.jsx) vai usar as funcoes dele
// -------------------------

// traz o modulo dos exercicios, por enquanto so temos multipla escolha
import multipla from './multipla.jsx'

// mapa: liga o NOME do tipo (a chave) ao modulo que sabe trata-lo.
// a chave 'multipla' TEM que ser igual ao campo tipo dos dados (tipo: 'multipla')
const REGISTRO = { multipla }

export default REGISTRO

// confere se a resposta esta certa, delegando pro modulo do tipo do exercicio
export function verificar(exercicio, resposta) {
  // REGISTRO[exercicio.tipo] = pega no mapa o modulo cujo nome e igual ao tipo
  const modulo = REGISTRO[exercicio.tipo]
  // se achou o modulo usa o verificar dele; se nao achou, devolve false (nao quebra)
  return modulo ? modulo.verificar(exercicio, resposta) : false
}

// devolve o valor "vazio" da resposta quando o exercicio abre (ex.: nada marcado)
export function respostaInicial(exercicio) {
  const modulo = REGISTRO[exercicio.tipo]
  return modulo ? modulo.respostaInicial(exercicio) : null
}

// diz se ja da pra habilitar o botao Verificar (se tem alguma resposta)
export function temResposta(exercicio, resposta) {
  const modulo = REGISTRO[exercicio.tipo]
  return modulo ? modulo.temResposta(exercicio, resposta) : false
}

// desenha o campo de resposta certo, escolhendo o componente pelo tipo
export function CampoResposta(props) {
  const modulo = REGISTRO[props.exercicio.tipo]
  // se o tipo nao existe no mapa, mostra um aviso em vez de quebrar a tela
  if (!modulo) return <p>Tipo desconhecido: {props.exercicio.tipo}</p>
  const Campo = modulo.Campo
  // {...props} = repassa TODOS os props que chegaram aqui, de uma vez, pro Campo
  return <Campo {...props} />
}