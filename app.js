// ---------- sample events (edit these for your project) ----------
const events = [
  {
    id: 1,
    title: "Tech Careers Networking Night",
    org: "Campus Career Center",
    type: "networking",          // networking | workshop | career-fair | info-session
    mode: "in-person",           // in-person | virtual | hybrid
    durationMinutes: 120,
    recommended: true,
    date: "2026-02-10",
    time: "5:00 PM – 7:00 PM",
    location: "Student Center 210",
    description:
      "Meet employers and alumni, practice your pitch, and discover tech internships and full-time roles."
  },
  {
    id: 2,
    title: "Cybersecurity Resume Clinic",
    org: "Computer Science Department",
    type: "workshop",
    mode: "virtual",
    durationMinutes: 60,
    recommended: true,
    date: "2026-01-25",
    time: "3:00 PM – 4:00 PM",
    location: "Zoom",
    description:
      "Bring a draft resume and get live feedback focused on security analyst and SOC roles."
  },
  {
    id: 3,
    title: "Spring Internship & Job Fair",
    org: "Employer Relations Team",
    type: "career-fair",
    mode: "in-person",
    durationMinutes: 180,
    recommended: true,
    date: "2026-03-05",
    time: "11:00 AM – 2:00 PM",
    location: "Campus Rec Center",
    description:
      "Over 60 employers hiring for summer internships, co-ops, and new-grad positions across industries."
  },
  {
    id: 4,
    title: "Company Spotlight: Horizon Robotics",
    org: "Industry Partnerships",
    type: "info-session",
    mode: "hybrid",
    durationMinutes: 45,
    recommended: false,
    date: "2026-01-18",
    time: "12:15 PM – 1:00 PM",
    location: "Engineering 105 / Zoom",
    description:
      "Learn how Horizon Robotics recruits students, what they look for, and how to stand out."
  },
  {
    id: 5,
    title: "Alumni Panel: First Year in Tech",
    org: "Alumni Office",
    type: "networking",
    mode: "virtual",
    durationMinutes: 90,
    recommended: false,
    date: "2025-11-10",
    time: "6:00 PM – 7:30 PM",
    location: "Zoom",
    description:
      "Recent graduates share job search lessons, onboarding surprises, and advice for students."
  }
];

// saved event ids (we'll persist them in localStorage)
let savedIds = [];

// ---------- helpers ----------
function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function isPast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00");
  return d < today;
}

function durationTag(durationMinutes) {
  if (!durationMinutes) return "";
  if (durationMinutes <= 60) return "short";
  if (durationMinutes >= 90) return "long";
  return "";
}

