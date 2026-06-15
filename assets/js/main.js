const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

const navToggle = $('#navToggle');
const navMenu = $('#navMenu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

$$('#navMenu a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

$('#year').textContent = new Date().getFullYear();

function createSkillCard(skill) {
  return `
    <article class="skill-card">
      <h3>${skill.title}</h3>
      <ul class="skill-list">
        ${skill.items.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    </article>
  `;
}

function createTimelineItem(item) {
  return `
    <article class="timeline-item">
      <div class="timeline-date">${item.date}</div>
      <div>
        <h3>${item.role}</h3>
        <p class="timeline-company">${item.company}</p>
        <ul class="timeline-points">
          ${item.points.map((point) => `<li>${point}</li>`).join('')}
        </ul>
        <div class="timeline-tags">
          ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    </article>
  `;
}

function createProjectCard(project) {
  const githubLink = project.github
    ? `<a href="${project.github}" target="_blank" rel="noopener">GitHub</a>`
    : `<span class="muted-link">Private / Company Project</span>`;

  const liveLink = project.live
    ? `<a href="${project.live}" target="_blank" rel="noopener">Live Demo</a>`
    : '';

  return `
    <article class="project-card" data-category="${project.category}">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <ul class="project-points">
        ${project.points.map((point) => `<li>${point}</li>`).join('')}
      </ul>
      <div class="project-tags">
        ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="project-links">
        ${githubLink}
        ${liveLink}
      </div>
    </article>
  `;
}

function renderSkills() {
  $('#skillsGrid').innerHTML = portfolioData.skills
    .map(createSkillCard)
    .join('');
}

function renderExperience() {
  $('#experienceTimeline').innerHTML = portfolioData.experience
    .map(createTimelineItem)
    .join('');
}

function getCategories() {
  return [
    'All',
    ...new Set(portfolioData.projects.map((project) => project.category)),
  ];
}

function renderFilters() {
  $('#projectFilters').innerHTML = getCategories()
    .map(
      (category, index) => `
      <button class="filter-btn ${index === 0 ? 'active' : ''}" data-filter="${category}">${category}</button>
    `,
    )
    .join('');

  $$('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      $$('.filter-btn').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      renderProjects(button.dataset.filter);
    });
  });
}

function renderProjects(filter = 'All') {
  const projects =
    filter === 'All'
      ? portfolioData.projects
      : portfolioData.projects.filter((project) => project.category === filter);

  $('#projectsGrid').innerHTML = projects.map(createProjectCard).join('');
}

function initRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  $$('.reveal').forEach((element) => observer.observe(element));
}

renderSkills();
renderExperience();
renderFilters();
renderProjects();
initRevealAnimations();

const backToTopLink = document.querySelector('.footer a[href="#top"]');
if (backToTopLink) {
  backToTopLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Typing animation utilities
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function typeText(el, text, speed = 60) {
  if (!el) return;
  el.textContent = '';
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await sleep(speed + Math.random() * 40);
  }
}

async function deleteText(el, speed = 40) {
  if (!el) return;
  while (el.textContent.length) {
    el.textContent = el.textContent.slice(0, -1);
    await sleep(speed + Math.random() * 30);
  }
}

async function startTypingSequence() {
  const eyebrow = document.getElementById('typed-eyebrow');
  const main = document.getElementById('typed-main');

  try {
    // initial eyebrow line
    await typeText(eyebrow, 'Python Backend Developer', 80);
    await sleep(900);
    await deleteText(eyebrow, 40);

    // cycle main short phrases
    const phrases = [
      'Building reliable APIs',
      'Backend systems at scale',
      'AI-powered products',
    ];

    while (true) {
      for (const p of phrases) {
        await typeText(main, p, 70);
        await sleep(1200);
        await deleteText(main, 50);
        await sleep(220);
      }
    }
  } catch (err) {
    // fail silently
    console.error('Typing sequence error', err);
  }
}

// Start typing after small delay so layout settles
setTimeout(startTypingSequence, 700);
