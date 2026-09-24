/* Renders the page from the JSON files in /data.
   To change content, edit the JSON files. You shouldn't need to touch this file. */
(() => {
  "use strict";

  const FILES = ["profile", "experience", "projects", "education", "references"];
  const $ = (sel, root = document) => root.querySelector(sel);

  /* Small helper for building elements: h("p", {class: "x"}, "text", child) */
  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  const pad = (n) => String(n).padStart(2, "0");
  const isExternal = (url) => /^https?:\/\//.test(url);
  const linkAttrs = (url) => (isExternal(url) ? { target: "_blank", rel: "noopener" } : {});

  function copyButton(text) {
    const btn = h("button", { class: "copy", type: "button", "aria-label": `Copy ${text}` }, "Copy");
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(btn.previousElementSibling || btn);
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
        btn.textContent = "Selected";
      }
      setTimeout(() => (btn.textContent = "Copy"), 1600);
    });
    return btn;
  }

  /* ---------- Hidden contact details ----------
     Emails and phone numbers are stored encoded in the JSON ("enc:..." values) and only
     decoded when a visitor clicks "Show". Scrapers reading the HTML or JSON never see them.
     Plain values (no "enc:" prefix) still work. See README for how to encode a value. */
  function decode(v) {
    if (typeof v !== "string" || !v.startsWith("enc:")) return v;
    try { return [...atob(v.slice(4))].reverse().join(""); } catch { return ""; }
  }

  /* Adds a line-break opportunity after "@" so emails wrap at a sensible spot */
  function breakable(text) {
    const at = text.indexOf("@");
    if (at < 0) return [text];
    return [text.slice(0, at + 1), h("wbr"), text.slice(at + 1)];
  }

  function hiddenValue(stored, kind) {
    const wrap = h("span", { class: "reveal" });
    const btn = h("button", { class: "reveal__btn", type: "button" }, kind === "email" ? "Show email" : "Show number");
    btn.addEventListener("click", () => {
      const value = decode(stored);
      const href = kind === "email" ? `mailto:${value}` : `tel:${value.replace(/\s/g, "")}`;
      wrap.replaceChildren(h("a", { href }, breakable(value)), copyButton(value));
      wrap.classList.add("is-open");
      wrap.querySelector("a").focus();
    });
    wrap.append(btn);
    return wrap;
  }

  function tags(list) {
    return list && list.length ? h("ul", { class: "tags" }, list.map((t) => h("li", {}, t))) : null;
  }

  function setCount(name, n) {
    const el = $(`[data-count="${name}"]`);
    if (el) el.textContent = pad(n);
  }

  /* ---------- Profile / hero ---------- */
  function renderProfile(p) {
    const [first, ...rest] = p.Name.split(" ");
    const name = $('[data-bind="name"]');
    name.replaceChildren(first, h("span", { class: "last" }, rest.join(" "), h("span", { class: "dot" }, ".")));

    $('[data-bind="eyebrow"]').textContent = [p.Role, p.Location].filter(Boolean).join(" · ");
    $('[data-bind="greeting"]').textContent = p.Greeting || "";
    $('[data-bind="intro"]').replaceChildren(...(p.Intro || []).map((t) => h("p", {}, t)));

    if (p.Quote) {
      const q = $('[data-bind="quote"]');
      q.replaceChildren(
        p.Quote.Lead ? h("p", { class: "quote__lead" }, p.Quote.Lead) : null,
        h("blockquote", {}, p.Quote.Text)
      );
      q.hidden = false;
    }

    const photo = $('[data-bind="photo"]');
    photo.src = p.Photo;
    photo.alt = `Portrait of ${p.Name}`;

    const resume = $('[data-bind="resume"]');
    if (p.Resume) resume.href = p.Resume; else resume.hidden = true;

    $('[data-bind="footer"]').textContent = `© ${new Date().getFullYear()} ${p.Name}`;
    document.title = p.Name;

    /* Contact boxes */
    const boxes = [];
    if (p.Email) boxes.push(h("div", { class: "cbox" },
      h("span", { class: "cbox__label" }, "Email"),
      h("span", { class: "cbox__value" }, hiddenValue(p.Email, "email"))));
    if (p.Phone) boxes.push(h("div", { class: "cbox" },
      h("span", { class: "cbox__label" }, "Phone"),
      h("span", { class: "cbox__value" }, hiddenValue(p.Phone, "phone"))));
    if (p.Resume) boxes.push(h("a", { class: "cbox", href: p.Resume, target: "_blank", rel: "noopener" },
      h("span", { class: "cbox__label" }, "Resume"),
      h("span", { class: "cbox__value" }, "Open PDF ↗")));
    for (const l of p.Links || []) boxes.push(h("a", { class: "cbox", href: l.Url, ...linkAttrs(l.Url) },
      h("span", { class: "cbox__label" }, l.Text),
      h("span", { class: "cbox__value" }, l.Url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") + " ↗")));
    $('[data-list="contact"]').replaceChildren(...boxes);
  }

  /* ---------- Experience & education ---------- */
  function renderTimeline(name, items) {
    setCount(name, items.length);
    $(`[data-list="${name}"]`).replaceChildren(...items.map((it) =>
      h("li", { class: "tl" },
        h("div", { class: "tl__period" }, it.Period),
        h("div", { class: "tl__body" },
          h("div", { class: "tl__head" },
            it.Logo ? h("img", { class: "tl__logo", src: it.Logo, alt: `${it.Organization} logo`, loading: "lazy", width: 48, height: 48 }) : null,
            h("div", {},
              h("h3", { class: "tl__title" }, it.Title),
              h("div", { class: "tl__org" }, it.Organization))),
          it.Description ? h("p", { class: "tl__desc" }, it.Description) : null,
          tags(it.Technologies)))
    ));
  }

  /* ---------- Projects ---------- */
  let projects = [];
  let activeFilter = "All";

  function renderFilters() {
    const counts = {};
    projects.forEach((p) => (p.Technologies || []).forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    const top = Object.entries(counts).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t);
    const wrap = $('[data-list="filters"]');
    if (!top.length) { wrap.hidden = true; return; }
    wrap.replaceChildren(...["All", ...top].map((t) =>
      h("button", {
        class: "filter", type: "button", "aria-pressed": String(t === activeFilter),
        onclick: () => { activeFilter = t; renderFilters(); renderProjects(); }
      }, t)));
  }

  function renderProjects() {
    const list = activeFilter === "All" ? projects : projects.filter((p) => (p.Technologies || []).includes(activeFilter));
    setCount("projects", list.length);
    $('[data-list="projects"]').replaceChildren(...list.map((p) => {
      const cover = p.Images && p.Images[0];
      const initials = p.Name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      return h("li", { class: "card" },
        h("button", { class: "card__btn", type: "button", onclick: () => openProject(p), "aria-label": `Open ${p.Name}` },
          h("div", { class: "card__media" },
            cover
              ? h("img", { src: cover.Url, alt: cover.Alt || p.Name, loading: "lazy" })
              : h("div", { class: "card__placeholder", "aria-hidden": "true" }, h("span", {}, h("span", { class: "y" }, initials[0]), h("span", { class: "b" }, initials[1] || ""))),
            p.Images && p.Images.length > 1 ? h("span", { class: "card__count" }, `${p.Images.length} images`) : null),
          h("div", { class: "card__body" },
            h("span", { class: "card__year" }, p.YearRange),
            h("h3", { class: "card__title" }, p.Name),
            h("p", { class: "card__desc" }, p.Description),
            tags(p.Technologies),
            h("span", { class: "card__more" }, "View details →"))));
    }));
  }

  /* ---------- Project dialog + gallery ---------- */
  const modal = $("#project-modal");
  let gallery = [];
  let gi = 0;

  function showImage(i) {
    if (!gallery.length) return;
    gi = (i + gallery.length) % gallery.length;
    const img = gallery[gi];
    const el = $("[data-gallery-img]", modal);
    el.src = img.Url;
    el.alt = img.Alt || "";
    $("[data-gallery-caption]", modal).textContent = img.Description || "";
    $("[data-gallery-index]", modal).textContent = gallery.length > 1 ? `${pad(gi + 1)} / ${pad(gallery.length)}` : "";
    modal.querySelectorAll("[data-prev],[data-next]").forEach((b) => (b.hidden = gallery.length < 2));
  }

  function openProject(p) {
    gallery = p.Images || [];
    $("[data-gallery]", modal).hidden = !gallery.length;
    showImage(0);
    $("[data-modal-year]", modal).textContent = p.YearRange;
    $("[data-modal-title]", modal).textContent = p.Name;
    $("[data-modal-desc]", modal).textContent = p.Description;
    const t = $("[data-modal-tags]", modal);
    t.replaceChildren(...(p.Technologies || []).map((x) => h("li", {}, x)));
    $("[data-modal-links]", modal).replaceChildren(...(p.Links || []).map((l) =>
      h("a", { href: l.Url, ...linkAttrs(l.Url) }, `${l.Text} ↗`)));
    modal.showModal();
    modal.scrollTop = 0;
  }

  $("[data-prev]", modal).addEventListener("click", () => showImage(gi - 1));
  $("[data-next]", modal).addEventListener("click", () => showImage(gi + 1));
  $("[data-close]", modal).addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
  modal.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showImage(gi - 1);
    if (e.key === "ArrowRight") showImage(gi + 1);
  });

  /* ---------- References ---------- */
  function renderReferences(refs) {
    setCount("references", refs.length);
    const line = (label, stored, kind) => h("div", { class: "copyline" },
      h("span", { class: "copyline__label" }, label), hiddenValue(stored, kind));
    $('[data-list="references"]').replaceChildren(...refs.map((r) =>
      h("li", { class: "ref" },
        h("div", {}, h("h3", { class: "ref__name" }, r.Name), r.Role ? h("div", { class: "ref__role" }, r.Role) : null),
        h("p", { class: "ref__desc" }, r.Description),
        h("div", { class: "ref__contacts" },
          r.Email ? line("Email", r.Email, "email") : null,
          r.Phone ? line("Phone", r.Phone, "phone") : null))));
  }

  /* ---------- Boot ---------- */
  Promise.all(FILES.map((f) =>
    fetch(`data/${f}.json`, { cache: "no-cache" }).then((r) => {
      if (!r.ok) throw new Error(`data/${f}.json: ${r.status}`);
      return r.json();
    })))
    .then(([profile, experience, proj, education, references]) => {
      renderProfile(profile);
      renderTimeline("experience", experience);
      renderTimeline("education", education);
      projects = proj;
      renderFilters();
      renderProjects();
      renderReferences(references);
    })
    .catch((err) => {
      console.error(err);
      const msg = location.protocol === "file:"
        ? "The content couldn't load because this page was opened directly from disk. Run a local server in this folder (see README) and open it through that instead."
        : `Some content couldn't load (${err.message}). Check that the file exists and is valid JSON.`;
      $("main").prepend(h("p", { class: "load-error", role: "alert" }, msg));
    });
})();
