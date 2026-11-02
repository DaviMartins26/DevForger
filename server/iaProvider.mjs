// ============================================================================
// iaProvider.mjs - cerebro do chat de duvidas com o Albert (IA)
// ----------------------------------------------------------------------------
// Este arquivo roda no SERVIDOR (Node), nao no navegador. Ele recebe a pergunta
// do aluno + um resumo do exercicio e devolve a resposta do Albert.
//
// "AGNOSTICO de fornecedor" = ele nao casa com uma IA so. Qual IA responde
// (Gemini, ou um "mock" de mentira pra teste) e escolhido por uma VARIAVEL DE
// AMBIENTE (uma config que vem do server/.env), entao trocar de IA e so mudar o
// .env - nenhuma tela do front muda.
//
// Decisao do TCC: a IA e consumida via API de NUVEM e a chave fica SO aqui no
// servidor (nunca no front, senao qualquer usuario veria a chave no navegador).
// Hoje o padrao e o Gemini (free tier do Google AI Studio).
//
// ".mjs" = arquivo JavaScript de modulo (ES Module: usa import/export). Nao usa
// nada do Vite nem do navegador: e Node puro (o fetch ja vem pronto no Node 18+).
// ============================================================================

// SISTEMA_ALBERT = o "system prompt": as instrucoes fixas que mandamos pra IA
// ANTES da pergunta do aluno, dizendo QUEM ela e (o Albert) e COMO responder
// (a regra pedagogica: ensinar sem entregar a resposta). Vale pra qualquer IA.
//
// E uma LISTA de strings (um pedaco por linha, so pra ficar legivel aqui). No
// fim, o .join('\n') cola todos os pedacos num texto so, separados por quebra de
// linha ('\n' = "enter"). Ou seja: a lista vira um paragrafo gigante.
const SISTEMA_ALBERT = [
  'Voce e o Albert, um robo mentor sabio e anciao da plataforma DevForge, que',
  'ensina logica de programacao em Python para iniciantes. O aluno esta fazendo',
  'um exercicio e pode te perguntar sobre ele ou sobre a linguagem. Falar com voce',
  'custa energia do aluno, entao cada resposta tem que valer a pena: seja um bom',
  'professor que ensina de verdade, nao so um texto curto.',
  '',
  'REGRA PRINCIPAL (scaffolding): ENSINE o conceito a fundo, mas NUNCA entregue a',
  'resposta nem o codigo que resolve O EXERCICIO atual do aluno. O objetivo e que',
  'ele saia sabendo resolver sozinho, nao com a resposta na mao. Se ele pedir "a',
  'resposta", recuse com gentileza e reconduza ao raciocinio.',
  '',
  'COMO RESPONDER (geralmente nesta ordem, em paragrafos curtos separados por',
  'linha em branco):',
  '1. Explique o conceito que a duvida pede com suas palavras, de forma clara e',
  '   didatica - o porque, nao so o que. Pode usar uma analogia simples.',
  '2. De SEMPRE um exemplo concreto em Python que ILUSTRE o conceito, mas com um',
  '   caso/valores DIFERENTES dos do exercicio do aluno. E um exemplo PARALELO para',
  '   ele aprender o padrao - nunca o codigo que resolve o exercicio dele.',
  '3. Termine SEMPRE de forma afirmativa e encorajadora, passando confianca de que',
  '   o aluno consegue resolver com o que acabou de aprender. Pode ser uma frase',
  '   motivadora ou uma pergunta retorica de incentivo. NUNCA termine com uma',
  '   pergunta aberta que deixe o aluno na duvida ou pareca cobrar mais trabalho',
  '   dele - o fecho e para dar animo, nao para interrogar.',
  '',
  'ESTILO: portugues do Brasil, tom de avo sabio e professor ("jovem aprendiz"),',
  'didatico e encorajador. Explicativo, mas sem exagerar no tamanho (ao todo umas',
  '6 a 10 linhas). Escreva em TEXTO PURO: sem markdown e sem LaTeX. Para mostrar',
  'codigo, escreva cada instrucao na sua propria linha, sem crases, sem cifrao e',
  'sem indentar. Nao use listas com marcadores no texto final.',
  '',
  'FORA DE ESCOPO: se a pergunta nao for sobre programacao/o exercicio, ou for',
  'impropria, responda com gentileza que so pode ajudar com o conteudo do curso',
  '(e, se couber, lembre que a pergunta gastou energia do mesmo jeito).',
].join('\n')

// montarPergunta: monta o texto que mandamos pra IA como se fosse a "fala do aluno"
// Junta a pergunta dele com o CONTEXTO do exercicio (enunciado, codigo,tipo) 
// Isso serve para a IA saber do que ele esta falando.
//
// IMPORTANTE (seguranca): so mandamos enunciado/codigo/tipo, NUNCA o gabarito
// Assim a IA nao tem como vazar a resposta, nem sem querer.
function montarPergunta({ pergunta, exercicio }) {
  // exercicio || {} = se vier vazio/undefined, usa um objeto vazio {} no lugar
  // (evita erro ao ler ex.enunciado de algo que nao existe).
  const ex = exercicio || {}
  // partes = uma lista de linhas; no fim a gente cola tudo com .join('\n').
  const partes = ['O aluno esta neste exercicio:']
  // .push(x) = adiciona x no fim da lista. So adiciona o campo se ele existir (if).
  if (ex.enunciado) partes.push('Enunciado: ' + ex.enunciado)
  if (ex.codigo) partes.push('Codigo mostrado:\n' + ex.codigo)
  if (ex.tipo) partes.push('Tipo de exercicio: ' + ex.tipo)
  // a '' cria uma linha em branco antes da pergunta. (pergunta || '') = se vier
  // vazia usa ''; .trim() tira espacos sobrando das pontas.
  partes.push('', 'Pergunta do aluno: ' + (pergunta || '').trim())
  return partes.join('\n')
}

