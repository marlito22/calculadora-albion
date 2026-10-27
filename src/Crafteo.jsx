import { useState } from 'react'
import { CRAFTEO, NOMBRES_INGREDIENTE } from './datosCrafteo.js'
import { BONO_PREMIUM } from './datos.js'
import { famaRestanteCrafteo, famaPorCrafteo, crafteosNecesarios, crafteosPosibles, ingredientes, tasaRetorno } from './calculo.js'
import { nf, campo, panel, Icono, IconoFama, DeslizadorRango, Selector } from './ui.jsx'

// Comidas y pociones: una rama = un nodo del Tablero del Destino (todos con la misma tabla de fama).
export default function Crafteo({ tipo }) {
  const ramas = CRAFTEO[tipo]
  const [rama, setRama] = useState(ramas[0].id)
  const [tier, setTier] = useState(0)
  const [nivel, setNivel] = useState(0)
  const [meta, setMeta] = useState(100)
  const [acumulada, setAcumulada] = useState(0)
  const [bono, setBono] = useState(0)
  const [premium, setPremium] = useState(false)
  const [tengo, setTengo] = useState({})
  const [foco, setFoco] = useState(false)
  const [ciudad, setCiudad] = useState(false)

  const info = ramas.find((r) => r.id === rama) ?? ramas[0]
  const tiers = Object.keys(info.recetas).map(Number)
  const t = tiers.includes(tier) ? tier : tiers[tiers.length - 1] // al cambiar de rama el tier puede no existir
  const receta = info.recetas[t]
  const objetivo = Math.max(meta, nivel)
  const fama = famaRestanteCrafteo(nivel, acumulada, objetivo)
  const bonoTotal = bono + (premium ? BONO_PREMIUM : 0)
  const famaCrafteo = famaPorCrafteo(tipo, receta)
  const crafteos = crafteosNecesarios(fama, famaCrafteo, bonoTotal)
  const retorno = tasaRetorno({ foco, ciudad })
  const posibles = crafteosPosibles(receta, tengo, retorno)
  const idItem = `T${t}_${info.item}`

  return (
    <div className="space-y-6">
      <section className={`${panel} relative z-10 space-y-4`}>
        <div className="grid grid-cols-[2fr_1fr] gap-4">
          <Selector etiqueta="Rama" valor={info.id} onChange={setRama}
            opciones={ramas.map((r) => ({ valor: r.id, etiqueta: r.nombre, icono: <Icono id={`T${Math.max(...Object.keys(r.recetas))}_${r.item}`} tam={32} /> }))} />
          <Selector etiqueta="Tier a craftear" valor={t} onChange={setTier}
            opciones={tiers.map((x) => ({ valor: x, etiqueta: `T${x}`, icono: <Icono id={`T${x}_${info.item}`} tam={32} /> }))} />
        </div>
        <div>
          <p className="mb-2">
            Mínimo para craftear: <b className="text-amber-400">1 crafteo</b> = {receta.n} unidades de {info.nombre} T{t}
          </p>
          <table className="w-full text-left">
            <thead className="text-slate-400">
              <tr><th className="pb-2">Material</th><th>Necesitas</th><th className="w-28">Tengo</th></tr>
            </thead>
            <tbody>
              {receta.ing.map(([id, n]) => (
                <tr key={id} className="border-t border-slate-700/80">
                  <td className="py-1"><span className="flex items-center gap-2"><Icono id={id} />{NOMBRES_INGREDIENTE[id]}</span></td>
                  <td>{nf.format(n)}</td>
                  <td className="py-1">
                    <input className={campo} type="number" min="0" aria-label={`Tengo ${NOMBRES_INGREDIENTE[id]}`} value={tengo[id] ?? ''} placeholder="0"
                      onChange={(e) => setTengo({ ...tengo, [id]: Math.max(0, Number(e.target.value) || 0) })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 flex items-center gap-2">
            <Icono id={idItem} tam={32} />
            {posibles.crafteos > 0 ? (
              <span>Con lo que tienes puedes hacer <b className="text-amber-400">{nf.format(posibles.crafteos)}</b> crafteos
                = <b className="text-amber-400">{nf.format(posibles.crafteos * receta.n)}</b> unidades de {info.nombre} T{t}
                {' '}(retorno {(retorno * 100).toFixed(1)}%).</span>
            ) : (
              <span>Con lo que tienes no alcanza para 1 crafteo: te falta <b className="text-amber-400">{NOMBRES_INGREDIENTE[posibles.limitante]}</b>.</span>
            )}
          </p>
        </div>
      </section>

      <section className={`${panel} grid gap-4 sm:grid-cols-2`}>
        <DeslizadorRango desde={nivel} hasta={objetivo} setDesde={setNivel} setHasta={setMeta} />
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
          Para subir {info.nombre} del nivel {nivel} al {objetivo} faltan <b>{nf.format(fama)}</b> <IconoFama /> de fama:
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
