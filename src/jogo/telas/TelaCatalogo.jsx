// ============================================================================
// TelaCatalogo.jsx - Escolha da trilha (catalogo do bloco)
// ----------------------------------------------------------------------------
// Lista as trilhas do bloco pra o usuario escolher qual jogar. Tela "burra":
// recebe o bloco, as trilhas e o callback aoEscolher (chamado com o id da trilha
// clicada). Quem decide o que fazer com essa escolha e o App.
// ============================================================================

export default function TelaCatalogo({ bloco, trilhas, aoEscolher }) {
  return (
    <main>
      <h1>DevForge</h1>
      <h2>{bloco.titulo}</h2>
      <p>{bloco.descricao}</p>

      {/* uma "lista" de cards, um por trilha. O .map percorre as trilhas e devolve
          um <li> pra cada uma. key={trilha.id} ajuda o React a controlar a lista. */}
      <ul className="cat-lista">
        {trilhas.map((trilha, i) => (
          <li key={trilha.id} className="cat-card">
            <h3>
              {i + 1}. {trilha.titulo}{' '}
              <small>({trilha.exercicios.length} exercícios)</small>
            </h3>
            <p>{trilha.descricao}</p>
            {/* ao clicar, avisa o App qual trilha foi escolhida (pelo id) */}
            <button type="button" className="df-primario" onClick={() => aoEscolher(trilha.id)}>
              Começar
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
