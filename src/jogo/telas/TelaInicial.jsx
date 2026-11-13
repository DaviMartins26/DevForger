// ============================================================================
// TelaInicial.jsx - Tela de entrada (apresenta o projeto)
// ----------------------------------------------------------------------------
// E a PRIMEIRA tela: explica, em poucas linhas, o que e o projeto, e tem um
// botao "Comecar" que leva pra historia (a abertura em quadrinho). So desenha;
// o App decide o que vem depois (recebe aoComecar por prop).
// ============================================================================

export default function TelaInicial({ aoComecar }) {
  return (
    <main>
      <h1>DevForge</h1>
      <div className="cat-card">
        <h2>Projeto de TCC</h2>
        <p>
          Este é um MVP (produto mínimo viável) para o TCC I de Engenharia de
          Software da PUCPR. Uma plataforma web gamificada que ensina lógica de
          programação por meio de uma história interativa, conduzida pela Lari.
        </p>
        <p>
          Autores: Davi Noel Martins Mundt, Giovani Tortato e Joshua Mendes.
          Orientadores: Sofia Marshallowitz e Tiago Navarro.
        </p>
        <button type="button" className="df-primario" onClick={aoComecar}>
          Começar
        </button>
      </div>
    </main>
  )
}
