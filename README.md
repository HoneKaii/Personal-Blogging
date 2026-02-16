# Generic Blog

Generic Blog is a dark "blogbear" themed personal blogging page designed to run on GitHub Pages.
It behaves like a lightweight Tumblr-style feed: you write a post, publish it, and it appears in reverse chronological order.
A built-in calendar lets you jump to specific days and browse posts from days before or after.

## Features

- Dark blogbear visual style.
- Create posts directly in the browser.
- Feed view sorted newest-to-oldest.
- Monthly calendar with markers for days that have posts.
- Day navigation (previous/next) for quick archive browsing.
- Local persistence via browser `localStorage`.

> Note: Posts are stored in your browser, not on a server. This is ideal for a static GitHub Pages deployment, but the posts are device/browser-specific unless you add a backend.

## What GitHub Pages uses (and what is required)

GitHub Pages hosts static websites directly from your repository. For this project, the required pieces are:

1. **Static files in your repo**: `index.html`, `style.css`, `script.js`.
2. **A publish source**: usually `main` branch root or `/docs` folder.
3. **Repository Pages settings enabled**: in GitHub repo settings, choose the branch/folder source.
4. **An entry page**: GitHub Pages serves `index.html` as the homepage.

### Optional GitHub Pages details

- GitHub Pages can process sites with **Jekyll** by default.
- This project is plain HTML/CSS/JS, so no special build pipeline is required.
- If you ever add files/folders that Jekyll ignores (for example those starting with `_`) and still want them served, add a `.nojekyll` file.

## Run locally

Open `index.html` in your browser, or use a local static server.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/ (root)`
4. Save and wait for deployment.
5. Your blog will be available at:
   - `https://<your-username>.github.io/<repo-name>/` (project site), or
   - `https://<your-username>.github.io/` (user site repo format).

## Migrate this to your own personal website

If you want this on your own domain (for example `blog.yourdomain.com`), use this path:

1. **Choose hosting**
   - Keep GitHub Pages, or move to another static host (Cloudflare Pages, Netlify, Vercel, your own server).
2. **Point your domain**
   - Update DNS records at your domain registrar.
   - For GitHub Pages, configure `CNAME` and matching DNS records.
3. **Set the custom domain**
   - In host settings (or GitHub Pages settings), set your domain and enable HTTPS.
4. **Move files**
   - Upload/copy `index.html`, `style.css`, `script.js` to the new host.
5. **Handle data persistence if needed**
   - Current posts are in browser `localStorage` only.
   - For real cross-device publishing, add a backend/API + database (for example Supabase, Firebase, or your own server).
6. **Optional improvements for production**
   - Add authentication for posting.
   - Add image upload support.
   - Add export/import for backups.

## File overview

- `index.html` – page structure and app sections (composer, calendar, feed).
- `style.css` – dark blogbear theme styling.
- `script.js` – posting logic, feed rendering, calendar filtering, and local storage.
