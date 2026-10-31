// App - raiz da aplicacao (por enquanto)
// ---------------------------------------------
// Monta a trilha 1 e entrega ao Jogo (motor), que cuida do jogo e mostra o exercicio.
// Mais pra frente, aqui entram a abertura (quadrinho) e o catalogo de trilhas;
// por ora e so o motor com uma trilha fixa, pra ver um exercicio funcionando.
// ---------------------------------------------

import Jogo from './jogo/Jogo.jsx'
import trilha1 from './trilhas/logica/leitura.js'

export default function App() {
  // passa a trilha 1 pro motor; o motor mostra o primeiro exercicio dela
  return <Jogo trilha={trilha1} />
}
