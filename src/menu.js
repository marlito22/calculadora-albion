// Menú lateral: `icono` es un id de item del render oficial de Albion. Una página nueva = una entrada aquí
// y su componente en PAGINAS (App.jsx); las que no lo tengan muestran "Próximamente".
export const MENU = [
  { id: 'refinacion', nombre: 'Refinación', icono: 'T6_PLANKS' },
  {
    grupo: 'Crafteo',
    items: [
      { id: 'comidas', nombre: 'Comidas', icono: 'T4_MEAL_STEW' },
      { id: 'pociones', nombre: 'Pociones', icono: 'T4_POTION_HEAL' },
      { id: 'armas', nombre: 'Armas', icono: 'T4_MAIN_SWORD' },
      { id: 'armaduras', nombre: 'Armaduras', icono: 'T4_ARMOR_PLATE_SET1' },
      { id: 'accesorios', nombre: 'Accesorios', icono: 'T4_BAG' },
      { id: 'herramientas', nombre: 'Herramientas', icono: 'T4_2H_TOOL_PICK' },
    ],
  },
]

export const PAGINAS_MENU = MENU.flatMap((m) => m.items ?? m)