// ---------- rendering ----------
function renderEvents(list) {
  const container = document.getElementById("eventsContainer");
  const summary = document.getElementById("resultsSummary");

  container.innerHTML = "";

  summary.textContent =
    list.length === 1 ? "1 event found" : `${list.length} events found`;

  if (list.length === 0) {
    const p = document.createElement("p");
    p.className = "hs-empty";
    p.textContent =
      "No events match your search. Try changing the filters or keywords.";
    container.appendChild(p);
    return;
  }

  list.forEach((event) => {
    const card = document.createElement("article");
    card.className = "hs-card";

    const past = isPast(event.date);
    const durTag = durationTag(event.durationMinutes);
    const isSaved = savedIds.includes(event.id);

    const prettyDate = formatDate(event.date);
    const [month, day, year] = prettyDate.split(" ");

    card.innerHTML = `
      <div class="hs-card-date">
        <strong>${day.replace(",", "")}</strong>
        <span>${month} ${year}</span>
      </div>

      <div class="hs-card-main">
        <h3>${event.title}</h3>
        <p class="meta">${event.org}</p>
        <p class="meta">${event.time} • ${event.location}</p>
        <p>${event.description}</p>

        <div class="hs-chips">
          <span class="hs-chip">${event.type.replace("-", " ")}</span>
          <span class="hs-chip hs-chip-mode">${event.mode}</span>
          ${
            durTag
              ? `<span class="hs-chip ${
                  durTag === "short" ? "hs-chip-short" : "hs-chip-long"
                }">${
                  durTag === "short" ? "≤ 1 hour" : "≥ 1.5 hours"
                }</span>`
              : ""
          }
          ${past ? '<span class="hs-chip hs-chip-past">Past event</span>' : ""}
          ${
            event.recommended
              ? '<span class="hs-chip hs-chip-rec">Recommended</span>'
              : ""
          }
        </div>
      </div>

      <div class="hs-card-actions">
        <button class="hs-btn-primary" data-id="${event.id}">Register</button>
        <button class="hs-btn-secondary ${isSaved ? "saved" : ""}"
                data-id="${event.id}">
          ${isSaved ? "Saved" : "Save"}
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  attachButtonHandlers();
}

// ---------- filters + sorting ----------
function applyFilters() {
  const search = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const type = document.getElementById("typeFilter").value;
  const mode = document.getElementById("modeFilter").value;
  const sortOrder = document.getElementById("sortOrder").value;
  const recOnly = document.getElementById("recommendedOnly").checked;
  const upcomingOnly = document.getElementById("upcomingOnly").checked;
  const durationChoice = document.querySelector(
    'input[name="duration"]:checked'
  ).value;

  let filtered = events.slice();

  // filters
  filtered = filtered.filter((e) => {
    if (type && e.type !== type) return false;
    if (mode && e.mode !== mode) return false;
    if (recOnly && !e.recommended) return false;
    if (upcomingOnly && isPast(e.date)) return false;

    if (durationChoice === "short" && e.durationMinutes > 60) return false;
    if (durationChoice === "long" && e.durationMinutes < 60) return false;

    if (search) {
      const haystack = (
        e.title +
        " " +
        e.org +
        " " +
        e.location +
        " " +
        e.description
      )
        .toLowerCase()
        .replace(/\s+/g, " ");
      if (!haystack.includes(search)) return false;
    }

    return true;
  });

  // sorting
  filtered.sort((a, b) => {
    if (sortOrder === "az") {
      return a.title.localeCompare(b.title);
    }
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (sortOrder === "latest") {
      return dateB - dateA;
    }
    // default: soonest first
    return dateA - dateB;
  });

  renderEvents(filtered);
}

// ---------- button actions ----------
function attachButtonHandlers() {
  const registerButtons = document.querySelectorAll(".hs-btn-primary");
  const saveButtons = document.querySelectorAll(".hs-btn-secondary");

  registerButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const ev = events.find((e) => e.id === id);
      if (ev) {
        alert(
          `You registered for:\n\n${ev.title}\n${formatDate(
            ev.date
          )} • ${ev.time}`
        );
      }
    });
  });

  saveButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      if (savedIds.includes(id)) {
        savedIds = savedIds.filter((x) => x !== id);
      } else {
        savedIds.push(id);
      }
      persistSaved();
      applyFilters(); // re-render to update button style/text
    });
  });
}

// ---------- saved state in localStorage ----------
function loadSaved() {
  try {
    const raw = localStorage.getItem("hs_saved_events");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        savedIds = parsed;
      }
    }
  } catch (e) {
    // ignore if localStorage is unavailable
  }
}

function persistSaved() {
  try {
    localStorage.setItem("hs_saved_events", JSON.stringify(savedIds));
  } catch (e) {
    // ignore
  }
}

// ---------- init ----------
window.addEventListener("DOMContentLoaded", () => {
  loadSaved();
  applyFilters(); // initial render

  document
    .getElementById("searchInput")
    .addEventListener("input", applyFilters);
  document
    .getElementById("typeFilter")
    .addEventListener("change", applyFilters);
  document
    .getElementById("modeFilter")
    .addEventListener("change", applyFilters);
  document
    .getElementById("sortOrder")
    .addEventListener("change", applyFilters);
  document
    .getElementById("recommendedOnly")
    .addEventListener("change", applyFilters);
  document
    .getElementById("upcomingOnly")
    .addEventListener("change", applyFilters);

  document
    .querySelectorAll('input[name="duration"]')
    .forEach((r) => r.addEventListener("change", applyFilters));
});
