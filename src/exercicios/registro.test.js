import { describe, it, expect } from 'vitest'
import { verificar } from './registro.jsx'
import leitura from '../trilhas/logica/leitura.js'

const ex = (id) => leitura.exercicios.find((e) => e.id === id)

const casos = [
  { id: 'ex1', certa: ['8', '15'], errada: ['8', '16'] },
  { id: 'ex2', certa: 0, errada: 1 },
  { id: 'ex3', certa: ['a = 2', 'b = 3', 'total = a + b', 'print(total)'], errada: ['print(total)', 'total = a + b', 'a = 2', 'b = 3'] },
  { id: 'ex4', certa: 'a + b', errada: 'a - b' },
  { id: 'ex5', certa: 0, errada: 1 },
  { id: 'ex6', certa: ['b = int(input())', 'a = int(input())', 'media = (a + b) / 2', 'print(media)'], errada: ['a = int(input())', 'media = (a + b) / 2', 'b = int(input())', 'print(media)'] },
  { id: 'ex7', certa: ['10'], errada: ['7'] },
  { id: 'ex8', certa: ['7', '10', '6', '2'], errada: ['7', '10', '6', '12'] },
]

describe('verificar() com a trilha de Leitura', () => {
  it('cobre os 8 exercícios da trilha', () => {
    expect(leitura.exercicios).toHaveLength(8)
  })

  for (const { id, certa, errada } of casos) {
    it(`${id} (${ex(id).tipo}) aceita a resposta certa`, () => {
      expect(verificar(ex(id), certa)).toBe(true)
    })

    it(`${id} (${ex(id).tipo}) recusa a resposta errada`, () => {
      expect(verificar(ex(id), errada)).toBe(false)
    })
  }

  it('tipo inexistente retorna false sem quebrar', () => {
    expect(verificar({ tipo: 'naoExiste' }, 'qualquer')).toBe(false)
  })
})
