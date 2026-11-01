// Parametros da gameficacao
//---------------------------------------------
// O arquivo contentra TODOS as variaveis e numeros que definem a "dificuldade" e a pontuacao
// Assim a calibracao poe ser feita ajustando os numeros aqui, evitando regras pedidas no meio
// da logica 
//
// Sao constantes exportadas (export const) a outros arquivos, que devem ser chamadas tipo:
//      import { nome_constante } from './config.js'
//      import { VIDAS_INICIAIS } from './config.js'
//---------------------------------------------

// Quantidade de VIDA que o usuario começa toda trilha
// Atualmente reinicia sempre que recomeça uma trilha, deve ser vinculada ao usuario no futuro
export const VIDAS_INICIAIS = 10

// Quantidade de erros que começa a tirar a primeira vida
export const ERROS_PARA_PERDER_VIDA = 3

// XP ganho ao acertar um exercicio
export const XP_BASE = 100

// XP perdido ao errar a resposta
export const XP_PENALIDADE_ERRO = 25

// A menor quantidade possivel de Xp que o usuario pode ter apos errar muitas vezes
export const XP_MINIMO = 10

// Bonuis de streack (acertos consecutivos) ao responder os exercicios
// o valor é somado ao XP total, não multiplicado (a principio)
export const XP_BONUS_POR_STREAK = 10

// Se o usuario errar muitas vezes deve ter uma dica "gratuita"
// a const controla esse numero
export const ERROS_PARA_DICA = 3

// Numero de erros a partir do qual o jogo revela a resposta completa (o
// feedbackErrado). Vem DEPOIS da dica: primeiro mostra a dica, so depois a resposta.
export const ERROS_PARA_RESPOSTA = 4

// Mensagem de erro ao errar a resposta
export const MENSAGEM_ERRO_SIMPLES = 'Resposta errada. Tente de novo'

//Energia do Chat de IA para auxilio, nao confundir com vidas 
//Cada pergunta consome uma energia que será restaurada com o passar de 24h
// agora recarrega junto com a pagina
export const ENERGIA_IA_INICIAL = 3
