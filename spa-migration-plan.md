# SPA Migration Plan: Convert Raw HTML Pages to Views with mu-switch

This plan lists all raw HTML pages and maps each to a new SPA route and view component. It then outlines steps to migrate the app to a single-page application using @calpoly/mustang's mu-history and mu-switch as described in lab13.md. Backward compatibility with legacy .html URLs will be removed.

## Inventory: Raw HTML pages to migrate

Source directory: `packages/app/src/pages`

- Auth
  - login.html
  - newuser.html
- Parks
  - parks/index.html (parks listing)
  - parks/park/index.html (park details; templated)
- Campsites
  - campsites/site/index.html (campsite details; templated)
- Paths
  - paths/index.html (paths listing)
- POI
  - poi/index.html (poi listing)
- Trips
  - trips/index.html (trips landing)
  - trips/itinerary.html (itineraries landing)
  - trips/yellowstone-summer-trip.html (trip detail)
  - trips/yosemite-fall-trip.html (trip detail)
  - trips/yellowstone-summer-itinerary.html (itinerary detail)
  - trips/yosemite-fall-itinerary.html (itinerary detail)
- Campers
  - campers/camper.html
  - campers/backpacker.html
  - campers/bikepacker.html

Note: There are duplicate legacy pages under `packages/proto/**`. Those will remain for reference but are not part of the live app after this migration.

## Target SPA routes and view components

- Home

  - Route: `/app`
  - View: `<home-view>` (exists)

- Parks

  - Route: `/app/parks`
  - View: `<parks-view>` (exists)
  - Route: `/app/parks/:parkid`
  - View: `<park-view park-id="...">` (new – refactor from `park-page`)

- Campsites

  - Route: `/app/campsites/:siteid`
  - View: `<campsite-view site-id="...">` (new – refactor from `campsite-page`)

- Paths

  - Route: `/app/paths`
  - View: `<paths-view>` (exists)
  - Route: `/app/paths/:pathid`
  - View: `<path-view path-id="...">` (new – refactor from `path-page`)

- Points of Interest

  - Route: `/app/poi`
  - View: `<poi-view>` (exists)
  - Route: `/app/poi/:poiid`
  - View: `<poi-detail-view poi-id="...">` (new – refactor from `poi-page`)

- Campers

  - Route: `/app/campers`
  - View: `<campers-view>` (exists)
  - Route: `/app/campers/:type` (type ∈ camper | backpacker | bikepacker)
  - View: `<camper-type-view type="...">` (new – simple content view)

- Trips

  - Route: `/app/trips`
  - View: `<trips-view>` (exists)
  - Route: `/app/trips/itineraries`
  - View: `<itinerary-view>` (exists)
  - Route: `/app/trips/:slug`
  - View: `<trip-view slug="...">` (new – renders static or API-backed trip content)
  - Route: `/app/itineraries/:slug`
  - View: `<itinerary-detail-view slug="...">` (new – renders static or API-backed itinerary content)

- Auth (moved into SPA)

  - Route: `/app/login`
  - View: `<login-view>` (new – reuses `mu-form` + existing `login-form` logic)
  - Route: `/app/register`
  - View: `<register-view>` (new)
  - Update `<mu-auth redirect="/app/login">`

- Root redirect
  - Route: `/`
  - Redirect → `/app`

## Component refactor mapping

Refactor existing “page” components into views that receive params (no direct window.location parsing):

- `packages/app/src/pages/park-page.ts` → rename/custom element: `<park-view park-id="...">`; change code to use the `@property({attribute: 'park-id'})` instead of parsing URL.
- `packages/app/src/pages/campsite-page.ts` → `<campsite-view site-id="...">`
- `packages/app/src/pages/path-page.ts` → `<path-view path-id="...">`
- `packages/app/src/pages/poi-page.ts` → `<poi-detail-view poi-id="...">`

New simple views (content-focused):

- `camper-type-view.ts` – renders content for camper/backpacker/bikepacker
- `trip-view.ts` – accepts `slug` param and renders trip details (static for now)
- `itinerary-detail-view.ts` – accepts `slug` param and renders itinerary details (static for now)
- `login-view.ts`, `register-view.ts` – wraps `mu-form` and existing `login-form` logic for SPA routing

## Router (mu-switch) updates

In `packages/app/src/main.ts`:

- Import the new/renamed view components
- Expand `routes` to include all above paths and pass params to views:
  - `/app/parks/:parkid` → `html` → `<park-view park-id=
${params.parkid}></park-view>`
  - Repeat for `campsites`, `paths`, `poi`, `campers/:type`, `trips/:slug`, `itineraries/:slug`
- Change `<mu-auth provides="natty:auth" redirect="/app/login">`

