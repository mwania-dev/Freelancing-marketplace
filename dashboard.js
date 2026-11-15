// ---------- Elements and state ----------
const tabsEl = document.getElementById("tabs");
const content = document.getElementById("tabContent");
const dashSub = document.getElementById("dashSub");

const validTabs = ["overview", "proposals", "posted", "profile"];
let activeTab = "overview";
let flash = "";   // a one-time success message

// open the tab named in the URL, e.g. dashboard.html#proposals
const hashTab = window.location.hash.slice(1);
if (validTabs.includes(hashTab)) activeTab = hashTab;

// ---------- Small helpers ----------
function val(id) {
  return document.getElementById(id).value.trim();
}

function pill(status) {
  const key = status.toLowerCase().replace(/\s+/g, "-");
  return `<span class="pill ${key}">${status}</span>`;
}

function emptyBox(message, href, label) {
  return `
    <div class="empty-box">
      <p class="desc">${message}</p>
      ${href ? `<a href="${href}" class="btn small">${label}</a>` : ""}
    </div>`;
}

function showErrors(keys, errors) {
  keys.forEach(function (k) {
    document.getElementById("err_" + k).textContent = errors[k] || "";
  });
}

// ---------- One proposal row ----------
function proposalRow(p, canWithdraw) {
  const proj = getProject(p.projectId);
  const projectStatus = proj ? proj.status : "Removed";
  return `
    <div class="list-row">
      <div>
        <a href="project.html?id=${p.projectId}"><strong>${p.projectTitle}</strong></a>
        <div class="desc">
          Your bid: $${p.budget.toLocaleString()} · Sent ${formatDate(p.date)} · Project: ${projectStatus}
        </div>
      </div>
      <div class="row-actions">
        ${pill(p.status)}
        ${canWithdraw ? `<button class="ghost small" data-withdraw="${p.id}">Withdraw</button>` : ""}
      </div>
    </div>`;
}

// ================= TAB 1: OVERVIEW =================
function renderOverview() {
  const proposals = getProposals();
  const posted = getPostedProjects();
  const pending = proposals.filter(function (p) { return p.status === "Pending"; }).length;
  const open = posted.filter(function (p) { return p.status === "Open"; }).length;
  const recent = proposals.slice().reverse().slice(0, 3);

  return `
    <div class="stats">
      <div class="stat-card"><strong>${proposals.length}</strong><span>Proposals sent</span></div>
      <div class="stat-card"><strong>${pending}</strong><span>Pending replies</span></div>
      <div class="stat-card"><strong>${posted.length}</strong><span>Projects posted</span></div>
      <div class="stat-card"><strong>${open}</strong><span>Open projects</span></div>
    </div>

    <h3 class="dash-h">Recent proposals</h3>
    ${recent.length
      ? recent.map(function (p) { return proposalRow(p, false); }).join("")
      : emptyBox("You haven't submitted any proposals yet.", "projects.html", "Browse projects")}
  `;
}

// ================= TAB 2: MY PROPOSALS =================
function renderProposals() {
  const proposals = getProposals().slice().reverse();   // newest first
  return `
    <h3 class="dash-h">Submitted proposals (${proposals.length})</h3>
    ${proposals.length
      ? proposals.map(function (p) { return proposalRow(p, true); }).join("")
      : emptyBox("No proposals yet. Find a project and send your first one.", "projects.html", "Browse projects")}
  `;
}

