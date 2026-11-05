// ============================================================================
// TelaConclusao.jsx - Tela de fim da trilha
// ----------------------------------------------------------------------------
// Aparece quando o aluno passa do ultimo exercicio (o motor marca finalizado).
// So desenha: mostra o XP final e as vidas que sobraram, e deixa recomecar (ou
// voltar ao catalogo, quando houver).
// ============================================================================

export default function TelaConclusao({ xpTotal, vidas, aoRecomecar, aoVoltar }) {
  return (
    <main>
      <h1>DevForge</h1>
      <h2>Trilha concluída!</h2>
      <p>Você chegou ao fim da trilha. Mandou bem!</p>
      <p>XP final: {xpTotal}</p>
      <p>Vidas restantes: {vidas}</p>
      <p>
        <button type="button" onClick={aoRecomecar}>Recomeçar</button>{' '}
        {aoVoltar && <button type="button" onClick={aoVoltar}>Voltar ao catálogo</button>}
      </p>
    </main>
  )
}
