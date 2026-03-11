# BigChanger Dev (MVP)

Static MVP catalog connected to Supabase.

## Pages
- `index.html` — home
- `developers.html` — public catalog (loads only approved profiles from Supabase)
- `developer-profile.html` — public profile page by id (Supabase)
- `submit.html` — on-site developer submission form (writes to Supabase with `status: pending`)
- `about.html` — about project

## JavaScript
- `js/supabase.js` — Supabase initialization with public anon key
- `js/catalog.js` — catalog loading/filtering from Supabase
- `js/profile.js` — profile loading from Supabase
- `js/submit.js` — submission + validation + insert pending profile
- `js/i18n.js` — RU/EN language support

## Notes
- Uses only Supabase Project URL + ANON key in frontend.
- Do not use service role key in static client code.
- `data/developers.json` is intentionally empty (no fake/sample data in UI).
