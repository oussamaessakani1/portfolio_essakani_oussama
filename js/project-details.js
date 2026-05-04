const loadingEl    = document.getElementById('pd-loading');
const errorEl      = document.getElementById('pd-error');
const errorMsgEl   = document.getElementById('pd-error-msg');
const wrapperEl    = document.getElementById('pd-wrapper');
const tabsEl       = document.getElementById('pd-tabs');
const sectionsEl   = document.getElementById('pd-sections');
const scrollTopEl  = document.getElementById('pd-scroll-top');
const modalOverlay = document.getElementById('pd-modal-overlay');
const modalClose   = document.getElementById('pd-modal-close');
const modalDismiss = document.getElementById('pd-modal-dismiss');

let activeSlug = null;

async function init() {
  try {
    const projects = await fetchProjects();
    renderTabs(projects);
    renderSections(projects);
    setupScrollTop();
    setupModal();
    
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && projects.some(p => p.slug === initialHash)) {
        showProject(initialHash);
    } else {
        showProject(projects[0].slug);
    }
    
    showWrapper();
  } catch (err) {
    showError(err.message);
  }
}

async function fetchProjects() {
  const res = await fetch('data/projects.json');
  if (!res.ok) throw new Error(`Could not load projects.json (HTTP ${res.status})`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error('projects.json is empty or malformed.');
  return data;
}

function renderTabs(projects) {
  tabsEl.innerHTML = '';
  projects.forEach(project => {
    const btn = document.createElement('a');
    btn.className  = 'pd-tab';
    btn.href       = `#${project.slug}`;
    btn.dataset.slug = project.slug;
    btn.setAttribute('aria-label', `View ${project.title}`);
    btn.innerHTML  = `
      <span class="pd-tab-dot" style="background:${project.accentColor}"></span>
      ${project.title}
    `;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showProject(project.slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    tabsEl.appendChild(btn);
  });
}

function renderSections(projects) {
  sectionsEl.innerHTML = '';
  projects.forEach(project => {
    const section = buildSection(project);
    sectionsEl.appendChild(section);
  });
}

function showProject(slug) {
    if (activeSlug === slug) return;
    
    const sections = document.querySelectorAll('.pd-section');
    sections.forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById(slug);
    if (target) {
        target.classList.add('active');
        activeSlug = slug;
        setActiveTab(slug);
        history.replaceState(null, '', `#${slug}`);
    }
}

function setActiveTab(slug) {
  document.querySelectorAll('.pd-tab').forEach(tab => {
    if (tab.dataset.slug === slug) {
      tab.classList.add('active');
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      tab.classList.remove('active');
    }
  });
}

function buildSection(p) {
  const section = document.createElement('section');
  section.className = 'pd-section';
  section.id = p.slug;

  const statusBg     = hexToRgba(p.statusColor, 0.12);
  const statusBorder = hexToRgba(p.statusColor, 0.3);

  const techHTML = p.technologies.map(t =>
    `<span class="pd-tech-tag">${t}</span>`
  ).join('');

  const featuresHTML = p.features.map(f => `
    <li class="pd-feature-item">
      <span class="pd-feature-check" style="border-color:${hexToRgba(p.accentColor, 0.4)};color:${p.accentColor}">✓</span>
      <span>${f}</span>
    </li>
  `).join('');

  const liveBtn = p.liveUrl
    ? `<button type="button"
          class="pd-link-btn primary pd-live-trigger"
          style="background:${p.accentColor}">
          ↗ View Live
       </button>`
    : '';

  const githubBtn = p.githubUrl && p.githubUrl !== '#' && p.githubUrl !== ''
    ? `<a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer"
          class="pd-link-btn secondary">
          ⌥ GitHub Repo
       </a>`
    : '';

  section.innerHTML = `
    <div class="pd-hero">
      <div class="pd-hero-top">
        <span class="pd-category-badge">${p.category}</span>
        <span class="pd-status-badge"
              style="background:${statusBg};border-color:${statusBorder};color:${p.statusColor}">
          <span class="pd-status-dot" style="background:${p.statusColor}"></span>
          ${p.status}
        </span>
      </div>
      <h2 class="pd-hero-title">${p.title}</h2>
      <div class="pd-accent-bar" style="background:${p.accentColor}"></div>
      <p class="pd-hero-short">${p.shortDescription}</p>
    </div>

    <div class="pd-info-cards">
      <div class="pd-info-card">
        <span class="pd-info-icon">📅</span>
        <span class="pd-info-label">Date</span>
        <span class="pd-info-value">${p.date}</span>
      </div>
      <div class="pd-info-card">
        <span class="pd-info-icon">⏱</span>
        <span class="pd-info-label">Duration</span>
        <span class="pd-info-value">${p.duration}</span>
      </div>
      <div class="pd-info-card">
        <span class="pd-info-icon">✦</span>
        <span class="pd-info-label">Status</span>
        <span class="pd-info-value" style="color:${p.statusColor}">${p.status}</span>
      </div>
    </div>

    <div class="pd-block">
      <p class="pd-block-title">About This Project</p>
      <p class="pd-block-text">${p.fullDescription}</p>
    </div>

    <div class="pd-block">
      <p class="pd-block-title">Technologies Used</p>
      <div class="pd-tech-list">${techHTML}</div>
    </div>

    <div class="pd-block">
      <p class="pd-block-title">Key Features</p>
      <ul class="pd-features-list">${featuresHTML}</ul>
    </div>

    <div class="pd-block">
      <p class="pd-block-title">Challenges &amp; Solutions</p>
      <div class="pd-challenge-card"
           style="border-left: 3px solid ${p.accentColor}">
        <p class="pd-challenge-text">${p.challenges}</p>
      </div>
    </div>

    <div class="pd-block">
      <p class="pd-block-title">Outcome &amp; Learnings</p>
      <p class="pd-block-text">${p.outcome}</p>
    </div>

    ${liveBtn || githubBtn ? `
    <div class="pd-block">
      <p class="pd-block-title">Project Links</p>
      <div class="pd-links-row">
        ${liveBtn}
        ${githubBtn}
      </div>
    </div>` : ''}
  `;

  section.querySelectorAll('.pd-live-trigger').forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  return section;
}

function setupModal() {
  if (modalClose)   modalClose.addEventListener('click', closeModal);
  if (modalDismiss) modalDismiss.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (modalOverlay) {
    modalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function setupScrollTop() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopEl.classList.remove('hidden');
    } else {
      scrollTopEl.classList.add('hidden');
    }
  });

  scrollTopEl.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function showWrapper() {
  loadingEl.classList.add('hidden');
  errorEl.classList.add('hidden');
  wrapperEl.classList.remove('hidden');
}

function showError(message) {
  loadingEl.classList.add('hidden');
  wrapperEl.classList.add('hidden');
  errorMsgEl.textContent = message || 'Unknown error.';
  errorEl.classList.remove('hidden');
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

document.addEventListener('DOMContentLoaded', init);
