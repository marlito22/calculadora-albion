import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Sin credenciales la calculadora funciona igual, solo sin login ni guardado.
export const supabase = url && key ? createClient(url, key) : null
