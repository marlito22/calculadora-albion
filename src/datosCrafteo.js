// Cocina y alquimia (de ao-bin-dumps items.xml y localization.xml). Cada rama es un nodo del Tablero del Destino
// y los 25 nodos comparten esta tabla: fama para pasar del nivel i al i+1 (i = índice).
// Fuente: albiondatabase.com/tools/fame-calculator (nodos FARM_COOK_* y FARM_ALCHEMIST_*).
export const FAMA_NIVEL_CRAFTEO = [1782,1892,2004,2120,2240,2364,2494,2626,2762,2904,3050,3200,3356,3516,3682,3852,4028,4210,4396,4588,4788,4992,5204,5422,5646,5876,6114,6360,6612,6872,7140,7416,7700,7992,8294,8604,8922,9250,9588,9936,10294,10662,11040,11430,11830,12242,12666,13102,13552,14012,14486,14974,15474,15990,16520,17064,17624,18198,18790,19396,20020,20662,21322,21998,22694,23408,24142,24898,25672,26468,27284,28124,28986,29872,30780,31714,32674,33658,34668,35706,36770,37864,38986,40138,41322,42536,43782,45060,46372,47720,49102,50520,51976,53470,55002,56574,58188,59844,61542,63284]

// Fama por material de la receta, igual en todos los tiers (medida en albiononline2d con guiso T4/T6/T8, pastel T5,
// curación T6, gigantismo T5 y berserker T4). Las esencias de criatura no dan fama (berserker T4: 320 con 16 materiales).
export const FAMA_POR_MATERIAL = { comidas: 10, pociones: 20 }

