/* Credentials managed in content/certificates.json; secure HTML escaping and native modal. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safePath = v => typeof v === 'string' && (/^assets\/(?:images|docs)\/[a-z0-9/._-]+$/i.test(v) || /^https:\/\/[^\s]+$/i.test(v)) ? v : '';
  const dialog=$('#certificateDialog');
  const modalImg=$('#dialogImage');
  const filterBox=$('#certFilters');
  const grid=$('#certGrid');
  let credentials = [];
  function showCredential(c) {
    const image=safePath(c.image),file=safePath(c.file);
    if(!dialog || !dialog.showModal){ if(file) window.open(file,'_blank','noopener,noreferrer');return; }
    $('#dialogTitle').textContent=c.title || 'Credential preview';
    modalImg.src=image;modalImg.alt=`Preview of ${c.title}`;
    const fileLink=$('#dialogFile');fileLink.href=file || image; fileLink.textContent = c.fileType === 'PDF' ? 'Open full PDF ↗' : 'Open original document ↗';
    const verify=$('#dialogVerify');verify.hidden=!safePath(c.verificationUrl);if(!verify.hidden) verify.href=safePath(c.verificationUrl);
    dialog.showModal();
  }
  $('#closeDialog')?.addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog) dialog.close();});
  dialog?.addEventListener('close',()=>{modalImg.removeAttribute('src');});
  function card(c,i){
    const image=esc(safePath(c.image)), file=esc(safePath(c.file)), verify=esc(safePath(c.verificationUrl));
    return `<article class="cert-card${c.featured?' cert-featured':''}"><button type="button" class="cert-image-btn" data-cert-id="${i}" aria-label="Preview ${esc(c.title)}"><img src="${image}" alt="${esc(c.title)} certificate image" loading="lazy" decoding="async" width="530" height="375"><span>Click to preview ↗</span></button><div class="cert-body"><div class="cert-topline"><span class="cert-type">${esc(c.type)}</span>${c.award?`<span class="cert-award">★ ${esc(c.award)}</span>`:''}</div><span class="cert-issuer">${esc(c.issuer)}</span><h3>${esc(c.title)}</h3>${c.program?`<p class="cert-program">${esc(c.program)}</p>`:''}<p class="cert-date">${esc(c.dateText)}</p>${c.credentialId?`<p class="cert-id">${esc(c.idLabel || 'Credential ID:')} ${esc(c.credentialId)}</p>`:''}<div class="cert-actions">${file?`<a href="${file}" target="_blank" rel="noopener noreferrer">View document ↗</a>`:''}${verify?`<a href="${verify}" target="_blank" rel="noopener noreferrer">Verify ↗</a>`:''}</div></div></article>`;
  }
  function render(){
    const categories=[['All','all'],['Certificates & CPD','training'],['Internships','internship']];
    let selected='all';
    filterBox.innerHTML=categories.map(([label,value])=>`<button type="button" class="filter-btn" data-filter="${value}" aria-pressed="${value==='all'}">${label}</button>`).join('');
    function update(){
      filterBox.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===selected)));
      grid.innerHTML=credentials.map((c,i)=>({c,i})).filter(x=>selected==='all'||x.c.category===selected).map(x=>card(x.c,x.i)).join('')||'<p class="empty-state">No credentials in this category.</p>';
    }
    filterBox.addEventListener('click',e=>{const b=e.target.closest('button[data-filter]');if(b){selected=b.dataset.filter;update();}});
    grid.addEventListener('click',e=>{const b=e.target.closest('button[data-cert-id]');if(b)showCredential(credentials[Number(b.dataset.certId)]);});
    update();
  }
  fetch('content/certificates.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Failed to load certificates');return r.json();}).then(data=>{
    credentials=(Array.isArray(data)?data:[]).filter(x=>x&&x.visible!==false).sort((a,b)=>(Number(a.order)||999)-(Number(b.order)||999));
    $('#statCredentials').textContent=String(credentials.length).padStart(2,'0');
    const featured=credentials.find(c=>c.featured);
    const spotlight=$('#credentialSpotlight');
    if(spotlight) {
      spotlight.hidden=!featured;
      if(featured) {
        $('#spotlightTitle').textContent=(featured.award ? featured.award+' · ' : '')+featured.title;
        $('#spotlightSubtitle').textContent=[featured.issuer,featured.dateText].filter(Boolean).join(' · ');
        const verify=$('#spotlightVerify');verify.hidden=!safePath(featured.verificationUrl);
        if(!verify.hidden) verify.href=safePath(featured.verificationUrl);
      }
    }
    render();
  }).catch(err=>{console.warn(err);if(!grid.children.length)grid.innerHTML='<p class="empty-state">Certificates could not load. Please try again or visit the live portfolio.</p>';});
})();
