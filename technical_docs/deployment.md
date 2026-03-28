# Deployment

## Local Development

```bash
npm run dev
# → http://localhost:5173
```

Hot Module Replacement (HMR) is handled by Vite — changes are reflected instantly in the browser.

## Production Build

```bash
npm run build
```

Output lands in `dist/`. TypeScript is compiled first (`tsc -b`), then Vite bundles and tree-shakes.

**Typical output sizes (gzipped):**

| Chunk | Size |
|---|---|
| `index.js` (React + core) | ~97 KB |
| `Portfolio.js` | ~1.6 KB |
| `Donation.js` | ~1.0 KB |
| `ComingSoon.js` | ~1.4 KB |
| `Licensing.js` | ~1.3 KB |
| `index.css` | ~5 KB |

## Preview Production Build Locally

```bash
npm run preview
# → http://localhost:4173
```

## Hosting Options

### Netlify / Vercel (recommended)

Both can deploy directly from the Git repository.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- No server-side config needed — this is a static SPA.

> **Important:** Configure a catch-all redirect so React Router handles unknown paths.  
> Netlify: add `public/_redirects` with `/* /index.html 200`.  
> Vercel: add `vercel.json` with rewrites.

### Netlify `_redirects`

Create `public/_redirects`:

```
/*  /index.html  200
```

### Vercel `vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### GitHub Pages

GitHub Pages does not natively support SPA routing. Use the `gh-pages` package with a custom 404.html redirect workaround, or prefer Netlify/Vercel.

## MSYS2 / MinGW64

Use `setup.sh` from the repository root to install Node.js (if missing) and start the dev server in one command:

```bash
bash setup.sh
```

The script uses `pacman -S mingw-w64-x86_64-nodejs` to install Node.js into the MinGW64 environment if it is not already present.