// ================= TAB 3: MY PROJECTS =================
function renderPosted() {
  const posted = getPostedProjects();
  const allProposals = getProposals();

  const rows = posted.map(function (p) {
    const count = allProposals.filter(function (x) { return x.projectId === p.id; }).length;
    const options = ["Open", "In Progress", "Completed"].map(function (s) {
      return `<option value="${s}" ${p.status === s ? "selected" : ""}>${s}</option>`;
    }).join("");

    return `
      <div class="list-row">
        <div>
          <a href="project.html?id=${p.id}"><strong>${p.title}</strong></a>
          <div class="desc">${p.category} · ${formatBudget(p)} · Due ${formatDate(p.deadline)} · ${count} proposal${count === 1 ? "" : "s"}</div>
        </div>
        <div class="row-actions">
          ${pill(p.status)}
          <select data-status="${p.id}" aria-label="Change status">${options}</select>
          <button class="ghost small" data-delete="${p.id}">Delete</button>
        </div>
      </div>`;
  }).join("");

  const categoryOptions = categories.map(function (c) {
    return `<option value="${c.name}">${c.name}</option>`;
  }).join("");

  return `
    <h3 class="dash-h">Your posted projects (${posted.length})</h3>
    ${posted.length ? rows : emptyBox("You haven't posted a project yet. Use the form below to post one.")}

    <div class="form-card wide">
      <h3>Post a new project</h3>
      <form id="postForm" novalidate>
        <label for="pjTitle">Project title</label>
        <input type="text" id="pjTitle">
        <div class="error" id="err_title"></div>

        <label for="pjCategory">Category</label>
        <select id="pjCategory"><option value="">Choose a category</option>${categoryOptions}</select>
        <div class="error" id="err_category"></div>

        <div class="two-col">
          <div>
            <label for="pjMin">Minimum budget ($)</label>
            <input type="number" id="pjMin" min="1">
            <div class="error" id="err_min"></div>
          </div>
          <div>
            <label for="pjMax">Maximum budget ($)</label>
            <input type="number" id="pjMax" min="1">
            <div class="error" id="err_max"></div>
          </div>
        </div>

        <label for="pjDeadline">Deadline</label>
        <input type="date" id="pjDeadline">
        <div class="error" id="err_deadline"></div>

        <label for="pjDesc">Description</label>
        <textarea id="pjDesc" rows="4"></textarea>
        <div class="error" id="err_desc"></div>

        <label for="pjSkills">Required skills (separate with commas)</label>
        <input type="text" id="pjSkills" placeholder="HTML, CSS, JavaScript">
        <div class="error" id="err_skills"></div>

        <button type="submit" class="block">Post project</button>
      </form>
    </div>
  `;
}

function validatePost() {
  const v = {
    title: val("pjTitle"),
    category: val("pjCategory"),
    min: Number(val("pjMin")),
    max: Number(val("pjMax")),
    deadline: val("pjDeadline"),
    desc: val("pjDesc"),
    skills: val("pjSkills").split(",").map(function (s) { return s.trim(); }).filter(Boolean)
  };
  const errors = {};

  if (v.title.length < 5) errors.title = "Give your project a title of at least 5 characters.";
  if (!v.category) errors.category = "Please choose a category.";
  if (!(v.min > 0)) errors.min = "Enter a minimum budget above 0.";
  if (!(v.max > 0)) errors.max = "Enter a maximum budget above 0.";
  else if (v.max < v.min) errors.max = "Maximum must be at least the minimum.";
  if (!v.deadline || new Date(v.deadline) <= new Date()) errors.deadline = "Choose a deadline in the future.";
  if (v.desc.length < 30) errors.desc = "Please describe the project in at least 30 characters.";
  if (v.skills.length === 0) errors.skills = "Add at least one required skill.";

  return { values: v, errors: errors, valid: Object.keys(errors).length === 0 };
}

function handlePostSubmit() {
  const keys = ["title", "category", "min", "max", "deadline", "desc", "skills"];
  const result = validatePost();
  showErrors(keys, result.errors);
  if (!result.valid) return;

  const v = result.values;
  const profile = getProfile();

  // Text typed by the user is escaped before saving, because the card
  // templates place it into innerHTML on other pages.
  const project = {
    id: Date.now(),
    title: escapeHTML(v.title),
    category: v.category,
    budgetMin: v.min,
    budgetMax: v.max,
    deadline: v.deadline,
    client: escapeHTML(profile.name),
    description: escapeHTML(v.desc),
    details: escapeHTML(v.desc),
    skills: v.skills.map(escapeHTML),
    status: "Open"
  };

  const list = getPostedProjects();
  list.push(project);
  if (!savePostedProjects(list)) {
    alert("Sorry, your project could not be saved. Please check your browser settings and try again.");
    return;
  }
  projects.push(project);   // so it shows up on this page's data too
  flash = "Project posted! It now appears on the Projects page.";
  render();
}

