# Hamza Bin Maqsood — Professional Portfolio

A fully redesigned, responsive, SEO-ready portfolio for **Hamza Bin Maqsood**, built with plain HTML, CSS, and JavaScript. It stays on **GitHub Pages** (no database or paid backend needed). Its content can be edited with **Pages CMS** after GitHub authentication.

## What is included

- Modern layout with mobile menu, light/dark switch, accessible buttons, and redesigned project, skills, experience, and credentials sections.
- All original portfolio data: 6 projects, 6 skills groups, 4 experience records, and 5 credentials, including the Pak Angels Top Performer award.
- Faster WebP portrait, optimized certificate thumbnail images, and a dedicated 1200 × 630 social preview.
- SEO: descriptive titles, canonical URL, sitemap, robots.txt, social media metadata, Person structured data, and static content snapshots built at deployment time.
- `content/*.json` as a central source of truth; `.pages.yml` provides an admin interface through Pages CMS.
- A GitHub Actions workflow that generates crawlable snapshots whenever content is changed through the CMS.

## Deploy your replacement site (GitHub Pages)

**Back up your existing repository before replacing files.** This package is a full website, not just a section.

1. Extract the package. Upload **all files and folders**, including hidden `.pages.yml` and `.github`, to the root of `Hamza-Bin-Maqsood-Portfolio` on GitHub. Keep `index.html` at the root. GitHub's web upload may not include hidden files from a folder drag: check that `.pages.yml` and `.github/workflows/deploy.yml` are uploaded.
2. Commit to the `main` branch. (If working locally, `git add -A && git commit -m "Redesign portfolio with SEO and CMS" && git push`.)
3. Open **Repository → Settings → Pages → Build and deployment → Source**, and choose **GitHub Actions**. This allows the included snapshot builder to run whenever you edit content in Pages CMS.
4. Go to **Repository → Actions**, and check the **Deploy professional portfolio** workflow. On first setup, you may need to enable Actions for the repository. Wait for it to complete.
5. View the existing portfolio URL: <https://hamzabinmaqsood.github.io/Hamza-Bin-Maqsood-Portfolio/>. Refresh with Ctrl+Shift+R if you see cached content.

**Important**: Do not upload just the ZIP file into the repo; upload its *contents*.

## Manage your portfolio from a browser (no code)

1. Open <https://app.pagescms.org>.
2. Sign in with **GitHub** and authorize access to your portfolio repository.
3. Choose `Hamza-Bin-Maqsood-Portfolio`, on the `main` branch.
4. Edit **Profile & About**, **Skills**, **Work Experience**, **Portfolio Projects**, or **Certifications & Internships**.
5. Add, edit, or remove list entries, set **Show on portfolio** or **Display order**, then save. Each save commits a change to GitHub. The Pages workflow builds a new HTML snapshot and publishes the site. There is no password stored in your public JavaScript.

For certificate uploads, use **Preview image** for the WebP/JPG/PNG thumbnail and **Original PDF or image** for the document. Use relative file paths like `assets/images/certificates/example.webp` if editing raw JSON. Never use a root-relative `/assets/...` URL on GitHub Pages project sites because it drops the `/Hamza-Bin-Maqsood-Portfolio/` prefix.

### Local preview

Open a terminal inside the extracted website folder and run:

```bash
python -m http.server 8000
```

Visit <http://localhost:8000>. Do not double-click `index.html` as a `file://` URL: the browser will block loading its JSON data files. No Node.js build process is required.

### Folder map

- `index.html`: HTML structure, main SEO meta tags, main hero/about fallback.
- `assets/css`: design and mobile styles.
- `assets/js`: JavaScript for interactive content and certificates.
- `content/site.json`: profile/about text, email and SEO title/description.
- `content/skills.json`, `experience.json`, `projects.json`, `certificates.json`: editable lists.
- `.pages.yml`: Pages CMS editor configuration.
- `.github/workflows/deploy.yml`: GitHub Pages deployment and SEO snapshot generation.
- `tools/build_snapshot.py`: writes visible content into initial HTML for crawlers and visitors before JavaScript starts.
- `assets/docs/certificates`: original proof documents. These are publicly accessible: review private information carefully.

## SEO steps after going live

1. Add/verify the site in **Google Search Console**, using the URL-prefix property if DNS ownership of `github.io` is not available.
2. Submit `https://hamzabinmaqsood.github.io/Hamza-Bin-Maqsood-Portfolio/sitemap.xml`.
3. Use Google's URL Inspection to request indexing when the portfolio is live and verify the canonical URL.
4. Test metadata previews when sharing the URL and correct outdated wording with Pages CMS (`SEO title` and `SEO description` fields).
5. Improve project-specific content: real screenshots, **actual** repository/demo links, measurable outcomes, and eventually individual case study URLs will provide stronger evidence and SEO than generic keyword stuffing.

## Factual checks to make before launch

Please review the existing content in `content/experience.json` and `content/projects.json` before publishing. It was migrated from the ZIP you provided without inventing employers, accomplishments, project metrics, or links. Confirm **current job date**, education details, and project descriptions are accurate.

Generic GitHub profile URLs were removed from individual project cards, since a profile link is not proof of a particular project; you can now add real repository links through Pages CMS. Your GitHub profile remains linked in the hero and footer.

## Limitations

- GitHub Pages is static hosting. This CMS works because Pages CMS signs in with your GitHub account and **writes content to GitHub**, not because your site runs a backend.
- GitHub Pages updates after each Actions deployment, not instantly on each keystroke.
- SEO implementation improves crawlability and sharing but does not guarantee Google ranking or rich results.
- The deployment uses Google Fonts with system fallbacks; browser caching minimizes repeat downloads.
