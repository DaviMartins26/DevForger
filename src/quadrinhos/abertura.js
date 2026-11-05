// ============================================================================
// quadrinhos/abertura.js - Roteiro em DADOS do quadrinho de abertura
// ----------------------------------------------------------------------------
// Um ARCO de historia = um arquivo (mesmo padrao das trilhas: so dados). O motor
// de quadrinho (Quadrinho.jsx) le este objeto e desenha quadro a quadro.
//
// Cada QUADRO tem:
//   - id        : identificador curto
//   - imagem    : caminho servido pelo Vite (em /public). null = ainda sem arte
//                 (o componente mostra um placeholder com a "descricao").
//   - descricao : o que a arte mostra (vira placeholder quando nao ha imagem)
//   - baloes    : lista de baloes de fala. O TEXTO fica aqui, FORA da imagem,
//                 pra a i18n (pt/en) ser so troca de string - sem reimagem.
//       - quem  : 'lari' | 'nos' | 'rival' | 'chef' (quem fala)
//       - x,y,w : posicao e largura do balao em % da imagem (0-100), medidos
//                 pra cair DENTRO do balao branco ja desenhado na arte.
//       - texto : { pt, en } - uma string por idioma
// ============================================================================

export default {
  id: 'abertura',
  titulo: 'Abertura - Bem-vindo à DevForge',
  quadros: [
    {
      id: 'q1',
      imagem: '/quadrinhos/intro/Quadro1.jpeg',
      descricao: 'Lari no console da DevForge, apontando.',
      baloes: [
        {
          quem: 'lari', x: 30, y: 15, w: 20,
          texto: {
            pt: 'Bem-vindo à DevForge! Você é a nossa mais nova IA em avaliação.',
            en: "Welcome to DevForge! You're our newest AI under evaluation.",
          },
        },
      ],
    },
    {
      id: 'q2',
      imagem: '/quadrinhos/intro/Quadro2.jpeg',
      descricao: 'Lari (direita) aponta para o jogador (azul) num pedestal holografico.',
      baloes: [
        {
          quem: 'lari', x: 74, y: 8, w: 20,
          texto: {
            pt: 'O trabalho é simples: provar que você raciocina. Cada bateria de testes é uma trilha.',
            en: 'The job is simple: prove you can reason. Each test battery is a track.',
          },
        },
      ],
    },
    {
      id: 'q3',
      imagem: '/quadrinhos/intro/Quadro3.jpeg',
      descricao: 'Lari aponta para um painel de System Health / energia (medidor 98.5%).',
      baloes: [
        {
          quem: 'lari', x: 12, y: 13, w: 20,
          texto: {
            pt: 'Você começa com vidas ❤️. Errar demais esgota elas, calma e capricho valem mais que pressa.',
            en: 'You start with lives ❤️. Too many mistakes drain them, care beats rushing.',
          },
        },
      ],
    },
    {
      id: 'q4',
      imagem: '/quadrinhos/intro/Quadro4.jpeg',
      descricao: 'Lari pisca, lampada acesa, dedo em riste (a dica).',
      baloes: [
        {
          quem: 'lari', x: 14, y: 14, w: 20,
          texto: {
            pt: 'Travou? Me chama. Eu te dou uma dica... mas ela gasta 1 vida ❤️. Combinado?',
            en: "Stuck? Call me. I'll give you a hint... but it costs 1 life ❤️. Deal?",
          },
        },
      ],
    },
    {
      id: 'q5',
      imagem: '/quadrinhos/intro/QuadroAlbert.jpeg',
      descricao: 'Lari (direita) apresenta o Albert: um robo anciao de bronze, barbudo, meio adormecido, ao lado do jogador.',
      baloes: [
        {
          quem: 'lari', x: 73.5, y: 6.5, w: 20,
          texto: {
            pt: 'Esse é o Albert... ele é diferente porque é da gestão anterior. Mas o conhecimento é infinito: ele te ajuda, por uma Energia ⚡.',
            en: "That's Albert... he looks different because he's from the previous management. But his knowledge is infinite: he can help you, for a Energy ⚡.",
          },
        },
      ],
    },
    {
      id: 'q6',
      imagem: '/quadrinhos/intro/Quadro5.jpeg',
      descricao: 'Sombra do Chefe (vermelho); so a mao enorme no console e o visor. Jogador olhando para cima.',
      baloes: [
        {
          quem: 'chef', x: 14, y: 13.5, w: 20,
          texto: {
            pt: 'Resultados. É só o que importa aqui. Quanto mais Alto Melhor',
            en: "Results. That's all that matters here. The Higher the Better",
          },
        },
      ],
    },
    {
      id: 'q7',
      imagem: '/quadrinhos/intro/Quadro6.jpeg',
      descricao: 'Lari (direita) acena, tranquilizando; jogador (azul) ao lado.',
      baloes: [
        {
          quem: 'lari', x: 20, y: 11.5, w: 20,
          texto: {
            pt: 'Não liga pra ele. Faz o teu melhor, de verdade. Bora?',
            en: "Don't mind him. Just do your honest best. Shall we?",
          },
        },
      ],
    },
  ],
}
