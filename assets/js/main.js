/* Lightweight portfolio renderer. Content lives in /content/*.json for Pages CMS. */
(() => {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL = (value) => {
    if (typeof value !== 'string') return '';
    const v = value.trim();
    // Only public https links for projects.
    return /^https:\/\/[^\s]+$/i.test(v) ? v : '';
  };
  const visibleItems = (items) => (Array.isArray(items) ? items : []).filter(x => x && x.visible !== false).sort((a,b) => (Number(a.order) || 999) - (Number(b.order) || 999));
  const stat = (id, count) => { const el = $(id); if (el) el.textContent = String(count).padStart(2,'0'); };

  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');
  const closeMenu = () => { navMenu.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); navToggle.setAttribute('aria-label','Open menu'); };
  navToggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded',String(open));
    navToggle.setAttribute('aria-label',open ? 'Close menu' : 'Open menu');
  });
  $$('#navMenu a').forEach(a => a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e => { if(e.key==='Escape') closeMenu(); });
  document.addEventListener('click',e => { if(navMenu.classList.contains('open') && !e.target.closest('.nav')) closeMenu(); });
  const themeToggle = $('#themeToggle');
  try { if(localStorage.getItem('hbm-theme')==='light') document.documentElement.dataset.theme='light'; } catch(e) {}
  function refreshThemeButton() { const light = document.documentElement.dataset.theme === 'light'; themeToggle?.setAttribute('aria-label',`Switch to ${light ? 'dark' : 'light'} theme`); }
  refreshThemeButton();
  themeToggle?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme=next;
    try { localStorage.setItem('hbm-theme',next); } catch(e) {}
    refreshThemeButton();
  });
  $('#year').textContent = new Date().getFullYear();
  const progress = $('#readingProgress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if(progress) progress.style.width = `${max > 0 ? (scrollY/max)*100 : 0}%`;
  };
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ $$('#navMenu a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id)); }});
    },{rootMargin:'-20% 0px -65% 0px'});
    $$('main section[id]').forEach(el=>observer.observe(el));
  }

  const load = async (path) => {
    const response = await fetch(path, { cache:'no-cache' });
    if(!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
    return response.json();
  };
  const renderSkills = (items) => {
    $('#skillsGrid').innerHTML = items.map((s,i) => `<article class="skill-card"><span class="skill-num">AREA ${String(i+1).padStart(2,'0')}</span><h3>${escapeHTML(s.title)}</h3><ul class="skill-list">${(Array.isArray(s.items)?s.items:[]).map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></article>`).join('') || '<p class="empty-state">Skills coming soon.</p>';
  };
  const renderExperience = (items) => {
    $('#experienceTimeline').innerHTML = items.map(x=>`<article class="timeline-item"><div class="timeline-date">${escapeHTML(x.date)}</div><div><div class="timeline-role"><h3>${escapeHTML(x.role)}</h3><span class="timeline-company">${escapeHTML(x.company)}</span></div><ul class="timeline-points">${(Array.isArray(x.points)?x.points:[]).map(p=>`<li>${escapeHTML(p)}</li>`).join('')}</ul><div class="timeline-tags">${(Array.isArray(x.tags)?x.tags:[]).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('')}</div></div></article>`).join('') || '<p class="empty-state">Experience coming soon.</p>';
  };
  const projectMarkup = (project,index) => {
    const github=safeURL(project.github), live=safeURL(project.live);
    return `<article class="project-card"><div class="project-card-top"><span class="project-card-index">PROJECT / ${String(index+1).padStart(2,'0')}</span><span class="project-cat">${escapeHTML(project.category || 'Project')}</span></div><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.description)}</p><ul class="project-points">${(Array.isArray(project.points)?project.points:[]).slice(0,3).map(p=>`<li>${escapeHTML(p)}</li>`).join('')}</ul><div class="project-tags">${(Array.isArray(project.tags)?project.tags:[]).map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div><div class="project-links">${github?`<a href="${escapeHTML(github)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHTML(project.title)} on GitHub">Source code ↗</a>`:''}${live?`<a href="${escapeHTML(live)}" target="_blank" rel="noopener noreferrer" aria-label="View demo for ${escapeHTML(project.title)}">Live website ↗</a>`:''}${!github&&!live?'<span class="muted-link">Project details available on request</span>':''}</div></article>`;
  };
  const renderProjects = (items) => {
    const categories = ['All',...new Set(items.map(p=>p.category).filter(Boolean))];
    let active = 'All';
    const bar = $('#projectFilters');
    const grid = $('#projectsGrid');
    const redraw = () => {
      $$('.filter-btn',bar).forEach(b => b.setAttribute('aria-pressed',String(b.dataset.category===active)));
      const filtered = active==='All' ? items : items.filter(p=>p.category===active);
      grid.innerHTML = filtered.map(projectMarkup).join('') || '<p class="empty-state">No projects in this category yet.</p>';
    };
    bar.innerHTML = categories.map(cat=>`<button type="button" class="filter-btn" data-category="${escapeHTML(cat)}" aria-pressed="${cat==='All'}">${escapeHTML(cat)}${cat==='All' ? ` <span>(${items.length})</span>` : ''}</button>`).join('');
    bar.addEventListener('click',e=>{const btn=e.target.closest('button[data-category]');if(!btn)return;active=btn.dataset.category;redraw();});
    redraw();
  };
  async function init() {
    const requests = await Promise.allSettled([
      load('content/skills.json'), load('content/experience.json'), load('content/projects.json'), load('content/site.json')
    ]);
    const grids = ['#skillsGrid','#experienceTimeline','#projectsGrid'];
    requests.forEach((result,i)=>{if(result.status==='rejected'){if(!$(grids[i]).children.length)$(grids[i]).innerHTML='<p class="empty-state">Content could not load. Please refresh or try the live website.</p>'; console.warn(result.reason);}});
    if(requests[0].status==='fulfilled') renderSkills(visibleItems(requests[0].value));
    if(requests[1].status==='fulfilled') {const items=visibleItems(requests[1].value);renderExperience(items);stat('#statExperience',items.length);}
    if(requests[2].status==='fulfilled') {const items=visibleItems(requests[2].value);renderProjects(items);stat('#statProjects',items.length);}
    if(requests[3].status==='fulfilled') {
      const site=requests[3].value;
      for(const [key,id] of Object.entries({heroIntro:'.hero-intro',heroOpening:'#heroOpening',heroAccent:'#heroAccent',heroClosing:'#heroClosing',heroDescription:'#heroDescription',aboutParagraph1:'#aboutP1',aboutParagraph2:'#aboutP2',location:'#aboutLocation',contactDescription:'#contactDescription'})) {
        if(typeof site[key]==='string' && $(id)) $(id).textContent=site[key];
      }
      if(typeof site.email==='string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email)) {
        $('#contactEmailLink').href=`mailto:${site.email}`;
      }

      // WhatsApp contact buttons. The number is editable in Pages CMS.
      // The fallback is this portfolio owner's number until they save the CMS field.
      const whatsappNumber=String(site.whatsapp || '+923473144690').replace(/\D/g,'');
      if(/^\d{10,15}$/.test(whatsappNumber)) {
        const message=encodeURIComponent('Hello Hamza, I visited your portfolio and would like to connect.');
        const whatsappURL=`https://wa.me/${whatsappNumber}?text=${message}`;
        for(const link of [$('.nav-contact'),$('#contactEmailAction')]) {
          if(!link) continue;
          link.href=whatsappURL;
          link.target='_blank';
          link.rel='noopener noreferrer';
        }
        const action=$('#contactEmailAction');
        if(action) action.innerHTML='Chat on WhatsApp <span aria-hidden="true">↗</span>';
        const links=$('.contact-links');
        if(links && !$('#contactWhatsAppLink')) {
          const whatsappLink=document.createElement('a');
          whatsappLink.id='contactWhatsAppLink';
          whatsappLink.textContent='WhatsApp ↗';
          whatsappLink.href=whatsappURL;
          whatsappLink.target='_blank';
          whatsappLink.rel='noopener noreferrer';
          links.prepend(whatsappLink);
        }
      }
    }
  }
  init();
})();
