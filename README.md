# ATLAS — City Explorer

ATLAS is an interactive city explorer for comparing the character of cities through movement, atmosphere, culture, nature, cost, safety and transit. It combines an editorial landing page with city profiles, a visual “city DNA” score, a preference matcher and a searchable map view.

![ATLAS preview](public/og.png)

## Highlights

- Editorial home page with responsive layouts and motion details.
- City profiles with a curated timeline, external source links and a visual score breakdown.
- Preference matching across ten city attributes.
- Searchable map view powered by MapLibre GL.
- Responsive behavior for desktop and mobile, including reduced-motion support.
- Shareable URLs for every view (`/city/tokyo`, `/explore?region=Europe`, `/compare`, …) with a proper 404 for unknown pages.
- Deployable as a Vite/Vinext application on a Cloudflare Worker.

## Stack

- Next.js-compatible React components through [Vinext](https://github.com/cloudflare/vinext)
- TypeScript
- Vite
- Framer Motion
- MapLibre GL
- Tailwind CSS 4
- Cloudflare Workers

## Run locally

Requirements:

- Node.js `>=22.13.0`
- Bash-compatible shell with `flock`, `curl` and GNU `timeout` for the repository helper scripts

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

On Windows, run the Bash-based commands from WSL or Git Bash. The bundled build helpers target the Linux environment used by the deployment pipeline.

Useful checks:

```bash
npm run typecheck
npm run lint
npm test
```

`npm test` runs the scoring unit tests, then builds the deployable artifact and checks that the worker returns the expected rendered HTML and metadata. `npm run test:unit` runs only the fast unit tests.

## Project structure

```text
app/         Routes (App Router): home, city/[id], explore, compare, discover, favorites
components/  Page and UI components, including the map and the DNA backdrop
lib/         City data, pure scoring logic and safe localStorage helpers
public/      Favicon, social preview and static assets
worker/      Cloudflare Worker entry point
build/       Build and artifact packaging helpers
tests/       Scoring unit tests and rendered HTML smoke test
```

The city dataset lives in [`lib/cities.ts`](lib/cities.ts). Each timeline entry links to the source used for the corresponding fact. Population, average temperature and score values are curated product data for the experience, not a live data feed. Matching and ranking rules live in [`lib/scoring.ts`](lib/scoring.ts).

Images are loaded from Unsplash URLs at runtime, sized per layout through `imageAt()`, so the preview and some city cards require network access.

Saved cities and match preferences are stored in the visitor's browser. If storage is unavailable (for example in some private browsing modes), they keep working for the current visit.

## Deployment

The project includes the configuration and scripts needed for the optional Sites/Cloudflare deployment path. The standard build command is:

```bash
npm run build
```

The build validates the generated artifact before it is ready to serve. Set `SITE_URL` (for example `https://atlas.example.com`) to use a fixed canonical URL for social preview images; otherwise the request host is used.

## License

No license has been selected yet. If you reuse this project, please ask the author before distributing modified or commercial versions.