// ================= TAB 4: PROFILE =================
function renderProfile() {
  return `
    <div class="form-card wide">
      <h3>Your profile</h3>
      <form id="profileForm" novalidate>
        <label for="prName">Full name</label>
        <input type="text" id="prName">
        <div class="error" id="err_prName"></div>

        <label for="prEmail">Email</label>
        <input type="email" id="prEmail">
        <div class="error" id="err_prEmail"></div>

        <label for="prLocation">Location</label>
        <input type="text" id="prLocation" placeholder="e.g. Nairobi, Kenya">

        <label for="prBio">Short bio</label>
        <textarea id="prBio" rows="4"></textarea>

        <button type="submit" class="block">Save profile</button>
      </form>
    </div>
  `;
}

// Values are set with JavaScript (not written into the HTML), which is the safe way
function fillProfileForm() {
  const p = getProfile();
  document.getElementById("prName").value = p.name;
  document.getElementById("prEmail").value = p.email;
  document.getElementById("prLocation").value = p.location;
  document.getElementById("prBio").value = p.bio;
}

function handleProfileSubmit() {
  const name = val("prName");
  const email = val("prEmail");
  const errors = {};

  if (name.length < 2) errors.prName = "Please enter your name.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.prEmail = "Enter a valid email address.";

  showErrors(["prName", "prEmail"], errors);
  if (Object.keys(errors).length) return;

  const ok = saveProfile({ name: name, email: email, location: val("prLocation"), bio: val("prBio") });
  flash = ok ? "Profile saved." : "Could not save your profile. Check your browser settings.";
  render();
}

// ================= RENDER =================
function render() {
  const profile = getProfile();
  dashSub.innerHTML = "Welcome back, <strong>" + escapeHTML(profile.name) + "</strong>";

  // highlight the active tab
  tabsEl.querySelectorAll(".tab").forEach(function (btn) {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === activeTab);
  });

  const views = {
    overview: renderOverview,
    proposals: renderProposals,
    posted: renderPosted,
    profile: renderProfile
  };

  content.innerHTML = (flash ? `<div class="flash">${flash}</div>` : "") + views[activeTab]();
  flash = "";

  if (activeTab === "profile") fillProfileForm();
}

// ================= EVENTS =================
tabsEl.addEventListener("click", function (e) {
  const tab = e.target.getAttribute("data-tab");
  if (!tab) return;
  activeTab = tab;
  history.replaceState(null, "", "#" + tab);
  render();
});

content.addEventListener("click", function (e) {
  // Withdraw a proposal
  const withdrawId = e.target.getAttribute("data-withdraw");
  if (withdrawId) {
    if (!confirm("Withdraw this proposal?")) return;
    saveProposals(getProposals().filter(function (p) { return p.id !== withdrawId; }));
    render();
    return;
  }

  // Delete a posted project
  const deleteId = e.target.getAttribute("data-delete");
  if (deleteId) {
    if (!confirm("Delete this project?")) return;
    const id = Number(deleteId);
    savePostedProjects(getPostedProjects().filter(function (p) { return p.id !== id; }));
    const index = projects.findIndex(function (p) { return p.id === id; });
    if (index > -1) projects.splice(index, 1);
    render();
  }
});

// Change a project's status
content.addEventListener("change", function (e) {
  const statusId = e.target.getAttribute("data-status");
  if (!statusId) return;
  const id = Number(statusId);

  const list = getPostedProjects();
  const saved = list.find(function (p) { return p.id === id; });
  if (saved) saved.status = e.target.value;
  savePostedProjects(list);

  const live = getProject(id);
  if (live) live.status = e.target.value;
  render();
});

content.addEventListener("submit", function (e) {
  e.preventDefault();
  if (e.target.id === "postForm") handlePostSubmit();
  if (e.target.id === "profileForm") handleProfileSubmit();
});

// ---------- Run on page load ----------
render();