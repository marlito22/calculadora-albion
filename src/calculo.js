import { BRUTO_POR_TIER, FAMA_POR_REFINADO } from './datos.js'
import { FAMA_NIVEL } from './famaNiveles.js'
import { FAMA_NIVEL_CRAFTEO, FAMA_POR_MATERIAL } from './datosCrafteo.js'

// Fama que falta para pasar del nivel `nivel` al `meta`, descontando lo ya acumulado dentro del nivel actual.
export function famaRestante(tier, nivel, acumulada = 0, tabla = FAMA_NIVEL[tier], meta = 100) {
  const total = tabla.slice(nivel, meta).reduce((a, b) => a + b, 0)
  return Math.max(0, total - acumulada)
}

export const famaRestanteCrafteo = (nivel, acumulada, meta) => famaRestante(null, nivel, acumulada, FAMA_NIVEL_CRAFTEO, meta)

// Las esencias de criatura (ALCHEMY_RARE) son como los artefactos: ni dan fama ni devuelven retorno (confirmado en juego).
const esEsencia = ([item]) => item.includes('_ALCHEMY_RARE_')

// Fama de un crafteo (toda la tanda): materiales de la receta por la fama por material de comidas o pociones.
export const famaPorCrafteo = (tipo, receta) =>
  receta.ing.filter((i) => !esEsencia(i)).reduce((a, [, n]) => a + n, 0) * FAMA_POR_MATERIAL[tipo]

export const crafteosNecesarios = (fama, famaCrafteo, bonoPct = 0) => Math.ceil(fama / (famaCrafteo * (1 + bonoPct / 100)))

// Ingredientes totales de `crafteos` tandas; el retorno solo baja los que no son esencias.
export const ingredientes = (receta, crafteos, retorno = 0) =>
  receta.ing.map((i) => [i[0], Math.ceil(crafteos * i[1] * (esEsencia(i) ? 1 : 1 - retorno))])

// Cuántos crafteos completos (tandas de receta.n unidades) alcanzan con lo que se tiene; `tengo` = { id: cantidad }.
// Con retorno cada material (menos esencias) rinde más. limitante = material que se agota primero.
export function crafteosPosibles(receta, tengo, retorno = 0) {
  let crafteos = Infinity, limitante = null
  for (const i of receta.ing) {
    const gasto = i[1] * (esEsencia(i) ? 1 : 1 - retorno)
    const x = Math.floor((tengo[i[0]] || 0) / gasto + 1e-9) // 1e-9: 0,7*10 no debe dar 6,99
    if (x < crafteos) [crafteos, limitante] = [x, i[0]]
  }
  return { crafteos, limitante }
}

// Bono local 18 + foco 59 + ciudad de la rama 40 (igual que la fórmula de retorno de crafteo).
export function tasaRetorno({ foco, ciudad }) {
  const lpb = 18 + (foco ? 59 : 0) + (ciudad ? 40 : 0)
  return 1 - 1 / (1 + lpb / 100)
}

// Fama de un refinado: cada refinado consume el del tier anterior del mismo encantamiento, salvo el T3 que no
// se encanta (7,5 fijos); el resto se duplica por encantamiento. T4: 22,5 / 37,5 / 67,5 / 127,5 / 247,5; T6.1: 532,5.
// shortcut: verificado en albiononline2d con tablones T4 (.0-.4) y T6.1 y con barras T6; la piedra falta por comprobar.
export const famaPorRefinado = (tier, encantamiento = 0) => 7.5 + (FAMA_POR_REFINADO[tier] - 7.5) * 2 ** encantamiento

// Refinados del tier objetivo para juntar la fama; bonoPct = bono de fama (premium, etc.).
export function refinadosNecesarios(tier, fama, encantamiento = 0, bonoPct = 0) {
  return Math.ceil(fama / (famaPorRefinado(tier, encantamiento) * (1 + bonoPct / 100)))
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
