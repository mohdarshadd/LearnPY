# LearnPY

Learn the Python data stack in the browser. Short lessons, runnable examples, and
auto-checked exercises for **NumPy**, **pandas**, **Matplotlib**, and **scikit-learn**.

Everything runs client-side with [Pyodide](https://pyodide.org) - no account, no
server, no install.

## Stack

- Next.js 16 (App Router, Cache Components) + React 19
- TypeScript, Tailwind CSS v4
- Pyodide running in a Web Worker
- CodeMirror 6, Zustand, Fuse.js
- Vitest for content and protocol checks

## Local development

Requires Node.js 24 or newer.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The GitHub Actions workflow in `.github/workflows/ci.yml` runs the same checks on
every push to `main` and on pull requests.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New > Project** and import the repository.
3. Keep the detected Next.js settings and the default build command (`npm run build`).
4. Deploy. No environment variables are required for a working site.

Optional: set `NEXT_PUBLIC_SITE_URL` to the canonical origin (for example,
`https://learnpy.example`) so `metadataBase`, `sitemap.xml`, and `robots.txt` use the
final domain. Otherwise Vercel's production hostname is used automatically during a
Vercel build, with `http://localhost:3000` as the local fallback.

Python packages and the Pyodide runtime are fetched from jsDelivr by the visitor's
browser. The deployment serves static content and does not run Python on the server.

## Project layout

- `app/` - routes for lessons, references, playground, capstone, and progress
- `components/` - lesson rendering, runners, editors, and navigation UI
- `content/` - typed lessons and references, validated through Zod at import time
- `lib/pyodide/` - worker protocol and the queued browser-side runner
- `public/pyodide.worker.js` - module worker that loads packages and captures plots
- `tests/` - Vitest coverage for registry invariants, protocol constants, and site URLs

## Content

The curriculum has 25 lessons and 26 reference entries. Add new material in
`content/lessons/` or `content/references/`, then export it from the matching index.
The registry rejects duplicate IDs, duplicate routes, and invalid lesson shapes.

After adding or renaming a route, run `npm run build` to regenerate Next.js route types.
