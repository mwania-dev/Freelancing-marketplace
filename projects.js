// ---------- Elements ----------
const projectSearch = document.getElementById("projectSearch");
const categoryFilter = document.getElementById("categoryFilter");
const budgetFilter = document.getElementById("budgetFilter");
const sortProjects = document.getElementById("sortProjects");
const projectGrid = document.getElementById("projectGrid");
const resultCount = document.getElementById("resultCount");
const clearFilters = document.getElementById("clearFilters");

// ---------- Fill the category dropdown from the data ----------
categoryFilter.innerHTML =
  '<option value="all">All categories</option>' +
  categories.map(function (c) {
    return `<option value="${c.name}">${c.name}</option>`;
  }).join("");

// ---------- Pre-select a category if the URL has ?category=... ----------
const urlCategory = new URLSearchParams(window.location.search).get("category");
if (urlCategory) categoryFilter.value = urlCategory;
if (!categoryFilter.value) categoryFilter.value = "all";   // unknown name: fall back

// ---------- Filter, sort, render ----------
function renderProjects() {
  const text = projectSearch.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const budget = budgetFilter.value;
  const sort = sortProjects.value;

  // 1. Filter
  const list = projects.filter(function (p) {
    if (text && !p.title.toLowerCase().includes(text)) return false;
    if (category !== "all" && p.category !== category) return false;
    if (budget === "low" && p.budgetMax > 300) return false;
    if (budget === "mid" && (p.budgetMax <= 300 || p.budgetMax > 1000)) return false;
    if (budget === "high" && p.budgetMax <= 1000) return false;
    return true;
  });

  // 2. Sort
  list.sort(function (a, b) {
    if (sort === "budgetHigh") return b.budgetMax - a.budgetMax;
    if (sort === "budgetLow") return a.budgetMax - b.budgetMax;
    return new Date(a.deadline) - new Date(b.deadline);   // soonest deadline first
  });

  // 3. Show the count
  resultCount.textContent =
    "Showing " + list.length + " of " + projects.length + " projects";

  // 4. Render
  if (list.length === 0) {
    projectGrid.innerHTML = '<p class="empty">No projects match your filters.</p>';
    return;
  }
  projectGrid.innerHTML = list.map(projectCardHTML).join("");
}

// ---------- Events ----------
projectSearch.addEventListener("input", renderProjects);
categoryFilter.addEventListener("change", renderProjects);
budgetFilter.addEventListener("change", renderProjects);
sortProjects.addEventListener("change", renderProjects);

clearFilters.addEventListener("click", function () {
  projectSearch.value = "";
  categoryFilter.value = "all";
  budgetFilter.value = "all";
  sortProjects.value = "deadline";
  renderProjects();
});

// ---------- Run on page load ----------
renderProjects();