// recetas[tier] = { n: unidades por crafteo, ing: [[item, cantidad]] }. Solo ingredientes directos, sin procesar.
// shortcut: sin encantamientos ni variantes de pescado/Avalon, se agregan si hacen falta.
export const CRAFTEO = {
  comidas: [
    { id: 'sopa', nombre: 'Sopa', item: 'MEAL_SOUP', recetas: {
      3: { n: 10, ing: [['T3_WHEAT', 48]] },
      5: { n: 10, ing: [['T5_CABBAGE', 144]] },
    } },
    { id: 'ensalada', nombre: 'Ensalada', item: 'MEAL_SALAD', recetas: {
      2: { n: 10, ing: [['T2_BEAN', 8], ['T1_CARROT', 8]] },
      4: { n: 10, ing: [['T4_TURNIP', 24], ['T3_WHEAT', 24]] },
      6: { n: 10, ing: [['T6_POTATO', 72], ['T5_CABBAGE', 72]] },
    } },
    { id: 'pastel', nombre: 'Pastel', item: 'MEAL_PIE', recetas: {
      3: { n: 10, ing: [['T3_WHEAT', 2], ['T3_FLOUR', 4], ['T3_MEAT', 8]] },
      5: { n: 10, ing: [['T5_CABBAGE', 6], ['T3_FLOUR', 12], ['T5_MEAT', 24], ['T4_MILK', 6]] },
      7: { n: 10, ing: [['T7_CORN', 18], ['T3_FLOUR', 36], ['T7_MEAT', 72], ['T6_MILK', 18]] },
    } },
    { id: 'tortilla', nombre: 'Tortilla', item: 'MEAL_OMELETTE', recetas: {
      3: { n: 10, ing: [['T3_WHEAT', 4], ['T3_MEAT', 8], ['T3_EGG', 2]] },
      5: { n: 10, ing: [['T5_CABBAGE', 12], ['T5_MEAT', 24], ['T5_EGG', 6]] },
      7: { n: 10, ing: [['T7_CORN', 36], ['T7_MEAT', 72], ['T5_EGG', 18]] },
    } },
    { id: 'guiso', nombre: 'Guiso', item: 'MEAL_STEW', recetas: {
      4: { n: 10, ing: [['T4_TURNIP', 4], ['T4_BREAD', 4], ['T4_MEAT', 8]] },
      6: { n: 10, ing: [['T6_POTATO', 12], ['T4_BREAD', 12], ['T6_MEAT', 24]] },
      8: { n: 10, ing: [['T8_PUMPKIN', 36], ['T4_BREAD', 36], ['T8_MEAT', 72]] },
    } },
    { id: 'asado', nombre: 'Asado', item: 'MEAL_ROAST', recetas: {
      3: { n: 10, ing: [['T3_MEAT', 8], ['T2_BEAN', 4], ['T4_MILK', 4]] },
      5: { n: 10, ing: [['T5_MEAT', 24], ['T5_CABBAGE', 12], ['T6_MILK', 12]] },
      7: { n: 10, ing: [['T7_MEAT', 72], ['T7_CORN', 36], ['T8_MILK', 36]] },
    } },
    { id: 'bocadillo', nombre: 'Bocadillo', item: 'MEAL_SANDWICH', recetas: {
      4: { n: 10, ing: [['T4_BREAD', 4], ['T4_MEAT', 8], ['T4_BUTTER', 2]] },
      6: { n: 10, ing: [['T4_BREAD', 12], ['T6_MEAT', 24], ['T6_BUTTER', 6]] },
      8: { n: 10, ing: [['T4_BREAD', 36], ['T8_MEAT', 72], ['T8_BUTTER', 18]] },
    } },
  ],
  pociones: [
    { id: 'curacion', nombre: 'Curación', item: 'POTION_HEAL', recetas: {
      2: { n: 5, ing: [['T2_AGARIC', 8]] },
      4: { n: 5, ing: [['T4_BURDOCK', 24], ['T3_EGG', 6]] },
      6: { n: 5, ing: [['T6_FOXGLOVE', 72], ['T5_EGG', 18], ['T6_ALCOHOL', 18]] },
    } },
    { id: 'energia', nombre: 'Energía', item: 'POTION_ENERGY', recetas: {
      2: { n: 5, ing: [['T2_AGARIC', 8]] },
      4: { n: 5, ing: [['T4_BURDOCK', 24], ['T4_MILK', 6]] },
      6: { n: 5, ing: [['T6_FOXGLOVE', 72], ['T6_MILK', 18], ['T6_ALCOHOL', 18]] },
    } },
    { id: 'gigantismo', nombre: 'Gigantismo', item: 'POTION_REVIVE', recetas: {
      3: { n: 5, ing: [['T3_COMFREY', 8]] },
      5: { n: 5, ing: [['T5_TEASEL', 24], ['T4_BURDOCK', 12], ['T5_EGG', 6]] },
      7: { n: 5, ing: [['T7_MULLEIN', 72], ['T6_FOXGLOVE', 36], ['T5_EGG', 18], ['T7_ALCOHOL', 18]] },
    } },
    { id: 'resistencia', nombre: 'Resistencia', item: 'POTION_STONESKIN', recetas: {
      3: { n: 5, ing: [['T3_COMFREY', 8]] },
      5: { n: 5, ing: [['T5_TEASEL', 24], ['T4_BURDOCK', 12], ['T4_MILK', 6]] },
      7: { n: 5, ing: [['T7_MULLEIN', 72], ['T6_FOXGLOVE', 36], ['T4_BURDOCK', 36], ['T6_MILK', 18], ['T7_ALCOHOL', 18]] },
    } },
    { id: 'pegajosa', nombre: 'Pegajosa', item: 'POTION_SLOWFIELD', recetas: {
      3: { n: 5, ing: [['T3_COMFREY', 8]] },
      5: { n: 5, ing: [['T5_TEASEL', 24], ['T4_BURDOCK', 12], ['T5_EGG', 6]] },
      7: { n: 5, ing: [['T7_MULLEIN', 72], ['T6_FOXGLOVE', 36], ['T4_BURDOCK', 36], ['T5_EGG', 18], ['T7_ALCOHOL', 18]] },
    } },
    { id: 'veneno', nombre: 'Veneno', item: 'POTION_COOLDOWN', recetas: {
      4: { n: 5, ing: [['T4_BURDOCK', 8], ['T3_COMFREY', 4]] },
      6: { n: 5, ing: [['T6_FOXGLOVE', 24], ['T5_TEASEL', 12], ['T3_COMFREY', 12], ['T6_MILK', 6]] },
      8: { n: 5, ing: [['T8_YARROW', 72], ['T7_MULLEIN', 36], ['T5_TEASEL', 36], ['T8_MILK', 18], ['T8_ALCOHOL', 18]] },
    } },
    { id: 'invisibilidad', nombre: 'Invisibilidad', item: 'POTION_CLEANSE', recetas: {
      8: { n: 5, ing: [['T8_YARROW', 72], ['T7_MULLEIN', 36], ['T5_TEASEL', 36], ['T8_MILK', 18], ['T8_ALCOHOL', 18]] },
    } },
    { id: 'calma', nombre: 'Calma', item: 'POTION_MOB_RESET', recetas: {
      3: { n: 10, ing: [['T3_ALCHEMY_RARE_PANTHER', 1], ['T3_COMFREY', 16]] },
      5: { n: 10, ing: [['T5_ALCHEMY_RARE_PANTHER', 1], ['T5_TEASEL', 48], ['T4_BURDOCK', 24], ['T2_AGARIC', 12]] },
      7: { n: 10, ing: [['T7_ALCHEMY_RARE_PANTHER', 1], ['T7_MULLEIN', 144], ['T6_FOXGLOVE', 72], ['T3_COMFREY', 72], ['T2_AGARIC', 36], ['T7_ALCOHOL', 36]] },
    } },
    { id: 'limpieza', nombre: 'Limpieza', item: 'POTION_CLEANSE2', recetas: {
      3: { n: 10, ing: [['T3_ALCHEMY_RARE_ENT', 1], ['T3_COMFREY', 16]] },
      5: { n: 10, ing: [['T5_ALCHEMY_RARE_ENT', 1], ['T5_TEASEL', 48], ['T3_COMFREY', 24], ['T4_BUTTER', 12]] },
      7: { n: 10, ing: [['T7_ALCHEMY_RARE_ENT', 1], ['T7_MULLEIN', 144], ['T4_BURDOCK', 72], ['T3_COMFREY', 72], ['T6_BUTTER', 36], ['T7_ALCOHOL', 36]] },
    } },
    { id: 'acido', nombre: 'Ácido', item: 'POTION_ACID', recetas: {
      3: { n: 10, ing: [['T3_ALCHEMY_RARE_DIREBEAR', 1], ['T3_COMFREY', 16]] },
      5: { n: 10, ing: [['T5_ALCHEMY_RARE_DIREBEAR', 1], ['T5_TEASEL', 48], ['T4_BURDOCK', 24], ['T4_MILK', 12]] },
      7: { n: 10, ing: [['T7_ALCHEMY_RARE_DIREBEAR', 1], ['T7_MULLEIN', 144], ['T6_FOXGLOVE', 72], ['T6_ALCOHOL', 72], ['T6_MILK', 36], ['T7_ALCOHOL', 36]] },
    } },
    { id: 'berserker', nombre: 'Berserker', item: 'POTION_BERSERK', recetas: {
      4: { n: 10, ing: [['T3_ALCHEMY_RARE_WEREWOLF', 1], ['T4_BURDOCK', 16]] },
      6: { n: 10, ing: [['T5_ALCHEMY_RARE_WEREWOLF', 1], ['T6_FOXGLOVE', 48], ['T2_AGARIC', 24], ['T6_ALCOHOL', 12]] },
      8: { n: 10, ing: [['T7_ALCHEMY_RARE_WEREWOLF', 1], ['T8_YARROW', 144], ['T3_COMFREY', 72], ['T6_ALCOHOL', 72], ['T7_ALCOHOL', 36], ['T8_ALCOHOL', 36]] },
    } },
    { id: 'infernal', nombre: 'Fuego infernal', item: 'POTION_LAVA', recetas: {
      4: { n: 10, ing: [['T3_ALCHEMY_RARE_IMP', 1], ['T4_MILK', 16]] },
      6: { n: 10, ing: [['T5_ALCHEMY_RARE_IMP', 1], ['T6_MILK', 48], ['T6_FOXGLOVE', 24], ['T3_EGG', 12]] },
      8: { n: 10, ing: [['T7_ALCHEMY_RARE_IMP', 1], ['T8_MILK', 144], ['T8_YARROW', 72], ['T7_MULLEIN', 72], ['T5_EGG', 36], ['T8_ALCOHOL', 36]] },
    } },
    { id: 'recoleccion', nombre: 'Recolección', item: 'POTION_GATHER', recetas: {
      4: { n: 10, ing: [['T3_ALCHEMY_RARE_ELEMENTAL', 1], ['T4_BUTTER', 16]] },
      6: { n: 10, ing: [['T5_ALCHEMY_RARE_ELEMENTAL', 1], ['T6_BUTTER', 48], ['T6_FOXGLOVE', 24], ['T5_TEASEL', 12]] },
      8: { n: 10, ing: [['T7_ALCHEMY_RARE_ELEMENTAL', 1], ['T8_BUTTER', 144], ['T8_YARROW', 72], ['T7_MULLEIN', 72], ['T6_FOXGLOVE', 36], ['T8_ALCOHOL', 36]] },
    } },
    { id: 'tornado', nombre: 'Tornado', item: 'POTION_TORNADO', recetas: {
      4: { n: 10, ing: [['T3_ALCHEMY_RARE_EAGLE', 1], ['T4_BURDOCK', 16]] },
      6: { n: 10, ing: [['T5_ALCHEMY_RARE_EAGLE', 1], ['T6_FOXGLOVE', 48], ['T5_TEASEL', 24], ['T3_EGG', 12]] },
      8: { n: 10, ing: [['T7_ALCHEMY_RARE_EAGLE', 1], ['T8_YARROW', 144], ['T7_MULLEIN', 72], ['T7_ALCOHOL', 72], ['T5_EGG', 36], ['T8_ALCOHOL', 36]] },
    } },
    { id: 'guardavida', nombre: 'Guardavida', item: 'POTION_LIFEWARD', recetas: {
      4: { n: 10, ing: [['T4_ALCHEMY_RARE_DRAGONAREA', 1], ['T4_BURDOCK', 16]] },
      6: { n: 10, ing: [['T6_ALCHEMY_RARE_DRAGONAREA', 1], ['T6_FOXGLOVE', 48], ['T5_TEASEL', 24], ['T2_AGARIC', 12]] },
      8: { n: 10, ing: [['T8_ALCHEMY_RARE_DRAGONAREA', 1], ['T8_YARROW', 144], ['T7_MULLEIN', 72], ['T5_TEASEL', 72], ['T2_AGARIC', 36], ['T8_ALCOHOL', 36]] },
    } },
  ],
}

