/**
 * ============================================================================
 * BIG BRASS CHRISTMAS — CONFIGURATION & INTERACTIVE EXPERIENCE
 * ============================================================================
 * Edit the values in SITE_CONFIG below to customize your Facebook Group link,
 * plug in your custom logo file when ready, or connect a free Google Sheet!
 */
const SITE_CONFIG = {
  // 1. Official Performers Facebook Group URL:
  FACEBOOK_GROUP_URL: "https://www.facebook.com/groups/1791469391126811",

  // 2. Optional Custom Logo Path:
  //    By default (""), the site uses the authentic vector Tuba & Holly artwork
  //    from your 2026 flyer (`files/tuba-artwork.svg`). To replace it with a
  //    different logo file later, place the file in `files/` and set e.g. "files/my-logo.png":
  CUSTOM_LOGO_PATH: "",

  // 3. NO-BACKEND GOOGLE SHEETS TRACKING (Optional, 100% Free):
  //    Paste your Google Apps Script Web App URL here (see SETUP.md for 2-minute instructions)
  //    to store all attendee counts & performer emails in a shared Google Sheet!
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxy1kle1DIkSq6FEBlAi1Alvn1yfOXnRO5RgCoyln-PIqmPmV9TjOHW4bSurCmXnBY/exec",

  // 4. Starting baseline counts (set to 0 when using live Google Sheets tracking):
  BASE_ATTENDEE_COUNT: 0,
  BASE_PERFORMER_COUNT: 0,
  BASE_SECTION_COUNTS: {
    tubas: 0,
    euphs: 0,
    bones: 0
  },

  // 5. Concert Date & Time (December 13, 2026 at 12:00 PM PST):
  CONCERT_ISO_START: "2026-12-13T12:00:00-08:00",
  CONCERT_ISO_END: "2026-12-13T13:00:00-08:00"
};

const STORAGE_KEYS = {
  ATTENDEE_DELTA: "bbc_2026_attendee_delta",
  PERFORMER_DELTA: "bbc_2026_performer_delta",
  SECTION_DELTAS: "bbc_2026_section_deltas",
  LOCAL_SIGNUPS: "bbc_2026_local_signups",
  NIGHT_GLOW: "bbc_2026_night_glow"
};

document.addEventListener("DOMContentLoaded", () => {
  initConfigBindings();
  initStringLightsAndTheme();
  initCountdown();
  initCalendarLinks();
  initTubaVisualBurst();
  initRsvpTracking();
  initSetupModal();
  initScrollReveal();
  initFestiveSnowAndNotes();
});

/* ==========================================================================
   1. APPLY CONFIG LINKS & OPTIONAL CUSTOM LOGO
   ========================================================================== */
function initConfigBindings() {
  const fbLink = document.getElementById("fb-group-link");
  if (fbLink && SITE_CONFIG.FACEBOOK_GROUP_URL) {
    fbLink.href = SITE_CONFIG.FACEBOOK_GROUP_URL;
  }

  if (SITE_CONFIG.CUSTOM_LOGO_PATH) {
    const mainImg = document.getElementById("main-tuba-img");
    if (mainImg) {
      mainImg.src = SITE_CONFIG.CUSTOM_LOGO_PATH;
    }
  }
}

/* ==========================================================================
   2. HOLIDAY STRING LIGHTS & NIGHT GLOW THEME
   ========================================================================== */
function initStringLightsAndTheme() {
  const themeBtn = document.getElementById("theme-toggle-btn");
  const themeText = document.getElementById("theme-btn-text");
  const bulbs = document.querySelectorAll(".bulb");

  if (localStorage.getItem(STORAGE_KEYS.NIGHT_GLOW) === "true") {
    document.body.classList.add("night-glow");
    if (themeText) themeText.textContent = "Daylight Mode";
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isNight = document.body.classList.toggle("night-glow");
      localStorage.setItem(STORAGE_KEYS.NIGHT_GLOW, String(isNight));
      if (themeText) {
        themeText.textContent = isNight ? "Daylight Mode" : "Night Glow";
      }
    });
  }

  bulbs.forEach((bulb) => {
    bulb.addEventListener("click", () => {
      bulb.classList.add("flash");
      setTimeout(() => bulb.classList.remove("flash"), 300);
    });
  });
}

