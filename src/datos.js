// Bruto necesario por refinado, por tier (de ao-bin-dumps items.xml). Cada refinado además consume 1 refinado del tier anterior.
export const BRUTO_POR_TIER = { 2: 1, 3: 2, 4: 2, 5: 3, 6: 4, 7: 5, 8: 5 }

// Fama base por refinado plano (sin bonos), verificada en albiononline2d. Tiers con spec: T4-T8.
// El encantamiento no la duplica entera, ver famaPorRefinado en calculo.js.
export const FAMA_POR_REFINADO = { 4: 22.5, 5: 90, 6: 270, 7: 645, 8: 1395 }

export const RAMAS = [
  { id: 'madera', nombre: 'Madera', bruto: 'Madera', refinado: 'Tablones', itemBruto: 'WOOD', itemRefinado: 'PLANKS' },
  { id: 'pieles', nombre: 'Pieles', bruto: 'Piel', refinado: 'Cuero', itemBruto: 'HIDE', itemRefinado: 'LEATHER' },
  { id: 'mineral', nombre: 'Mineral', bruto: 'Mineral', refinado: 'Barras de metal', itemBruto: 'ORE', itemRefinado: 'METALBAR' },
  { id: 'fibra', nombre: 'Fibra', bruto: 'Fibra', refinado: 'Tela', itemBruto: 'FIBER', itemRefinado: 'CLOTH' },
  { id: 'piedra', nombre: 'Piedra', bruto: 'Piedra', refinado: 'Bloques de piedra', itemBruto: 'ROCK', itemRefinado: 'STONEBLOCK' },
]

export const ENCANTAMIENTOS = [0, 1, 2, 3, 4]

export const BONO_PREMIUM = 50
