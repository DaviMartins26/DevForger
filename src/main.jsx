// main.jsx - Ponto de entrada da aplicacao React
// --------------------------
// O Vite carrega este arquivo a partir de index.html (<script type="module">).
// Aqui o React "monta" o componente raiz (App) dentro da div #root da pagina.

import React from 'react'
import { createRoot } from 'react-dom/client' // API de montagem do React 18
import App from './App.jsx' // componente raiz (controla toda a tela)
import './styles.css' // estilo minimo global

// createRoot cria a raiz do React na div #root (definida em index.html) e
// render() desenha o App ali dentro.
// <React.StrictMode> e um "modo estrito" so de desenvolvimento: executa parte
// da logica duas vezes para ajudar a achar bugs. Nao afeta a versao final.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
