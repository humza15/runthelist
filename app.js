/* Rounding List — app.js
   All patient data is de-identified (room number only) and stored locally
   on this device via localStorage. Nothing is sent to a server. */

(() => {
  "use strict";

  const STORAGE_KEY = "roundingListState";
  const APP_VERSION_URL = "./version.json";

  /* ---------------------------- Icons ---------------------------- */
  const ICONS = {
    stethoscope: '<path d="M8 3v4a4 4 0 0 0 8 0V3"/><path d="M8 3H6a1 1 0 0 0-1 1v2"/><path d="M16 3h2a1 1 0 0 1 1 1v2"/><path d="M12 11v3a5 5 0 0 0 10 0v-1"/><circle cx="20" cy="18" r="2"/>',
    fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2"/><path d="M9 12l2 2 4-4"/>',
    message: '<path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.4 8.5 8.5 0 0 1-4-1L3 20l1.1-4.5A8.4 8.4 0 0 1 12.5 3a8.38 8.38 0 0 1 8.5 8.5z"/>',
    mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    dots: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
    door: '<path d="M14 3v18"/><rect x="4" y="3" width="16" height="18" rx="1"/><circle cx="10.5" cy="12" r="1"/>',
    list: '<path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><path d="M4 6l1 1 2-2"/><path d="M4 12l1 1 2-2"/><path d="M4 18l1 1 2-2"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    chevDown: '<polyline points="6 9 12 15 18 9"/>',
    chevUp: '<polyline points="18 15 12 9 6 15"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><line x1="8.3" y1="10.7" x2="15.7" y2="6.3"/><line x1="8.3" y1="13.3" x2="15.7" y2="17.7"/>',
    play: '<polygon points="6 4 20 12 6 20 6 4"/>',
    pause: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 7v4M10 9h4"/><line x1="9" y1="14" x2="15" y2="14"/><line x1="9" y1="17" x2="15" y2="17"/>',
    sunrise: '<path d="M12 2v4"/><path d="M4.9 6.9l2.8 2.8"/><path d="M19.1 6.9l-2.8 2.8"/><path d="M2 17h20"/><path d="M5 21h14"/><path d="M12 9a5 5 0 0 0-5 5h10a5 5 0 0 0-5-5z"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    calendarOff: '<rect x="3" y="4" width="18" height="17" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="7" y1="14" x2="17" y2="20"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>'
  };
  function icon(name) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
  }

  /* ---------------------------- Unit database ---------------------------- */
  /* Add more units here over time. "beds" auto-populate the room list. */
  const UNITS = [
    { name: "Galter 4 Observation Unit", from: 472, to: 484 },
    { name: "Custom / manual entry", from: null, to: null }
  ];

  /* ---------------------------- State ---------------------------- */
  function uid() { return Math.random().toString(36).slice(2, 10); }

  function defaultState() {
    return {
      week: { active: false, unitName: "", startDate: null, dayIndex: 1 },
      patients: [],
      reminders: [],
      ui: { tab: "rounds", screen: "splash" }
    };
  }

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (e) {
      return defaultState();
    }
  }
  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function fmtTime(ts) {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  function fmtClock(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function newPatient(room) {
    return {
      id: uid(),
      room,
      problem: "",
      roundedAt: null,
      noteAt: null,
      dispo: [],
      notesText: "",
      timerSessions: [],
      timerRunningStart: null,
      edd: ""
    };
  }

  /* ---------------------------- Toast ---------------------------- */
  let toastTimer = null;
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
  }

  /* ---------------------------- Version footer ---------------------------- */
  let displayedVersion = "0.1.0";
  function versionFooter() {
    return `<div class="footer-version" style="text-align:right; padding-right:16px;">
      <button data-action="open-changelog">Version ${displayedVersion}</button>
    </div>`;
  }

  /* ---------------------------- Render: root ---------------------------- */
  function render() {
    const app = document.getElementById("app");
    if (state.ui.screen === "splash") {
      app.innerHTML = renderSplash();
    } else if (state.ui.tab === "dispo") {
      app.innerHTML = renderHeader() + renderDispoTab() + versionFooter() + renderTabbar();
    } else {
      app.innerHTML = renderHeader() + renderProgress() + renderReminders() + renderRoundsList() + versionFooter() + renderTabbar();
      attachSwipeHandlers();
    }
  }

  /* ---------------------------- Splash / launch screen ---------------------------- */
  function renderSplash() {
    let unitOptions = UNITS.map(u => `<option value="${u.name}">${u.name}</option>`).join("");
    let resumeBlock = "";
    if (state.week.active && state.patients.length) {
      resumeBlock = `
        <div class="resume-card">
          <div style="font-weight:600; font-size:14px; margin-bottom:4px;">Resume rounding week</div>
          <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">${state.week.unitName || "Custom list"} &middot; Day ${state.week.dayIndex} &middot; ${state.patients.length} beds</div>
          <button class="btn-primary btn-block" data-action="resume-week">Resume Day ${state.week.dayIndex}</button>
        </div>`;
    }
    return `
      <div class="splash">
        <h1>Rounding List</h1>
        <p>No names, no PHI beyond room numbers &mdash; everything stays on this device.</p>
        ${resumeBlock}
        <div class="resume-card" style="border-color:var(--border);">
          <div style="font-weight:600; font-size:14px; margin-bottom:8px;">Start a new rounding week</div>
          <select id="unit-select">${unitOptions}</select>
          <div id="unit-preview"></div>
          <button class="btn-primary btn-block" data-action="start-week">Load beds &amp; start week</button>
          <div style="text-align:center; margin-top:8px;">
            <button data-action="manual-week" style="background:none;border:none;color:var(--accent);font-size:12px;">Or select individual rooms manually</button>
          </div>
        </div>
      </div>`;
  }

  function unitPreview(name) {
    const unit = UNITS.find(u => u.name === name);
    const preview = document.getElementById("unit-preview");
    if (!preview) return;
    if (!unit || unit.from == null) {
      preview.innerHTML = `<div style="font-size:12px; color:var(--text-secondary); margin:8px 0;">You'll add rooms one at a time on the next screen.</div>`;
      return;
    }
    const beds = [];
    for (let r = unit.from; r <= unit.to; r++) beds.push(r);
    preview.innerHTML = `
      <div style="font-size:12px; color:var(--text-secondary); margin:8px 0 4px;">${beds.length} beds &middot; rooms ${unit.from}&ndash;${unit.to}</div>
      <div class="unit-grid">${beds.slice(0, 8).map(b => `<div class="unit-bed">${b}</div>`).join("")}${beds.length > 8 ? '<div class="unit-bed">&hellip;</div>' : ""}</div>`;
  }

  /* ---------------------------- Header ---------------------------- */
  function renderHeader() {
    const tabLabel = state.ui.tab === "dispo" ? "Dispo overview" : "Rounding week";
    const sub = state.ui.tab === "dispo"
      ? `${state.patients.length} beds`
      : `Day ${state.week.dayIndex} &middot; ${state.patients.length} beds`;
    return `
      <div class="header">
        <div>
          <div class="header-title">${tabLabel}</div>
          <div class="header-sub">${sub}</div>
        </div>
        <button class="icon-btn" data-action="open-menu" aria-label="Menu">${icon("dots")}</button>
      </div>`;
  }

  /* ---------------------------- Progress ---------------------------- */
  function renderProgress() {
    const total = state.patients.length || 1;
    const rounded = state.patients.filter(p => p.roundedAt).length;
    const notes = state.patients.filter(p => p.noteAt).length;
    const pct = Math.round((rounded / total) * 100);
    return `
      <div class="progress-wrap">
        <span>${rounded} of ${state.patients.length} rounded &middot; ${notes} notes done</span>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>`;
  }

  /* ---------------------------- Reminders ---------------------------- */
  function renderReminders() {
    const items = state.reminders.map(r => `
      <div class="reminder-chip ${r.done ? "done" : ""}" data-action="toggle-reminder" data-id="${r.id}">
        <span>${escapeHtml(r.text)}</span>
        <button data-action="delete-reminder" data-id="${r.id}" aria-label="Delete reminder">${icon("x")}</button>
      </div>`).join("");
    return `
      <div class="reminders">
        <div class="reminders-head">
          <span>${icon("bell")} Today's reminders</span>
          <button class="icon-btn" style="width:30px;height:30px;" data-action="add-reminder">${icon("plus")}</button>
        </div>
        <div class="reminder-chips">${items || '<span style="font-size:12px; color:var(--text-muted);">No reminders yet</span>'}</div>
      </div>`;
  }

  /* ---------------------------- Rounds list ---------------------------- */
  function renderRoundsList() {
    if (!state.patients.length) {
      return `<div class="empty-state">No beds loaded. Open the menu to edit your bed list.</div>`;
    }
    const sorted = [...state.patients].sort((a, b) => {
      const score = p => (p.roundedAt ? 1 : 0) + (p.noteAt ? 1 : 0);
      return score(a) - score(b) || a.room.localeCompare(b.room, undefined, { numeric: true });
    });
    return `<div class="list">${sorted.map(renderCard).join("")}</div>`;
  }

  function renderCard(p) {
    const done = p.roundedAt && p.noteAt;
    const dispoOpen = p._dispoOpen ? "block" : "none";
    const dispoItems = p.dispo.map(d => `
      <div class="dispo-item ${d.checked ? "checked" : ""}">
        <input type="checkbox" data-action="toggle-dispo" data-pid="${p.id}" data-did="${d.id}" ${d.checked ? "checked" : ""}/>
        <span data-action="edit-dispo" data-pid="${p.id}" data-did="${d.id}">${escapeHtml(d.text)}</span>
      </div>
      ${d.isConsult && d.checked ? `
      <div class="dispo-subitem">
        <input type="checkbox" data-action="toggle-recs" data-pid="${p.id}" data-did="${d.id}" ${d.recsChecked ? "checked" : ""}/>
        <span>Recs followed?</span>
      </div>` : ""}
    `).join("");

    const running = !!p.timerRunningStart;
    const totalSeconds = timerTotalSeconds(p);
    const sessionsCount = p.timerSessions.length + (running ? 1 : 0);

    return `
    <div class="card-swipe-wrap">
      <div class="swipe-bg">
        <span class="left">${icon("stethoscope")} Rounded</span>
        <span class="right">Note done ${icon("fileText")}</span>
      </div>
      <div class="card ${done ? "done" : ""}" data-pid="${p.id}" data-role="card">
        <div class="card-row">
          <div class="toggle-col">
            <button class="toggle-btn ${p.roundedAt ? "on" : ""}" data-action="toggle-rounded" data-pid="${p.id}" aria-label="Rounded">${icon("stethoscope")}</button>
            <button class="toggle-btn ${p.noteAt ? "note-on" : ""}" data-action="toggle-note" data-pid="${p.id}" aria-label="Note written">${icon("fileText")}</button>
          </div>
          <div class="card-main">
            <div class="card-top">
              <span class="room-label">Room ${escapeHtml(p.room)}</span>
              ${p.problem ? `<span class="problem-tag" data-action="edit-problem" data-pid="${p.id}">${escapeHtml(p.problem)}</span>` : `<button class="problem-tag" style="border:none;" data-action="edit-problem" data-pid="${p.id}">Add problem</button>`}
            </div>
            <div class="timestamp-line">${p.roundedAt ? "Rounded " + fmtTime(p.roundedAt) : "Not yet rounded"}${p.noteAt ? " &middot; note " + fmtTime(p.noteAt) : ""}</div>
            <div class="action-row">
              <button data-action="toggle-dispo-panel" data-pid="${p.id}">${icon("clipboard")}</button>
              <button data-action="open-notes" data-pid="${p.id}" class="${p.notesText ? "active" : ""}">${icon("message")}</button>
              <button data-action="remove-patient" data-pid="${p.id}" aria-label="Remove bed">${icon("trash")}</button>
            </div>
          </div>
        </div>

        <div class="dispo-panel" style="display:${dispoOpen}">
          <div class="dispo-label">Dispo planning</div>
          ${dispoItems || '<div style="font-size:12px; color:var(--text-muted);">No items yet</div>'}
          <button class="dispo-add" data-action="add-dispo" data-pid="${p.id}">${icon("plus")} Add item</button>

          <div class="timer-row">
            <div class="timer-info">${sessionsCount} session${sessionsCount === 1 ? "" : "s"} logged today &middot; ${Math.round(totalSeconds / 60)} min total</div>
            <div style="display:flex; align-items:center;">
              <span class="timer-display" data-role="timer-display" data-pid="${p.id}">${fmtClock(running ? totalSeconds + (Date.now() - p.timerRunningStart) / 1000 : totalSeconds)}</span>
              <button class="timer-btn ${running ? "running" : ""}" data-action="toggle-timer" data-pid="${p.id}" aria-label="Start or stop timer">${icon(running ? "pause" : "play")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  function timerTotalSeconds(p) {
    const sessionsTotal = p.timerSessions.reduce((sum, s) => sum + (s.end - s.start) / 1000, 0);
    return sessionsTotal;
  }

  /* ---------------------------- Dispo tab ---------------------------- */
  function renderDispoTab() {
    if (!state.patients.length) {
      return `<div class="empty-state">No beds loaded yet.</div>`;
    }
    const sorted = [...state.patients].sort((a, b) => {
      if (a.edd && b.edd) return a.edd.localeCompare(b.edd);
      if (a.edd) return -1;
      if (b.edd) return 1;
      return a.room.localeCompare(b.room, undefined, { numeric: true });
    });
    const cards = sorted.map(p => {
      const pending = p.dispo.filter(d => !d.checked);
      const pendingRecs = p.dispo.filter(d => d.isConsult && d.checked && !d.recsChecked);
      const eddBadge = p.edd
        ? `<span class="edd-badge" style="background:var(--warn-bg); color:var(--warn-text);" data-action="edit-edd" data-pid="${p.id}">EDD ${escapeHtml(p.edd)}</span>`
        : `<span class="edd-badge" style="background:var(--surface-2); color:var(--text-secondary);" data-action="edit-edd" data-pid="${p.id}">Set EDD</span>`;
      const lines = [
        ...pending.map(d => `<div class="pending-line">&bull; ${escapeHtml(d.text)}</div>`),
        ...pendingRecs.map(d => `<div class="pending-line">&bull; ${escapeHtml(d.text)} &mdash; recs not yet confirmed</div>`)
      ].join("");
      return `
        <div class="dispo-card">
          <div class="dispo-card-top">
            <span style="font-size:14px; font-weight:600;">Room ${escapeHtml(p.room)}</span>
            ${eddBadge}
          </div>
          ${lines || '<div class="pending-line" style="color:var(--success-text);">All items complete</div>'}
        </div>`;
    }).join("");
    return `<div class="list">${cards}</div>
      <div style="padding:0 16px;">
        <button class="btn-secondary btn-block" data-action="share-summary">${icon("share")} Share sign-out summary</button>
      </div>`;
  }

  /* ---------------------------- Tab bar ---------------------------- */
  function renderTabbar() {
    return `
      <div class="tabbar">
        <button class="tabbar-item ${state.ui.tab === "rounds" ? "active" : ""}" data-action="set-tab" data-tab="rounds">${icon("list")}<span>Rounds</span></button>
        <button class="tabbar-item ${state.ui.tab === "dispo" ? "active" : ""}" data-action="set-tab" data-tab="dispo">${icon("door")}<span>Dispo</span></button>
        <button class="tabbar-item" data-action="open-menu">${icon("dots")}<span>More</span></button>
      </div>`;
  }

  /* ---------------------------- Menu sheet ---------------------------- */
  function openMenuSheet() {
    const overlay = createOverlay(false);
    overlay.querySelector(".sheet").innerHTML = `
      <div class="sheet-handle"></div>
      <h2>Menu</h2>
      <button class="menu-item" data-action="new-day">${icon("sunrise")} Start new day <span class="hint">clears daily checks</span></button>
      <button class="menu-item" data-action="edit-beds">${icon("edit")} Edit bed list</button>
      <button class="menu-item" data-action="open-changelog">${icon("fileText")} Version ${displayedVersion} &amp; changelog</button>
      <button class="menu-item danger" data-action="end-week">${icon("calendarOff")} End rounding week <span class="hint">clears roster</span></button>
      <div class="sheet-actions"><button class="btn-secondary" data-action="close-overlay">Close</button></div>
    `;
  }

  /* ---------------------------- Notes modal ---------------------------- */
  let recognizer = null;
  function openNotesModal(pid) {
    const p = state.patients.find(x => x.id === pid);
    if (!p) return;
    const overlay = createOverlay(false);
    overlay.querySelector(".sheet").innerHTML = `
      <div class="sheet-handle"></div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
        <h2 style="margin:0;">Room ${escapeHtml(p.room)} &middot; notes</h2>
        <button data-action="close-overlay" aria-label="Close">${icon("x")}</button>
      </div>
      <textarea id="notes-textarea" placeholder="e.g. patient complained of chest pain overnight...">${escapeHtml(p.notesText)}</textarea>
      <div class="sheet-actions">
        <button class="btn-secondary dictate-btn" id="dictate-btn">${icon("mic")} Dictate</button>
        <button class="btn-primary" data-action="save-notes" data-pid="${p.id}">Save note</button>
      </div>
    `;
    const dictateBtn = document.getElementById("dictate-btn");
    dictateBtn.addEventListener("click", () => toggleDictation(dictateBtn));
  }

  function toggleDictation(btn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast("Dictation isn't supported in this browser. Type your note instead.");
      return;
    }
    const textarea = document.getElementById("notes-textarea");
    if (recognizer) {
      recognizer.stop();
      recognizer = null;
      btn.classList.remove("recording");
      return;
    }
    recognizer = new SpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = false;
    recognizer.lang = "en-US";
    let baseText = textarea.value;
    recognizer.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
      }
      if (finalText) {
        baseText = (baseText + " " + finalText).trim();
        textarea.value = baseText;
      }
    };
    recognizer.onerror = () => { btn.classList.remove("recording"); recognizer = null; };
    recognizer.onend = () => { btn.classList.remove("recording"); recognizer = null; };
    recognizer.start();
    btn.classList.add("recording");
  }

  /* ---------------------------- Changelog modal ---------------------------- */
  function openChangelogModal() {
    const overlay = createOverlay(true);
    overlay.querySelector(".sheet").innerHTML = `<div style="text-align:center; padding:20px;">Loading changelog&hellip;</div>`;
    fetch("./CHANGELOG.md", { cache: "no-store" })
      .then(r => r.text())
      .then(text => {
        overlay.querySelector(".sheet").innerHTML = `
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <h2 style="margin:0;">Changelog</h2>
            <button data-action="close-overlay" aria-label="Close">${icon("x")}</button>
          </div>
          <div style="font-size:13px; color:var(--text-secondary); white-space:pre-wrap; line-height:1.6;">${escapeHtml(text)}</div>
        `;
      })
      .catch(() => {
        overlay.querySelector(".sheet").innerHTML = `<div style="text-align:center; padding:20px;">Couldn't load changelog offline.</div>`;
      });
  }

  /* ---------------------------- Overlay helper ---------------------------- */
  function createOverlay(centered) {
    const overlay = document.createElement("div");
    overlay.className = "overlay" + (centered ? " center" : "");
    overlay.innerHTML = `<div class="sheet"></div>`;
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeOverlay(overlay); });
    document.body.appendChild(overlay);
    return overlay;
  }
  function closeOverlay(el) {
    if (recognizer) { recognizer.stop(); recognizer = null; }
    el.remove();
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------------------------- Actions ---------------------------- */
  function handlePatientMutation(pid, mutate) {
    const p = state.patients.find(x => x.id === pid);
    if (!p) return;
    mutate(p);
    saveState();
    render();
  }

  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    const pid = target.dataset.pid;

    switch (action) {
      case "resume-week":
        state.ui.screen = "app";
        saveState(); render();
        break;

      case "manual-week": {
        const unit = "Custom / manual entry";
        state.week = { active: true, unitName: unit, startDate: new Date().toISOString(), dayIndex: 1 };
        state.patients = [];
        state.ui.screen = "app";
        saveState(); render();
        break;
      }

      case "start-week": {
        const sel = document.getElementById("unit-select");
        const unitName = sel ? sel.value : UNITS[0].name;
        const unit = UNITS.find(u => u.name === unitName);
        const patients = [];
        if (unit && unit.from != null) {
          for (let r = unit.from; r <= unit.to; r++) patients.push(newPatient(String(r)));
        }
        state.week = { active: true, unitName, startDate: new Date().toISOString(), dayIndex: 1 };
        state.patients = patients;
        state.ui.screen = "app";
        saveState(); render();
        toast(`${patients.length} beds loaded`);
        break;
      }

      case "set-tab":
        state.ui.tab = target.dataset.tab;
        saveState(); render();
        break;

      case "open-menu":
        openMenuSheet();
        break;

      case "close-overlay":
        closeOverlay(target.closest(".overlay"));
        break;

      case "new-day":
        state.patients.forEach(p => { p.roundedAt = null; p.noteAt = null; });
        state.week.dayIndex += 1;
        saveState();
        closeOverlay(target.closest(".overlay"));
        render();
        toast("New day started — daily checks cleared");
        break;

      case "end-week":
        if (confirm("End this rounding week? This clears your bed list. Notes and dispo history for these beds will be removed.")) {
          state = defaultState();
          state.ui.screen = "splash";
          saveState();
          closeOverlay(target.closest(".overlay"));
          render();
        }
        break;

      case "edit-beds": {
        const roomsCsv = prompt("Edit room list, comma separated:", state.patients.map(p => p.room).join(", "));
        if (roomsCsv !== null) {
          const rooms = roomsCsv.split(",").map(r => r.trim()).filter(Boolean);
          const existing = {};
          state.patients.forEach(p => existing[p.room] = p);
          state.patients = rooms.map(r => existing[r] || newPatient(r));
          saveState();
        }
        closeOverlay(target.closest(".overlay"));
        render();
        break;
      }

      case "open-changelog":
        openChangelogModal();
        break;

      case "add-reminder": {
        const text = prompt("Reminder text (e.g. f/u 2PM BMP room 402):");
        if (text) {
          state.reminders.push({ id: uid(), text, done: false });
          saveState(); render();
        }
        break;
      }
      case "toggle-reminder": {
        const id = target.closest("[data-id]").dataset.id;
        const r = state.reminders.find(x => x.id === id);
        if (r) { r.done = !r.done; saveState(); render(); }
        break;
      }
      case "delete-reminder": {
        const id = target.dataset.id;
        state.reminders = state.reminders.filter(x => x.id !== id);
        saveState(); render();
        break;
      }

      case "toggle-rounded":
        handlePatientMutation(pid, p => { p.roundedAt = p.roundedAt ? null : Date.now(); });
        break;
      case "toggle-note":
        handlePatientMutation(pid, p => { p.noteAt = p.noteAt ? null : Date.now(); });
        break;

      case "edit-problem": {
        const p = state.patients.find(x => x.id === pid);
        const val = prompt("Primary problem:", p ? p.problem : "");
        if (val !== null) handlePatientMutation(pid, p => { p.problem = val.trim(); });
        break;
      }

      case "toggle-dispo-panel": {
        const p = state.patients.find(x => x.id === pid);
        if (p) { p._dispoOpen = !p._dispoOpen; render(); }
        break;
      }
      case "add-dispo": {
        const text = prompt("Dispo item (e.g. needs Cardiology follow up):");
        if (text) {
          const isConsult = /consult/i.test(text);
          handlePatientMutation(pid, p => {
            p.dispo.push({ id: uid(), text, checked: false, isConsult, recsChecked: false });
            p._dispoOpen = true;
          });
        }
        break;
      }
      case "edit-dispo": {
        const did = target.dataset.did;
        const p = state.patients.find(x => x.id === pid);
        const item = p && p.dispo.find(d => d.id === did);
        if (!item) break;
        const val = prompt("Edit item:", item.text);
        if (val !== null) handlePatientMutation(pid, p => {
          const it = p.dispo.find(d => d.id === did);
          it.text = val.trim();
          it.isConsult = /consult/i.test(val);
          p._dispoOpen = true;
        });
        break;
      }
      case "toggle-dispo": {
        const did = target.dataset.did;
        handlePatientMutation(pid, p => {
          const it = p.dispo.find(d => d.id === did);
          it.checked = !it.checked;
          p._dispoOpen = true;
        });
        break;
      }
      case "toggle-recs": {
        const did = target.dataset.did;
        handlePatientMutation(pid, p => {
          const it = p.dispo.find(d => d.id === did);
          it.recsChecked = !it.recsChecked;
          p._dispoOpen = true;
        });
        break;
      }

      case "edit-edd": {
        const p = state.patients.find(x => x.id === pid);
        const val = prompt("Estimated discharge date (e.g. Today, Tomorrow, 7/26):", p ? p.edd : "");
        if (val !== null) handlePatientMutation(pid, p => { p.edd = val.trim(); });
        break;
      }

      case "remove-patient": {
        if (confirm("Remove this bed from your list?")) {
          state.patients = state.patients.filter(p => p.id !== pid);
          saveState(); render();
        }
        break;
      }

      case "open-notes": {
        const p = state.patients.find(x => x.id === pid);
        if (p) p._dispoOpen = p._dispoOpen;
        openNotesModal(pid);
        break;
      }
      case "save-notes": {
        const val = document.getElementById("notes-textarea").value;
        handlePatientMutation(pid, p => { p.notesText = val; });
        closeOverlay(target.closest(".overlay"));
        toast("Note saved");
        break;
      }

      case "toggle-timer": {
        handlePatientMutation(pid, p => {
          if (p.timerRunningStart) {
            p.timerSessions.push({ start: p.timerRunningStart, end: Date.now() });
            p.timerRunningStart = null;
          } else {
            p.timerRunningStart = Date.now();
          }
          p._dispoOpen = true;
        });
        break;
      }

      case "share-summary": {
        const lines = state.patients.map(p => {
          const pending = p.dispo.filter(d => !d.checked).map(d => `  - ${d.text}`).join("\n");
          return `Room ${p.room}${p.edd ? " (EDD " + p.edd + ")" : ""}\n${pending || "  - all items complete"}`;
        }).join("\n\n");
        const text = `Sign-out summary — ${state.week.unitName || "Rounding list"}\n\n${lines}`;
        if (navigator.share) {
          navigator.share({ text }).catch(() => {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
          toast("Summary copied to clipboard");
        }
        break;
      }
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.id === "unit-select") unitPreview(e.target.value);
  });

  /* ---------------------------- Swipe gestures ---------------------------- */
  function attachSwipeHandlers() {
    document.querySelectorAll('.card[data-role="card"]').forEach(card => {
      let startX = 0, currentX = 0, dragging = false;
      const pid = card.dataset.pid;

      card.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        dragging = true;
      }, { passive: true });

      card.addEventListener("touchmove", (e) => {
        if (!dragging) return;
        currentX = e.touches[0].clientX - startX;
        const clamped = Math.max(-90, Math.min(90, currentX));
        card.style.transform = `translateX(${clamped}px)`;
      }, { passive: true });

      card.addEventListener("touchend", () => {
        dragging = false;
        card.style.transform = "";
        if (currentX > 60) {
          handlePatientMutation(pid, p => { p.roundedAt = p.roundedAt ? null : Date.now(); });
        } else if (currentX < -60) {
          handlePatientMutation(pid, p => { p.noteAt = p.noteAt ? null : Date.now(); });
        }
        currentX = 0;
      });
    });
  }

  /* ---------------------------- Timer tick ---------------------------- */
  setInterval(() => {
    document.querySelectorAll('[data-role="timer-display"]').forEach(el => {
      const p = state.patients.find(x => x.id === el.dataset.pid);
      if (!p || !p.timerRunningStart) return;
      const total = timerTotalSeconds(p) + (Date.now() - p.timerRunningStart) / 1000;
      el.textContent = fmtClock(total);
    });
  }, 1000);

  /* ---------------------------- Launch flow ---------------------------- */
  function initLaunch() {
    const fresh = !sessionStorage.getItem("sessionActive");
    sessionStorage.setItem("sessionActive", "1");
    state.ui.screen = fresh ? "splash" : (state.week.active ? "app" : "splash");
    if (!fresh && !state.week.active) state.ui.screen = "splash";
  }

  /* ---------------------------- Version + service worker ---------------------------- */
  function loadVersionAndStart() {
    fetch(APP_VERSION_URL, { cache: "no-store" })
      .then(r => r.json())
      .then(data => { displayedVersion = data.version || displayedVersion; })
      .catch(() => {})
      .finally(() => {
        initLaunch();
        render();
      });
  }

  function initServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").then(reg => {
        // Check for a newer version every time the app is opened.
        reg.update();

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              showUpdateModal(reg);
            }
          });
        });
      }).catch(() => {});

      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    });
  }

  function showUpdateModal(reg) {
    fetch(APP_VERSION_URL, { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        document.getElementById("current-version-label").textContent = displayedVersion;
        document.getElementById("new-version-label").textContent = data.version;
        document.getElementById("update-notes").innerHTML = (data.notes || []).map(n => `• ${escapeHtml(n)}`).join("<br>");
        const modal = document.getElementById("update-modal");
        modal.hidden = false;

        document.getElementById("update-now").onclick = () => {
          toast("Downloading update…");
          if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
          setTimeout(() => toast("Update complete. Restarting…"), 400);
        };
        document.getElementById("update-later").onclick = () => { modal.hidden = true; };
      })
      .catch(() => {});
  }

  loadVersionAndStart();
  initServiceWorker();
})();
