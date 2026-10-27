import test from 'node:test'
import assert from 'node:assert/strict'
import { famaPorRefinado, famaRestante, refinadosNecesarios, materiales, tasaRetorno, famaRestanteCrafteo, famaPorCrafteo, crafteosNecesarios, ingredientes, crafteosPosibles, nivelAlcanzado } from './calculo.js'
import { CRAFTEO } from './datosCrafteo.js'

test('T6: 100 refinados sin retorno piden 400 bruto T6, 300 T5, 200 T4, 200 T3 y 100 T2', () => {
  const filas = materiales(6, 100)
  assert.deepEqual(filas.map((f) => f.bruto), [100, 200, 200, 300, 400])
  assert.deepEqual(filas.map((f) => f.tier), [2, 3, 4, 5, 6])
})

test('con retorno 50% cada escalón gasta la mitad', () => {
  const filas = materiales(3, 100, 0.5)
  assert.deepEqual(filas.map((f) => [f.refinado, f.bruto]), [[50, 25], [100, 100]])
})

test('tasa de retorno coincide con albiondatabase', () => {
  const r = (o) => Number((tasaRetorno(o) * 100).toFixed(1))
  assert.deepEqual([r({}), r({ foco: true }), r({ ciudad: true }), r({ foco: true, ciudad: true })], [15.3, 43.5, 36.7, 53.9])
})

test('refinadosNecesarios redondea hacia arriba, aplica encantamiento y bono', () => {
  assert.equal(refinadosNecesarios(4, 225), 10)
  assert.equal(refinadosNecesarios(4, 226), 11)
  assert.equal(refinadosNecesarios(4, 225, 1), 6) // .1 da 37,5 de fama, no 45
  assert.equal(refinadosNecesarios(4, 225, 0, 50), 7)
})

test('fama total a nivel 100 coincide con la tabla publicada', () => {
  assert.deepEqual([4, 5, 6, 7, 8].map((t) => famaRestante(t, 0)), [2900810, 3976767, 7328579, 19980828, 21915828])
  assert.equal(famaRestante(4, 99), 79550)
  assert.equal(famaRestante(4, 99, 100000), 0)
})

test('cocina y alquimia: fama a nivel 100, fama por crafteo y materiales (las esencias no dan fama ni retorno)', () => {
  assert.equal(famaRestanteCrafteo(0), 2017942)
  const guiso = CRAFTEO.comidas.find((r) => r.id === 'guiso').recetas[4]
  assert.equal(famaPorCrafteo('comidas', guiso), 160) // 16 materiales x 10, como albiononline2d
  assert.equal(famaPorCrafteo('comidas', CRAFTEO.comidas.find((r) => r.id === 'guiso').recetas[8]), 1440)
  assert.equal(famaPorCrafteo('pociones', CRAFTEO.pociones[0].recetas[6]), 2160) // 108 materiales x 20
  assert.equal(crafteosNecesarios(320, 160), 2)
  assert.equal(crafteosNecesarios(320, 160, 50), 2)
  assert.equal(crafteosNecesarios(480, 160, 50), 2)
  assert.deepEqual(ingredientes(guiso, 10, 0.5), [['T4_TURNIP', 20], ['T4_BREAD', 20], ['T4_MEAT', 40]])
  const calma = CRAFTEO.pociones.find((r) => r.id === 'calma').recetas[3]
  assert.equal(famaPorCrafteo('pociones', calma), 16 * 20)
  assert.deepEqual(ingredientes(calma, 4, 0.5), [['T3_ALCHEMY_RARE_PANTHER', 4], ['T3_COMFREY', 32]])
})

test('fama por refinado coincide con albiononline2d: plano T4-T8, tablones T4 encantados y T6.1', () => {
  assert.deepEqual([4, 5, 6, 7, 8].map((t) => famaPorRefinado(t)), [22.5, 90, 270, 645, 1395])
  assert.deepEqual([0, 1, 2, 3, 4].map((e) => famaPorRefinado(4, e)), [22.5, 37.5, 67.5, 127.5, 247.5])
  assert.equal(famaPorRefinado(6, 1), 532.5)
})

test('fama de un tramo parcial: del 50 al 70 es la diferencia entre faltar desde el 50 y desde el 70', () => {
  assert.equal(famaRestante(4, 50, 0, undefined, 70), famaRestante(4, 50) - famaRestante(4, 70))
  assert.equal(famaRestanteCrafteo(50, 0, 70), famaRestanteCrafteo(50) - famaRestanteCrafteo(70))
  assert.equal(famaRestante(4, 50, 100000, undefined, 70) > 0, true)
})

test('crafteosPosibles: manda el material más escaso, el retorno rinde más y faltar uno da 0', () => {
  const guiso = CRAFTEO.comidas.find((r) => r.id === 'guiso').recetas[4] // 4 rábano, 4 pan, 8 carne
  assert.deepEqual(crafteosPosibles(guiso, { T4_TURNIP: 40, T4_BREAD: 40, T4_MEAT: 79 }), { crafteos: 9, limitante: 'T4_MEAT' })
  assert.equal(crafteosPosibles(guiso, { T4_TURNIP: 40, T4_BREAD: 40, T4_MEAT: 80 }, 0.5).crafteos, 20)
  assert.deepEqual(crafteosPosibles(guiso, { T4_TURNIP: 40, T4_BREAD: 40 }), { crafteos: 0, limitante: 'T4_MEAT' })
  const calma = CRAFTEO.pociones.find((r) => r.id === 'calma').recetas[3] // esencia: sin retorno
  assert.equal(crafteosPosibles(calma, { T3_ALCHEMY_RARE_PANTHER: 3, T3_COMFREY: 999 }, 0.5).crafteos, 3)
})

test('nivelAlcanzado: suma lo acumulado, cruza niveles y se detiene en 100', () => {
  assert.deepEqual(nivelAlcanzado(0, 0, 1781), { nivel: 0, sobra: 1781 })
  assert.deepEqual(nivelAlcanzado(0, 1, 1781), { nivel: 1, sobra: 0 })
  assert.deepEqual(nivelAlcanzado(0, 0, 1782 + 1892 + 5), { nivel: 2, sobra: 5 })
  assert.deepEqual(nivelAlcanzado(0, 0, famaRestanteCrafteo(0) + 999), { nivel: 100, sobra: 0 })
  assert.deepEqual(nivelAlcanzado(30, 0, 12345), { nivel: 31, sobra: 5205 }) // 12345 - 7140 (nivel 30→31)
})
