// Robot skill explorer. Picking a part (or a filter) slides it out of the robot
// along a guide line, like an exploded assembly drawing, and lists its skills.
(() => {
  const wrap = document.querySelector(".robot-wrap");
  if (!wrap) return;
  const NS = "http://www.w3.org/2000/svg";
  const svg = wrap.querySelector(".robot");
  const parts = [...svg.querySelectorAll(".part")];
  const frame = svg.querySelector(".frame");
  const guides = svg.querySelector(".guides");
  const chips = [...document.querySelectorAll(".chip-btn")];
  const panel = document.querySelector(".panel");
  const areas = [...panel.querySelectorAll(".area")];
  const titleOf = (id) => panel.querySelector(`.area[data-area="${id}"] .area-link`).textContent.trim();
  const shortOf = (id) => document.querySelector(`.chip-btn[data-area="${id}"]`).textContent.trim();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let selected = "";

  // Where each area's parts list is drawn, in drawing units
  const LIST_AT = {
    vision: { x: 352, y: 150 }, rl: { x: 352, y: 150 },
    ai: { x: 16, y: 150 }, embedded: { x: 16, y: 150 }, backend: { x: 16, y: 150 },
    control: { x: 16, y: 462 },
  };

  const list = document.createElementNS(NS, "g");
  list.setAttribute("class", "parts-list");
  list.setAttribute("aria-hidden", "true");
  svg.appendChild(list);

  const el = (name, attrs, text) => {
    const node = document.createElementNS(NS, name);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (text) node.textContent = text;
    return node;
  };
  const shift = (part, k = 1) => `translate(${(+part.dataset.dx || 0) * k}px, ${(+part.dataset.dy || 0) * k}px)`;

  function drawList(area) {
    list.replaceChildren();
    list.classList.remove("is-shown");
    if (!area) return;
    const at = LIST_AT[area];
    const head = el("g", {});
    head.append(el("text", { x: at.x, y: at.y, class: "head" }, shortOf(area)));
    list.append(head);
    panel.querySelectorAll(`.area[data-area="${area}"] li`).forEach((li, i) => {
      const y = at.y + 26 + i * 21;
      const row = el("g", {});
      row.style.transitionDelay = reduceMotion ? "0ms" : `${80 + i * 40}ms`;
      const learning = li.classList.contains("is-learning");
      row.append(el("line", { x1: at.x, y1: y - 5, x2: at.x + 8, y2: y - 5, class: learning ? "tick learning" : "tick" }));
      const label = el("text", { x: at.x + 14, y }, li.querySelector(".skill-name").textContent.trim());
      if (learning) {
        const tag = el("tspan", { class: "learn-tag", dx: 6 }, "learning");
        label.append(tag);
      }
      row.append(label);
      list.append(row);
    });
    requestAnimationFrame(() => requestAnimationFrame(() => list.classList.add("is-shown")));
  }

  function drawGuides(area) {
    guides.replaceChildren();
    if (!area) return;
    parts.filter((p) => p.dataset.area === area).forEach((part) => {
      const b = part.getBBox();
      const x = b.x + b.width / 2, y = b.y + b.height / 2;
      const dx = +part.dataset.dx || 0, dy = +part.dataset.dy || 0;
      guides.append(el("line", { x1: x, y1: y, x2: x + dx, y2: y + dy }));
      guides.append(el("circle", { cx: x, cy: y, r: 2.5 }));
    });
  }

  function select(area) {
    if (area && area === selected) area = "";
    selected = area;
    wrap.classList.toggle("has-selection", !!area);
    panel.dataset.selected = area;
    parts.forEach((part) => {
      const on = part.dataset.area === area;
      part.classList.toggle("is-on", on);
      part.classList.toggle("is-dim", !!area && !on);
      part.style.transform = on ? shift(part) : "";
      part.setAttribute("aria-pressed", String(on));
    });
    frame.classList.toggle("is-dim", !!area);
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.area === area)));
    areas.forEach((a) => a.classList.toggle("is-on", a.dataset.area === area));
    drawGuides(area);
    drawList(area);
  }

  parts.forEach((part) => {
    part.setAttribute("tabindex", "0");
    part.setAttribute("role", "button");
    part.setAttribute("aria-label", `Show ${titleOf(part.dataset.area)} skills`);
    part.addEventListener("click", () => select(part.dataset.area));
    part.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(part.dataset.area); }
    });
  });
  chips.forEach((chip) => chip.addEventListener("click", () => select(chip.dataset.area)));
  panel.querySelectorAll(".area-link").forEach((b) => b.addEventListener("click", () => select(b.dataset.area)));
  svg.querySelectorAll(".callouts g").forEach((g) => g.addEventListener("click", () => select(g.dataset.area)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) select(""); });

  // One assembly on load: the parts start pulled apart and slide into place.
  if (!reduceMotion) {
    parts.forEach((part) => { part.style.transition = "none"; part.style.transform = shift(part, 1.5); part.style.opacity = "0"; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      parts.forEach((part, i) => {
        part.style.transition = `transform .9s cubic-bezier(.2,.8,.2,1) ${150 + i * 80}ms, opacity .5s ${150 + i * 80}ms`;
        part.style.transform = "";
        part.style.opacity = "";
      });
      setTimeout(() => parts.forEach((p) => { p.style.transition = ""; }), 2200);
    }));
  }
})();
