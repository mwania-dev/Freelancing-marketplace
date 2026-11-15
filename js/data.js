// ================= DATA =================

const categories = [
  { name: "Web Development",   emoji: "💻" },
  { name: "Graphic Design",    emoji: "🎨" },
  { name: "Content Writing",   emoji: "✍️" },
  { name: "Digital Marketing", emoji: "📣" },
  { name: "Mobile Apps",       emoji: "📱" },
  { name: "Video Editing",     emoji: "🎬" }
];

const projects = [
  { id: 1, title: "Build a restaurant website", category: "Web Development",
    budgetMin: 300, budgetMax: 600, deadline: "2026-12-20", client: "Savanna Grill",
    description: "We need a modern, responsive website with a menu page, photo gallery and a table booking form.",
    details: "The site should have five pages: Home, Menu, Gallery, About and Contact. We will provide logo, photos and menu text. The booking form can send to email. Mobile-first design is important because most of our customers visit on phones.",
    skills: ["HTML", "CSS", "JavaScript"], status: "Open" },

  { id: 2, title: "Logo and brand identity", category: "Graphic Design",
    budgetMin: 150, budgetMax: 400, deadline: "2026-12-10", client: "FreshCart Kenya",
    description: "Design a logo, colour palette and simple brand guide for a grocery delivery startup.",
    details: "Deliverables: primary logo and icon version, colour palette, two fonts, and a one-page brand guide as PDF. We want a fresh, friendly feel. Please include three initial concepts before we choose a direction.",
    skills: ["Logo Design", "Illustrator", "Branding"], status: "Open" },

  { id: 3, title: "Write 10 blog posts about personal finance", category: "Content Writing",
    budgetMin: 200, budgetMax: 350, deadline: "2027-01-05", client: "MoneyWise Blog",
    description: "10 SEO-friendly articles of about 1,200 words each for beginners.",
    details: "Topics will be agreed together. Each article needs a clear structure, headings and a short summary. Content must be original and checked for plagiarism. We pay per batch of five articles.",
    skills: ["SEO", "Copywriting", "Research"], status: "Open" },

  { id: 4, title: "Social media campaign for a product launch", category: "Digital Marketing",
    budgetMin: 400, budgetMax: 900, deadline: "2027-01-15", client: "GlowSkin Co.",
    description: "Plan and run a 4-week Instagram and TikTok campaign for a new skincare line.",
    details: "You will create a content calendar, write captions, coordinate with two influencers and report weekly on reach and engagement. Experience with beauty or lifestyle brands is a plus.",
    skills: ["Social Media", "Content Strategy", "Analytics"], status: "Open" },

  { id: 5, title: "Mobile app for a gym membership", category: "Mobile Apps",
    budgetMin: 1200, budgetMax: 2500, deadline: "2027-02-28", client: "IronWorks Gym",
    description: "A cross-platform app for class booking, membership status and payments.",
    details: "Core features: sign-up and login, class schedule with booking, membership card with QR code, and payment history. Backend can be Firebase. We would like a clickable prototype in the first two weeks.",
    skills: ["React Native", "Firebase", "UI/UX"], status: "Open" },

  { id: 6, title: "Edit 8 YouTube videos", category: "Video Editing",
    budgetMin: 160, budgetMax: 320, deadline: "2026-12-05", client: "TechTalk with Amina",
    description: "Cut, add captions, music and thumbnails for 8 tech review videos of 8-12 minutes.",
    details: "Raw footage will be shared through Google Drive. We need jump cuts, on-screen text, background music and a custom thumbnail for each video. Turnaround of 3 days per video.",
    skills: ["Premiere Pro", "Captions", "Thumbnails"], status: "Open" },

  { id: 7, title: "Landing page for an online course", category: "Web Development",
    budgetMin: 120, budgetMax: 250, deadline: "2026-12-12", client: "LearnBright Academy",
    description: "A single high-converting landing page with a signup form and course outline.",
    details: "One page with hero, benefits, curriculum, instructor profile, testimonials and a signup form. Design mockup is provided in Figma. Must load fast and work well on mobile.",
    skills: ["HTML", "CSS", "Responsive Design"], status: "Open" },

  { id: 8, title: "Poster and flyer set for a music festival", category: "Graphic Design",
    budgetMin: 90, budgetMax: 200, deadline: "2026-12-01", client: "Coastline Beats",
    description: "A poster, Instagram post and flyer, all in one consistent style.",
    details: "Bold, colourful and youthful. We will send the line-up, date and venue. Files needed: print-ready PDF for the poster and flyer, and PNG for the social posts.",
    skills: ["Photoshop", "Poster Design"], status: "Open" }
];

