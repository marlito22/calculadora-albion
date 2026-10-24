import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'
import { RAMAS, FAMA_POR_REFINADO, ENCANTAMIENTOS, BONO_PREMIUM } from './datos.js'
import { famaRestante, refinadosNecesarios, materiales, tasaRetorno, famaPorRefinado } from './calculo.js'
import { nf, campo, panel, boton, Icono, IconoFama, DeslizadorRango } from './ui.jsx'

export default function Refinacion({ usuario }) {
  const [guardadas, setGuardadas] = useState([])
  const [rama, setRama] = useState('madera')
  const [tier, setTier] = useState(6)
  const [nivel, setNivel] = useState(0)
  const [meta, setMeta] = useState(100)
  const [acumulada, setAcumulada] = useState(0)
  const [enc, setEnc] = useState(0)
  const [bono, setBono] = useState(0)
  const [premium, setPremium] = useState(false)
  const [foco, setFoco] = useState(false)
  const [ciudad, setCiudad] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!usuario) return setGuardadas([])
    supabase.from('specs').select('*').order('recurso').order('tier').then(({ data, error }) => {
      if (error) setError(error.message)
      else setGuardadas(data)
    })
  }, [usuario])

  const objetivo = Math.max(meta, nivel)
  const fama = famaRestante(tier, nivel, acumulada, undefined, objetivo)
  const sinEnc = rama === 'piedra' // la piedra no tiene versiones encantadas
  const encEfectivo = sinEnc ? 0 : enc
  const bonoTotal = bono + (premium ? BONO_PREMIUM : 0)
  const refinados = refinadosNecesarios(tier, fama, encEfectivo, bonoTotal)
  const retorno = tasaRetorno({ foco, ciudad })
  const filas = materiales(tier, refinados, retorno)
  const info = RAMAS.find((r) => r.id === rama)

  async function guardar() {
    const fila = { recurso: rama, tier, nivel, fama_restante: Math.round(famaRestante(tier, nivel, acumulada)), actualizado: new Date().toISOString() }
    const { error } = await supabase.from('specs').upsert({ ...fila, user_id: usuario.id })
    if (error) return setError(error.message)
    setError('')
    setGuardadas((g) => [...g.filter((s) => s.recurso !== rama || s.tier !== tier), fila].sort((a, b) => a.recurso.localeCompare(b.recurso) || a.tier - b.tier))
  }

  const cargar = (s) => {
    setRama(s.recurso); setTier(s.tier); setNivel(s.nivel); setAcumulada(famaRestante(s.tier, s.nivel) - s.fama_restante)
  }

  return (
    <div className="space-y-6">
          <section className={`${panel} grid gap-4 sm:grid-cols-2`}>
            <div className="sm:col-span-2">
              <p className="mb-1">Rama</p>
              <div className="grid grid-cols-5 gap-2">
                {RAMAS.map((r) => (
                  <button key={r.id} className={boton(rama === r.id)} onClick={() => setRama(r.id)}>
                    <Icono tier={tier} item={r.itemRefinado} enc={r.id === 'piedra' ? 0 : enc} />
                    {r.nombre}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1">Tier a subir</p>
              <div className="grid grid-cols-5 gap-2">
                {Object.keys(FAMA_POR_REFINADO).map((t) => (
                  <button key={t} className={`${boton(tier === Number(t))} py-3 text-sm font-semibold`} onClick={() => setTier(Number(t))}>
                    T{t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1">Encantamiento a refinar</p>
              <div className="grid grid-cols-5 gap-2">
                {ENCANTAMIENTOS.map((e) => (
                  <button key={e} className={boton(encEfectivo === e)} disabled={sinEnc && e > 0} onClick={() => setEnc(e)}>
                    <Icono tier={tier} item={info.itemRefinado} enc={e} tam={32} />
                    {e ? `.${e}` : 'Plano'}
                  </button>
                ))}
              </div>
            </div>
            <DeslizadorRango desde={nivel} hasta={objetivo} setDesde={setNivel} setHasta={setMeta} />
            <label><span className="flex items-center gap-1">Fama <IconoFama tam={16} /> ya acumulada en tu nivel actual</span>
              <input className={campo} type="number" min="0" value={acumulada}
                onChange={(e) => setAcumulada(Math.max(0, Number(e.target.value) || 0))} />
            </label>
            <label><span className="flex items-center gap-1">Otro bono de fama <IconoFama tam={16} /> %</span>
              <input className={campo} type="number" min="0" value={bono}
                onChange={(e) => setBono(Math.max(0, Number(e.target.value) || 0))} />
            </label>
            <div className="flex flex-col justify-end gap-1">
              <label><input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} /> Tengo premium (+{BONO_PREMIUM}% de fama)</label>
              <label><input type="checkbox" checked={foco} onChange={(e) => setFoco(e.target.checked)} /> Usar foco</label>
              <label><input type="checkbox" checked={ciudad} onChange={(e) => setCiudad(e.target.checked)} /> Ciudad con bono de {info.nombre.toLowerCase()}</label>
            </div>
            {usuario && (
              <button className="rounded bg-emerald-600 px-3 py-2 font-semibold sm:col-span-2" onClick={guardar}>
                Guardar esta spec
              </button>
            )}
          </section>
  
          {error && <p className="rounded bg-black/80 p-2 text-sm text-red-400">{error}</p>}
  
          <section className={panel}>
            <p className="mb-3">
              Para subir {info.nombre} T{tier} del nivel {nivel} al {objetivo} faltan <b>{nf.format(fama)}</b> <IconoFama /> de fama:
              necesitas refinar <b className="text-amber-400">{nf.format(refinados)}</b> {info.refinado} T{tier}
              {encEfectivo ? `.${encEfectivo}` : ''} ({nf.format(famaPorRefinado(tier, encEfectivo))} <IconoFama /> de fama c/u{bonoTotal ? `, +${bonoTotal}% de bono` : ''}).
              Retorno de materiales: {(retorno * 100).toFixed(1)}%.
            </p>
            <table className="w-full text-left">
              <thead className="text-slate-400">
                <tr><th className="pb-2">Tier</th><th>{info.bruto} bruta</th><th>{info.refinado} a refinar</th></tr>
              </thead>
              <tbody>
                {filas.map((f) => {
                  const e = f.tier >= 4 ? encEfectivo : 0 // el encantamiento solo existe desde T4
                  return (
                    <tr key={f.tier} className="border-t border-slate-700/80">
                      <td className="py-1 font-semibold">T{f.tier}{e ? `.${e}` : ''}</td>
                      <td><span className="flex items-center gap-2"><Icono tier={f.tier} item={info.itemBruto} enc={e} />{nf.format(f.bruto)}</span></td>
                      <td><span className="flex items-center gap-2"><Icono tier={f.tier} item={info.itemRefinado} enc={e} />{nf.format(f.refinado)}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
  
          {guardadas.length > 0 && (
            <section className={panel}>
              <h2 className="mb-2 font-semibold">Mis specs guardadas</h2>
              <ul className="space-y-1">
                {guardadas.map((s) => {
                  const r = RAMAS.find((x) => x.id === s.recurso)
                  return (
                    <li key={s.recurso + s.tier} className="flex items-center gap-2">
                      <Icono tier={s.tier} item={r.itemRefinado} tam={28} />
                      <button className="underline" onClick={() => cargar(s)}>{r.nombre} T{s.tier}</button>
                      — nivel {s.nivel}, faltan {nf.format(s.fama_restante)} <IconoFama tam={16} /> de fama
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
    </div>
  )
}
