# Tyler Loomis: Resume Site

An interactive resume. A 3D Mapbox globe shows every place I've worked. Click a pin to fly into the building and see the roles and design work from that job. Recruiters can filter by company and year, or switch to a plain resume view that prints to PDF.

## Run locally

```sh
npm install
cp .env.example .env.local   # then paste your Mapbox public token
npm run dev                  # http://localhost:5173
```

## Edit your content

All content lives in [`src/data/experience.ts`](src/data/experience.ts): profile, jobs, positions, highlights, and portfolio items. Put portfolio images in `public/portfolio/` and reference them as `/portfolio/name.jpg`.

To get building coordinates, right-click the building in Google Maps and copy the lat/lng.

## Build

```sh
npm run build   # outputs static files to dist/
```

`dist/` is a static site. Deploy it to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages) and point the GoDaddy domain at it with DNS records.

## Mapbox token

Use a **public** token (`pk.`). In the Mapbox dashboard, restrict it to your domain and `localhost` before going live.
