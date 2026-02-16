# McNeilNews

McNeilNews is a dark-themed wedding update page designed for GitHub Pages.
It works like a lightweight feed: post updates, browse by date in the calendar, and let visitors comment under each update.

## Features

- Dark "blogbear" wedding theme.
- Post updates in-browser.
- Reverse-chronological feed.
- Monthly calendar with post-day markers.
- Previous/next day navigation.
- Comments under each post.
- Dedicated checklist/info page in a new tab.
- Local persistence via browser `localStorage`.

> Note: Updates, comments, and checklist data are saved locally in the browser only.

## What GitHub Pages uses (and what is required)

GitHub Pages hosts static websites directly from your repository.
For this project you need:

1. **Static files**: `index.html`, `style.css`, `script.js`, and `checklist.html` / `checklist.js`.
2. **A publish source**: usually branch root (`main`) or `/docs`.
3. **Pages enabled in repository settings**.
4. **`index.html`** as the homepage entry point.

Optional notes:

- GitHub Pages can process Jekyll by default.
- This project is plain HTML/CSS/JS, so no build tool is required.
- Add `.nojekyll` if you later need files served that Jekyll would otherwise ignore.

## Deploy to GitHub Pages

1. Push the repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
4. Save and wait for deployment.

## Photo uploads: best option for your use case

Since you already use Google Photos, the easiest and most reliable option is:

### Recommended now: Google Photos shared album (best immediate option)

- Create a shared wedding album.
- Put the album link on McNeilNews.
- Let guests upload directly into that album.

Why this is best for now:
- No custom backend needed.
- You keep everything in the photo platform you already use.
- Storage and media handling are managed by Google.

### Alternative: Upload files directly to the page

This requires a backend service (or object storage + signed upload flow), because GitHub Pages is static and cannot accept uploaded files by itself.
If you eventually want direct uploads in-site, common options are:

- Firebase Storage + auth
- Supabase Storage + auth
- Cloudinary upload widget
- S3-compatible storage with an API endpoint

## Migrate this to your personal website

1. Choose hosting (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).
2. Point DNS for your domain/subdomain (for example `news.yourdomain.com`).
3. Set custom domain and enable HTTPS.
4. Move static files: `index.html`, `style.css`, `script.js`, `checklist.html`, `checklist.js`.
5. If you want shared data across devices/users, add a backend + database.

## File overview

- `index.html`: main feed page for wedding updates.
- `style.css`: shared dark theme styles.
- `script.js`: update posting, comments, feed/calendar behavior.
- `checklist.html`: separate checklist/info page.
- `checklist.js`: checklist state handling.
