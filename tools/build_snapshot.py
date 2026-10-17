#!/usr/bin/env python3
"""Build initial HTML snapshots so search crawlers/non-JS visitors see portfolio content.
GitHub Actions runs this automatically before each GitHub Pages deployment.
"""
from pathlib import Path
from html import escape
import json,re
root=Path(__file__).resolve().parent.parent
file=root/'index.html'
html=file.read_text()
load=lambda name: json.loads((root/'content'/f'{name}.json').read_text())
visible=lambda items: sorted((x for x in items if x.get('visible',True)),key=lambda x:int(x.get('order') or 999))
e=lambda value: escape(str(value if value is not None else ''),quote=True)
skills=visible(load('skills'));exp=visible(load('experience'));projects=visible(load('projects'));certs=visible(load('certificates'));site=load('site')

def tags(items,cls='tag'):
    return ''.join(f'<span class="{cls}">{e(t)}</span>' for t in items or [])

def skill(x,i):
    return f'<article class="skill-card"><span class="skill-num">AREA {i+1:02d}</span><h3>{e(x.get("title"))}</h3><ul class="skill-list">'+''.join(f'<li>{e(t)}</li>' for t in x.get('items',[]))+'</ul></article>'

def experience(x):
    return f'<article class="timeline-item"><div class="timeline-date">{e(x.get("date"))}</div><div><div class="timeline-role"><h3>{e(x.get("role"))}</h3><span class="timeline-company">{e(x.get("company"))}</span></div><ul class="timeline-points">'+''.join(f'<li>{e(p)}</li>' for p in x.get('points',[]))+'</ul><div class="timeline-tags">'+tags(x.get('tags',[]))+'</div></div></article>'

def proj(x,i):
    github=x.get('github','');live=x.get('live','')
    links=''
    if str(github).startswith('https://'):
        links+=f'<a href="{e(github)}" target="_blank" rel="noopener noreferrer">Source code ↗</a>'
    if str(live).startswith('https://'):
        links+=f'<a href="{e(live)}" target="_blank" rel="noopener noreferrer">Live website ↗</a>'
    if not links:links='<span class="muted-link">Project details available on request</span>'
    return f'<article class="project-card"><div class="project-card-top"><span class="project-card-index">PROJECT / {i+1:02d}</span><span class="project-cat">{e(x.get("category"))}</span></div><h3>{e(x.get("title"))}</h3><p>{e(x.get("description"))}</p><ul class="project-points">'+''.join(f'<li>{e(p)}</li>' for p in x.get('points',[])[:3])+'</ul><div class="project-tags">'+tags(x.get('tags',[]),'') .replace('class=""','')+'</div><div class="project-links">'+links+'</div></article>'

def cert(x,i):
    preview=x.get('image','');doc=x.get('file','');verify=x.get('verificationUrl','')
    # The same card structure as client JS. Only relative assets or HTTPS URLs.
    safe=lambda v: bool(re.match(r'^(?:assets/(?:images|docs)/[a-z0-9/._-]+|https://\S+)$',str(v or ''),re.I))
    image=e(preview) if safe(preview) else ''
    link=e(doc) if safe(doc) else ''
    verification=e(verify) if safe(verify) else ''
    return f'<article class="cert-card{" cert-featured" if x.get("featured") else ""}"><button type="button" class="cert-image-btn" data-cert-id="{i}" aria-label="Preview {e(x.get("title"))}"><img src="{image}" alt="{e(x.get("title"))} certificate image" loading="lazy" decoding="async" width="530" height="375"><span>Click to preview ↗</span></button><div class="cert-body"><div class="cert-topline"><span class="cert-type">{e(x.get("type"))}</span>'+ (f'<span class="cert-award">★ {e(x["award"])}</span>' if x.get('award') else '')+'</div><span class="cert-issuer">'+e(x.get('issuer'))+'</span><h3>'+e(x.get('title'))+'</h3>'+ (f'<p class="cert-program">{e(x["program"])}</p>' if x.get('program') else '')+f'<p class="cert-date">{e(x.get("dateText"))}</p>'+ (f'<p class="cert-id">{e(x.get("idLabel") or "Credential ID:")} {e(x["credentialId"])}</p>' if x.get('credentialId') else '')+'<div class="cert-actions">'+ (f'<a href="{link}" target="_blank" rel="noopener noreferrer">View document ↗</a>' if link else '')+ (f'<a href="{verification}" target="_blank" rel="noopener noreferrer">Verify ↗</a>' if verification else '') + '</div></div></article>'

def snapshot(key,items):
    global html
    pattern=fr'(<!-- STATIC_{key}_START -->).*?(<!-- STATIC_{key}_END -->)'
    replacement=lambda m:m.group(1)+'\n'+''.join(items)+'\n'+m.group(2)
    html,count=re.subn(pattern,replacement,html,flags=re.S)
    if count!=1:raise ValueError('Missing snapshot markers: '+key)

snapshot('SKILLS',(skill(x,i) for i,x in enumerate(skills)))
snapshot('EXPERIENCE',(experience(x) for x in exp))
snapshot('PROJECTS',(proj(x,i) for i,x in enumerate(projects)))
snapshot('CERTIFICATES',(cert(x,i) for i,x in enumerate(certs)))

# Keep static copy visible to crawlers and to visitors before JS hydration.
for key,selector in [('heroIntro','heroIntro'),('heroOpening','heroOpening'),('heroAccent','heroAccent'),('heroClosing','heroClosing'),('heroDescription','heroDescription'),('aboutParagraph1','aboutP1'),('aboutParagraph2','aboutP2'),('location','aboutLocation'),('contactDescription','contactDescription')]:
    if not isinstance(site.get(key),str):continue
    pattern=fr'(<(?P<tag>span|p|strong)\b[^>]*\bid="{re.escape(selector)}"[^>]*>).*?(</(?P=tag)>)'
    html,n=re.subn(pattern,lambda m:m.group(1)+e(site[key])+m.group(3),html,flags=re.S)
    if n!=1:raise ValueError('Missing profile slot: '+key)
for k,v in [('statProjects',len(projects)),('statExperience',len(exp)),('statCredentials',len(certs))]:
    html=re.sub(fr'(<strong\b[^>]*\bid="{k}"[^>]*>).*?(</strong>)',lambda m:m.group(1)+f'{v:02d}'+m.group(2),html)
seo_title=site.get('seoTitle','Hamza Bin Maqsood | Python Backend Developer & Software Engineer')
seo_desc=site.get('seoDescription','Hamza Bin Maqsood is a Python backend developer and software engineer building reliable APIs, Django and FastAPI applications, PostgreSQL systems, and AI integrations. Explore projects, experience, and certifications.')
html=re.sub(r'(<title>).*?(</title>)',lambda m:m.group(1)+e(seo_title)+m.group(2),html)
for nm,value in [('description',seo_desc)]:
    html=re.sub(r'(<meta name="'+nm+r'" content=").*?("\s*>)',lambda m:m.group(1)+e(value)+m.group(2),html)
for prop,value in [('og:title',seo_title),('og:description',seo_desc)]:
    html=re.sub(r'(<meta property="'+prop+r'" content=").*?("\s*>)',lambda m:m.group(1)+e(value)+m.group(2),html)
for prop,value in [('twitter:title',seo_title),('twitter:description',seo_desc)]:
    html=re.sub(r'(<meta name="'+prop+r'" content=").*?("\s*>)',lambda m:m.group(1)+e(value)+m.group(2),html)
file.write_text(html)
print(f'Generated HTML snapshot: {len(skills)} skills, {len(exp)} roles, {len(projects)} projects, {len(certs)} credentials')
