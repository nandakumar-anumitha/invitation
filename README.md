# V Nandakumar & K Anumitha — Wedding Invitation

A responsive, buildless invitation for GitHub Pages. No npm, framework, database, or API key is needed. Upload **the contents of this folder**, keeping the `assets/` folder alongside `index.html`.

## Deploy with GitHub Actions

Repository: https://github.com/nandakumar-anumitha/invitation
Wedding branch: `marriage`
Expected Pages URL: https://nandakumar-anumitha.github.io/invitation/

The `.github/workflows/deploy-pages.yml` workflow deploys the wedding website on pushes to `marriage`. It uploads only the wedding HTML, CSS, JavaScript, configuration, and assets. Existing engagement source files inherited from `main` are not included in this deployment.

1. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
2. In **Actions**, select **Deploy wedding invitation to GitHub Pages** and inspect the run triggered by the push to `marriage`.
3. If deployment environment protection restricts branches, permit `marriage` for the `github-pages` environment.
4. Subsequent commits to `marriage` deploy automatically. The `main` branch is unchanged.

This Pages deployment uses the repository's existing public site URL and replaces its content with the wedding invitation when it succeeds. The workflow does not remove the engagement code from `main`.

## Preview

Open `index.html` for a basic preview. To use PDF checks, serve the folder: run `python -m http.server 8080` from this directory, then visit `http://localhost:8080`. Publish before sharing with guests.

## Invitation PDF and phone numbers

The six supplied invitation photographs have been combined into `assets/invitation.pdf`. The six-page PDF uses consistent ivory and antique-gold framing, page labels, and bookmarks. Photographs have conservative brightness, contrast, and sharpening adjustments; printed wording is preserved. Original photo artifacts such as creases, perspective, and glare remain.

The website includes separate Wedding invitation (6 pages) and Engagement album (18 pages) tabs, with thumbnails, previous/next controls, 75–200% zoom, fullscreen viewing, original PDF downloads, and an optional native PDF preview. The engagement PDF is an unchanged copy of the supplied photo album. Its lightweight JPEG page previews load individually; the full original PDF downloads only when opened or downloaded. The reader uses natural page height and normal vertical scrolling so hovering or swiping over an image does not trap page scrolling. At larger zoom levels, horizontal scrolling remains available. The page images are local assets and work on GitHub Pages.

Edit **config.js** to replace the PDF or add phone numbers:

```js
pdfUrl: 'assets/invitation.pdf', // first add your actual PDF to assets/
rsvpPhone: '',                 // add international digits, e.g. country code + number
contacts: [],                  // [{ name: 'Groom’s family', phone: '+91…' }]
siteUrl: ''                    // your published HTTPS URL
```

Leave missing values empty. The PDF placeholder remains visible until a configured file can be fetched and verified as a PDF. The toolbar offers view, page-image zoom, fullscreen, and download. The native PDF preview can be expanded below the enhanced reader. Native PDF rendering/zoom varies by browser; View Invitation opens the original. Cross-origin PDF URLs require CORS for verification and might not support download. A PDF hosted in `assets/` is recommended. No phone numbers or venue addresses are invented.

## Guest features

- English/Tamil switch, with language preference remembered on the current browser.
- Live wedding and reception countdowns use explicit `+05:30` timestamps. They show zero once the date arrives.
- Downloadable `.ics` calendar events use UTC timestamps, displaying correctly across timezones. Start times are 6 PM IST on 15 November and 6 AM IST on 16 November 2026. Each event reserves one hour solely as a calendar placeholder; the actual end times were not supplied. This is explained inside the calendar description. The ceremony start is not described as a confirmed muhurtham.
- Both events use the supplied Google Maps link. Because it is a shared short link, **Get Directions** opens that exact Maps location; the guest taps Directions there. Set `directionsUrl` only if you have a verified direct directions URL.
- The local QR in `assets/location-qr.svg` encodes the supplied location and works without a QR service. If `locationUrl` changes, the page uses api.qrserver.com to generate its public-location QR; regenerate the local QR if you want all QR assets local. A failed QR load shows a fallback location link.
- Customizable WhatsApp wishes open WhatsApp for the guest to send. With `rsvpPhone` configured, wishes open addressed to that number. Otherwise guests select a family recipient in WhatsApp.
- The attendance RSVP form, personalized guest link generator, and footer WhatsApp sharing button have been removed. The WhatsApp wishes option and invitation sharing control remain available.
- Previously shared `?guest=Guest%20Name` URLs can still display a personalized greeting. The guest-link generator is no longer shown.
- Phone buttons appear only after valid contacts are configured.
- Decorative petals respect reduced-motion preferences. No music is included because no licensed audio was provided; nadaswaram was optional. Artwork is local SVG. Google Fonts loads online, with system fallbacks available offline.

## Files

- `index.html` — invitation and all English/Tamil text
- `styles.css` — responsive maroon, gold, and ivory design
- `app.js` — countdowns, sharing, QR, calendar files, PDF, wishes
- `config.js` — optional PDF, phone numbers, public URL, and venue links
- `assets/invitation.pdf` — six-page invitation PDF
- `assets/invitation/` — enhanced page images and thumbnails
- `assets/engagement.pdf` — original 18-page engagement photo album
- `assets/engagement/` — album page previews and thumbnails
- `assets/location-qr.svg` — scannable QR code for the supplied location
- `.nojekyll` — tells GitHub Pages to serve the static files directly

The supplied Google Maps link was preserved exactly. Its destination could not be independently resolved during creation. Confirm that it opens the intended venue before sharing publicly.
