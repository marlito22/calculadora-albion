import { useState } from 'react'
import { CRAFTEO, NOMBRES_INGREDIENTE } from './datosCrafteo.js'
import { BONO_PREMIUM } from './datos.js'
import { famaRestanteCrafteo, famaPorCrafteo, crafteosNecesarios, ingredientes, tasaRetorno } from './calculo.js'
import { nf, campo, panel, boton, Icono, IconoFama } from './ui.jsx'

// Comidas y pociones: una rama = un nodo del Tablero del Destino (todos con la misma tabla de fama).
export default function Crafteo({ tipo }) {
  const ramas = CRAFTEO[tipo]
  const [rama, setRama] = useState(ramas[0].id)
  const [tier, setTier] = useState(0)
  const [nivel, setNivel] = useState(0)
  const [acumulada, setAcumulada] = useState(0)
  const [bono, setBono] = useState(0)
  const [premium, setPremium] = useState(false)
  const [foco, setFoco] = useState(false)
  const [ciudad, setCiudad] = useState(false)

  const info = ramas.find((r) => r.id === rama) ?? ramas[0]
  const tiers = Object.keys(info.recetas).map(Number)
  const t = tiers.includes(tier) ? tier : tiers[tiers.length - 1] // al cambiar de rama el tier puede no existir
  const receta = info.recetas[t]
  const fama = famaRestanteCrafteo(nivel, acumulada)
  const bonoTotal = bono + (premium ? BONO_PREMIUM : 0)
  const famaCrafteo = famaPorCrafteo(tipo, receta)
  const crafteos = crafteosNecesarios(fama, famaCrafteo, bonoTotal)
  const retorno = tasaRetorno({ foco, ciudad })
  const idItem = `T${t}_${info.item}`

  return (
    <div className="space-y-6">
      <section className={`${panel} grid gap-4 sm:grid-cols-2`}>
        <div className="sm:col-span-2">
          <p className="mb-1">Rama</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {ramas.map((r) => (
              <button key={r.id} className={boton(info.id === r.id)} onClick={() => setRama(r.id)}>
                <Icono id={`T${Math.max(...Object.keys(r.recetas))}_${r.item}`} />
                {r.nombre}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <p className="mb-1">Tier a craftear</p>
          <div className="grid grid-cols-5 gap-2">
            {tiers.map((x) => (
              <button key={x} className={`${boton(t === x)} py-3 text-sm font-semibold`} onClick={() => setTier(x)}>
                T{x}
              </button>
            ))}
          </div>
        </div>
        <label className="sm:col-span-2">
          <span className="flex items-center justify-between">
            Nivel actual de spec
            <b className="rounded-md bg-black/70 px-3 py-1 text-lg text-amber-400">{nivel}</b>
          </span>
          <input className="my-2 h-3 w-full cursor-pointer accent-amber-400" type="range" min="0" max="100" value={nivel}
            onChange={(e) => setNivel(Number(e.target.value))} />
          <span className="flex justify-between text-xs text-slate-400"><span>0</span><span>50</span><span>100</span></span>
        </label>
        <label><span className="flex items-center gap-1">Fama <IconoFama tam={16} /> ya acumulada en tu nivel actual</span>
          <input className={campo} type="number" min="0" value={acumulada}
            onChange={(e) => setAcumulada(Math.max(0, Number(e.target.value) || 0))} />
        </label>
        <label><span className="flex items-center gap-1">Otro bono de fama <IconoFama tam={16} /> %</span>
          <input className={campo} type="number" min="0" value={bono}
            onChange={(e) => setBono(Math.max(0, Number(e.target.value) || 0))} />
        </label>
        <div className="flex flex-col justify-end gap-1 sm:col-span-2">
          <label><input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} /> Tengo premium (+{BONO_PREMIUM}% de fama)</label>
          <label><input type="checkbox" checked={foco} onChange={(e) => setFoco(e.target.checked)} /> Usar foco</label>
          <label><input type="checkbox" checked={ciudad} onChange={(e) => setCiudad(e.target.checked)} /> Ciudad con bono de {info.nombre.toLowerCase()}</label>
        </div>
      </section>

      <section className={panel}>
        <p className="mb-3">
          Para subir {info.nombre} del nivel {nivel} al 100 faltan <b>{nf.format(fama)}</b> <IconoFama /> de fama:
          necesitas hacer <b className="text-amber-400">{nf.format(crafteos)}</b> crafteos de {info.nombre} T{t}
          {' '}({nf.format(crafteos * receta.n)} unidades; {nf.format(famaCrafteo)} <IconoFama /> de fama por crafteo de {receta.n}
          {bonoTotal ? `, +${bonoTotal}% de bono` : ''}). Retorno de materiales: {(retorno * 100).toFixed(1)}%.
        </p>
        <table className="w-full text-left">
          <thead className="text-slate-400">
            <tr><th className="pb-2">Material</th><th>Cantidad</th></tr>
          </thead>
          <tbody>
            {ingredientes(receta, crafteos, retorno).map(([id, n]) => (
              <tr key={id} className="border-t border-slate-700/80">
                <td className="py-1"><span className="flex items-center gap-2"><Icono id={id} />{NOMBRES_INGREDIENTE[id]}</span></td>
                <td>{nf.format(n)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <Icono id={idItem} tam={24} /> Resultado: {nf.format(crafteos * receta.n)} unidades de T{t} sin encantar.
        </p>
      </section>
    </div>
  )
}
