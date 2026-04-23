# Portfolio Site Handoff

This document contains everything you need to build Patrick Suijk's portfolio site. Read it in full before starting.

## What you're building

A personal portfolio site for Patrick Suijk, an AI engineer and tech lead. The site showcases his projects and is intended to help him land AI infrastructure or AI engineering roles.

The content is already written and lives in the `content/` directory. Your job is to build the site that presents it well.

## Tech stack (locked)

- **Framework:** Astro (static site generator)
- **Styling:** Tailwind CSS
- **Content:** Markdown files with frontmatter, consumed via Astro Content Collections
- **Deploy:** GitHub Pages via GitHub Actions
- **Repo:** `psuijk.github.io` (user site, publishes to `https://psuijk.github.io`)
- **No custom domain for now** (may be added later; don't design around one)

## Architecture requirements

1. Content lives in `src/content/` as markdown files. The user adds projects by creating new markdown files. No code changes required to add a project.
2. Each project markdown file has frontmatter with at minimum: `title`, `slug`, `status`, `stack`, `tier` (one of: `featured`, `client`, `other`), `order` (number, lower = earlier).
3. The site has two page types:
   - **Index page** (`/`): hero, about, compact project cards, contact.
   - **Project detail pages** (`/projects/[slug]`): full case study for each project.
4. Project cards on the index page show: title, one-line description, status badge, stack tags, and link to the detail page. They are compact (not expanded inline).
5. RTS Labs client work is a grouped section, not individual detail pages. It lives on the index page inline (read the content file for details).
6. Kite is a featured project with its own detail page, but labeled as "also building" to soften positioning.

## Design direction

The aesthetic is "thoughtful editorial," not "flashy dev portfolio." Think well-designed personal blog or minimalist product page. Content carries the weight; design gets out of its way.

**Color:**
- Dark mode only (no toggle).
- Background: near-black, not pure black. Use `#0a0a0a` or similar. Pure `#000` is harsh.
- Text: soft off-white, around `#e8e8e8` or `#ededed`. Pure white is too high-contrast.
- Muted text (metadata, stack tags, timestamps): mid-gray around `#888` or `#999`.
- Accent color: warm and subtle. A soft amber like `#d4a574` or a warm off-white. Use sparingly for links (on hover), status badges, and section markers. **Do not use cyan, neon green, or any saturated bright color.** The accent should feel editorial, not electric.
- Monochrome overall. One accent, used sparingly.

**Typography:**
- Sans (headings and body): **Geist**.
- Mono (code, stack tags, inline technical labels): **Geist Mono**.
- Import both from Google Fonts or from Vercel's CDN. Both are free and open source.
- Body size: 16-18px at base, comfortable line-height around 1.6-1.7 for readability.
- Heading hierarchy should feel intentional. Hero tagline is the largest text on the site by a wide margin.

**Layout:**
- Max content width around 700-800px for prose-heavy sections. Do not span full viewport width for text. Readability first.
- Generous whitespace. Sections should feel like they have room to breathe.
- Mobile-first and fully responsive. Test on narrow viewports.

**Hero:**
- The hero takes up the full first screen.
- Name at top in moderate size.
- Tagline ("AI engineer. Tech lead. Building toward AI infrastructure.") is the hero's visual centerpiece. Very large. Each of the three phrases should be visually distinct, either on separate lines or with intentional separators. Do not jam all three into one flowing sentence.
- Supporting sentence ("I build production AI systems and the tools to make them.") below tagline, smaller, in muted color.
- Links (email, GitHub, LinkedIn, Resume) at the bottom of the hero as small text links or subtle icons.
- No photo. Do not add a placeholder gray square. The hero should read complete without one.

**Project cards (index page):**
- Each card is compact: title, one-line description, status badge (e.g., "In development", "Live", "In production, internal"), stack tags in monospace, click to view detail page.
- Status badges use the accent color.
- Cards are stacked vertically, not in a grid. Reason: the full-width stack reads more editorial; grid reads more like a template.
- Featured projects come first (Golem, Neuromod, Chonker, Cardlang, ManaFest), then the RTS Labs grouped section inline, then Kite at the bottom under an "Also building" header.

**Project detail pages:**
- Same max content width as the index.
- Project title at top, status badge, stack, link back to home.
- Then the full markdown content rendered.
- Screenshots (for Chonker) render inline at the points specified in the markdown.
- At the bottom, a "back to projects" link.

**Transitions and interactions:**
- Keep it minimal. A subtle fade-in on page load is fine. Do not add scroll-triggered animations, parallax, cursor effects, or anything that would feel like a 2019 agency site.
- Links should have a clear hover state using the accent color.
- No scroll hijacking. Native browser scroll behavior only.

**What NOT to do (explicit list):**
- No terminal window with "console.log('hello')" in the hero.
- No gradient text.
- No animated typing effects.
- No particle backgrounds.
- No floating 3D shapes.
- No "scroll down" animated chevron.
- No cyan, no neon, no "hackery" aesthetic.

## Content structure

The `content/` directory you've been given contains:

- `hero.md` — hero content (name, tagline, supporting line, links)
- `about.md` — about section content
- `contact.md` — contact section content
- `rts-labs.md` — grouped client work section content
- `projects/golem.md`
- `projects/neuromod.md`
- `projects/chonker.md` (references three screenshots; see below)
- `projects/cardlang.md`
- `projects/manafest.md`
- `projects/kite.md`

When setting up the Astro project, move these files into the appropriate `src/content/` locations based on Astro Content Collections conventions.

## Screenshot placement (Chonker only)

The user will provide three screenshot files. Place them in `public/images/chonker/` with these filenames:

1. `chonker-new-usecase.png` — Shows the "create new use case" screen with AI generate vs manual setup choice. Placement in the Chonker case study: inline with the bullet point about AI-assisted config generation (in the Playground workflow list).

2. `chonker-usecase-edit.png` — Shows the use case edit view with the description editor and the provider/model dropdowns for prompt generation and extraction. Placement: at the top of the "What's interesting technically" section, so it lands adjacent to the two-model architecture description.

3. `chonker-schema-editor.png` — Shows schema editing with the nested fields wizard. Placement: inline with the bullet point about editing configs in a proper UI (in the Playground workflow list).

The Chonker markdown file includes comment markers (`<!-- screenshot: filename -->`) at the exact insertion points. Render these as proper `<img>` elements with appropriate alt text.

Screenshots should be displayed at a reasonable size (not full-width; around 80-90% of content width is good), centered, with a subtle border or inset shadow to separate them from the dark background.

## Resume PDF

The user will place `resume.pdf` in `public/`. The hero and contact sections link to `/resume.pdf`.

## Build order

Follow this order to avoid rework:

1. Initialize Astro project with Tailwind.
2. Set up Content Collections schema for projects. Verify the markdown files load correctly.
3. Build the base layout component (dark background, typography, max-width container).
4. Build the hero section.
5. Build the about section.
6. Build the project card component.
7. Build the index page (hero → about → featured project cards → RTS Labs section → Kite card → contact).
8. Build the project detail page template. Test with one project first (Golem recommended — no screenshots, text-only).
9. Add Chonker with its screenshot rendering.
10. Verify all detail pages render correctly.
11. Set up GitHub Actions workflow for Pages deployment.
12. Test locally with `npm run build && npm run preview` before deploying.

## Before you ship

Check all of these:

- [ ] All project detail pages load without errors.
- [ ] The RTS Labs section renders inline on the index, not as a separate page.
- [ ] Status badges use the accent color consistently.
- [ ] Stack tags render in Geist Mono.
- [ ] Body text renders in Geist.
- [ ] Links (GitHub, LinkedIn, email, resume, cardlang.ai, manafest.gg) are all functional.
- [ ] Mobile view is clean at 375px width.
- [ ] Screenshots on the Chonker page render with alt text.
- [ ] The site builds cleanly with `npm run build`.
- [ ] GitHub Actions workflow is committed and will deploy on push to main.

## Things to leave for the user to do manually

- Create the GitHub repo `psuijk.github.io` (the user has likely already done this).
- Enable GitHub Pages in repo settings (source: GitHub Actions).
- Place `resume.pdf` in `public/`.
- Place screenshot files in `public/images/chonker/`.
- Push to main to trigger the first deploy.

## Do not push, commit, or deploy

Do not run `git push`, `git commit`, `git add`, or any command that modifies the repo's git state. The user will review the built site locally and handle the initial push themselves.

Build the site. Verify it runs locally with `npm run dev`. Stop there. Do not deploy. Do not commit. Do not push.

If the user asks you to commit or push later in the conversation, confirm they mean it before proceeding.

## Notes on voice and content

The content files are final. Do not rewrite or "improve" the copy. Render it as-is. The user spent significant effort on the voice and it is intentional.

If you find a typo, fix it silently. If you think a sentence reads awkwardly, leave it alone. The user will iterate on content separately.
