# Febin C S — portfolio

Portfolio site built with Next.js (App Router), exported as a static site.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # writes the static site to out/
```

The `out/` folder can be uploaded to any static host (Vercel, Netlify, GitHub Pages).

## How it is laid out

- `app/` has one folder per page: `/` (home), `/about`, `/work`, `/workshops`, `/recognition`,
  `/experience`, `/contact`. Each `page.tsx` only lists the sections that page shows.
  `layout.tsx` holds what every page shares; `template.tsx` plays the page entrance.
- `app/styles/` has one stylesheet per area (`base`, `layout`, `shared`, `journey`, then one
  per page). `app/globals.css` only imports them, in that order.
- `components/sections/` has one file per section (Hero, About, Projects, Workshops, ...).
- `components/` has the interactive pieces those sections use:
  - `Board`, `Stage`: the hero's circuit board and its live signal scope
  - `Rail`, `Traces`: the Process section's sideways scroll and its animated traces
  - `ProjectBrowser`, `Chain`: the Work page's arc of cards, the open project's file, the signal chain
  - `Panes`: the Workshops page's glass panes
  - `Deck`: the Recognition page's certificate deck
  - `Gallery`, `Viewer`: photo thumbnails and the full-size viewer
  - `Typed`, `useAutoplay`: the typewriter, and the "runs by itself until touched" behaviour
  - `Nav`, `Footer`, `PageEnd`, `PageStart`, `Transit`: moving around and between pages
  - `Effects`: pointer light and tilt, and the cream flip
- `content/site.ts` has all the text, the photo lists and the list of pages for the nav.

## How it behaves

- Scrolling past the end of a page loads the next one; scrolling up past the top of a page
  goes back. The order is the nav's order.
- The pin diagram (home), the panes (Workshops) and the deck (Recognition) run by themselves.
  Touching one stops it for two minutes (`QUIET` in `components/useAutoplay.ts`).
- Sections marked `paper` turn the whole screen cream while they hold the middle of it.

## Edit the content

All text lives in `content/site.ts`: profile, capabilities, projects, workshop photos, certificates, experience, education.

## Add photos

Copy images into `public/photos/`, then list them in `content/site.ts` with their width and
height: under a project's `shots` (the first one is its main photo), a workshop event's
`shots`, or `recognition` for a certificate.

The résumé button downloads `public/Febin-C-S-Resume.pdf`; replace that file to update it.
