// ============================================================================
// albert.js - cliente do chat de duvidas (front -> backend -> IA)
// ----------------------------------------------------------------------------
// UNICO ponto de contato do front com a IA. A TelaChat chama perguntarAlbert();
// aqui a gente fala com POST /api/albert (o backend que esconde a chave e chamao Gemini)
// Se o backend estiver fora do ar ou sem chave, caimos num MOCK local
// o chat nunca quebra, so avisa que a IA real nao respondeu.
//
// Trocar o fornecedor de IA NAO mexe neste arquivo: isso e decidido no server/.env
// ============================================================================

const URL_ALBERT = '/api/albert'

// So mandamos enunciado/codigo/tipo pro backend - NUNCA o gabarito (respostas,
// opcoes certas), pra IA nao ter como vazar a resposta do exercicio.
function resumoExercicio(ex) {
  if (!ex) return {}
  return { enunciado: ex.enunciado, codigo: ex.codigo, tipo: ex.tipo }
}

// Aberturas do Albert usadas SO no mock (quando a IA real nao responder).
const MOCK_ABERTURAS = [
  'Boa pergunta, jovem aprendiz.',
  'Hmm. Deixa este velho circuito pensar...',
  'Entendo tua dúvida.',
  'Já processei muitos bugs em meus longos ciclos.',
]
function sortear(lista) {
  return lista[Math.floor(Math.random() * lista.length)]
}

// Resposta de reserva (mock) quando o backend nao responde. Honesta: avisa que
// a IA de verdade esta fora, sem fingir que respondeu.
export function respostaMockAlbert() {
  return (
    sortear(MOCK_ABERTURAS) +
    ' Acompanhe o código linha por linha e teste com um exemplo pequeno, costuma' +
    ' revelar o ponto. (A IA de verdade está offline agora contate o suporte)'
  )
}

// Pergunta ao Albert de verdade. Resolve com o texto da IA; em qualquer falha
// (rede, 503 sem chave, 4xx), lanca - quem chama usa respostaMockAlbert().
export async function perguntarAlbert({ pergunta, exercicio }) {
  const resp = await fetch(URL_ALBERT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pergunta, exercicio: resumoExercicio(exercicio) }),
  })
  if (!resp.ok) throw new Error('Albert indisponivel (' + resp.status + ')')
  const data = await resp.json()
  if (!data?.texto) throw new Error('Albert: resposta vazia')
  return data.texto
}
