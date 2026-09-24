# Joonas Suuronen – Portfolio

A plain static website. There is no build step, framework or dependency.

```
index.html        page layout
css/style.css     all styling (colors are the tokens at the top)
js/main.js        reads the JSON files and renders the page
data/             ALL content lives here
images/           images referenced from the JSON
assets/resume.pdf resume
```

## Editing content

Edit the JSON files in `data/`:

| File | What it holds |
|---|---|
| `profile.json` | name, role, intro text, quote, email, phone, links, photo, resume path |
| `experience.json` | jobs, newest first |
| `projects.json` | projects, in the order they appear |
| `education.json` | schools and degrees |
| `references.json` | references and their contact details |

Every list is shown in the order it appears in its file. To add an item, copy an existing one and change the values.
Image paths are relative, e.g. `images/MyProject/shot1.webp` (no leading `/`), so the site also works from a sub-folder
such as `username.github.io/PortfolioWebsite/`.

Project technology filters are generated automatically from technologies that appear in 2 or more projects.

## Emails and phone numbers (scraper protection)

Emails and phone numbers in `profile.json` and `references.json` are stored encoded, like
`"Email": "enc:bW9jLmxpYW1nQDluZW5vcnV1c2o="`. The page only decodes them when a visitor clicks
**Show email** / **Show number**, so they never appear in the HTML or JSON as readable text.

To encode a new value, open any browser's developer console (F12 → Console) and run:

```js
"enc:" + btoa([..."someone@example.com"].reverse().join(""))
```

Paste the result (including `enc:`) into the JSON. A plain, unencoded value also works but isn't protected.

## Previewing locally

The page loads JSON with `fetch`, so it must be served over http (double-clicking `index.html` won't load content).
Run one of these in this folder, then open http://localhost:8000

```
python -m http.server 8000
# or
npx serve -l 8000
```

The VS Code "Live Server" extension also works.

## Deploying

Upload the folder as-is to any static host. With GitHub Pages:

1. Push this folder to the repository root on the `main` branch.
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The site goes live at `https://<username>.github.io/<repo>/` within a minute. Every later push redeploys automatically.

Netlify, Vercel and Cloudflare Pages work the same way: point them at the repo, leave the build command empty and set the output directory to the root.

## Adding images

Keep screenshots around 1600px wide or smaller. WebP is used for size; JPG and PNG work too.
