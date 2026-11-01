// ============================================================================
// quadrinhos/trilha1-intro.js - Intro em quadrinho da Trilha 1 (Leitura de Codigo)
// ----------------------------------------------------------------------------
// Mesmo formato de abertura.js (ver la os comentarios do formato). Toca ao
// clicar "Comecar" na Trilha 1, ANTES do primeiro exercicio. 3 quadros:
//   1. Lari apresenta a trilha (aponta um codigo).
//   2. O desafio: ler e prever a saida (tela com codigo).
//   3. Semente do conflito: o Rival (verde) aparece debochando.
// ============================================================================

export default {
  id: 'trilha1-intro',
  titulo: 'Trilha 1 - Leitura de Codigo',
  quadros: [
    {
      id: 't1q1',
      imagem: '/quadrinhos/trilha1/Inicio1.jpeg',
      descricao: 'Lari aponta para uma tela de codigo no console da DevForge.',
      baloes: [
        {
          quem: 'lari', x: 27, y: 10, w: 27,
          texto: {
            pt: 'Primeira trilha: Leitura de Codigo. Antes de escrever, aprenda a ler.',
            en: 'First track: Reading Code. Before you write, learn to read.',
          },
        },
      ],
    },
    {
      id: 't1q2',
      imagem: '/quadrinhos/trilha1/Inicio2.jpeg',
      descricao: 'Monitor grande exibindo um trecho de codigo (diagnostico de sistema).',
      baloes: [
        {
          quem: 'lari', x: 8, y: 9, w: 27,
          texto: {
            pt: 'Olhe o programa e preveja o que ele faz. Sem adivinhar - raciocine linha por linha.',
            en: 'Look at the program and predict what it does. No guessing - reason line by line.',
          },
        },
      ],
    },
    {
      id: 't1q3',
      imagem: '/quadrinhos/trilha1/Inicio3.jpeg',
      descricao: 'O Rival (verde, sorriso debochado) espia por tras de um rack de servidores.',
      baloes: [
        {
          quem: 'rival', x: 24, y: 9, w: 29,
          texto: {
            pt: 'Boa sorte. Vai precisar.',
            en: "Good luck. You'll need it.",
          },
        },
      ],
    },
  ],
}
