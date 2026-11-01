// ============================================================================
// TelaLicaoInterrompida.jsx - Tela de "acabaram as vidas"
// ----------------------------------------------------------------------------
// Aparece quando as vidas chegam a 0 (quem decide isso e o motor, Jogo.jsx).
// So desenha: mostra o XP que o aluno juntou e deixa recomecar a trilha (ou
// voltar ao catalogo, quando houver).
// ============================================================================

export default function TelaLicaoInterrompida({ xpTotal, aoRecomecar, aoVoltar }) {
  return (
    <main>
      <h1>DevForge</h1>
      <h2>Licao interrompida</h2>
      <p>Suas vidas acabaram por agora. Sem pressa: da pra recomecar e tentar de novo.</p>
      <p>XP conquistado: {xpTotal}</p>
      <p>
        <button type="button" onClick={aoRecomecar}>Recomecar</button>{' '}
        {/* so mostra o voltar SE o App passou a funcao aoVoltar */}
        {aoVoltar && <button type="button" onClick={aoVoltar}>Voltar ao catalogo</button>}
      </p>
    </main>
  )
}