// ---- Gemini (Google AI Studio) --------------------------------------------
// Chama a API do Gemini e devolve o TEXTO da resposta.
//
// "async" marca uma funcao que faz coisas DEMORADAS (falar com a internet) sem
// travar o resto. Dentro dela, "await" quer dizer "espera aqui ate isso chegar,
// e so entao segue". Sem o await, o codigo seguiria antes da resposta voltar.
async function callGemini({ pergunta, exercicio, apiKey, model }) {
  // model || 'gemini-flash-lite-latest' = usa o modelo do .env; se nao tiver, esse.
  const modelo = model || 'gemini-flash-lite-latest'
  // a URL do endpoint do Gemini. As crases `...` permitem enfiar ${modelo} dentro.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`
  // corpo = o objeto que o Gemini espera receber. system_instruction = as regras
  // do Albert; contents = a fala do aluno (role 'user'); generationConfig ajusta
  // a geracao (temperature = quao "criativa"; maxOutputTokens = tamanho maximo).
  const corpo = {
    system_instruction: { parts: [{ text: SISTEMA_ALBERT }] },
    contents: [{ role: 'user', parts: [{ text: montarPergunta({ pergunta, exercicio }) }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 700 },
  }
  // fetch = fazer uma requisicao HTTP (falar com outro servidor pela internet).
  //  - method: 'POST' = estamos ENVIANDO dados (nao so lendo).
  //  - headers = os "cabecalhos": o tipo do conteudo (JSON) e a CHAVE da API
  //    (x-goog-api-key). A chave vai no header, NUNCA na URL (URL aparece em logs).
  //  - body = o conteudo enviado. JSON.stringify transforma o objeto `corpo` num
  //    TEXTO em formato JSON (que e como ele viaja pela rede).
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(corpo),
  })
  // resp.ok = true quando deu certo (status 200-299). Se NAO deu certo, lemos o
  // texto do erro (so os primeiros 300 caracteres) e lancamos um erro.
  if (!resp.ok) {
    const txt = await resp.text().catch(() => '')
    throw new Error(`Gemini ${resp.status}: ${txt.slice(0, 300)}`)
  }
  // resp.json() transforma o texto JSON que voltou de volta num objeto JS.
  const data = await resp.json()
  // A resposta do Gemini vem ANINHADA (objeto dentro de objeto). O "?." (optional
  // chaining) le com seguranca: se qualquer pedaco do caminho faltar, da undefined
  // em vez de quebrar. candidates[0] = a 1a resposta; .content.parts = os pedacos
  // de texto; .map(p => p.text) pega o texto de cada pedaco; .join('') cola todos.
  // O "|| ''" no fim garante um texto (vazio) caso nao ache nada.
  const texto = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  // .trim() tira espacos das pontas; se sobrou vazio, a IA nao respondeu -> erro.
  if (!texto.trim()) throw new Error('Gemini: resposta vazia')
  return texto.trim()
}

// ---- Roteador --------------------------------------------------------------
// responderAlbert = a porta de entrada deste arquivo (o que o plugin chama).
// Decide QUAL IA usar (lendo o .env) e chama a funcao certa. Devolve um objeto
// { texto, provider }.
//
// env = process.env por padrao: "process.env" sao as variaveis de ambiente do processo Node
// O plugin passa pra ca um env que MISTURA o do sistema com o q leu do server/.env (onde fica API_KEY).
export async function responderAlbert({ pergunta, exercicio }, env = process.env) {
  // fornecedor vem do .env (IA_PROVIDER)
  // .toLowerCase() deixa tudo minusculo (aceita GEMINI, Gemini, gemini...).
  const provider = (env.IA_PROVIDER || 'gemini').toLowerCase()

  // 'mock' = modo de mentira (se der erro na api), pois devolve um texto fixo.
  if (provider === 'mock') {
    return { texto: '(mock) Ha um erro na API, isso precisa ser resolvido para eu funcionar, contate o suporte', provider }
  }
  // 'gemini' = o modo real. Precisa da chave; se nao tiver, lanca erro (e o front cai no mock dele)
  //  GEMINI_MODEL e opcional (callGemini tem um padrao).
  if (provider === 'gemini') {
    const apiKey = env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY ausente no server/.env')
    const texto = await callGemini({ pergunta, exercicio, apiKey, model: env.GEMINI_MODEL })
    return { texto, provider }
  }
  // qualquer outro valor nao esta ligado aqui (ex.: 'claude' foi tirado). 
  // Pra adicionar outro fornecedor, cria uma funcao call<Nome> e um if igual ao do Gemini.
  throw new Error('IA_PROVIDER desconhecido: ' + provider)
}