## Link updates (internal navigation)

Replace legacy links that point to `.html` files with SPA routes:

- `/parks/index.html` → `/app/parks`
- `/parks/{parkid}/index.html` → `/app/parks/{parkid}`
- `/campsites/{siteid}.html` → `/app/campsites/{siteid}`
- `/paths/{pathid}.html` → `/app/paths/{pathid}`
- `/poi/{poiid}.html` → `/app/poi/{poiid}`
- `/trips/index.html` → `/app/trips`
- `/trips/itinerary.html` → `/app/trips/itineraries`
- Specific trips/itineraries `.html` → `/app/trips/{slug}` or `/app/itineraries/{slug}`
- `login.html` → `/app/login`
- `newuser.html` → `/app/register`

These occur in breadcrumb components and card links across:

- `packages/app/src/pages/*.ts` (park/path/poi/campsite pages)
- `packages/app/src/views/*.ts` (itinerary/trips/home/parks/paths/poi/campers)

## Server changes (packages/server)

- Keep SPA handler (already present):
  - `app.use('/app', (req, res) => res.send(index.html))`
- Remove static legacy rewrites that served HTML templates (no longer needed):
  - `/parks/:parkid/index.html`
  - `/campsites/:siteid.html`
  - `/paths/:pathid.html`
  - `/poi/:poiid.html`
- Ensure Vite dev proxy covers `/api`, `/auth`, `/images`, `/login`, `/register` (already present in `packages/app/vite.config.ts`)

## Step-by-step migration

1. Prep and scaffolding

- Create new view files: `park-view.ts`, `campsite-view.ts`, `path-view.ts`, `poi-detail-view.ts`, `camper-type-view.ts`, `trip-view.ts`, `itinerary-detail-view.ts`, `login-view.ts`, `register-view.ts`.
- Export and register each via `define` in `main.ts`.

2. Refactor existing page components into param-driven views

- For each of `park-page.ts`, `campsite-page.ts`, `path-page.ts`, `poi-page.ts`:
  - Add `@property({attribute: '...-id'})` (e.g., `park-id`) and replace all URL parsing with the attribute.
  - Rename the custom element to `*-view` and update exports accordingly; or create thin wrappers that pass params to current implementation, then delete the old custom elements.

3. Router expansion

- Update `routes` in `main.ts` with param routes and new view elements.
- Update `<mu-auth>` redirect to `/app/login` in `index.html`.

4. Internal link sweep

- Update all internal anchors to SPA routes (see mapping above). Focus on breadcrumb and card links.
- Verify navigation with `<mu-history>` prevents full page reloads.

5. Remove legacy HTML assets

- Delete raw `.html` from `packages/app/src/pages/**` (except keep under `proto/**` for reference).
- If any CSS/images were referenced only from deleted files, either move into view components or remove if unused.

6. Server cleanup

- Remove legacy static rewrite routes in `packages/server/src/index.ts`.
- Keep the `/app` SPA route for deep-linking.

7. Verification (dev)

- Run the server and Vite dev server.
- Validate navigation for all routes, including deep links and browser refresh → no 404s and no full reload.
- Validate auth redirects to `/app/login` and back (using next param).

## Acceptance criteria

- All user-facing pages are reachable under `/app/...` without full page reloads.
- All legacy `.html` files under `packages/app/src/pages/**` are removed.
- Breadcrumbs and links use SPA routes consistently.
- Deep links (e.g., `/app/paths/grand-loop`) load via server SPA route in production and via Vite dev in development.
- Auth redirects use `/app/login` and return to the original route after login.

## Risks & mitigations

- Missed link updates cause page reloads → Use a quick grep for `.html` links and replace systemically.
- Page components rely on `window.location` → Refactor to use passed attributes; audit for leftover URL parsing.
- Server-side rewrites conflict → Remove the four legacy rewrites before testing SPA-only.
- Trip content is static → Implement `trip-view` and `itinerary-detail-view` as static for now; can later back with API.

## Work breakdown (implementation-ready)

- Routing & auth (2–3 hrs)
  - Update routes, redirect, and register views in `main.ts` and `index.html`.
- Refactor 4 detail pages (4–6 hrs)
  - park, campsite, path, poi → attribute-driven views
- Create 4–5 simple views (2–4 hrs)
  - camper-type, trip-view, itinerary-detail, login, register
- Link migration sweep (1–2 hrs)
- Server cleanup and final test (1 hr)

## Notes

- Existing views: `home-view`, `parks-view`, `paths-view`, `campers-view`, `trips-view`, `poi-view`, `itinerary-view`.
- Existing components to reuse: `nav-element`, `card-element`, `section-header`, `parks-listing`, and auth `login-form`.
