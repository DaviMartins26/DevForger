// ============================================================================
// albertVitePlugin.mjs - plugin do Vite que vira o "backend" do Albert em DEV
// ----------------------------------------------------------------------------
// Um "plugin do Vite" e um pedacinho de codigo que a gente pendura no servidor
// Aqui usamos a rota via POST para /api/albert.
// Assim o chat de duvidas funciona com UM comando (npm run dev),
// sem precisar de um segundo servidor/terminal e sem CORS 
// a rota fica na mesma origem do front, entao o navegador nao reclama
//
// A chave da IA fica so aqui no servidor (node) nunca chega ao navegador.
// A logica de IA de verdade esta em iaProvider.mjs; este arquivo e so a "casca"
// HTTP: recebe a requisicao, chama responderAlbert() e devolve a resposta.
// ============================================================================

// imports de modulos nativos do Node (vem com ele, nao instala nada):
//  - readFileSync : le um arquivo do disco (de forma sincrona: espera ler e segue)
//  - fileURLToPath/dirname/join : ferramentas de CAMINHO de arquivo 
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
// traz a funcao que realmente fala com a IA 
import { responderAlbert } from './iaProvider.mjs'

// AQUI = o caminho da PASTA onde este arquivo esta (a pasta server/). Precisamos
// disso pra achar o server/.env ao lado, nao importa de onde o npm run dev rodou.
//  - import.meta.url = o endereco deste proprio arquivo (como uma URL file://)
//  - fileURLToPath   = transforma essa URL num caminho normal de disco
//  - dirname         = tira o nome do arquivo e deixa so a pasta
const AQUI = dirname(fileURLToPath(import.meta.url))

// carregarEnv: le o server/.env e devolve um objeto { CHAVE: valor }.
// E um parser (leitor) de .env le linha por linha.
function carregarEnv() {
  try {
    // le o arquivo .env (que fica ao lado, por isso join(AQUI, '.env')) como texto
    const bruto = readFileSync(join(AQUI, '.env'), 'utf8')
    const env = {}
    // .split('\n') quebra o texto numa lista de linhas (corta em cada quebra de linha)
    for (const linha of bruto.split('\n')) {
      const t = linha.trim() // tira espacos das pontas
      // pula linha vazia ou comentario (que comeca com #)
      if (!t || t.startsWith('#')) continue
      // acha a posicao do primeiro '=' (separa CHAVE de valor)
      const i = t.indexOf('=')
      if (i === -1) continue // sem '=' nao e uma config: ignora
      // slice(0, i) = o pedaco antes do '=' (a chave); slice(i + 1) = depois (o valor)
      env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
    }
    return env
  } catch {
    // deu erro (ex.: o .env sumiu) -> devolve {} vazio, e sem a chave
    // o responderAlbert vai lancar erro mais tarde e o front cai no mock.
    return {}
  }
}

// lerCorpo: le o CORPO (o conteudo) de uma requisicao que chega. 
// Numa requisicao HTTP, o corpo nao vem de uma vez: chega em PEDACOS (chunks) pela rede 
// Por isso a gente "escuta" esses pedacos e vai juntando, e so no fim converte de texto JSON pra objeto.
//
// Devolve uma PROMISE: um valor que fica "pronto depois". Quem chama usa await.
//  - resolve(x) = deu certo, entrega x
//  - reject(e)  = deu errado, com o erro e
function lerCorpo(req) {
  return new Promise((resolve, reject) => {
    let dados = ''
    // req.on('data', ...) = "toda vez que chegar um pedaco, roda isto"
    req.on('data', (c) => {
      dados += c
      // trava de seguranca: se passar de 100 mil caracteres, corta (evita abuso)
      if (dados.length > 100_000) reject(new Error('corpo grande demais'))
    })
    // req.on('end', ...) = "acabou de chegar tudo": agora converte o texto em objeto.
    req.on('end', () => {
      try {
        // JSON.parse transforma o TEXTO json de volta num objeto JS. Se vier vazio, usa {}.
        resolve(dados ? JSON.parse(dados) : {})
      } catch (e) {
        reject(e) // json invalido -> rejeita
      }
    })
    // req.on('error', ...) = se der erro na rede no meio, rejeita a promise.
    req.on('error', reject)
  })
}

// albertDevApi: a funcao que o vite.config.js chama (albertDevApi()) e poe na lista de plugins
// Ela devolve um OBJETO de plugin que o Vite entende.
export function albertDevApi() {
  return {
    name: 'devforge-albert-dev-api', // so um nome pra identificar o plugin
    // configureServer roda UMA vez, quando o dev server sobe. "server" e o servidor.
    configureServer(server) {
      // middlewares.use(caminho, handler) = "registra um atendente pra esse caminho".
      // A partir daqui, toda requisicao pra /api/albert passa por esta funcao.
      //  - req  = a requisicao que chegou (o pedido do navegador)
      //  - res  = a resposta que a gente vai devolver
      //  - next = "passa pro proximo atendente" (quando nao e com a gente)
      server.middlewares.use('/api/albert', async (req, res, next) => {
        // so tratamos POST (que e o que o front usa pra enviar a pergunta)
        //  Qualquer outro metodo (GET,etc) a gente deixa passar pro Vite cuidar.
        if (req.method !== 'POST') return next()
        // avisamos que a resposta e JSON (em UTF-8, pra acentos/emojis funcionarem)
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        try {
          // le o corpo e tira de dentro a pergunta e o exercicio (desestruturacao)
          const { pergunta, exercicio } = await lerCorpo(req)
          // sem pergunta valida -> responde 400 (Bad Request) e para por aqui.
          if (!pergunta || !String(pergunta).trim()) {
            res.statusCode = 400
            return res.end(JSON.stringify({ erro: 'pergunta vazia' }))
          }
          // monta o ambiente: as variaveis do sistema + as do server/.env 
          const env = { ...process.env, ...carregarEnv() }
          // chama o cerebro (iaProvider): ele decide a IA e devolve { texto, provider }.
          const { texto, provider } = await responderAlbert({ pergunta, exercicio }, env)
          // deu certo: status 200 e devolve o texto da IA como JSON.
          res.statusCode = 200
          res.end(JSON.stringify({ texto, provider }))
        } catch (e) {
          // deu errado no processo  responde 503
          // O front enxerga esse 503 e cai no mock do Albert entao o chat nunca quebra 
          // so avisa que a IA real nao respondeu.
          res.statusCode = 503
          res.end(JSON.stringify({ erro: String(e.message || e) }))
        }
      })
    },
  }
}
