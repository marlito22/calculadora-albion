import test from 'node:test'
import assert from 'node:assert/strict'
import { famaRestante, refinadosNecesarios, materiales, tasaRetorno } from './calculo.js'

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
  assert.equal(refinadosNecesarios(4, 225, 1), 5)
  assert.equal(refinadosNecesarios(4, 225, 0, 50), 7)
})

test('fama total a nivel 100 coincide con la tabla publicada', () => {
  assert.deepEqual([4, 5, 6, 7, 8].map((t) => famaRestante(t, 0)), [2900810, 3976767, 7328579, 19980828, 21915828])
  assert.equal(famaRestante(4, 99), 79550)
  assert.equal(famaRestante(4, 99, 100000), 0)
})
