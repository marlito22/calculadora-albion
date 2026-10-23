import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'
import { RAMAS, FAMA_POR_REFINADO, ENCANTAMIENTOS } from './datos.js'
import { famaRestante, refinadosNecesarios, materiales, tasaRetorno } from './calculo.js'

const BONO_PREMIUM = 50
const nf = new Intl.NumberFormat('es')
// Campos y paneles opacos con borde dorado para que no se confundan con el fondo.
const campo = 'w-full rounded-md bg-black/70 border border-slate-500 px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none'
const panel = 'rounded-xl border border-amber-500/40 bg-slate-950/90 p-5 shadow-2xl shadow-black/60 backdrop-blur-md'
const boton = (activo) =>
  `flex flex-col items-center rounded-lg border px-2 py-1 text-xs transition disabled:opacity-30 ${
    activo ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-slate-600 bg-black/60 text-slate-300 hover:border-slate-400'
  }`

// Iconos del servicio oficial de render de Albion; los encantados llevan sufijo _LEVELn@n.
function Icono({ tier, item, enc = 0, tam = 40 }) {
  const sufijo = enc ? `_LEVEL${enc}@${enc}` : ''
  return (
    <img
      src={`https://render.albiononline.com/v1/item/T${tier}_${item}${sufijo}.png?size=64`}
      width={tam} height={tam} alt={`T${tier}.${enc} ${item}`} loading="lazy"
    />
  )
}

// Estrella dorada propia: el render oficial de Albion no tiene un icono de fama.
function IconoFama({ tam = 18 }) {
  return (
    <svg className="inline-block align-text-bottom" width={tam} height={tam} viewBox="0 0 24 24" role="img" aria-label="Fama">
      <defs>
        <linearGradient id="oroFama" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"
        fill="url(#oroFama)" stroke="#78350f" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [guardadas, setGuardadas] = useState([])
  const [rama, setRama] = useState('madera')
  const [tier, setTier] = useState(6)
  const [nivel, setNivel] = useState(0)
  const [acumulada, setAcumulada] = useState(0)
  const [enc, setEnc] = useState(0)
  const [bono, setBono] = useState(0)
  const [premium, setPremium] = useState(false)
  const [foco, setFoco] = useState(false)
  const [ciudad, setCiudad] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setUsuario(data.session?.user ?? null))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUsuario(s?.user ?? null))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!usuario) return setGuardadas([])
    supabase.from('specs').select('*').order('recurso').order('tier').then(({ data, error }) => {
      if (error) setError(error.message)
      else setGuardadas(data)
    })
  }, [usuario])

  const fama = famaRestante(tier, nivel, acumulada)
  const sinEnc = rama === 'piedra' // la piedra no tiene versiones encantadas
  const encEfectivo = sinEnc ? 0 : enc
  const bonoTotal = bono + (premium ? BONO_PREMIUM : 0)
  const refinados = refinadosNecesarios(tier, fama, encEfectivo, bonoTotal)
  const retorno = tasaRetorno({ foco, ciudad })
  const filas = materiales(tier, refinados, retorno)
  const info = RAMAS.find((r) => r.id === rama)

  async function guardar() {
    const fila = { recurso: rama, tier, nivel, fama_restante: Math.round(fama), actualizado: new Date().toISOString() }
    const { error } = await supabase.from('specs').upsert({ ...fila, user_id: usuario.id })
    if (error) return setError(error.message)
    setError('')
    setGuardadas((g) => [...g.filter((s) => s.recurso !== rama || s.tier !== tier), fila].sort((a, b) => a.recurso.localeCompare(b.recurso) || a.tier - b.tier))
  }

  const cargar = (s) => {
    setRama(s.recurso); setTier(s.tier); setNivel(s.nivel); setAcumulada(famaRestante(s.tier, s.nivel) - s.fama_restante)
  }

  return (
    <div
      className="min-h-screen bg-slate-950 bg-cover bg-fixed bg-center text-slate-100"
      style={{ backgroundImage: 'linear-gradient(rgba(2,6,23,.55), rgba(2,6,23,.8)), url(/fondo.jpeg)' }}
    >
      <div className="mx-auto max-w-3xl space-y-6 p-4 sm:py-10">
        <header className={`${panel} flex items-center justify-between gap-4 py-3`}>
          <h1 className="flex items-center gap-3 text-xl font-bold text-amber-400 sm:text-2xl">
            <Icono tier={tier} item={info.itemRefinado} enc={encEfectivo} tam={44} />
            Calculadora de Refinación
          </h1>
          {supabase && (usuario ? (
            <button className="text-sm underline" onClick={() => supabase.auth.signOut()}>
              Salir ({usuario.email})
            </button>
          ) : (
            <button
              className="rounded bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-900"
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
            >
              Entrar con Google
            </button>
          ))}
        </header>

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
            Para subir {info.nombre} T{tier} del nivel {nivel} al 100 faltan <b>{nf.format(fama)}</b> <IconoFama /> de fama:
            necesitas refinar <b className="text-amber-400">{nf.format(refinados)}</b> {info.refinado} T{tier}
            {encEfectivo ? `.${encEfectivo}` : ''} ({FAMA_POR_REFINADO[tier] * 2 ** encEfectivo} <IconoFama /> de fama c/u{bonoTotal ? `, +${bonoTotal}% de bono` : ''}).
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

        <footer className="text-center text-xs text-slate-200 [text-shadow:0_1px_3px_#000]">
          Fondo: Dragonfire por Carlos Ancot. Albion Online y sus iconos © Sandbox Interactive GmbH.
        </footer>
      </div>
    </div>
  )
}
