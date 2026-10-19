# Calic Design

Website for **Calic Design**, an interior design & build studio in Malaysia (est. 1998).
Live at [calic.neutronast.com](https://calic.neutronast.com).

Built with [Astro](https://astro.build) 7, Tailwind CSS 4 and TypeScript. The output is a fully static site with zero client-side frameworks.

## Develop

```sh
nvm use            # Node 22.22+
npm install
npm run dev        # http://localhost:4321
npm run build      # astro check + static build to dist/
npm run preview    # serve dist/ (CSP is only active in build/preview, not dev)
```

## Project structure

```
src/
  content/
    projects/*.md     # one file per project (specs, cover, gallery + alt text)
    services/*.md     # one file per service
  content.config.ts   # typed schemas for the above
  assets/             # source images (web masters, EXIF stripped); Astro emits AVIF/WebP variants
  components/         # Header, Footer, Gallery (lightbox), ContactForm, cards…
  layouts/Base.astro  # <head>, SEO / Open Graph / JSON-LD, header & footer
  pages/              # routes
  scripts/*.ts        # small progressive-enhancement scripts (menu, lightbox, reveal, form)
  styles/global.css   # design tokens (light/dark) + Tailwind utilities
public/
  _headers            # security headers (Cloudflare)
  _redirects          # 301s from the old *.html URLs (Cloudflare)
```

### Adding a project

1. Put photos in `src/assets/projects/<slug>/` (ideally ≤ 2400px wide).
2. Copy `src/content/projects/the-mines.md` to `<slug>.md` and edit the frontmatter. Every gallery image needs `alt` text.
3. `npm run build`. The page `/projects/<slug>` is generated automatically.

## Security

- **CSP**: Astro (`security.csp` in `astro.config.mjs`) emits a hash-based `Content-Security-Policy` meta tag on every page, so only the site's own bundled scripts and styles can run. There are no third-party scripts, fonts or CDNs: everything is self-hosted.
- **HTTP headers** (`public/_headers`): HSTS, `X-Frame-Options`/`frame-ancestors`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP. These need a host that supports `_headers`, such as Cloudflare.
- **Images**: EXIF/GPS metadata is stripped from all source and generated images.
- **Supply chain**: GitHub Actions are pinned to commit SHAs, `npm ci --ignore-scripts`, `npm audit` runs in CI, and Dependabot keeps npm and Actions dependencies updated.
- **Contact form**: currently **not connected** to a backend. Client-side validation and a honeypot field are in place. To enable it, set `endpoint` in `src/components/ContactForm.astro`, add the provider's origin to `form-action` / `connect-src` in `astro.config.mjs`, and implement the POST in `src/scripts/contact-form.ts`.

## Deploy

### Cloudflare (recommended)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick this repo.
2. Build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION=22.22.0`.
3. **Custom domains** → add `calic.neutronast.com`. This is automatic if `neutronast.com` is already on Cloudflare.
4. In GitHub, set repository variable `DEPLOY_TARGET=cloudflare` so the GitHub Pages deploy job is skipped, then disable GitHub Pages.

Every branch and PR gets its own preview URL.

### GitHub Pages (fallback)

`.github/workflows/ci.yml` builds and deploys `dist/` on pushes to `main`. GitHub Pages ignores `_headers` and `_redirects`, so you only get the meta-tag CSP there.
