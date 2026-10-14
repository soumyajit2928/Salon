(() => {
  const WHATSAPP = "+919593188894"; // digits with country code, e.g. "919876543210". Empty = demo mode (nothing is sent).
  const $ = s => document.querySelector(s);
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const HOURS = [[10, 18], [10, 20], null, [10, 20], [10, 20], [10, 20], [10, 20]]; // by getDay(); null = closed
  const SERVICES = {
    Hair: [["Haircut and styling", "₹600"], ["Hair spa", "₹1,200"], ["Global colour", "from ₹2,500"], ["Highlights", "from ₹3,500"], ["Smoothing treatment", "from ₹4,500"]],
    Skin: [["Cleanup", "₹800"], ["Classic facial", "₹1,500"], ["De-tan treatment", "₹1,000"], ["Threading (per area)", "₹60"]],
    Nails: [["Manicure", "₹700"], ["Pedicure", "₹900"], ["Gel polish", "₹600"]],
    Bridal: [["Bridal consultation", "free"], ["Bridal package", "on enquiry"]]
  };
  const fmt = h => (h % 12 || 12) + (h < 12 ? " AM" : " PM");
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; };

  // Services tabs
  const tabs = $(".tabs"), list = $("#menu-list"), cats = Object.keys(SERVICES);
  const pick = c => {
    tabs.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", b.textContent === c));
    list.replaceChildren(...SERVICES[c].map(([n, p]) => { const li = el("li"); li.append(el("span", "n", n), el("span", "p", p)); return li; }));
  };
  cats.forEach(c => { const b = el("button", "", c); b.role = "tab"; b.onclick = () => pick(c); tabs.append(b); });
  pick(cats[0]);
  const sel = document.querySelector('[name=service]'); sel.append(new Option("Choose a service", ""));
  cats.forEach(c => { const g = document.createElement("optgroup"); g.label = c; SERVICES[c].forEach(([n]) => g.append(new Option(n, n))); sel.append(g); });

  // Hours table + open-now status
  const today = new Date().getDay();
  DAYS.forEach((d, i) => { const r = el("tr", i === today ? "today" : ""); r.append(el("td", "", d), el("td", "", HOURS[i] ? `${fmt(HOURS[i][0])} – ${fmt(HOURS[i][1])}` : "Closed")); $("#hours").append(r); });
  const now = new Date(), hr = now.getHours() + now.getMinutes() / 60, h = HOURS[today], st = $("#status");
  if (h && hr >= h[0] && hr < h[1]) st.textContent = `Open now, closes at ${fmt(h[1])}`;
  else {
    st.classList.add("closed");
    for (let i = 0; i < 8; i++) { const d = (today + i) % 7, x = HOURS[d]; if (x && (i > 0 || hr < x[0])) { st.textContent = `Closed now, opens ${i === 0 ? "today" : i === 1 ? "tomorrow" : DAYS[d]} at ${fmt(x[0])}`; break; } }
  }

  // Mobile menu
  const nav = $(".nav"), bg = $(".burger");
  bg.onclick = () => { const o = nav.classList.toggle("open"); bg.setAttribute("aria-expanded", o); };
  document.querySelectorAll("#menu a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); bg.setAttribute("aria-expanded", false); }));
  $("#y").textContent = now.getFullYear();

  // Booking form
  const f = $("#form"), iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  f.date.min = iso(now);
  const slots = () => {
    f.time.replaceChildren(new Option(f.date.value ? "Choose a time" : "Choose a date first", ""));
    if (!f.date.value) return;
    const d = new Date(f.date.value + "T00:00"), x = HOURS[d.getDay()];
    if (!x) { f.time.options[0].text = "Closed that day"; return; }
    for (let t = x[0]; t < x[1]; t++) if (f.date.value !== iso(now) || t > now.getHours()) f.time.append(new Option(fmt(t), fmt(t)));
    if (f.time.options.length === 1) f.time.options[0].text = "No slots left that day";
  };
  f.date.addEventListener("change", () => { slots(); check("date"); });
  const rules = {
    name: v => v.trim().length >= 2 || "Enter your name.",
    phone: v => /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")) || "Enter a 10-digit Indian mobile number.",
    service: v => !!v || "Choose a service.",
    date: v => (!!v && v >= iso(now) && !!HOURS[new Date(v + "T00:00").getDay()]) || "Choose an open date from today onwards.",
    time: v => !!v || "Choose a time."
  };
  const check = k => { const m = rules[k](f[k].value), o = f.querySelector(`[data-for=${k}]`); o.textContent = m === true ? "" : m; f[k].setAttribute("aria-invalid", m !== true); return m === true; };
  Object.keys(rules).forEach(k => f[k].addEventListener("blur", () => check(k)));
  f.addEventListener("submit", e => {
    e.preventDefault(); const bad = Object.keys(rules).filter(k => !check(k)), r = $("#result");
    r.className = ""; r.replaceChildren();
    if (bad.length) return f[bad[0]].focus();
    const msg = `Hi, I'd like to book ${f.service.value} on ${f.date.value} at ${f.time.value}. Name: ${f.name.value.trim()}. Phone: ${f.phone.value.trim()}.` + (f.notes.value.trim() ? ` Notes: ${f.notes.value.trim()}` : "");
    if (WHATSAPP) { open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg), "_blank", "noopener"); r.className = "ok"; r.append(el("p", "", "Opening WhatsApp so you can send your request.")); }
    else { r.className = "ok"; r.append(el("p", "", "Demo mode: nothing was sent. This is the message a live site would deliver:"), el("p", "", msg)); }
  });
})();