export const NOMBRES_INGREDIENTE = {
  T1_CARROT: "Zanahorias",
  T2_AGARIC: "Agárico arcano",
  T2_BEAN: "Frijoles",
  T3_ALCHEMY_RARE_DIREBEAR: "Patas de espíritu duras",
  T3_ALCHEMY_RARE_EAGLE: "Pluma de alba dura",
  T3_ALCHEMY_RARE_ELEMENTAL: "Diente de piedra rúnica duro",
  T3_ALCHEMY_RARE_ENT: "Raíz silvana dura",
  T3_ALCHEMY_RARE_IMP: "Cuerno de diablillo duro",
  T3_ALCHEMY_RARE_PANTHER: "Garras sombrías duras",
  T3_ALCHEMY_RARE_WEREWOLF: "Colmillos de hombre lobo duros",
  T3_COMFREY: "Consuelda hojabrillante",
  T3_EGG: "Huevos de gallina",
  T3_FLOUR: "Harina",
  T3_MEAT: "Carne de pollo",
  T3_WHEAT: "Manojo de trigo",
  T4_ALCHEMY_RARE_DRAGONAREA: "Sangre de Dragón diluida",
  T4_BREAD: "Pan",
  T4_BURDOCK: "Bardana almenada",
  T4_BUTTER: "Manteca de cabra",
  T4_MEAT: "Carne de cabra",
  T4_MILK: "Leche de cabra",
  T4_TURNIP: "Rábanos",
  T5_ALCHEMY_RARE_DIREBEAR: "Patas de espíritu finas",
  T5_ALCHEMY_RARE_EAGLE: "Pluma de alba fina",
  T5_ALCHEMY_RARE_ELEMENTAL: "Diente de piedra rúnica fino",
  T5_ALCHEMY_RARE_ENT: "Raíz silvana fina",
  T5_ALCHEMY_RARE_IMP: "Cuerno de diablillo fino",
  T5_ALCHEMY_RARE_PANTHER: "Garras sombrías finas",
  T5_ALCHEMY_RARE_WEREWOLF: "Colmillos de hombre lobo finos",
  T5_CABBAGE: "Coles",
  T5_EGG: "Huevos de ganso",
  T5_MEAT: "Carne de ganso",
  T5_TEASEL: "Cardo de dragón",
  T6_ALCHEMY_RARE_DRAGONAREA: "Sangre de Dragón",
  T6_ALCOHOL: "Schnapps de patata",
  T6_BUTTER: "Manteca de oveja",
  T6_FOXGLOVE: "Dedalera elusiva",
  T6_MEAT: "Carne de carnero",
  T6_MILK: "Leche de oveja",
  T6_POTATO: "Patatas",
  T7_ALCHEMY_RARE_DIREBEAR: "Patas de espíritu excelentes",
  T7_ALCHEMY_RARE_EAGLE: "Pluma de alba excelente",
  T7_ALCHEMY_RARE_ELEMENTAL: "Diente de piedra rúnica excelente",
  T7_ALCHEMY_RARE_ENT: "Raíz silvana excelente",
  T7_ALCHEMY_RARE_IMP: "Cuerno de diablillo excelente",
  T7_ALCHEMY_RARE_PANTHER: "Garras sombrías excelentes",
  T7_ALCHEMY_RARE_WEREWOLF: "Colmillos de hombre lobo excelentes",
  T7_ALCOHOL: "Orujo de maíz",
  T7_CORN: "Fardo de maíz",
  T7_MEAT: "Carne de cerdo",
  T7_MULLEIN: "Gordolobo de fuego",
  T8_ALCHEMY_RARE_DRAGONAREA: "Sangre de Dragón potente",
  T8_ALCOHOL: "Aguardiente de calabaza",
  T8_BUTTER: "Manteca de vaca",
  T8_MEAT: "Carne de ternera",
  T8_MILK: "Leche de vaca",
  T8_PUMPKIN: "Calabaza",
  T8_YARROW: "Milenrama demoníaca",
}
