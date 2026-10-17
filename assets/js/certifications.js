/**
 * Hamza Bin Maqsood - Certifications, CPD & Internships
 * Self-contained add-on for the static portfolio.
 * To add more entries, append a record to CREDENTIALS and add its files under assets/.
 * Display only details actually present in documents.
 */
(() => {
  'use strict';
  const CREDENTIALS = [
    {
      title: 'Generative and Agentic AI Application Developer',
      issuer: 'Pak Angels',
      type: 'AI Certification',
      category: 'training',
      program: 'Generative & Agentic AI Training · Cohort 11 (Aug–Oct 2026)',
      dateText: 'Issued Oct 17, 2026',
      sortDate: '2026-10-17',
      credentialId: 'PAGAI-TP-1583',
      award: 'Top Performer',
      featured: true,
      image: 'assets/images/certificates/pak-angels-generative-agentic-ai.webp',
      file: 'assets/docs/certificates/PAGAI-TP-1583.pdf',
      fileType: 'PDF',
      verificationUrl: 'https://aspirepk.org/hub/certificate/02470fff-1a3a-4489-9450-289bde3b4584/'
    },
    {
      title: 'Procurement & Contract Management for Engineering Professionals',
      issuer: 'Pakistan Engineering Council (PEC)',
      type: 'CPD Webinar',
      category: 'training',
      program: 'One-day Continuing Professional Development webinar · 1 CPD point',
      dateText: 'Attended Sep 26, 2026',
      sortDate: '2026-09-26',
      credentialId: '8248489',
      idLabel: 'Serial No.',
      image: 'assets/images/certificates/pec-procurement-contracts.webp',
      file: 'assets/docs/certificates/pec-procurement-contracts.png',
      fileType: 'Image'
    },
    {
      title: 'Engineering Applications of Artificial Intelligence',
      issuer: 'Pakistan Engineering Council (PEC)',
      type: 'CPD Webinar',
      category: 'training',
      program: 'One-day Continuing Professional Development webinar · 1 CPD point',
      dateText: 'Attended Aug 22, 2026',
      sortDate: '2026-08-22',
      credentialId: '8236580',
      idLabel: 'Serial No.',
      image: 'assets/images/certificates/pec-engineering-ai.webp',
      file: 'assets/docs/certificates/pec-engineering-ai.png',
      fileType: 'Image'
    },
    {
      title: 'ISPR Summer Internship Programme 2025',
      issuer: 'Inter Services Public Relations (ISPR)',
      type: 'Internship',
      category: 'internship',
      program: 'Summer Internship Programme 2025 · Rawalpindi',
      dateText: 'Jul 14 – Aug 22, 2025',
      sortDate: '2025-08-22',
      credentialId: '1027',
      idLabel: 'Certificate No.',
      image: 'assets/images/certificates/ispr-summer-internship-2025.webp',
      file: 'assets/docs/certificates/ispr-summer-internship-2025.jpg',
      fileType: 'Image'
    },
    {
      title: 'Web Development Internship',
      issuer: 'AJK Information Technology Board',
      type: 'Internship Completion Letter',
      category: 'internship',
      program: 'Two-month internship in Web Development · Summer 2025',
      dateText: 'Letter dated Aug 12, 2025',
      sortDate: '2025-08-12',
      image: 'assets/images/certificates/ajk-it-board-web-development-internship.webp',
      file: 'assets/docs/certificates/ajk-it-board-web-development-internship.jpeg',
      fileType: 'Image'
    }
  ];
  const sorted = [...CREDENTIALS].sort((a, b) => (b.sortDate || '').localeCompare(a.sortDate || ''));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const safeUrl = u => typeof u === 'string' && /^(https:\/\/|assets\/)/i.test(u) ? u : '#';
  const attr = u => esc(safeUrl(u));

  function cardHTML(c, index) {
    const featured = c.featured ? ' hbm-cert--featured' : '';
    const award = c.award ? `<span class="hbm-cert__award">🏆 ${esc(c.award)}</span>` : '';
    const id = c.credentialId ? `<p class="hbm-cert__id">${esc(c.idLabel || 'Credential ID:')} <code>${esc(c.credentialId)}</code></p>` : '';
    const program = c.program ? `<p class="hbm-cert__program">${esc(c.program)}</p>` : '';
    const verify = c.verificationUrl ? `<a class="hbm-cert__button hbm-cert__button--outline" href="${attr(c.verificationUrl)}" target="_blank" rel="noopener noreferrer">Verify credential ↗</a>` : '';
    return `<article class="hbm-cert${featured}" data-hbm-category="${esc(c.category)}" aria-labelledby="hbm-cert-title-${index}">
      <button type="button" class="hbm-cert__image-button" data-hbm-preview="${index}" aria-label="Preview ${esc(c.title)}">
        <img class="hbm-cert__image" src="${attr(c.image)}" loading="lazy" decoding="async" alt="Document for ${esc(c.title)}" />
        <span class="hbm-cert__zoom">↗ Preview document</span>
      </button>
      <div class="hbm-cert__details">
        <div class="hbm-cert__topline"><span class="hbm-cert__issuer">${esc(c.issuer)}</span>${award}</div>
        <span class="hbm-cert__type">${esc(c.type)}</span>
        <h3 id="hbm-cert-title-${index}" class="hbm-cert__title">${esc(c.title)}</h3>
        ${program}
        <p class="hbm-cert__date">${esc(c.dateText || '')}</p>${id}
        <div class="hbm-cert__actions">
          <a class="hbm-cert__button hbm-cert__button--primary" href="${attr(c.file)}" target="_blank" rel="noopener noreferrer">View ${esc(c.fileType === 'PDF' ? 'PDF' : 'document')} ↗</a>
          ${verify}
        </div>
      </div>
    </article>`;
  }

  function addNavLinks() {
    const links = document.querySelectorAll('header nav a[href="#projects"], nav a[href="#projects"], .navbar a[href="#projects"]');
    links.forEach(projectLink => {
      const nav = projectLink.closest('nav') || projectLink.parentElement;
      if (!nav || nav.querySelector('a[href="#certifications"]')) return;
      const parent = projectLink.parentElement;
      if (parent?.tagName?.toLowerCase() === 'li') {
        const newLi = parent.cloneNode(false);
        const link = projectLink.cloneNode(false);
        link.href = '#certifications'; link.textContent = 'Certifications';
        newLi.appendChild(link); parent.insertAdjacentElement('afterend', newLi);
      } else {
        const link = projectLink.cloneNode(false);
        link.href = '#certifications'; link.textContent = 'Certifications';
        projectLink.insertAdjacentElement('afterend', link);
      }
    });
  }

  function openPreview(c) {
    const dialog = document.querySelector('#hbm-cert-dialog');
    if (!dialog || typeof dialog.showModal !== 'function') {
      window.open(safeUrl(c.file), '_blank', 'noopener,noreferrer');
      return;
    }
    const img = dialog.querySelector('.hbm-cert-dialog__image');
    img.src = safeUrl(c.image); img.alt = `Preview of ${c.title}`;
    dialog.querySelector('.hbm-cert-dialog__name').textContent = c.title;
    const fileLink = dialog.querySelector('.hbm-cert-dialog__file');
    fileLink.href = safeUrl(c.file);
    fileLink.textContent = c.fileType === 'PDF' ? 'Open full PDF ↗' : 'Open original image ↗';
    const verify = dialog.querySelector('.hbm-cert-dialog__verify');
    verify.hidden = !c.verificationUrl;
    if (c.verificationUrl) verify.href = safeUrl(c.verificationUrl);
    dialog.showModal();
  }

  function init() {
    if (document.getElementById('certifications') || sorted.length === 0) return;
    const section = document.createElement('section');
    section.id = 'certifications';
    section.className = 'hbm-certs';
    section.setAttribute('aria-labelledby', 'hbm-certs-heading');
    section.innerHTML = `<div class="hbm-certs__wrap">
      <div class="hbm-certs__heading-row">
        <div>
          <p class="hbm-certs__eyebrow">✦ Learning · Experience · Recognition</p>
          <h2 id="hbm-certs-heading">Certifications <span>& Achievements</span></h2>
          <p class="hbm-certs__intro">A collection of formal training, professional development and documented internship experiences — with a focus on AI and technology.</p>
        </div>
        <div class="hbm-certs__count" aria-label="${sorted.length} credentials"><strong>${String(sorted.length).padStart(2,'0')}</strong><span>Credentials</span></div>
      </div>
      <div class="hbm-certs__filters" role="group" aria-label="Filter achievements">
        <button class="hbm-certs__filter" type="button" data-hbm-filter="all" aria-pressed="true">All <span>${sorted.length}</span></button>
        <button class="hbm-certs__filter" type="button" data-hbm-filter="training" aria-pressed="false">Certificates & CPD <span>${sorted.filter(c=>c.category==='training').length}</span></button>
        <button class="hbm-certs__filter" type="button" data-hbm-filter="internship" aria-pressed="false">Internships <span>${sorted.filter(c=>c.category==='internship').length}</span></button>
      </div>
      <div class="hbm-certs__grid">${sorted.map(cardHTML).join('')}</div>
    </div>`;
    const target = document.getElementById('contact') || document.querySelector('footer');
    if (target) target.insertAdjacentElement('beforebegin', section);
    else {
      const projects = document.getElementById('projects');
      if (projects) projects.insertAdjacentElement('afterend', section);
      else (document.querySelector('main') || document.body).appendChild(section);
    }
    const dialog = document.createElement('dialog');
    dialog.id = 'hbm-cert-dialog';
    dialog.className = 'hbm-cert-dialog';
    dialog.setAttribute('aria-label', 'Credential preview');
    dialog.innerHTML = `<div class="hbm-cert-dialog__heading"><strong class="hbm-cert-dialog__name"></strong><button type="button" class="hbm-cert-dialog__close" aria-label="Close preview">✕</button></div>
      <img class="hbm-cert-dialog__image" src="" alt="" />
      <div class="hbm-cert-dialog__actions"><a class="hbm-cert__button hbm-cert__button--primary hbm-cert-dialog__file" target="_blank" rel="noopener noreferrer">Open document ↗</a><a class="hbm-cert__button hbm-cert__button--outline hbm-cert-dialog__verify" target="_blank" rel="noopener noreferrer">Verify credential ↗</a></div>`;
    document.body.appendChild(dialog);
    dialog.querySelector('.hbm-cert-dialog__close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    section.querySelectorAll('[data-hbm-preview]').forEach(button => {
      button.addEventListener('click', () => openPreview(sorted[Number(button.dataset.hbmPreview)]));
    });
    section.querySelectorAll('[data-hbm-filter]').forEach(button => {
      button.addEventListener('click', () => {
        const chosen = button.dataset.hbmFilter;
        section.querySelectorAll('[data-hbm-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        section.querySelectorAll('[data-hbm-category]').forEach(card => {card.hidden = chosen !== 'all' && chosen !== card.dataset.hbmCategory;});
      });
    });
    addNavLinks();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
