import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'
import { MENU, PAGINAS_MENU } from './menu.js'
import { panel, Icono } from './ui.jsx'
import Refinacion from './Refinacion.jsx'
import Crafteo from './Crafteo.jsx'

const PAGINAS = {
  refinacion: Refinacion,
  comidas: () => <Crafteo tipo="comidas" />,
  pociones: () => <Crafteo tipo="pociones" />,
}

function Proximamente({ pagina }) {
  return (
    <section className={`${panel} flex flex-col items-center gap-3 py-12 text-center`}>
      <Icono id={pagina.icono} tam={80} />
      <h2 className="text-xl font-bold text-amber-400">Crafteo de {pagina.nombre.toLowerCase()}</h2>
      <p className="text-slate-300">Próximamente.</p>
    </section>
  )
}

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [actual, setActual] = useState('refinacion')
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    const cerrar = (e) => e.key === 'Escape' && setAbierto(false)
    window.addEventListener('keydown', cerrar)
    return () => window.removeEventListener('keydown', cerrar)
  }, [])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setUsuario(data.session?.user ?? null))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUsuario(s?.user ?? null))
    return () => data.subscription.unsubscribe()
  }, [])

  const pagina = PAGINAS_MENU.find((p) => p.id === actual)
  const Pagina = PAGINAS[actual]

  const enlace = (p) => (
    <button
      key={p.id}
      onClick={() => { setActual(p.id); setAbierto(false) }}
      className={`flex w-full items-center gap-2 rounded-lg border px-2 py-1 text-left transition ${
        actual === p.id ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-transparent text-slate-200 hover:bg-white/10'
      }`}
    >
      <Icono id={p.icono} tam={32} />
      {p.nombre}
    </button>
  )

  return (
    <div
      className="min-h-screen bg-slate-950 bg-cover bg-fixed bg-center text-slate-100"
      style={{ backgroundImage: 'linear-gradient(rgba(2,6,23,.55), rgba(2,6,23,.8)), url(/fondo.jpeg)' }}
    >
      {abierto && <div className="fixed inset-0 z-20 bg-black/60" onClick={() => setAbierto(false)} />}
      <nav
        aria-label="Menú"
        className={`fixed inset-y-0 left-0 z-30 w-64 max-w-[80vw] space-y-1 overflow-y-auto border-r border-amber-500/40 bg-slate-950 p-3 shadow-2xl shadow-black transition-transform ${
          abierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <p className="px-2 pb-2 text-lg font-bold text-amber-400">Calculadora Albion</p>
        {MENU.map((m) =>
          m.items ? (
            <div key={m.grupo} className="pt-2">
              <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{m.grupo}</p>
              {m.items.map(enlace)}
            </div>
          ) : enlace(m),
        )}
      </nav>

      <div className="mx-auto max-w-3xl p-4 sm:py-10">
        <main className="min-w-0 space-y-6">
          <header className={`${panel} flex items-center justify-between gap-3 py-3`}>
            <button
              aria-label="Abrir menú"
              aria-expanded={abierto}
              className="shrink-0 rounded-md border border-slate-600 bg-black/60 p-2 hover:border-amber-400"
              onClick={() => setAbierto(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="flex min-w-0 flex-1 items-center gap-3 text-lg font-bold text-amber-400 sm:text-2xl">
              <Icono id={pagina.icono} tam={40} />
              <span className="truncate">
              {Pagina ? <>{/* título corto en celular para dejar sitio al botón de login */}<span className="sm:hidden">{pagina.nombre}</span><span className="hidden sm:inline">Calculadora de {pagina.nombre}</span></> : `Crafteo de ${pagina.nombre.toLowerCase()}`}
            </span>
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

          {Pagina ? <Pagina usuario={usuario} /> : <Proximamente pagina={pagina} />}

          <footer className="text-center text-xs text-slate-200 [text-shadow:0_1px_3px_#000]">
            Fondo: Dragonfire por Carlos Ancot. Albion Online y sus iconos © Sandbox Interactive GmbH.
          </footer>
        </main>
      </div>
    </div>
  )
}
