export const nf = new Intl.NumberFormat('es')
// Campos y paneles opacos con borde dorado para que no se confundan con el fondo.
export const campo = 'w-full rounded-md bg-black/70 border border-slate-500 px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none'
export const panel = 'rounded-xl border border-amber-500/40 bg-slate-950/90 p-5 shadow-2xl shadow-black/60 backdrop-blur-md'
export const boton = (activo) =>
  `flex flex-col items-center rounded-lg border px-2 py-1 text-xs transition disabled:opacity-30 ${
    activo ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-slate-600 bg-black/60 text-slate-300 hover:border-slate-400'
  }`

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
