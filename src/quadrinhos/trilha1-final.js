// ============================================================================
// quadrinhos/trilha1-final.js - Fechamento (ciclo dramatico) da Trilha 1
// ----------------------------------------------------------------------------
// Mesmo formato de abertura.js. Toca ao CONCLUIR a Trilha 1 (depois do ultimo
// exercicio), ANTES da tela de conclusao. Primeiro fechamento da lore.
//
// A ordem dos arquivos Fim1..Fim7 segue a ordem da historia (beats 1..7):
//   1. Fim1 - Condecoracao: o Chefe anuncia a pontuacao e chama de prodigio.
//   2. Fim2 - Orgulho: Lari comemora ao lado do jogador (com a medalha).
//   3. Fim3 - O Rival (verde) irrompe dizendo ter 1500.
//   4. Fim4 - Placar impossivel: 1500 > MAX 1160 (prova da trapaca).
//   5. Fim5 - O Chefe entrega a medalha ao Rival ("Maior e Maior").
//   6. Fim6 - O Rival debocha.
//   7. Fim7 - Lari conforta e vira motivacional.
//
// NUMEROS:
//   - {xp} no quadro 1 e a pontuacao REAL do jogador (vem do Jogo.jsx via
//     `variaveis`; o motor Quadrinho.jsx substitui {xp}).
//   - 1160 = teto honesto de XP da trilha 1 (8 acertos sem erro, streak 1..8:
//     100 + 10*streak por acerto; 800 + 360 = 1160). Se o config.js mudar, recalcular.
//   - 1500 = pontuacao (impossivel) que o Rival alega (desenhada no Fim4).
// ============================================================================

export default {
  id: 'trilha1-final',
  titulo: 'Trilha 1 - Desfecho',
  quadros: [
    {
      id: 'tf1',
      imagem: '/quadrinhos/trilha1/Fim1.jpeg',
      descricao: 'Jogador (azul) no podio sob holofote; o Chefe (sombra, visor e mao vermelhos) oferece a medalha.',
      baloes: [
        {
          quem: 'chef', x: 74, y: 12, w: 20,
          texto: {
            // {xp} = pontuacao REAL do jogador (injetada pelo Jogo.jsx)
            pt: '{xp} pontos. Um verdadeiro prodígio da IA.',
            en: '{xp} points. A true AI prodigy.',
          },
        },
      ],
    },
    {
      id: 'tf2',
      imagem: '/quadrinhos/trilha1/Fim2.jpeg',
      descricao: 'Jogador (azul) com a medalha de ouro; Lari (ambar) aplaude; confetes.',
      baloes: [
        {
          quem: 'lari', x: 13, y: 16, w: 20,
          texto: {
            pt: 'Você conseguiu! Que orgulho!',
            en: 'You did it! So proud of you!',
          },
        },
      ],
    },
    {
      id: 'tf3',
      imagem: '/quadrinhos/trilha1/Fim3.jpeg',
      descricao: 'O Rival (verde, bracos cruzados, deboche) irrompe; jogador surpreso.',
      baloes: [
        {
          quem: 'rival', x: 73, y: 13, w: 20,
          texto: {
            pt: 'Prodígio? Que fofo. Eu fiz 1500.',
            en: 'Prodigy? How cute. I scored 1500.',
          },
        },
      ],
    },
    {
      id: 'tf4',
      imagem: '/quadrinhos/trilha1/Fim4.jpeg',
      descricao: 'Placar holografico: 1500 (verde) e, menor, MAX 1160 (azul). Jogador aponta, incredulo.',
      baloes: [
        {
          quem: 'nos', x: 73.5, y: 12, w: 20,
          texto: {
            pt: '1500? Impossível. O máximo da trilha é 1160!',
            en: '1500? Impossible. The track maxes out at 1160!',
          },
        },
      ],
    },
    {
      id: 'tf5',
      imagem: '/quadrinhos/trilha1/Fim5.jpeg',
      descricao: 'O Chefe (sombra, visor e mao vermelhos) entrega a medalha ao Rival (verde). Jogador e Lari abatidos.',
      baloes: [
        {
          quem: 'chef', x: 52, y: 10, w: 20,
          texto: {
            pt: '1500 é maior que 1160. Maior é Maior. A condecoração é dele.',
            en: '1500 is greater than 1160. Bigger is Bigger. The honor is his.',
          },
        },
      ],
    },
    {
      id: 'tf6',
      imagem: '/quadrinhos/trilha1/Fim6.jpeg',
      descricao: 'O Rival (verde) exibe a medalha e pisca zombando; jogador indignado.',
      baloes: [
        {
          quem: 'rival', x: 21, y: 13, w: 20,
          texto: {
            pt: 'Números são números. Boa sorte na próxima, prodígio.',
            en: 'Numbers are numbers. Good luck next time, prodigy.',
          },
        },
      ],
    },
    {
      id: 'tf7',
      imagem: '/quadrinhos/trilha1/Fim7.jpeg',
      descricao: 'Corredor; jogador (azul) cabisbaixo; Lari (ambar) com a mao no ombro, encorajando.',
      baloes: [
        {
          quem: 'lari', x: 76.5, y: 3 , w: 20,
          texto: {
            pt: 'Não foi justo, eu sei. Mas você fez por mérito. Ainda temos muito a aprender! E vamos superar aquele trapaceiro. Juntos.',
            en: "It wasn't fair, I know. But you earned yours. We still have a lot to learn! And we'll outdo that cheater. Together.",
          },
        },
      ],
    },
  ],
}
