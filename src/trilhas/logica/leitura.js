// Trilha 1: Leitura de codigo
// aqui sera adicionada  a estrura das trilhas devem seguir a seguinte logica a principio
//
// OBS (ajuste meu p/ a demo): por enquanto SO o tipo 'multipla' esta implementado.
// Por isso pus o exercicio de multipla em PRIMEIRO, pra ele ja aparecer
// funcionando na tela. O 'saidaMultipla' ficou em segundo e vai mostrar
// "Tipo desconhecido" ate a gente criar esse tipo (proxima etapa). Pode reordenar
// quando o saidaMultipla existir.

export default {
    id: 'leitura',
    titulo: 'Leitura de Codigo',
    descricao: 'Prever a saida de um programa e montar programas simples, passo a passo.',
    aula: [
        'aqui deve contem uma explicacao',
        'sobre oque seravisto',
        'cada liha sera uma mensagem do bot'
    ],
    exercicios: [
        { //exemplo mais 'fiel' (tipo multipla ja funciona)
        id: 'exe2',
        tipo: 'multipla',
        titulo: 'O que aparece na tela',
        nota: 'Repara num detalhe: a virgula dentro do print separa os pedacos com um espaco, e uma variavel mostra o VALOR guardado, nao o nome dela.',
        enunciado: 'O que este programa imprime?',
        codigo: 'nome = "Ana"\nprint("Ola,", nome)',
        opcoes: ['Ola, nome', 'Ola, Ana', 'Ola Ana (sem virgula)', 'nome'],
        correta: 1,
        dica: 'print mostra o texto e, no lugar de nome, o valor guardado na variavel.',
        feedbackCerto: 'Isso. A virgula no print poe um espaco: "Ola, Ana".',
        feedbackErrado: 'nome vale "Ana"; print("Ola,", nome) mostra "Ola, Ana".',
        },
        {
        id:'ex1',
        // tipo saidaMultipla ainda NAO implementado: vai aparecer "Tipo desconhecido"
        tipo: 'saidaMultipla',
        titulo: 'duvida do exercicio',
        //explicacao do exercicio
        enunciado: 'O que este programa imprime? Preencha cada saida na ordem.',
        //codigo que sera impresso pro aluno compreender
        codigo: 'x = 5\ny = 3\nprint(x + y)\nprint(x * y)',
        //campo que ele precisa colocar a(s) saidas
        rotulos: ['Saida 1', 'Saida 2'],
        // respostas corras do exercico
        respostas: ['8', '15'],
        //dica que gratuita que ele recebe apos pedir ou errar x vezes
        dica: 'Resolva cada print: primeiro x + y, depois x * y.',
        //mensagem enviada ao acertar, pode ficar ruim em multipla escolha
        feedbackCerto: 'Isso. 5 + 3 = 8 e 5 * 3 = 15.',
        //dica dada quando o aluno errou muitas vezes
        feedbackErrado: 'A 1a saida e 5 + 3 = 8; a 2a e 5 * 3 = 15.',
        // resposta do bot mais bonita em chat, principalmente em multipla escolha
        gabarito: [
            'Saida 1 e Soma, entao: 5 + 3 = 8',
            'Saida 2 e Multiplicacao, entao: 5 * 3 = 15',
        ],
        },
    ]

}
