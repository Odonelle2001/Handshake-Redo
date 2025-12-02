// Js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // Find anything that should trigger the loading screen
  const loadingButtons = document.querySelectorAll("[data-loading-button]");

  loadingButtons.forEach(btn => {
    btn.addEventListener("click", (event) => {
      event.preventDefault(); // stop normal link navigation

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
    });
  });
});
