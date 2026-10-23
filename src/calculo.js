import { BRUTO_POR_TIER, FAMA_POR_REFINADO } from './datos.js'
import { FAMA_NIVEL } from './famaNiveles.js'

// Fama que falta para llegar al nivel 100, descontando lo ya acumulado dentro del nivel actual.
export function famaRestante(tier, nivel, acumulada = 0) {
  const total = FAMA_NIVEL[tier].slice(nivel).reduce((a, b) => a + b, 0)
  return Math.max(0, total - acumulada)
}

// Bono local 18 + foco 59 + ciudad de la rama 40 (igual que la fórmula de retorno de crafteo).
export function tasaRetorno({ foco, ciudad }) {
  const lpb = 18 + (foco ? 59 : 0) + (ciudad ? 40 : 0)
  return 1 - 1 / (1 + lpb / 100)
}

// Refinados del tier objetivo para juntar la fama; bonoPct = bono de fama (premium, etc.).
export function refinadosNecesarios(tier, fama, encantamiento = 0, bonoPct = 0) {
  return Math.ceil(fama / (FAMA_POR_REFINADO[tier] * 2 ** encantamiento * (1 + bonoPct / 100)))
}

// Una fila por tier desde T2. Cada refinado gasta (1 - retorno) de sus ingredientes, y el refinado
// del tier inferior hay que fabricarlo antes, así que las cantidades bajan con el retorno en cada escalón.
export function materiales(tier, refinados, retorno = 0) {
  const filas = []
  for (let t = tier; t >= 2; t--) {
    const refinado = refinados * (1 - retorno) ** (tier - t)
    filas.unshift({ tier: t, bruto: Math.ceil(refinado * BRUTO_POR_TIER[t] * (1 - retorno)), refinado: Math.ceil(refinado) })
  }
  return filas
}
