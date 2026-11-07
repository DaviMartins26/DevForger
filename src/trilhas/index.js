// ============================================================================
// trilhas/index.js - catalogo do bloco (a lista de trilhas que a TelaCatalogo mostra)
// ----------------------------------------------------------------------------
// Junta as trilhas num so lugar. Por enquanto so tem a Trilha 1 (Leitura de Codigo)
// pra adicionar outra, importe o arquivo dela e coloque no array `trilhas`
// O App usa `bloco` (titulo/descricao do catalogo) e `trilhas` (a lista)
// ============================================================================

import leitura from './logica/leitura.js'

// dados do "bloco" mostrados no topo do catalogo
export const bloco = {
  titulo: 'Bloco de Lógica de Programação',
  descricao: 'Trilhas de exercícios em Python, começando pela leitura de código.',
}

// a lista de trilhas JOGAVEIS do catalogo (a ordem aqui e a ordem na tela).
// Por ora so a Trilha 1 (Leitura de Codigo) tem exercicios de verdade no DevForge.
export const trilhas = [leitura]

// trilhas TRAVADAS: aparecem no catalogo so como vitrine (mostrar o plano do
// bloco), SEM poder jogar. Aqui NAO ha exercicios em JS - sao so os dados de
// cartaz (titulo/descricao/quantos exercicios). O conteudo real dessas trilhas
// ainda nao foi trazido pro DevForge. Pra "destravar" uma, cria-se o arquivo
// dela em logica/, importa aqui e move pro array `trilhas` acima.
export const trilhasBloqueadas = [
  {
    titulo: 'Tipos de Dados',
    descricao: 'Números, texto e booleanos: como o Python guarda cada valor e converte entre eles.',
    nExercicios: 8,
  },
  {
    titulo: 'Operadores Aritméticos',
    descricao: 'Contas em Python: divisão inteira, resto, potência e a ordem das operações.',
    nExercicios: 8,
  },
  {
    titulo: 'Verdadeiro ou Falso',
    descricao: 'Comparações e operadores lógicos: quando uma condição vale True ou False.',
    nExercicios: 8,
  },
  {
    titulo: 'Condições (if / elif / else)',
    descricao: 'Tomar decisões no código e classificar valores em faixas.',
    nExercicios: 8,
  },
  {
    titulo: 'Repetição (laços)',
    descricao: 'Repetir ações com while e for, acumular valores e combinar laço com condição.',
    nExercicios: 8,
  },
  {
    titulo: 'Listas e Matrizes',
    descricao: 'Guardar vários valores juntos, acessar por índice e percorrer com laço.',
    nExercicios: 8,
  },
  {
    titulo: 'Funções',
    descricao: 'Organizar o código em blocos reutilizáveis que recebem dados e devolvem resultados.',
    nExercicios: 8,
  },
  {
    titulo: 'Boas Práticas e Testes',
    descricao: 'Escrever código legível, evitar repetição e entender para que servem os casos de teste.',
    nExercicios: 8,
  },
]
