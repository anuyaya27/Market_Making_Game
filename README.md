# Market Making Game

Fermi-estimation market making simulator for quant trading interview practice.

## Deploy On Vercel

This project is set up for Vercel zero-config hosting:

- `index.html` at the repository root is served as the static frontend.
- `api/openai-proxy.js` is served as the serverless route at `/api/openai-proxy`.

No `vercel.json` is needed for this layout.

Steps:

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. In Vercel, open `Settings` -> `Environment Variables`.
4. Add `OPENAI_API_KEY` with your OpenAI API key.
5. Optionally add `OPENAI_MODEL`; if omitted, the proxy uses `gpt-4o-mini`.
6. Deploy.

The frontend calls the proxy with a same-origin relative URL:

```js
const PROXY_URL = "/api/openai-proxy";
```

## Local Development

Install the Vercel CLI:

```bash
npm i -g vercel
```

Create `.env.local` in the project root:

```text
OPENAI_API_KEY=sk-...
# Optional:
OPENAI_MODEL=gpt-4o-mini
```

Run locally:

```bash
vercel dev
```

Open the local URL printed by the CLI. Vercel will serve both `index.html` and `/api/openai-proxy` from the same local origin.