const freelancers = [
  { id: 1, name: "Amina Wanjiru", title: "Full-Stack Web Developer", level: "Expert", emoji: "👩🏾‍💻",
    rating: 4.9, reviews: 48, skills: ["HTML", "CSS", "JavaScript", "React"],
    bio: "I build fast, accessible websites and web apps for small businesses. 6 years of experience.",
    portfolio: ["Online store for a fashion brand", "Booking system for a clinic", "Portfolio sites for creatives"] },

  { id: 2, name: "Brian Otieno", title: "Brand and Graphic Designer", level: "Intermediate", emoji: "🎨",
    rating: 4.7, reviews: 31, skills: ["Logo Design", "Illustrator", "Photoshop", "Branding"],
    bio: "I help new businesses look professional with clean, memorable branding.",
    portfolio: ["Logo set for a coffee shop", "Brand guide for a fintech startup", "Event posters"] },

  { id: 3, name: "Grace Njeri", title: "SEO Content Writer", level: "Expert", emoji: "✍️",
    rating: 4.8, reviews: 62, skills: ["SEO", "Copywriting", "Research", "Blogging"],
    bio: "Former journalist turned content writer. I write articles that rank and read well.",
    portfolio: ["30+ finance and tech blog posts", "Website copy for a law firm", "Email newsletters"] },

  { id: 4, name: "Kevin Mutua", title: "Mobile App Developer", level: "Expert", emoji: "📱",
    rating: 4.6, reviews: 22, skills: ["React Native", "Firebase", "UI/UX"],
    bio: "I turn app ideas into polished iOS and Android apps, from prototype to store release.",
    portfolio: ["Delivery tracking app", "Fitness tracker", "School parent portal"] },

  { id: 5, name: "Lucy Akinyi", title: "Social Media Manager", level: "Intermediate", emoji: "📣",
    rating: 4.5, reviews: 19, skills: ["Social Media", "Content Strategy", "Analytics"],
    bio: "I plan and run campaigns that grow engaged communities for lifestyle brands.",
    portfolio: ["Instagram growth for a bakery", "TikTok launch for a clothing line"] },

  { id: 6, name: "Daniel Kiprop", title: "Junior Video Editor", level: "Beginner", emoji: "🎬",
    rating: 4.3, reviews: 8, skills: ["Premiere Pro", "Captions", "Thumbnails"],
    bio: "Reliable and fast editor for YouTube creators. Eager to build long-term working relationships.",
    portfolio: ["Weekly vlog edits", "Short-form clips for Reels"] }
];

// ---------- Reviews, keyed by freelancer id ----------
const reviews = {
  1: [
    { by: "Savanna Grill",       rating: 5, text: "Delivered ahead of schedule and the site works great on phones." },
    { by: "LearnBright Academy", rating: 5, text: "Clean code and clear communication from day one." }
  ],
  2: [
    { by: "FreshCart Kenya", rating: 5, text: "Three strong logo concepts and fast revisions." },
    { by: "Coastline Beats", rating: 4, text: "Great poster design, just needed a small colour tweak." }
  ],
  3: [
    { by: "MoneyWise Blog", rating: 5, text: "Articles were well researched and ranked within weeks." },
    { by: "GlowSkin Co.",   rating: 5, text: "Our website copy finally sounds like us." }
  ],
  4: [
    { by: "IronWorks Gym", rating: 5, text: "The prototype in week two made decisions easy." },
    { by: "LearnBright Academy", rating: 4, text: "Solid app, handled our feedback well." }
  ],
  5: [
    { by: "GlowSkin Co.", rating: 5, text: "Our Instagram engagement doubled in a month." },
    { by: "Savanna Grill", rating: 4, text: "Creative content ideas and good weekly reports." }
  ],
  6: [
    { by: "TechTalk with Amina", rating: 4, text: "Fast turnaround and tidy captions." },
    { by: "Coastline Beats",     rating: 4, text: "Good short clips, learning quickly." }
  ]
};

function stars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

// ================= HELPERS =================
function getProject(id) {
  return projects.find(function (p) { return p.id === id; });
}

