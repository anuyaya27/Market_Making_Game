# Market_Making_Game
Market Making Game Simulator for Quant Trader/Research Interviews

## Deploy

- Frontend: deploy `index.html` directly to GitHub Pages. There is no build step.
- Proxy: deploy `api/openai-proxy.js` as a Vercel serverless function.
- Vercel environment variables:
  - `OPENAI_API_KEY`: your OpenAI API key.
  - `ALLOWED_ORIGIN`: your GitHub Pages origin, for example `https://yourname.github.io`.
  - `OPENAI_MODEL`: optional, defaults to `gpt-4o-mini`.
- After deploying to Vercel, paste the function URL into `const PROXY_URL = ""` near the top of the inline JavaScript in `index.html`.
  - If the frontend is also hosted on Vercel, use `/api/openai-proxy`.
  - If the frontend stays on GitHub Pages, use `https://your-vercel-app.vercel.app/api/openai-proxy`.
