// ---------- Elements ----------
const skillSearch = document.getElementById("skillSearch");
const levelFilter = document.getElementById("levelFilter");
const sortFreelancers = document.getElementById("sortFreelancers");
const freelancerGrid = document.getElementById("freelancerGrid");
const resultCount = document.getElementById("resultCount");
const clearFilters = document.getElementById("clearFilters");
const profileOverlay = document.getElementById("profileOverlay");
const profileBox = document.getElementById("profileBox");

// ---------- Filter, sort, render ----------
function renderFreelancers() {
  const text = skillSearch.value.trim().toLowerCase();
  const level = levelFilter.value;
  const sort = sortFreelancers.value;

  // 1. Filter: the text can match any skill or the job title
  const list = freelancers.filter(function (f) {
    if (level !== "all" && f.level !== level) return false;
    if (text) {
      const inSkills = f.skills.some(function (s) { return s.toLowerCase().includes(text); });
      const inTitle = f.title.toLowerCase().includes(text);
      if (!inSkills && !inTitle) return false;
    }
    return true;
  });

  // 2. Sort
  list.sort(function (a, b) {
    if (sort === "reviews") return b.reviews - a.reviews;
    return b.rating - a.rating;
  });

  // 3. Count and render
  resultCount.textContent = "Showing " + list.length + " of " + freelancers.length + " freelancers";

  if (list.length === 0) {
    freelancerGrid.innerHTML = '<p class="empty">No freelancers match your search.</p>';
    return;
  }
  freelancerGrid.innerHTML = list.map(freelancerCardHTML).join("");
}

// ---------- Profile pop-up ----------
function openProfile(id) {
  const f = getFreelancer(id);
  if (!f) return;

  profileBox.innerHTML = `
    <div class="drawer-head">
      <span></span>
      <button class="ghost small" id="closeProfile" aria-label="Close">✕</button>
    </div>

    <div class="profile-head">
      <div class="avatar">${f.emoji}</div>
      <div>
        <h2>${f.name}</h2>
        <div class="desc">${f.title}</div>
        <div class="meta"><span>⭐ ${f.rating} (${f.reviews} reviews)</span><span class="badge">${f.level}</span></div>
      </div>
    </div>

    <h3>About</h3>
    <p>${f.bio}</p>

    <h3>Skills</h3>
    <div class="tags">${skillTags(f.skills)}</div>

    <h3>Portfolio samples</h3>
    <ul class="portfolio">
      ${f.portfolio.map(function (item) { return `<li>🗂️ ${item}</li>`; }).join("")}
    </ul>

    <h3>Reviews</h3>
    ${(reviews[f.id] || []).map(function (r) {
      return `
        <div class="review">
          <div class="meta"><strong>${r.by}</strong><span class="stars">${stars(r.rating)}</span></div>
          <p class="desc">${r.text}</p>
        </div>`;
    }).join("")}
  `;

  profileOverlay.classList.add("show");
}

function closeProfile() {
  profileOverlay.classList.remove("show");
}

// ---------- Events ----------
skillSearch.addEventListener("input", renderFreelancers);
levelFilter.addEventListener("change", renderFreelancers);
sortFreelancers.addEventListener("change", renderFreelancers);

clearFilters.addEventListener("click", function () {
  skillSearch.value = "";
  levelFilter.value = "all";
  sortFreelancers.value = "rating";
  renderFreelancers();
});

// "View profile" links: open the pop-up instead of reloading the page
freelancerGrid.addEventListener("click", function (e) {
  const link = e.target.closest("[data-profile]");
  if (!link) return;
  e.preventDefault();
  openProfile(Number(link.getAttribute("data-profile")));
});

// close with the X button, a click on the dark area, or the Escape key
profileOverlay.addEventListener("click", function (e) {
  if (e.target === profileOverlay || e.target.id === "closeProfile") closeProfile();
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeProfile();
});

// ---------- Run on page load ----------
renderFreelancers();

// open a profile directly if the URL has ?id=3 (links from the homepage)
const profileIdFromUrl = Number(new URLSearchParams(window.location.search).get("id"));
if (profileIdFromUrl) openProfile(profileIdFromUrl);