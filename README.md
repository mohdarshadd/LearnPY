# LearnPY

Learn the Python data stack in the browser. Short lessons, runnable examples, and
auto-checked exercises for **NumPy**, **pandas**, **Matplotlib**, and **scikit-learn**.

Everything runs client-side with [Pyodide](https://pyodide.org) — no account, no server,
no install.

## Stack

- Next.js 16 (App Router, Cache Components) + React 19
- TypeScript, Tailwind CSS v4
- Pyodide running in a Web Worker
- CodeMirror 6, Zustand, Fuse.js

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy

Built for Vercel. All lesson content is static; Python execution happens in the visitor's
browser.
