// main.js
document.addEventListener("DOMContentLoaded", () => {
  // ========== 1. Buttons that show loading screen then navigate ==========
  const loadingButtons = document.querySelectorAll("[data-loading-button]");

  loadingButtons.forEach(btn => {
    btn.addEventListener("click", (event) => {
      event.preventDefault(); // stop normal link navigation

      const targetUrl = btn.getAttribute("href");
      if (!targetUrl || targetUrl === "#") return;

      // Replace the whole page with a white "loading" screen
      document.body.style.margin = "0";
      document.body.style.background = "#ffffff";
      document.body.innerHTML = `
        <div style="
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 2.5rem;
          color: #333;
        ">
          <p>Page is loading...</p>
        </div>
      `;

      // After a short delay, go to the real page
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 800);
    });
  });

  // ========== 2. Event RSVP / Add to Calendar demo ==========
  const calendarList = document.getElementById("calendarList");
  const eventButtons = document.querySelectorAll(".event-btn");

  eventButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const box = btn.closest(".sidebar-box");
      const title =
        box.getAttribute("data-event-title") ||
        box.querySelector("strong")?.textContent.trim() ||
        "Untitled Event";

      if (calendarList) {
        // remove "No events" message if present
        const emptyMsg = calendarList.querySelector(".empty-msg");
        if (emptyMsg) emptyMsg.remove();

        // avoid duplicates
        const exists = Array.from(calendarList.children).some(
          li => li.textContent === title
        );
        if (!exists) {
          const li = document.createElement("li");
          li.textContent = title;
          calendarList.appendChild(li);
        }
      }

      // Update button state for the demo
      btn.disabled = true;
      const action = btn.getAttribute("data-action");
      btn.textContent = action === "calendar" ? "Added ✓" : "Reserved ✓";
    });
  });
});