function getFreelancer(id) {
  return freelancers.find(function (f) { return f.id === id; });
}

function formatBudget(p) {
  return "$" + p.budgetMin.toLocaleString() + " – $" + p.budgetMax.toLocaleString();
}

function formatDate(text) {
  return new Date(text).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function skillTags(list) {
  return list.map(function (s) { return `<span class="tag">${s}</span>`; }).join("");
}

// ---------- Client info (shown on the project details page) ----------
const clients = {
  "Savanna Grill":       { location: "Nairobi, Kenya", since: 2024, rating: 4.8 },
  "FreshCart Kenya":     { location: "Mombasa, Kenya", since: 2025, rating: 4.6 },
  "MoneyWise Blog":      { location: "Kisumu, Kenya",  since: 2023, rating: 4.9 },
  "GlowSkin Co.":        { location: "Nairobi, Kenya", since: 2025, rating: 4.7 },
  "IronWorks Gym":       { location: "Nakuru, Kenya",  since: 2024, rating: 4.5 },
  "TechTalk with Amina": { location: "Nairobi, Kenya", since: 2023, rating: 4.9 },
  "LearnBright Academy": { location: "Eldoret, Kenya", since: 2025, rating: 4.4 },
  "Coastline Beats":     { location: "Mombasa, Kenya", since: 2024, rating: 4.6 }
};

function getClient(name) {
  const info = clients[name] || { location: "Kenya", since: 2025, rating: 4.5 };
  const posted = projects.filter(function (p) { return p.client === name; }).length;
  return { name: name, location: info.location, since: info.since, rating: info.rating, posted: posted };
}

// ---------- Makes user-typed text safe to place inside innerHTML ----------
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---------- Saved proposals (kept in LocalStorage) ----------
const PROPOSALS_KEY = "hirehub_proposals";

function getProposals() {
  try {
    return JSON.parse(localStorage.getItem(PROPOSALS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveProposal(proposal) {
  const list = getProposals();
  list.push(proposal);
  try {
    localStorage.setItem(PROPOSALS_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    return false;   // storage blocked or full
  }
}
function saveProposals(list) {
  try {
    localStorage.setItem(PROPOSALS_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    return false;
  }
}

// ---------- Projects posted by the user (kept in LocalStorage) ----------
const POSTED_KEY = "hirehub_posted";

function getPostedProjects() {
  try {
    return JSON.parse(localStorage.getItem(POSTED_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function savePostedProjects(list) {
  try {
    localStorage.setItem(POSTED_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    return false;
  }
}

// ---------- The user's profile (kept in LocalStorage) ----------
const PROFILE_KEY = "hirehub_profile";

function getProfile() {
  const fallback = { name: "Guest User", email: "", location: "", bio: "" };
  try {
    return Object.assign({}, fallback, JSON.parse(localStorage.getItem(PROFILE_KEY)) || {});
  } catch (e) {
    return fallback;
  }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (e) {
    return false;
  }
}

// ================= CARD TEMPLATES (reused on several pages) =================
function projectCardHTML(p) {
  return `
    <div class="card">
      <span class="badge">${p.category}</span>
      <h3>${p.title}</h3>
      <p class="desc">${p.description}</p>
      <div class="tags">${skillTags(p.skills)}</div>
      <div class="meta"><span>💰 ${formatBudget(p)}</span></div>
      <div class="meta"><span>🏢 ${p.client}</span><span>📅 ${formatDate(p.deadline)}</span></div>
      <a href="project.html?id=${p.id}" class="btn small">View details</a>
    </div>
  `;
}

function freelancerCardHTML(f) {
  return `
    <div class="card">
      <div class="avatar">${f.emoji}</div>
      <h3>${f.name}</h3>
      <div class="meta"><span>${f.title}</span></div>
      <div class="meta"><span>⭐ ${f.rating} (${f.reviews} reviews)</span><span class="badge">${f.level}</span></div>
      <p class="desc">${f.bio}</p>
      <div class="tags">${skillTags(f.skills)}</div>
      <a href="freelancers.html?id=${f.id}" data-profile="${f.id}" class="btn small">View profile</a>
    </div>
  `;
}
// ---------- Merge the user's posted projects into the main list ----------
// After this line, every page treats them like any other project.
getPostedProjects().forEach(function (p) {
  projects.push(p);
});
