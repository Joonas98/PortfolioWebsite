# Joonas Suuronen – Portfolio

Personal portfolio website of Joonas Suuronen, software engineer from Espoo, Finland.

**Live site:** https://joonas98.github.io/PortfolioWebsite/

The site is plain HTML, CSS and JavaScript with no framework, build step or dependencies. All of the content
(introduction, work experience, projects, education and references) lives in JSON files, and a small script renders
it into the page when it loads.

## Features

- **Content-driven:** every section is generated from a JSON file in `data/`, so adding or editing an entry never
  requires touching HTML.
- **Project gallery:** projects are shown as cards. Clicking one opens a dialog with an image gallery (arrow keys
  work), the full description and links.
- **Technology filters:** filter chips are generated automatically from technologies used in two or more projects.
- **Scraper-resistant contact details:** email addresses and phone numbers are stored encoded and only decoded in the
  browser when a visitor clicks *Show email* or *Show number*. They never appear as readable text in the HTML or JSON.
- **Responsive and accessible:** works down to phone width, supports keyboard navigation and respects
  reduced-motion settings.
- **Lightweight:** images are WebP; the whole site is around 3.5 MB, and each page view loads only what is visible.

## Project structure

```
index.html            page skeleton
css/style.css         all styling; colors and fonts are defined as variables at the top
js/main.js            loads the JSON files and renders every section
data/
  profile.json        name, role, introduction, quote, contact details, links, photo and resume path
  experience.json     work history, newest first
  projects.json       projects, in display order
  education.json      education, newest first
  references.json     references and their contact details
images/               photo, company logos and project screenshots
assets/resume.pdf     resume linked from the page
```

## Content format

Entries appear in the same order as in their file. A project entry looks like this:

```json
{
  "Name": "Project name",
  "Description": "What it is and what I did.",
  "Technologies": ["C#", "Unity"],
  "YearRange": "2024 - 2025",
  "Links": [{ "Text": "GitHub", "Url": "https://github.com/..." }],
  "Images": [{ "Url": "images/Folder/shot1.webp", "Description": "Caption", "Alt": "Alt text" }]
}
```

Image paths are relative (no leading `/`), so the site works both at a domain root and in a sub-folder such as
GitHub Pages' `username.github.io/repository/`. `Images` and `Links` can be left empty; a project without images gets a
generated placeholder.

### Encoded contact details

`Email` and `Phone` values starting with `enc:` are Base64 of the reversed string. To encode a new value, run this in
any browser console:

```js
"enc:" + btoa([..."someone@example.com"].reverse().join(""))
```

Plain values without the prefix also work, but they are not protected from scrapers.

## Run your own copy

To try changes to the content before publishing them, download the repository and serve the folder with any local web
server. Opening `index.html` straight from disk won't work, because browsers block the page from loading its JSON files
that way. For example:

```
python -m http.server 8000
```

Then open http://localhost:8000.

To publish a copy, upload the repository as it is to any static host (GitHub Pages, Netlify, Cloudflare Pages or a
plain web server). There is no build command. This site is served by GitHub Pages from the `main` branch, so every
commit to `main` is live within a minute or two.

## Previous version

The earlier Blazor WebAssembly version of this portfolio is archived at
[Joonas98/OldPortfolioWebsite](https://github.com/Joonas98/OldPortfolioWebsite).
