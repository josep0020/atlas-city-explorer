# ATLAS — City Explorer

ATLAS is an interactive city explorer for comparing the character of cities through movement, atmosphere, culture, nature, cost, safety and transit. It combines an editorial landing page with city profiles, a visual “city DNA” score, a preference matcher and a searchable map view.

![ATLAS preview](public/og.png)

## Highlights

- Editorial home page with responsive layouts and motion details.
- City profiles with a curated timeline, external source links and a visual score breakdown.
- Preference matching across ten city attributes.
- Searchable map view powered by MapLibre GL.
- Responsive behavior for desktop and mobile, including reduced-motion support.
- Deployable as a Vite/Vinext application with an optional Cloudflare Worker and D1 integration.

## Stack

- Next.js-compatible React components through [Vinext](https://github.com/cloudflare/vinext)
- TypeScript
- Vite
- Framer Motion
- MapLibre GL
- Tailwind CSS 4
- Cloudflare Workers and optional D1/Drizzle support

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

`npm test` builds the deployable artifact and checks that the worker returns the expected rendered HTML and metadata.

## Project structure

```text
app/       UI, city data and map components
public/    Favicon, social preview and static assets
worker/    Cloudflare Worker entry point
build/     Build and artifact packaging helpers
tests/     Rendered HTML smoke test
db/        Optional D1/Drizzle database layer
```

The city dataset lives in [`app/cities.ts`](app/cities.ts). Each timeline entry links to the source used for the corresponding fact. Population, temperature and score values are curated product data for the experience, not a live data feed.

Images are loaded from Unsplash URLs at runtime, so the preview and some city cards require network access.

## Deployment

The project includes the configuration and scripts needed for the optional Sites/Cloudflare deployment path. The standard build command is:

```bash
npm run build
```

The build validates the generated artifact before it is ready to serve. Database bindings are optional; the application can run without D1 configured.

## License

No license has been selected yet. If you reuse this project, please ask the author before distributing modified or commercial versions.