/* ==========================================================================
   3. LIVE COUNTDOWN TO DECEMBER 13 AT 12:00 PM
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");

  if (!daysEl) return;

  const targetTime = new Date(SITE_CONFIG.CONCERT_ISO_START).getTime();

  function updateClock() {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(mins).padStart(2, "0");
    secsEl.textContent = String(secs).padStart(2, "0");
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   4. ADD TO CALENDAR (.ICS & GOOGLE CALENDAR)
   ========================================================================== */
function initCalendarLinks() {
  const title = "Big Brass Christmas — Holiday Low Brass Concert";
  const location = "River Park (In Front of Regal Cinema), 250 Paseo del Centro, Fresno, CA 93720";
  const details =
    "Annual Big Brass Christmas holiday performance in Fresno, CA! Free outdoor low brass concert starting at 12:00 PM in front of the Regal Cinema at River Park. Details: https://bigbrasschristmas.com";

  const gcalBtn = document.getElementById("google-cal-link");
  if (gcalBtn) {
    const gcalUrl = new URL("https://calendar.google.com/calendar/render");
    gcalUrl.searchParams.set("action", "TEMPLATE");
    gcalUrl.searchParams.set("text", title);
    gcalUrl.searchParams.set("dates", "20261213T200000Z/20261213T210000Z");
    gcalUrl.searchParams.set("details", details);
    gcalUrl.searchParams.set("location", location);
    gcalBtn.href = gcalUrl.toString();
  }

  const icsBtn = document.getElementById("add-ics-btn");
  if (icsBtn) {
    icsBtn.addEventListener("click", () => {
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Big Brass Christmas//Fresno CA//EN",
        "BEGIN:VEVENT",
        "UID:bigbrasschristmas-2026@bigbrasschristmas.com",
        "DTSTAMP:20261108T180000Z",
        "DTSTART:20261213T200000Z",
        "DTEND:20261213T210000Z",
        `SUMMARY:${title}`,
        `DESCRIPTION:${details}`,
        `LOCATION:${location}`,
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Big-Brass-Christmas-2026.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
}

/* ==========================================================================
   5. TUBA VISUAL BURST (PURELY VISUAL FLOATING NOTES & SNOWFLAKES)
   ========================================================================== */
function initTubaVisualBurst() {
  const stage = document.getElementById("tuba-interactive");
  const emitter = document.getElementById("note-emitter");
  if (!stage || !emitter) return;

  const noteSvgs = [
    `<svg width="28" height="28" viewBox="0 0 24 24" fill="#DB1F26"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`,
    `<svg width="28" height="28" viewBox="0 0 24 24" fill="#93C5FD"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`,
    `<svg width="26" height="26" viewBox="0 0 24 24" fill="#EBB41F"><path d="M12 1L14.8 9.2L23 12L14.8 14.8L12 23L9.2 14.8L1 12L9.2 9.2L12 1Z"/></svg>`
  ];

  function spawnNotes(count = 5) {
    for (let i = 0; i < count; i++) {
      const wrap = document.createElement("div");
      wrap.className = "floating-note";
      wrap.innerHTML = noteSvgs[i % noteSvgs.length];
      const tx = Math.round((Math.random() - 0.35) * 180);
      const ty = Math.round(-75 - Math.random() * 110);
      const rot = Math.round((Math.random() - 0.5) * 70);
      wrap.style.setProperty("--tx", `${tx}px`);
      wrap.style.setProperty("--ty", `${ty}px`);
      wrap.style.setProperty("--rot", `${rot}deg`);
      emitter.appendChild(wrap);
      setTimeout(() => wrap.remove(), 1150);
    }
  }

  stage.addEventListener("click", () => {
    stage.classList.remove("tooting");
    void stage.offsetWidth;
    stage.classList.add("tooting");
    spawnNotes(5);
  });

  stage.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      stage.click();
    }
  });
}

/* ==========================================================================
   6. RSVP, BAND ROSTER BREAKDOWN & LIVE PLAZA FEED
   ========================================================================== */
