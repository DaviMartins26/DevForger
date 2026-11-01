// ============================================================================
// trilhas/index.js - catalogo do bloco (a lista de trilhas que a TelaCatalogo mostra)
// ----------------------------------------------------------------------------
// Junta as trilhas num so lugar. Por enquanto so a Trilha 1 (Leitura de Codigo);
// pra adicionar outra, importe o arquivo dela e coloque no array `trilhas`.
// O App usa `bloco` (titulo/descricao do catalogo) e `trilhas` (a lista).
// ============================================================================

import leitura from './logica/leitura.js'

// dados do "bloco" mostrados no topo do catalogo
export const bloco = {
  titulo: 'Bloco de Logica de Programacao',
  descricao: 'Trilhas de exercicios em Python, comecando pela leitura de codigo.',
}

// a lista de trilhas do catalogo (a ordem aqui e a ordem na tela)
export const trilhas = [leitura]
