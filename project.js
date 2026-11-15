// ---------- Which project? Read the id from the URL (?id=3) ----------
const params = new URLSearchParams(window.location.search);
const projectId = Number(params.get("id"));
const project = getProject(projectId);
const detail = document.getElementById("projectDetail");

// ---------- Helper: days until the deadline ----------
function daysLeft(deadline) {
  const ms = new Date(deadline) - new Date();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

// ---------- Show the project, or a friendly message if the id is wrong ----------
if (!project) {
  detail.innerHTML = `
    <div class="not-found">
      <h2>Project not found</h2>
      <p class="desc">This project doesn't exist or may have been removed.</p>
      <a href="projects.html" class="btn">Back to projects</a>
    </div>
  `;
} else {
  document.title = project.title + " – HireHub";

  const client = getClient(project.client);
  const days = daysLeft(project.deadline);
  const timeLeft = days > 0 ? days + " days left" : "Deadline passed";
  const isOpen = project.status === "Open";

  detail.innerHTML = `
    <a href="projects.html" class="back">← Back to projects</a>

    <div class="detail-layout">

      <article class="detail-main">
        <span class="badge">${project.category}</span>
        <h1>${project.title}</h1>
        <p class="desc">Posted by <strong>${project.client}</strong> ·
          <span class="status ${isOpen ? "open" : "closed"}">${project.status}</span>
        </p>

        <h3>Project description</h3>
        <p>${project.description}</p>

        <h3>Full details</h3>
        <p>${project.details}</p>

        <h3>Required skills</h3>
        <div class="tags">${skillTags(project.skills)}</div>
      </article>

      <aside class="detail-side">

        <div class="card">
          <div class="stat"><span>Budget</span><strong>${formatBudget(project)}</strong></div>
          <div class="stat"><span>Deadline</span><strong>${formatDate(project.deadline)}</strong></div>
          <div class="stat"><span>Time left</span><strong>${timeLeft}</strong></div>
          <div class="stat"><span>Category</span><strong>${project.category}</strong></div>
          ${isOpen
            ? '<a href="#proposalSection" class="btn block">Submit a proposal</a>'
            : '<button class="block" disabled>Project closed</button>'}
        </div>

        <div class="card">
          <h3>About the client</h3>
          <div class="client-row">
            <div class="avatar small">${client.name.charAt(0)}</div>
            <div>
              <strong>${client.name}</strong>
              <div class="desc">📍 ${client.location}</div>
            </div>
          </div>
          <div class="stat"><span>Client rating</span><strong>⭐ ${client.rating}</strong></div>
          <div class="stat"><span>Projects posted</span><strong>${client.posted}</strong></div>
          <div class="stat"><span>Member since</span><strong>${client.since}</strong></div>
        </div>

      </aside>
    </div>
  `;
}

// ================= PROPOSAL FORM =================
const proposalSection = document.getElementById("proposalSection");

function renderProposalForm() {
  proposalSection.innerHTML = `
    <div class="form-card">
      <h2>Submit a proposal</h2>
      <p class="desc">For <strong>${project.title}</strong> · Client budget: ${formatBudget(project)}</p>

      <form id="proposalForm" novalidate>
        <label for="pName">Your name</label>
        <input type="text" id="pName" autocomplete="name">
        <div class="error" id="err_name"></div>

        <label for="pEmail">Email</label>
        <input type="email" id="pEmail" autocomplete="email">
        <div class="error" id="err_email"></div>

        <label for="pPhone">Phone (optional)</label>
        <input type="tel" id="pPhone" autocomplete="tel" placeholder="+254 700 000 000">
        <div class="error" id="err_phone"></div>

        <label for="pLetter">Cover letter</label>
        <textarea id="pLetter" rows="6" placeholder="Why are you the right person for this project?"></textarea>
        <div class="row-between">
          <div class="error" id="err_letter"></div>
          <span class="desc" id="letterCount">0 / 50 minimum</span>
        </div>

        <label for="pBudget">Your expected budget ($)</label>
        <input type="number" id="pBudget" min="1" step="1">
        <div class="error" id="err_budget"></div>

        <button type="submit" class="block">Send proposal</button>
      </form>
    </div>
  `;

  const form = document.getElementById("proposalForm");
  const letterBox = document.getElementById("pLetter");

  // live character counter
  letterBox.addEventListener("input", function () {
    document.getElementById("letterCount").textContent =
      letterBox.value.trim().length + " / 50 minimum";
  });

  // clear a field's error as soon as the user starts fixing it
  ["name", "email", "phone", "letter", "budget"].forEach(function (key) {
    const field = document.getElementById("p" + key.charAt(0).toUpperCase() + key.slice(1));
    field.addEventListener("input", function () {
      document.getElementById("err_" + key).textContent = "";
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();                       // stop the page from reloading
    handleProposalSubmit();
  });
}

// ---------- Validation ----------
function validateProposal() {
  const values = {
    name:   document.getElementById("pName").value.trim(),
    email:  document.getElementById("pEmail").value.trim(),
    phone:  document.getElementById("pPhone").value.trim(),
    letter: document.getElementById("pLetter").value.trim(),
    budget: document.getElementById("pBudget").value.trim()
  };
  const errors = {};

  if (values.name.length < 2) {
    errors.name = "Please enter your full name.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (values.phone && !/^\+?[0-9\s-]{9,15}$/.test(values.phone)) {
    errors.phone = "Enter a valid phone number (9-15 digits), or leave it empty.";
  }
  if (values.letter.length < 50) {
    errors.letter = "Please write at least 50 characters.";
  }
  const budgetNumber = Number(values.budget);
  if (!values.budget || isNaN(budgetNumber) || budgetNumber <= 0) {
    errors.budget = "Enter your expected budget as a number above 0.";
  }

  return { values: values, errors: errors, valid: Object.keys(errors).length === 0 };
}

// ---------- Submit ----------
function handleProposalSubmit() {
  const result = validateProposal();

  // show or clear each error message
  ["name", "email", "phone", "letter", "budget"].forEach(function (key) {
    document.getElementById("err_" + key).textContent = result.errors[key] || "";
  });
  if (!result.valid) return;

  const proposal = {
    id: "P" + Date.now(),
    projectId: project.id,
    projectTitle: project.title,
    name: result.values.name,
    email: result.values.email,
    phone: result.values.phone,
    letter: result.values.letter,
    budget: Number(result.values.budget),
    date: new Date().toISOString(),
    status: "Pending"
  };

  if (!saveProposal(proposal)) {
    alert("Sorry, your proposal could not be saved. Please check your browser settings and try again.");
    return;
  }
  showProposalSuccess(proposal);
}

function showProposalSuccess(p) {
  proposalSection.innerHTML = `
    <div class="form-card center-text">
      <div class="success-icon">✅</div>
      <h2>Proposal sent!</h2>
      <p class="desc">
        Thank you, ${escapeHTML(p.name)}. Your proposal of
        <strong>$${p.budget.toLocaleString()}</strong> for
        <strong>${p.projectTitle}</strong> has been submitted (reference #${p.id}).
      </p>
     <a href="dashboard.html#proposals" class="btn">View my dashboard</a>
      <a href="projects.html" class="btn ghost">Browse more projects</a>
    </div>
  `;
}

// ---------- Show the form, or a message if the project is closed ----------
if (project && project.status === "Open") {
  renderProposalForm();
} else if (project) {
  proposalSection.innerHTML =
    '<div class="form-card center-text"><p class="desc">This project is closed and no longer accepts proposals.</p></div>';
}