function initRsvpTracking() {
  const attendeeCountEl = document.getElementById("attendee-count-display");
  const performerCountEl = document.getElementById("performer-count-display");
  const heroAttendeeChip = document.getElementById("hero-attendee-chip");
  const heroPerformerChip = document.getElementById("hero-performer-chip");
  const crowdDotsEl = document.getElementById("crowd-ring-dots");
  const cheerFeedEl = document.getElementById("cheer-feed");

  const countTubasEl = document.getElementById("count-tubas");
  const countEuphsEl = document.getElementById("count-euphs");
  const countBonesEl = document.getElementById("count-bones");

  const attendeeForm = document.getElementById("attendee-form");
  const performerForm = document.getElementById("performer-form");
  const partySizeInput = document.getElementById("party-size");
  const instrumentInput = document.getElementById("performer-instrument");
  const groupInput = document.getElementById("performer-group");
  const attendeeSubmitBtn = document.getElementById("attendee-submit-btn");
  const attendeeFeedback = document.getElementById("attendee-feedback");
  const performerFeedback = document.getElementById("performer-feedback");

  const hasGoogleSheet = Boolean(SITE_CONFIG.GOOGLE_SCRIPT_URL);

  let attendeeDelta = parseInt(localStorage.getItem(STORAGE_KEYS.ATTENDEE_DELTA) || "0", 10);
  let performerDelta = parseInt(localStorage.getItem(STORAGE_KEYS.PERFORMER_DELTA) || "0", 10);
  let sectionDeltas = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.SECTION_DELTAS) || '{"tubas":0,"euphs":0,"bones":0}'
  );

  let currentAttendees = SITE_CONFIG.BASE_ATTENDEE_COUNT + (hasGoogleSheet ? 0 : attendeeDelta);
  let currentPerformers = SITE_CONFIG.BASE_PERFORMER_COUNT + (hasGoogleSheet ? 0 : performerDelta);
  let currentSections = {
    tubas: SITE_CONFIG.BASE_SECTION_COUNTS.tubas + (hasGoogleSheet ? 0 : (sectionDeltas.tubas || 0)),
    euphs: SITE_CONFIG.BASE_SECTION_COUNTS.euphs + (hasGoogleSheet ? 0 : (sectionDeltas.euphs || 0)),
    bones: SITE_CONFIG.BASE_SECTION_COUNTS.bones + (hasGoogleSheet ? 0 : (sectionDeltas.bones || 0))
  };

  function classifyInstrumentSection(instName) {
    const s = String(instName || "").toLowerCase();
    if (s.includes("tuba") || s.includes("sousa")) return "tubas";
    if (s.includes("euph") || s.includes("bari")) return "euphs";
    if (s.includes("trombone") || s.includes("bone")) return "bones";
    return "tubas";
  }

  function renderCrowdDots() {
    if (!crowdDotsEl) return;
    const dotCount = Math.min(36, Math.max(4, Math.round(currentAttendees / 2)));
    crowdDotsEl.innerHTML = "";
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("span");
      dot.className = i % 3 === 0 ? "crowd-dot gold" : "crowd-dot";
      crowdDotsEl.appendChild(dot);
    }
  }

  function renderCounts(bumpType) {
    if (attendeeCountEl) {
      attendeeCountEl.textContent = currentAttendees.toLocaleString();
      if (bumpType === "attendee") {
        attendeeCountEl.classList.add("bump");
        setTimeout(() => attendeeCountEl.classList.remove("bump"), 350);
      }
    }
    if (performerCountEl) {
      performerCountEl.textContent = currentPerformers.toLocaleString();
      if (bumpType === "performer") {
        performerCountEl.classList.add("bump");
        setTimeout(() => performerCountEl.classList.remove("bump"), 350);
      }
    }
    if (heroAttendeeChip) heroAttendeeChip.textContent = `${currentAttendees} Going`;
    if (heroPerformerChip) heroPerformerChip.textContent = `${currentPerformers} Horns`;

    if (countTubasEl) {
      countTubasEl.textContent = String(currentSections.tubas);
    }
    if (countEuphsEl) {
      countEuphsEl.textContent = String(currentSections.euphs);
    }
    if (countBonesEl) {
      countBonesEl.textContent = String(currentSections.bones);
    }

    renderCrowdDots();
  }

  function pushCheerMessage(htmlStr) {
    if (!cheerFeedEl) return;
    const span = document.createElement("span");
    span.className = "cheer-item";
    span.innerHTML = htmlStr;
    cheerFeedEl.prepend(span);
    while (cheerFeedEl.children.length > 2) {
      cheerFeedEl.lastElementChild.remove();
    }
  }

  renderCounts();

  // Optional Google Apps Script live fetch
  if (SITE_CONFIG.GOOGLE_SCRIPT_URL) {
    fetch(SITE_CONFIG.GOOGLE_SCRIPT_URL)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.attendees === "number") {
          currentAttendees = SITE_CONFIG.BASE_ATTENDEE_COUNT + data.attendees;
        }
        if (typeof data.performers === "number") {
          currentPerformers = SITE_CONFIG.BASE_PERFORMER_COUNT + data.performers;
        }

        // Support section counts via `data.sections`, top-level `tubas`/`euphs`/`bones`, or `data.instruments` array
        if (data.sections && typeof data.sections === "object") {
          currentSections.tubas = SITE_CONFIG.BASE_SECTION_COUNTS.tubas + (Number(data.sections.tubas) || 0);
          currentSections.euphs = SITE_CONFIG.BASE_SECTION_COUNTS.euphs + (Number(data.sections.euphs) || 0);
          currentSections.bones = SITE_CONFIG.BASE_SECTION_COUNTS.bones + (Number(data.sections.bones) || 0);
        } else if (
          typeof data.tubas === "number" ||
          typeof data.euphs === "number" ||
          typeof data.bones === "number"
        ) {
          currentSections.tubas = SITE_CONFIG.BASE_SECTION_COUNTS.tubas + (Number(data.tubas) || 0);
          currentSections.euphs = SITE_CONFIG.BASE_SECTION_COUNTS.euphs + (Number(data.euphs) || 0);
          currentSections.bones = SITE_CONFIG.BASE_SECTION_COUNTS.bones + (Number(data.bones) || 0);
        } else if (Array.isArray(data.instruments)) {
          const tallied = { tubas: 0, euphs: 0, bones: 0 };
          data.instruments.forEach((inst) => {
            const grp = classifyInstrumentSection(inst);
            tallied[grp] = (tallied[grp] || 0) + 1;
          });
          currentSections.tubas = SITE_CONFIG.BASE_SECTION_COUNTS.tubas + tallied.tubas;
          currentSections.euphs = SITE_CONFIG.BASE_SECTION_COUNTS.euphs + tallied.euphs;
          currentSections.bones = SITE_CONFIG.BASE_SECTION_COUNTS.bones + tallied.bones;
        }

        renderCounts();
      })
      .catch(() => { });
  }

  // Group Size Selector Buttons
  const partyBtns = document.querySelectorAll(".party-btn");
  partyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      partyBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const size = parseInt(btn.dataset.size || "1", 10);
      if (partySizeInput) partySizeInput.value = String(size);
      if (attendeeSubmitBtn) {
        attendeeSubmitBtn.innerHTML = `<span>Add +${size} to the Crowd Count!</span>`;
      }
    });
  });

  // Instrument Selector Pills
  const instPills = document.querySelectorAll(".inst-pill");
  instPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      instPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const inst = pill.dataset.inst || "Tuba";
      const grp = pill.dataset.group || "tubas";
      if (instrumentInput) instrumentInput.value = inst;
      if (groupInput) groupInput.value = grp;
    });
  });

  function recordSignup(payload) {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_SIGNUPS) || "[]");
    existing.push({ ...payload, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.LOCAL_SIGNUPS, JSON.stringify(existing));
    updateLocalSavedBadge();

    if (SITE_CONFIG.GOOGLE_SCRIPT_URL) {
      fetch(SITE_CONFIG.GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      }).catch(() => { });
    }
  }

  // Attendee Form Submit
  if (attendeeForm) {
    attendeeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const size = parseInt(partySizeInput ? partySizeInput.value : "1", 10) || 1;
      const note = document.getElementById("attendee-note")?.value.trim() || "";

      attendeeDelta += size;
      currentAttendees += size;
      localStorage.setItem(STORAGE_KEYS.ATTENDEE_DELTA, String(attendeeDelta));

      recordSignup({
        type: "attendee",
        partySize: size,
        note
      });

      renderCounts("attendee");
      launchConfettiBurst(attendeeSubmitBtn);

      const cheerText = note
        ? `🎉 <strong>+${size} Attendee${size > 1 ? "s" : ""}</strong> joined: "${escapeHtml(note)}"`
        : `🎉 <strong>+${size} Attendee${size > 1 ? "s" : ""}</strong> just RSVPed for Dec 13th @ River Park!`;
      pushCheerMessage(cheerText);

      if (attendeeFeedback) {
        attendeeFeedback.hidden = false;
        attendeeFeedback.innerHTML = `Awesome! We've added <strong>+${size}</strong> to the crowd count. See you on <strong>Sunday, Dec 13th at 12:00 PM</strong> in front of Regal at River Park!`;
      }
      attendeeForm.reset();
      if (partySizeInput) partySizeInput.value = "1";
      partyBtns.forEach((b, i) => b.classList.toggle("active", i === 0));
      if (attendeeSubmitBtn) {
        attendeeSubmitBtn.innerHTML = `<span>Add +1 More to the Crowd Count!</span>`;
      }
    });
  }

  // Performer Form Submit
  if (performerForm) {
    performerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("performer-name")?.value.trim() || "";
      const instrument = instrumentInput?.value || "Tuba";
      const grp = groupInput?.value || "tubas";
      const email = document.getElementById("performer-email")?.value.trim() || "";
      const notes = document.getElementById("performer-notes")?.value.trim() || "";

      if (!name || !email) return;

      performerDelta += 1;
      currentPerformers += 1;
      sectionDeltas[grp] = (sectionDeltas[grp] || 0) + 1;
      currentSections[grp] = (currentSections[grp] || 0) + 1;

      localStorage.setItem(STORAGE_KEYS.PERFORMER_DELTA, String(performerDelta));
      localStorage.setItem(STORAGE_KEYS.SECTION_DELTAS, JSON.stringify(sectionDeltas));

      recordSignup({
        type: "performer",
        name,
        instrument,
        email,
        notes
      });

      renderCounts("performer");

      const submitBtn = document.getElementById("performer-submit-btn");
      launchConfettiBurst(submitBtn);

      pushCheerMessage(`🎺 <strong>${escapeHtml(name)}</strong> just joined the lineup on <strong>${escapeHtml(instrument)}</strong>!`);

      if (performerFeedback) {
        performerFeedback.hidden = false;
        performerFeedback.innerHTML = `Welcome to the lineup, <strong>${escapeHtml(name)}</strong> (${escapeHtml(instrument)})! Your email (<strong>${escapeHtml(email)}</strong>) is saved. Next step: <a href="${SITE_CONFIG.FACEBOOK_GROUP_URL}" target="_blank" rel="noopener">join the Performers Facebook Group below</a> for rehearsal &amp; call times!`;
      }
      performerForm.reset();
    });
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (ch) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[ch] || ch;
  });
}

