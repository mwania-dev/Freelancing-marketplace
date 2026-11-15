// Builds the navbar and footer on every page.
// Each page tells us which link to highlight with <body data-page="...">

const navLinks = [
  { href: "index.html",       label: "Home",        page: "home" },
  { href: "projects.html",    label: "Projects",    page: "projects" },
  { href: "freelancers.html", label: "Freelancers", page: "freelancers" },
  { href: "dashboard.html",   label: "Dashboard",   page: "dashboard" }
];

const currentPage = document.body.dataset.page;

document.getElementById("siteHeader").innerHTML = `
  <header class="navbar">
    <a href="index.html" class="logo">💼 HireHub</a>
    <nav id="mainNav">
      ${navLinks.map(function (l) {
        const active = l.page === currentPage ? "active" : "";
        return `<a href="${l.href}" class="${active}">${l.label}</a>`;
      }).join("")}
    </nav>
    <button class="ghost small" id="themeBtn" aria-label="Toggle dark mode">🌓</button>
    <button class="ghost small menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false">☰</button>
  </header>
`;

document.getElementById("siteFooter").innerHTML = `
  <footer>
    <div class="footer-grid">
      <div>
        <strong>💼 HireHub</strong>
        <p>Where clients and freelancers meet.</p>
      </div>
      <div>
        <strong>Contact</strong>
        <p>hello@hirehub.example</p>
        <p>+254 700 000 000</p>
        <p>Nairobi, Kenya</p>
      </div>
      <div>
        <strong>Follow us</strong>
        <a href="#">LinkedIn</a>
        <a href="#">X / Twitter</a>
        <a href="#">GitHub</a>
      </div>
    </div>
    <p class="copy">&copy; 2026 HireHub</p>
  </footer>
`;

// ================= DARK MODE =================
const themeBtn = document.getElementById("themeBtn");

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("hirehub_theme");
} catch (e) {}

// first visit: follow the device setting; later visits: use the saved choice
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.setAttribute("data-theme", savedTheme || (prefersDark ? "dark" : "light"));

themeBtn.addEventListener("click", function () {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("hirehub_theme", next);
  } catch (e) {}
});

// ================= MOBILE MENU =================
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function setMenu(open) {
  mainNav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  menuToggle.textContent = open ? "✕" : "☰";
}

menuToggle.addEventListener("click", function () {
  setMenu(!mainNav.classList.contains("open"));
});

mainNav.addEventListener("click", function (e) {
  if (e.target.tagName === "A") setMenu(false);   // close after choosing a link
});

document.addEventListener("click", function (e) {
  // a click anywhere outside the navbar closes the menu
  if (!e.target.closest(".navbar")) setMenu(false);
});
