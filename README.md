# Calculadora de Refinación - Albion Online

Calcula cuánta fama falta para llevar una spec de refinación (T4–T8) al nivel 100 y cuánto material bruto y refinado necesitas, desde T2 hasta el tier elegido. Considera encantamiento, retorno de materiales (foco y ciudad con bono), premium y otros bonos de fama. Con login de Google (Supabase) se guardan las specs de cada usuario.

## Uso

```bash
npm install
npm run dev
npm test
```

## Login y guardado (opcional)

Sin credenciales la calculadora funciona igual, solo sin login.

1. Crea un proyecto en Supabase y ejecuta [supabase.sql](supabase.sql) en el SQL Editor.
2. En Authentication > Providers activa Google.
3. Copia `.env.example` a `.env` y completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

## Datos

- Recetas: [ao-bin-dumps](https://github.com/ao-data/ao-bin-dumps) (`items.xml`).
- Fama por nivel de spec: datos del juego publicados en albiondatabase.com (nodos `CRAFT_REFINE_*`).
- La fama por refinado (22,5 / 90 / 270 / 645 / 1395) está deducida de la fama de fabricar objetos y no está verificada en juego.

## Créditos

Albion Online, sus iconos y el fondo "Dragonfire" (Carlos Ancot) pertenecen a Sandbox Interactive GmbH. Proyecto de fans, sin afiliación oficial.