/* ==========================================================================
   7. FESTIVE CONFETTI BURST
   ========================================================================== */
function launchConfettiBurst(anchorEl) {
  if (!anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const colors = ["#DB1F26", "#1E3A8A", "#EBB41F", "#FFFFFF", "#93C5FD"];

  for (let i = 0; i < 28; i++) {
    const piece = document.createElement("div");
    piece.style.position = "fixed";
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.width = "11px";
    piece.style.height = "11px";
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.border = "1.5px solid #0B152E";
    piece.style.borderRadius = i % 2 === 0 ? "50%" : "2px";
    piece.style.pointerEvents = "none";
    piece.style.zIndex = "999";

    const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.4;
    const velocity = 65 + Math.random() * 110;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity - 45;

    piece.animate(
      [
        { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.4) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ],
      { duration: 900, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );

    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 920);
  }
}

/* ==========================================================================
   8. ORGANIZER MODAL & CSV EXPORT
   ========================================================================== */
function updateLocalSavedBadge() {
  const countEl = document.getElementById("local-saved-count");
  if (!countEl) return;
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_SIGNUPS) || "[]");
  countEl.textContent = String(existing.length);
}

function initSetupModal() {
  const closeBtn = document.getElementById("close-setup-modal");
  const modal = document.getElementById("setup-modal");
  const exportBtn = document.getElementById("export-csv-btn");


  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.hidden = true;
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.hidden = true;
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const rows = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_SIGNUPS) || "[]");
      if (!rows.length) {
        alert("No local signups recorded in this browser yet! Try submitting the Attendee or Performer form first.");
        return;
      }

      const headers = ["timestamp", "type", "name", "email", "instrument", "partySize", "notes", "note"];
      const csvLines = [
        headers.join(","),
        ...rows.map((r) =>
          headers
            .map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`)
            .join(",")
        )
      ];

      const blob = new Blob([csvLines.join("\r\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "big-brass-christmas-signups.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
}

/* ==========================================================================
   9. SMOOTH SCROLL-REVEAL CHOREOGRAPHY
   ========================================================================== */
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal-on-scroll");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   10. MULTI-LAYERED SNOWFALL & MUSICAL NOTE SHAPES (BACKGROUND + OVERLAY)
   ========================================================================== */
function initFestiveSnowAndNotes() {
  const bgCanvas = document.getElementById("festive-bg-canvas");
  const fgCanvas = document.getElementById("festive-fg-canvas");
  if (!bgCanvas || !fgCanvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const bgCtx = bgCanvas.getContext("2d");
  const fgCtx = fgCanvas.getContext("2d");

  let width = window.innerWidth;
  let height = window.innerHeight;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    bgCanvas.width = width;
    bgCanvas.height = height;
    fgCanvas.width = width;
    fgCanvas.height = height;
  }
  resize();
  window.addEventListener("resize", resize);

  // Vector shape drawers on 2D Canvas:
  // 1) 6-pointed crystalline snowflake with side branches
  function drawCrystalSnowflake(ctx, size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      ctx.moveTo(0, 0);
      ctx.lineTo(cos * size, sin * size);

      // Little crystal V-branch at 60% radius
      const bx = cos * (size * 0.58);
      const by = sin * (size * 0.58);
      const bLen = size * 0.34;
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(angle + 0.55) * bLen, by + Math.sin(angle + 0.55) * bLen);
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(angle - 0.55) * bLen, by + Math.sin(angle - 0.55) * bLen);
    }
    ctx.stroke();
  }

  // 2) Quarter Note (♩)
  function drawQuarterNote(ctx, size) {
    const r = size * 0.42;
    ctx.save();
    // Tilted oval notehead
    ctx.save();
    ctx.translate(-r * 0.3, size * 0.45);
    ctx.rotate(-0.35);
    ctx.scale(1.25, 0.88);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Stem
    const stemX = r * 0.72;
    const stemBottom = size * 0.42;
    const stemTop = -size * 0.78;
    ctx.lineWidth = Math.max(1.8, size * 0.16);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(stemX, stemBottom);
    ctx.lineTo(stemX, stemTop);
    // Flag curve
    ctx.bezierCurveTo(
      stemX + size * 0.65,
      stemTop + size * 0.22,
      stemX + size * 0.55,
      stemTop + size * 0.72,
      stemX + size * 0.18,
      stemTop + size * 0.95
    );
    ctx.stroke();
    ctx.restore();
  }

  // 3) Beamed Eighth Notes (♫)
  function drawBeamedNotes(ctx, size) {
    const r = size * 0.34;
    const spacing = size * 0.95;
    const leftX = -spacing * 0.5;
    const rightX = spacing * 0.5;
    const bottomY = size * 0.48;
    const topY = -size * 0.58;

    // Two tilted noteheads
    [leftX, rightX].forEach((nx, idx) => {
      ctx.save();
      ctx.translate(nx, bottomY - idx * (size * 0.14));
      ctx.rotate(-0.32);
      ctx.scale(1.22, 0.85);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Two stems + top beam
    const sLeft = leftX + r * 0.95;
    const sRight = rightX + r * 0.95;
    ctx.lineWidth = Math.max(1.6, size * 0.15);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(sLeft, bottomY);
    ctx.lineTo(sLeft, topY);
    ctx.lineTo(sRight, topY - size * 0.16);
    ctx.lineTo(sRight, bottomY - size * 0.14);
    ctx.stroke();

    // Thick top beam
    ctx.lineWidth = Math.max(2.6, size * 0.26);
    ctx.beginPath();
    ctx.moveTo(sLeft, topY + size * 0.06);
    ctx.lineTo(sRight, topY - size * 0.10);
    ctx.stroke();
  }

  // 4) 4-Point Festive Star Sparkle (✦)
  function drawSparkleStar(ctx, size) {
    const inner = size * 0.26;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const rad = i % 2 === 0 ? size : inner;
      const angle = (Math.PI / 4) * i;
      const x = Math.cos(angle) * rad;
      const y = Math.sin(angle) * rad;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Create particle pools for Background (richer, denser around edges) & Foreground Overlay (delicate across page)
  function createParticle(layer) {
    const isFg = layer === "fg";
    // Mix of shapes: ~45% soft snow, ~25% crystal snowflake, ~16% quarter note, ~10% beamed notes, ~4% star
    const roll = Math.random();
    let kind = " puff";
    if (roll < 0.42) kind = "puff";
    else if (roll < 0.68) kind = "crystal";
    else if (roll < 0.84) kind = "quarter";
    else if (roll < 0.95) kind = "beamed";
    else kind = "star";

    // Colors: crisp snow white, frost blue-white, crimson red, and ice-blue/gold notes
    let color = "#FFFFFF";
    if (kind === "quarter" || kind === "beamed") {
      const cRoll = Math.random();
      if (cRoll < 0.48) color = "#DB1F26"; // Festive Crimson
      else if (cRoll < 0.80) color = isFg ? "#1E3A8A" : "#FFFFFF"; // Royal Navy on poster / White on dark bg
      else color = "#EBB41F"; // Brass Gold
    } else if (kind === "star") {
      color = Math.random() > 0.35 ? "#FFFFFF" : "#DB1F26";
    } else {
      color = Math.random() > 0.3 ? "#FFFFFF" : "#E0F2FE";
    }

    const baseSize =
      kind === "puff"
        ? (isFg ? 2.5 + Math.random() * 3.5 : 3 + Math.random() * 4.5)
        : (isFg ? 6.5 + Math.random() * 5.5 : 7.5 + Math.random() * 7);

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: baseSize,
      kind,
      color,
      alpha: isFg ? 0.28 + Math.random() * 0.34 : 0.38 + Math.random() * 0.48,
      speedY: (isFg ? 0.45 : 0.55) + Math.random() * 0.85,
      swayAmp: 0.3 + Math.random() * 0.8,
      swayFreq: 0.008 + Math.random() * 0.016,
      phase: Math.random() * Math.PI * 2,
      rot: (Math.random() - 0.5) * 0.6,
      rotSpeed: (Math.random() - 0.5) * 0.012
    };
  }

  // Twinkling night-sky starfield on the background canvas
  const skyStars = Array.from({ length: 65 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.8 + Math.random() * 1.8,
    phase: Math.random() * Math.PI * 2,
    speed: 0.015 + Math.random() * 0.035,
    color: Math.random() > 0.25 ? "#FFFFFF" : "#F7CA44"
  }));

  const bgParticles = Array.from({ length: 48 }, () => createParticle("bg"));
  const fgParticles = Array.from({ length: 34 }, () => createParticle("fg"));

  function renderStars(ctx) {
    for (const s of skyStars) {
      s.phase += s.speed;
      const twinkle = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(s.phase));
      ctx.save();
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function renderLayer(ctx, list, isBg) {
    ctx.clearRect(0, 0, width, height);
    if (isBg) {
      renderStars(ctx);
    }

    const isNight = document.body.classList.contains("night-glow");

    for (const p of list) {
      p.y += p.speedY;
      p.phase += p.swayFreq;
      p.x += Math.sin(p.phase) * p.swayAmp;
      p.rot += p.rotSpeed;

      if (p.y > height + 24) {
        p.y = -24;
        p.x = Math.random() * width;
      }
      if (p.x > width + 24) p.x = -24;
      if (p.x < -24) p.x = width + 24;

      const drawColor = isNight && p.color === "#1E3A8A" ? "#93C5FD" : p.color;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = drawColor;
      ctx.strokeStyle = drawColor;

      if (p.kind === "puff") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === "crystal") {
        ctx.rotate(p.rot);
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        drawCrystalSnowflake(ctx, p.size);
      } else if (p.kind === "quarter") {
        ctx.rotate(Math.sin(p.phase) * 0.25);
        drawQuarterNote(ctx, p.size);
      } else if (p.kind === "beamed") {
        ctx.rotate(Math.sin(p.phase) * 0.22);
        drawBeamedNotes(ctx, p.size);
      } else if (p.kind === "star") {
        ctx.rotate(p.rot * 0.5);
        drawSparkleStar(ctx, p.size * 0.85);
      }

      ctx.restore();
    }
  }

  function animate() {
    renderLayer(bgCtx, bgParticles, true);
    renderLayer(fgCtx, fgParticles, false);
    requestAnimationFrame(animate);
  }

  animate();
}
