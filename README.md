# McNeilNews

McNeilNews is a light pastel autumn-floral themed wedding update page.
It works like a lightweight feed: post updates, browse by date in the calendar, and let visitors comment under each update.

## Features

- Light pastel autumn-floral color palette.
- Big day highlighted on **21 March**.
- Post updates in-browser with comments.
- Monthly calendar with post markers.
- Wedding countdown shown in the calendar card.
- Vertical photo strip on the outside of the main page.
- Extra tabs/pages:
  - Checklist & Info
  - Media
  - How We Met
  - Travel
  - Need to Know
- Local persistence via browser `localStorage`.
- Added favicon support (`/favicon.svg`) with `/favicon.ico` redirect for browser compatibility.

## 21 March fix confirmation

The calendar now uses a **local date key** (`YYYY-MM-DD` from local time) instead of UTC `toISOString()` slicing, which prevents accidental day-shift highlighting. This ensures the big day marker is on **March 21**.

## Netlify compatibility

This project is fully static HTML/CSS/JS and works directly on Netlify.

### Deploy on Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import from Git**.
3. Build settings:
   - Build command: *(leave blank)*
   - Publish directory: `.`
4. Deploy.

No server runtime is required.

### If Netlify shows "Page not found"

1. Confirm `netlify.toml` is in the repository root.
2. Confirm publish directory is `.` (project root), not a subfolder.
3. Re-deploy after any `netlify.toml` changes.
4. Use clean routes like `/media`, `/travel`, `/checklist` (redirected to `.html` pages).
5. Unknown paths now fall back to `index.html` instead of the default Netlify 404 page.

6. If devtools shows `/favicon.ico` 404, ensure `favicon.svg` is present and deployed (this repo now includes a redirect from `/favicon.ico` to `/favicon.svg`).

## How to add media/album content (Netlify-friendly)

Media is driven by `media-config.js`.

### Add local images/videos

1. Add files to `media/photos/` (example: `media/photos/couple-shoot.jpg`).
2. Open `media-config.js` and add an entry:

```js
{
  title: "Couple Shoot",
  type: "image", // or "video"
  src: "media/photos/couple-shoot.jpg",
  caption: "Golden hour at the venue."
}
```

3. Commit and push; Netlify redeploys automatically.

### Add Google Photos album link

Use a `type: "link"` entry in `media-config.js`:

```js
{
  title: "Guest Upload Album",
  type: "link",
  src: "https://photos.google.com/share/...",
  caption: "Upload your photos here"
}
```

## File overview

- `index.html`: main feed page + outside vertical photo strip.
- `style.css`: shared autumn theme styles.
- `script.js`: posting, comments, calendar behavior, and photo strip rendering.
- `media-config.js`: central media album configuration.
- `media.html` + `media.js`: media gallery page.
- `checklist.html` + `checklist.js`: checklist page and logic.
- `how-we-met.html`: couple story page.
- `travel.html`: travel information page.
- `need-to-know.html`: key logistics page.
