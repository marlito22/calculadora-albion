export const nf = new Intl.NumberFormat('es')
// Campos y paneles opacos con borde dorado para que no se confundan con el fondo.
export const campo = 'w-full rounded-md bg-black/70 border border-slate-500 px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none'
export const panel = 'rounded-xl border border-amber-500/40 bg-slate-950/90 p-5 shadow-2xl shadow-black/60 backdrop-blur-md'
export const boton = (activo) =>
  `flex flex-col items-center rounded-lg border px-2 py-1 text-xs transition disabled:opacity-30 ${
    activo ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-slate-600 bg-black/60 text-slate-300 hover:border-slate-400'
  }`

// Una barra 0-100 con dos puntos: nivel actual (desde) y nivel objetivo (hasta). Dos <input range> superpuestos;
// solo los puntos reciben el ratón. Si coinciden en 100 manda el de "desde" para poder bajarlo.
// shortcut: si coinciden en medio hay que mover primero "hasta" a la derecha; teclado (flechas) siempre funciona.
const punto =
  'pointer-events-none absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent ' + // clases completas: Tailwind no ve las armadas con plantillas
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 [&::-webkit-slider-thumb]:bg-amber-400 ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-900 [&::-moz-range-thumb]:bg-amber-400'

export function DeslizadorRango({ desde, hasta, setDesde, setHasta }) {
  return (
    <div className="sm:col-span-2">
      <span className="flex items-center justify-between">
        Nivel de spec: actual y objetivo
        <b className="rounded-md bg-black/70 px-3 py-1 text-lg text-amber-400">{desde} → {hasta}</b>
      </span>
      <div className="relative my-2 h-6">
        <div className="absolute inset-x-0 top-1.5 h-3 rounded-full bg-slate-700" />
        <div className="absolute top-1.5 h-3 rounded-full bg-amber-500"
          style={{ left: `calc(${desde}% + ${10 - desde / 5}px)`, width: `calc(${hasta - desde}% - ${(hasta - desde) / 5}px)` }} />
        <input aria-label="Nivel actual" className={punto} style={{ zIndex: desde === 100 ? 4 : 2 }} type="range" min="0" max="100" value={desde}
          onChange={(e) => setDesde(Math.min(Number(e.target.value), hasta))} />
        <input aria-label="Nivel objetivo" className={punto} style={{ zIndex: 3 }} type="range" min="0" max="100" value={hasta}
          onChange={(e) => setHasta(Math.max(Number(e.target.value), desde))} />
      </div>
      <span className="flex justify-between text-xs text-slate-400"><span>0</span><span>50</span><span>100</span></span>
    </div>
  )
}

// Iconos del servicio oficial de render de Albion; los encantados llevan sufijo _LEVELn@n.
export function Icono({ tier, item, id, enc = 0, tam = 40 }) {
  const sufijo = enc ? `_LEVEL${enc}@${enc}` : ''
  return (
    <img
      src={`https://render.albiononline.com/v1/item/${id ?? `T${tier}_${item}`}${sufijo}.png?size=64`}
      width={tam} height={tam} alt={id ?? `T${tier}.${enc} ${item}`} loading="lazy"
    />
  )
}

// Estrella dorada propia: el render oficial de Albion no tiene un icono de fama.
export function IconoFama({ tam = 18 }) {
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
