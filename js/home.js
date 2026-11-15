// ---------- Categories ----------
const categoryGrid = document.getElementById("categoryGrid");

categoryGrid.innerHTML = categories.map(function (c) {
  return `
    <a class="cat-card" href="projects.html?category=${encodeURIComponent(c.name)}">
      <span class="cat-emoji">${c.emoji}</span>
      <strong>${c.name}</strong>
    </a>
  `;
}).join("");

// ---------- Featured freelancers: top 3 by rating ----------
const topFreelancers = freelancers.slice().sort(function (a, b) {
  return b.rating - a.rating;
}).slice(0, 3);

document.getElementById("freelancerGrid").innerHTML = topFreelancers.map(freelancerCardHTML).join("");

// ---------- Featured projects: first 3 ----------
document.getElementById("projectGrid").innerHTML = projects.slice(0, 3).map(projectCardHTML).join("");
