// ============================================================================
// albert.mjs - Azure Function que serve POST /api/albert em PRODUCAO
// ----------------------------------------------------------------------------
// Em Azure Static Web Apps NAO existe o dev server do Vite, entao o
// plugin (server/albertVitePlugin.mjs) nao vai funcionar la.
// Esta function vai atender o albert na nuvem  pois ele faz o mesmo que
// o plugin, mas no formato do Azure Functions (Node v4),
// e reusa o mesmo cerebro (iaProvider.mjs)
//
// A chave de api nao preisa ficar no env, ela fica nas Variaveis de ambiente do Azure
// Sem chave no site retorna erro 503, e o front cai no mock tambem
//
// A rota app.http('albert', { route: 'albert' }) vira /api/albert automaticamente
// no Static Web Apps do azure 
// ============================================================================

import { app } from '@azure/functions'
import { responderAlbert } from '../../shared/iaProvider.mjs'

// registra a funcao "albert": responde a POST, sem exigir login (anonymous).
app.http('albert', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'albert',
  // handler = o que roda a cada requisicao. request = o pedido; context = utilidades
  // do Azure (log, etc). async porque falamos com a IA (await).
  handler: async (request, context) => {
    try {
      // request.json() le o corpo JSON; .catch(() => ({})) usa {} se vier vazio/invalido
      const body = await request.json().catch(() => ({}))
      const { pergunta, exercicio } = body || {}
      // sem pergunta valida -> 400 (Bad Request). jsonBody ja devolve como JSON.
      if (!pergunta || !String(pergunta).trim()) {
        return { status: 400, jsonBody: { erro: 'pergunta vazia' } }
      }
      // chama o cerebro com as variaveis de ambiente do Azure 
      const { texto, provider } = await responderAlbert({ pergunta, exercicio }, process.env)
      return { status: 200, jsonBody: { texto, provider } }
    } catch (e) {
      context.error('Albert falhou:', e)
      // 503 = IA indisponivel (sem chave, erro de rede) o front vai usar o mock.
      return { status: 503, jsonBody: { erro: String(e?.message || e) } }
    }
  },
})
